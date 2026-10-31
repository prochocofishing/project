const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createSiteServer, appRoutes } = require('./scripts/static-server');

async function prerender() {
  const source = path.resolve(__dirname, 'dist/prochoco');
  const output = path.resolve(__dirname, 'dist/static');
  if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error('Run npm run build:prod before prerendering.');
  // Remove only this generated output, after checking both its absolute path and real parent.
  const projectRoot = fs.realpathSync(__dirname);
  if (path.relative(projectRoot, output) !== path.join('dist', 'static') ||
      fs.realpathSync(path.dirname(output)) !== path.join(projectRoot, 'dist')) {
    throw new Error('Refusing to clean a static output directory outside this project.');
  }
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  fs.cpSync(source, output, { recursive: true });
  const server = createSiteServer(source, { appFallback: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const executablePath = process.env.CHROME_PATH || (process.platform === 'win32' && fs.existsSync(edgePath) ? edgePath : undefined);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    // Capture the real first visit. Never grant analytics consent on behalf of visitors.
    await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of [...appRoutes, '/404/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__PROCHOCO_READY__ === true);
      await page.waitForSelector('app-root h1');
      await page.waitForFunction(() => document.documentElement.dataset.seoReady === 'true');
      if (await page.locator('h1').count() !== 1) throw new Error(`Expected one h1 at ${route}`);
      const html = await page.content();
      const destination = route === '/404/' ? path.join(output, '404.html') : path.join(output, route.slice(1), 'index.html');
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, `${html}\n`, 'utf8');
      console.log(`Prerendered ${route}`);
    }
    if (errors.length) throw new Error(`Browser errors during prerender: ${[...new Set(errors)].join('; ')}`);
    fs.writeFileSync(path.join(output, '.nojekyll'), '');
    console.log(`Static site ready: ${output} (${appRoutes.size} localized pages + 404)`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

prerender().catch(error => { console.error(error); process.exitCode = 1; });
