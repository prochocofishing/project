/* Integration QA against the production static output. No third-party requests are sent. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createSiteServer, appRoutes } = require('./static-server');

const root = path.resolve(process.argv[2] || 'dist/static');
const canonicalOrigin = 'https://www.prochoco.com';
const catalogue = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/products.json'), 'utf8'));
const failures = [];
const results = [];
const runtimeErrors = [];
const localResourceFailures = [];
const externalAttempts = [];
let base;
let browser;
let server;

async function test(name, action) {
  if (process.env.VERIFY_ONLY && !name.toLowerCase().includes(process.env.VERIFY_ONLY.toLowerCase()) && !name.startsWith('No application exceptions')) return;
  try {
    await action();
    results.push(name);
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function context(options = {}) {
  const result = await browser.newContext({ reducedMotion: 'reduce', ...options });
  await result.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin === base) return route.continue();
    externalAttempts.push({ url: request.url(), method: request.method() });
    return route.abort();
  });
  result.on('page', page => {
    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400 && !response.url().includes('/qa-page-that-does-not-exist/')) {
        localResourceFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('requestfailed', request => {
      const reason = request.failure()?.errorText;
      // Navigation and filters can cancel in-flight lazy images. Every local
      // asset is also fetched independently below, so cancellation is not a 404.
      if (request.url().startsWith(base) && reason !== 'net::ERR_ABORTED') localResourceFailures.push(`${reason} ${request.url()}`);
    });
  });
  return result;
}

async function visit(page, route = '/') {
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__PROCHOCO_READY__ === true);
  await page.waitForSelector('main h1');
  await page.waitForFunction(() => document.documentElement.dataset.seoReady === 'true');
  return response;
}

async function waitCount(page, count) {
  await page.waitForFunction(expected => document.querySelectorAll('.products-grid .product-card').length === expected, count);
}

function routePath(pathname) { return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`; }

async function waitMenu(page, expanded) {
  await page.waitForFunction(expected => document.querySelector('.menu-toggle')?.getAttribute('aria-expanded') === String(expected), expanded);
}

function installedBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    chromium.executablePath(),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ];
  return candidates.find(candidate => candidate && fs.existsSync(candidate));
}

async function main() {
  assert(fs.existsSync(path.join(root, 'en/privacy/index.html')), 'Run npm run build:static before integration QA.');
  server = createSiteServer(root);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = installedBrowser();
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const session = await context({ viewport: { width: 1440, height: 1000 } });
  await session.addInitScript(() => {
    // Init scripts also run in inaccessible initial documents and frames.
    try { localStorage.setItem('prochoco_analytics_consent', 'denied'); } catch { /* no storage before navigation */ }
  });
  const page = await session.newPage();
  page.setDefaultTimeout(10000);
  const linkedAssets = new Set(['/robots.txt', '/sitemap.xml', '/assets/products.json']);
  const pageDocuments = new Map();

  await test('All 8 routes remain readable and indexable with JavaScript disabled', async () => {
    const staticSession = await context({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
    const staticPage = await staticSession.newPage();
    try {
      for (const route of appRoutes) {
        const response = await staticPage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, route);
        assert.equal(await staticPage.locator('h1').count(), 1, `Static h1 at ${route}`);
        assert.match(await staticPage.title(), /PROCHOCO/);
        assert((await staticPage.locator('meta[name="description"]').getAttribute('content')).length > 40);
        assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalOrigin}${route}`);
        const home = route === '/' || route === '/en/';
        assert.equal(await staticPage.locator('article.product-card').count(), home ? 10 : 0, `Static catalogue at ${route}`);
        if (home) {
          assert.equal(await staticPage.locator('form.contact-form').count(), 1, 'The interactive form has a no-JavaScript fallback marker.');
          assert.equal(await staticPage.locator('form.contact-form').isVisible(), false, 'The inactive form is hidden without JavaScript.');
          assert(await staticPage.locator('#contact a[href="mailto:prochocofishing@gmail.com"]').isVisible(), 'Email contact remains available without JavaScript.');
          for (const product of catalogue) {
            const actual = (await staticPage.locator(`#product-${product.id} .description-content p`).allTextContents()).map(text => text.trim());
            const expected = (route === '/en/' ? product.descriptionEn : product.description).split('\n').map(text => text.trim()).filter(Boolean);
            assert.deepEqual(actual, expected, `Complete static description for ${product.id} at ${route}`);
          }
          await staticPage.locator('#product-5 summary').click();
          assert(await staticPage.locator('#product-5 .description-content').isVisible(), 'Native product details work without JavaScript.');
        }
      }
    } finally { await staticSession.close(); }
  });

  await test('All 8 PT/EN routes: HTTP, localization, metadata and real product schema', async () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const route of appRoutes) {
      const response = await visit(page, route);
      assert.equal(response.status(), 200, route);
      const actual = await page.evaluate(() => {
        const graph = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .flatMap(script => { const data = JSON.parse(script.textContent); return data['@graph'] || [data]; });
        return {
          language: document.documentElement.lang,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content,
          h1Count: document.querySelectorAll('h1').length,
          h1: document.querySelector('h1')?.textContent.trim(),
          canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(link => link.href),
          alternates: [...document.querySelectorAll('link[hreflang]')].map(link => [link.hreflang, link.href]),
          robots: document.querySelector('meta[name="robots"]')?.content,
          ogTitle: document.querySelector('meta[property="og:title"]')?.content,
          ogDescription: document.querySelector('meta[property="og:description"]')?.content,
          ogUrl: document.querySelector('meta[property="og:url"]')?.content,
          twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
          products: graph.filter(node => node['@type'] === 'Product'),
          types: graph.map(node => node['@type']),
          assets: [...document.querySelectorAll('img[src], script[src], link[rel="stylesheet"], link[rel="icon"]')].map(node => node.src || node.href),
          links: [...document.querySelectorAll('a[href]')].map(link => link.href),
          ids: [...document.querySelectorAll('[id]')].map(node => node.id),
        };
      });
      const english = route.startsWith('/en/');
      const home = route === '/' || route === '/en/';
      const pagePath = route.replace(/^\/en(?=\/)/, '');
      assert.equal(actual.language, english ? 'en' : 'pt-PT', route);
      assert.equal(actual.h1Count, 1, route);
      assert(actual.h1.length > 4, `Meaningful h1 at ${route}`);
      assert(actual.title && !titles.has(actual.title), `Unique title at ${route}`); titles.add(actual.title);
      assert(actual.description?.length > 40 && !descriptions.has(actual.description), `Unique description at ${route}`); descriptions.add(actual.description);
      assert.deepEqual(actual.canonical, [`${canonicalOrigin}${route}`]);
      assert.deepEqual(new Map(actual.alternates), new Map([
        ['pt-PT', `${canonicalOrigin}${pagePath}`], ['en', `${canonicalOrigin}/en${pagePath}`], ['x-default', `${canonicalOrigin}${pagePath}`],
      ]));
      assert(!/noindex/i.test(actual.robots), `Indexable ${route}`);
      assert.equal(actual.ogTitle, actual.title); assert.equal(actual.twitterTitle, actual.title);
      assert.equal(actual.ogDescription, actual.description); assert.equal(actual.ogUrl, actual.canonical[0]);
      assert(actual.types.includes('Organization') && actual.types.includes('WebSite'), `Organization/WebSite at ${route}`);
      if (!home) assert(actual.types.includes('BreadcrumbList'), `Legal page breadcrumbs at ${route}`);
      assert.equal(actual.products.length, home ? 10 : 0, `Product count at ${route}`);
      if (home) {
        assert.deepEqual(actual.products.map(product => product.sku).sort(), catalogue.map(product => String(product.id)).sort());
        for (const product of actual.products) {
          const source = catalogue.find(item => String(item.id) === product.sku);
          assert(product.name.includes(source.name) && product.name.includes(source.sizeNumber));
          assert.equal(product.description, (english ? source.descriptionEn : source.description).replace(/\n/g, ' '));
        }
        assert(await page.locator('h2').filter({ hasText: english ? 'Your next cephalopod jig.' : 'O teu próximo palhaço.' }).count());
      } else {
        assert(english ? /privacy|terms|cookies?/i.test(actual.h1) : /privacidade|termos|cookies/i.test(actual.h1));
      }
      for (const asset of actual.assets) {
        const url = new URL(asset);
        if (url.origin === base) linkedAssets.add(url.pathname);
      }
      pageDocuments.set(route, actual);
    }
  });

  await test('Local links, static assets, sitemap, robots and public catalogue feed', async () => {
    assert.equal(pageDocuments.size, 8, 'All localized documents must be available.');
    for (const [route, document] of pageDocuments) for (const href of document.links) {
      const url = new URL(href);
      if (url.origin !== base) continue;
      const target = pageDocuments.get(routePath(url.pathname));
      if (!target && url.pathname.startsWith('/assets/')) { linkedAssets.add(url.pathname); continue; }
      assert(target, `Broken local route from ${route}: ${url.pathname}`);
      if (url.hash) assert(target.ids.includes(decodeURIComponent(url.hash.slice(1))), `Broken local fragment from ${route}: ${href}`);
    }
    for (const product of catalogue) linkedAssets.add(`/${product.image}`);
    for (const asset of linkedAssets) {
      const response = await fetch(`${base}${asset}`);
      assert.equal(response.status, 200, `Asset ${asset}`);
      assert(Number(response.headers.get('content-length')) > 0, `Nonempty asset ${asset}`);
    }
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    assert.deepEqual(new Set(locations), new Set([...appRoutes].map(route => `${canonicalOrigin}${route}`)));
    assert.equal(locations.length, 8); assert(!sitemap.includes('#'));
    const robots = await (await fetch(`${base}/robots.txt`)).text();
    assert(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
    assert(!/^Disallow:\s*\/\s*$/m.test(robots));
    const feed = await (await fetch(`${base}/assets/products.json`)).json();
    assert.deepEqual(feed, catalogue, 'Public feed must match the displayed catalogue source.');
    const redirect = await fetch(`${base}/privacy`, { redirect: 'manual' });
    assert.equal(redirect.status, 308); assert.equal(redirect.headers.get('location'), '/privacy/');
  });

  await test('Unknown URL returns HTTP 404 and a localized noindex page', async () => {
    for (const route of ['/qa-page-that-does-not-exist/', '/en/qa-page-that-does-not-exist/']) {
      const response = await visit(page, route);
      assert.equal(response.status(), 404);
      assert.equal(await page.locator('h1').count(), 1);
      assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
      assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
      assert.match(await page.locator('h1').innerText(), route.startsWith('/en/') ? /not found/i : /encontrada/i);
    }
  });

  await test('Responsive layouts have no horizontal overflow at 320, 360, 768 and 1440 px', async () => {
    for (const width of [320, 360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of appRoutes) {
        await visit(page, route);
        const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
        assert(geometry.document <= geometry.viewport + 1, `${route} overflows at ${width}px: ${geometry.document}px`);
        if (route === '/' || route === '/en/') {
          const image = await page.locator('.product-visual').evaluate(element => {
            const box = element.getBoundingClientRect();
            const image = element.querySelector('img').getBoundingClientRect();
            return { inside: image.left >= box.left - 1 && image.right <= box.right + 1 && image.top >= box.top - 1 && image.bottom <= box.bottom + 1,
              box: { x: box.x, y: box.y, width: box.width, height: box.height }, image: { x: image.x, y: image.y, width: image.width, height: image.height } };
          });
          assert(image.inside, `Hero image stays inside its reserved card at ${width}px on ${route}: ${JSON.stringify(image)}`);
        }
      }
    }
  });

  await test('Gallery: local photographs, PT/EN controls, full framing and accessible automatic playback', async () => {
    async function waitPhoto(target, index) {
      await target.waitForFunction(expected => {
        const slide = document.querySelectorAll('.photo-slide')[expected];
        const image = slide?.querySelector('img');
        return slide?.classList.contains('is-active') && image?.complete && image.naturalWidth > 0;
      }, index);
    }
    async function tick(target, duration = 6100) {
      await target.clock.fastForward(duration);
      await target.clock.runFor(100);
    }
    async function index(target) {
      return target.locator('.photo-slide').evaluateAll(slides => slides.findIndex(slide => slide.classList.contains('is-active')));
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await visit(page);
    await page.locator('.hero-display').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.slide-image')].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator('.photo-slide').count(), 2);
    assert.equal(await page.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).count(), 1, 'Reduced motion starts playback paused.');
    const photoAssets = await page.locator('.slide-image').evaluateAll(images => images.flatMap(image => [image.src, ...image.srcset.split(',').map(candidate => new URL(candidate.trim().split(/\s+/)[0], document.baseURI).href)]));
    for (const asset of new Set(photoAssets)) {
      assert.equal(new URL(asset).origin, base, 'Photographs are served locally.');
      const response = await fetch(asset);
      assert.equal(response.status, 200, asset);
      assert.match(response.headers.get('content-type'), /^image\/webp/);
    }
    await waitPhoto(page, 0);
    assert.equal(await page.locator('.photo-slide.is-active').getAttribute('aria-label'), '1 de 2');
    assert.match(await page.locator('.slide-caption p').innerText(), /padrões da série PREDADOR/);
    await page.getByRole('button', { name: 'Fotografia seguinte', exact: true }).click(); await waitPhoto(page, 1);
    assert.match(await page.locator('.slide-caption p').innerText(), /pesca ao choco/);
    assert.equal(await page.locator('.photo-slide.is-active').getAttribute('aria-label'), '2 de 2');
    await page.getByRole('button', { name: 'Fotografia anterior', exact: true }).click(); await waitPhoto(page, 0);
    await page.locator('.slide-dot').nth(1).click(); await waitPhoto(page, 1);
    assert.equal(await page.locator('.slide-dot').nth(1).getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Fotografia seguinte', exact: true }).focus();
    await page.keyboard.press('ArrowRight'); await waitPhoto(page, 0);
    assert.equal(await page.locator('.slide-counter').innerText(), '01 / 02');
    assert.equal(await page.locator('.photo-slide[aria-hidden="true"]').count(), 1);

    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const photo of [0, 1]) {
        await page.locator('.slide-dot').nth(photo).click(); await waitPhoto(page, photo);
        const geometry = await page.locator('.product-visual').evaluate(frame => {
          const box = frame.getBoundingClientRect();
          const image = frame.querySelector('.photo-slide.is-active img');
          const rect = image.getBoundingClientRect();
          return { inside: rect.left >= box.left - 1 && rect.right <= box.right + 1 && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1,
            fit: getComputedStyle(image).objectFit, document: document.documentElement.scrollWidth, viewport: innerWidth };
        });
        assert(geometry.inside && geometry.fit === 'contain', `Full photograph ${photo + 1} remains inside the frame at ${width}px.`);
        assert(geometry.document <= geometry.viewport + 1, `Gallery reflows at ${width}px.`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 }); await visit(page, '/en/');
    await waitPhoto(page, 0);
    assert.equal(await page.locator('.photo-slide.is-active').getAttribute('aria-label'), '1 of 2');
    assert.equal(await page.locator('.slide-caption p').innerText(), 'The PREDADOR series patterns');
    await page.getByRole('button', { name: 'Next photograph', exact: true }).click(); await waitPhoto(page, 1);
    assert.equal(await page.locator('.slide-caption p').innerText(), 'PROCHOCO jigs for cuttlefish fishing');
    assert.match(await page.locator('.photo-slide.is-active img').getAttribute('alt'), /cuttlefish/i);

    const autoSession = await context({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    await autoSession.addInitScript(() => { try { localStorage.setItem('prochoco_analytics_consent', 'denied'); } catch {} });
    const autoPage = await autoSession.newPage();
    try {
      await autoPage.clock.install();
      await visit(autoPage);
      await autoPage.waitForFunction(() => [...document.querySelectorAll('.slide-image')].every(image => image.complete && image.naturalWidth > 0));
      assert.equal(await autoPage.getByRole('button', { name: 'Pausar slideshow', exact: true }).count(), 1);
      await autoPage.mouse.move(0, 0); await tick(autoPage); await waitPhoto(autoPage, 1);
      await autoPage.locator('.hero-display').hover(); await autoPage.clock.runFor(100);
      const hovered = await index(autoPage); await tick(autoPage); assert.equal(await index(autoPage), hovered, 'Hover pauses automatic changes.');
      await autoPage.mouse.move(0, 0); await autoPage.clock.runFor(100); await tick(autoPage); await waitPhoto(autoPage, 0);
      await autoPage.locator('.slide-actions .slide-control').first().focus(); await autoPage.clock.runFor(100);
      await tick(autoPage); assert.equal(await index(autoPage), 0, 'Keyboard focus pauses automatic changes.');
      await autoPage.locator('header .logo').focus(); await autoPage.clock.runFor(100); await tick(autoPage); await waitPhoto(autoPage, 1);
      await autoPage.getByRole('button', { name: 'Fotografia seguinte', exact: true }).click(); await waitPhoto(autoPage, 0);
      await autoPage.mouse.move(0, 0); await autoPage.locator('header .logo').focus(); await autoPage.clock.runFor(100);
      await tick(autoPage, 12500); assert.equal(await index(autoPage), 0, 'Manual navigation stops automatic playback.');
      assert.equal(await autoPage.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).count(), 1);
      await autoPage.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).focus();
      await autoPage.keyboard.press('Enter'); await autoPage.mouse.move(0, 0); await autoPage.clock.runFor(100);
      assert(await autoPage.locator('.rotation-control').evaluate(button => document.activeElement === button), 'Explicit keyboard play retains focus.');
      await tick(autoPage); await waitPhoto(autoPage, 1);
      await autoPage.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await autoPage.clock.runFor(100); await tick(autoPage); assert.equal(await index(autoPage), 1, 'Document visibility pauses playback.');
      await autoPage.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await autoPage.clock.runFor(100); await tick(autoPage); await waitPhoto(autoPage, 0);
      await autoPage.emulateMedia({ reducedMotion: 'reduce' }); await autoPage.clock.runFor(100);
      await autoPage.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).waitFor({ state: 'visible' });
      assert.equal(await autoPage.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).count(), 1, 'A change to reduced motion stops playback.');
      await tick(autoPage); assert.equal(await index(autoPage), 0);
      await autoPage.getByRole('button', { name: 'Reproduzir slideshow', exact: true }).focus();
      await autoPage.keyboard.press('Enter'); await autoPage.clock.runFor(100);
      await tick(autoPage); await waitPhoto(autoPage, 1);
      assert(await autoPage.locator('.rotation-control').evaluate(button => document.activeElement === button), 'Explicit play also works with reduced motion and retained keyboard focus.');
    } finally { await autoSession.close(); }
  });

  await test('Model/size filters, empty-state recovery, details and product deep links', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await visit(page);
    await waitCount(page, 10);
    await page.getByRole('button', { name: 'PREDADOR', exact: true }).click();
    await waitCount(page, 6); assert.match(await page.locator('.catalogue-count').innerText(), /6 de 10/);
    await page.locator('#catalogue-size').selectOption('3.0'); await waitCount(page, 0);
    assert(await page.locator('.empty-state').isVisible());
    await page.getByRole('button', { name: 'Ver todos os produtos', exact: true }).click(); await waitCount(page, 10);
    await page.getByRole('button', { name: 'CIRCUS', exact: true }).click(); await waitCount(page, 2);
    await page.locator('#catalogue-size').selectOption('3.0'); await waitCount(page, 1);
    assert.equal(await page.locator('.product-card').getAttribute('id'), 'product-3');
    await page.evaluate(() => { window.location.hash = 'product-5'; });
    await waitCount(page, 10); assert(await page.locator('#product-5').isVisible());
    await page.locator('#product-5 summary').click();
    assert(await page.locator('#product-5 details').getAttribute('open') !== null);
    assert.match(await page.locator('#product-5 .description-content').innerText(), /Quando usar o "cavala japonesa"/);
    assert.equal(await page.locator('#retailers .retailer-link').count(), 14);
  });

  await test('Legal-page language switching preserves context and catalogue navigation works', async () => {
    await visit(page, '/privacy/');
    await page.locator('header button').filter({ hasText: /^EN$/ }).click();
    await page.waitForURL(url => routePath(url.pathname) === '/en/privacy/');
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    assert.match(await page.locator('h1').innerText(), /Privacy/);
    await page.locator('header button').filter({ hasText: /^PT$/ }).click();
    await page.waitForURL(url => routePath(url.pathname) === '/privacy/');
    await page.waitForFunction(() => document.documentElement.lang === 'pt-PT');
    await page.locator('header a[href$="#products"]').click();
    await page.waitForURL(`${base}/#products`); await waitCount(page, 10);
    assert(await page.locator('#products').isVisible());
    await visit(page, '/en/');
    await page.locator('.hero-buttons a').first().click();
    await page.waitForURL(url => routePath(url.pathname) === '/en/' && url.hash === '#products');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  });

  await test('Mobile navigation is hidden when closed, opens and closes with Escape', async () => {
    await page.setViewportSize({ width: 360, height: 800 }); await visit(page);
    const toggle = page.locator('.menu-toggle');
    const id = await toggle.getAttribute('aria-controls'); assert(id, 'Menu toggle controls a named navigation region.');
    const menu = page.locator(`[id="${id}"]`);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false'); assert(!await menu.isVisible());
    const hiddenCanFocus = await menu.evaluate(element => {
      const previous = document.activeElement;
      let focused = false;
      for (const link of element.querySelectorAll('a, button')) { link.focus(); focused ||= element.contains(document.activeElement); }
      previous?.focus(); return focused;
    });
    assert.equal(hiddenCanFocus, false, 'Closed menu links cannot receive focus.');
    await toggle.click(); await waitMenu(page, true); assert(await menu.isVisible());
    await page.keyboard.press('Escape'); await waitMenu(page, false);
    assert(!await menu.isVisible()); assert(await toggle.evaluate(element => document.activeElement === element));
    await toggle.click(); await waitMenu(page, true); await menu.locator('a[href$="#products"]').click();
    await page.waitForURL(`${base}/#products`); await waitMenu(page, false);
  });

  await test('Invalid contact enquiries show errors and never send a request', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 }); await visit(page);
    const requests = [];
    const track = request => { if (request.method() === 'POST' || /emailjs/.test(request.url())) requests.push(request.url()); };
    session.on('request', track);
    try {
      await page.locator('#contact button[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('#contact .submit-message')?.textContent.includes('Verifique'));
      assert.equal(await page.locator('#contact [aria-invalid="true"]').count(), 3);
      assert(await page.locator('#contact-name').evaluate(element => document.activeElement === element));
      await page.locator('#contact-name').fill('   ');
      await page.locator('#contact-store').fill('Loja de teste');
      await page.locator('#contact-email').fill('email-invalido');
      await page.locator('#contact button[type="submit"]').click();
      assert.equal(await page.locator('#contact-email').getAttribute('aria-invalid'), 'true');
      assert.match(await page.locator('#email-error').innerText(), /válido/);
      await page.locator('#contact-name').fill('   ');
      await page.locator('#contact-store').fill('   ');
      await page.locator('#contact-email').fill('qa@example.com');
      await page.locator('#contact button[type="submit"]').click();
      await page.waitForFunction(() => ['contact-name', 'contact-store'].every(id => document.getElementById(id)?.getAttribute('aria-invalid') === 'true'));
      assert(await page.locator('#contact-name').evaluate(element => document.activeElement === element), 'Whitespace-only names are identified and focused.');
      assert.equal(requests.length, 0); assert.equal(await page.locator('#contact form').getAttribute('aria-busy'), 'false');
    } finally { session.off('request', track); }
  });

  await test('Cookie rejection blocks analytics, persists, and preferences reopen accessibly', async () => {
    const cookieSession = await context({ viewport: { width: 360, height: 800 } });
    const cookiePage = await cookieSession.newPage();
    const analyticsRequests = [];
    cookieSession.on('request', request => { if (/google-analytics|googletagmanager|\/g\/collect/.test(request.url())) analyticsRequests.push(request.url()); });
    try {
      await visit(cookiePage);
      assert(await cookiePage.locator('.consent-banner').isVisible());
      assert.equal(analyticsRequests.length, 0, 'No analytics before consent.');
      await cookiePage.locator('#consent-decline').click(); await cookiePage.locator('.consent-banner').waitFor({ state: 'hidden' });
      assert.equal(await cookiePage.evaluate(() => localStorage.getItem('prochoco_analytics_consent')), 'denied');
      assert.equal(await cookiePage.locator('script[src*="googletagmanager"]').count(), 0);
      await cookiePage.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
      await cookiePage.locator('#consent-decline').waitFor({ state: 'visible' });
      assert(await cookiePage.locator('#consent-decline').evaluate(element => document.activeElement === element));
      await cookiePage.locator('#consent-decline').click();
      await cookiePage.reload({ waitUntil: 'networkidle' });
      assert.equal(await cookiePage.locator('.consent-banner').count(), 0); assert.equal(analyticsRequests.length, 0);
    } finally { await cookieSession.close(); }
  });

  await session.close();
  await test('No application exceptions, missing local resources or unsolicited third-party traffic', async () => {
    assert.deepEqual([...new Set(runtimeErrors)], []);
    assert.deepEqual([...new Set(localResourceFailures)], []);
    assert.deepEqual(externalAttempts, [], 'The first visit should use local assets and defer all external embeds and analytics.');
  });
  const summary = { passed: results.length, failed: failures.length, selectedTests: process.env.VERIFY_ONLY || 'all', browser: executablePath || 'Playwright Chromium', routes: appRoutes.size, viewports: [320, 360, 768, 1440], failures };
  const reportDirectory = path.resolve('.qa');
  fs.mkdirSync(reportDirectory, { recursive: true });
  fs.writeFileSync(path.join(reportDirectory, process.env.VERIFY_ONLY ? `${process.env.VERIFY_ONLY}-results.json` : 'integration-results.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Integration QA: ${results.length} passed; ${failures.length} failed.`);
  if (failures.length) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});
