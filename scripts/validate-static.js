const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { appRoutes } = require('./static-server');

const root = path.resolve(__dirname, '../dist/static');
const origin = 'https://www.prochoco.com';
const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/products.json'), 'utf8'));
const titles = new Set();
const descriptions = new Set();
for (const route of appRoutes) {
  const html = fs.readFileSync(path.join(root, route.slice(1), 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  assert(title && !titles.has(title), `Missing or duplicated title: ${route}`); titles.add(title);
  assert(description && !descriptions.has(description), `Missing or duplicated description: ${route}`); descriptions.add(description);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1: ${route}`);
  assert(html.includes(`lang="${route.startsWith('/en/') ? 'en' : 'pt-PT'}"`), `HTML language: ${route}`);
  assert(html.includes(`rel="canonical" href="${origin}${route}"`), `Canonical: ${route}`);
  assert(html.includes('hreflang="pt-PT"') && html.includes('hreflang="en"'), `Hreflang: ${route}`);
  assert(!html.includes('content="noindex'), `Indexable: ${route}`);
  assert(!html.includes('SearchAction'), `No unsupported site search: ${route}`);
  const schema = html.match(/<script[^>]*id="site-structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert(schema, `JSON-LD exists: ${route}`);
  const graph = JSON.parse(schema)['@graph'];
  assert(graph.some(node => node['@type'] === 'Organization'), `Organization: ${route}`);
  assert(graph.some(node => node['@type'] === 'WebSite'), `WebSite: ${route}`);
  const home = route === '/' || route === '/en/';
  assert.equal(graph.filter(node => node['@type'] === 'Product').length, home ? products.length : 0, `Product graph matches catalogue: ${route}`);
  if (!home) assert(graph.some(node => node['@type'] === 'BreadcrumbList'), `Breadcrumbs: ${route}`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|mailto:|tel:|javascript:)/i.test(url)) continue;
    const assetPath = new URL(url, `${origin}/`).pathname;
    const target = path.join(root, assetPath);
    assert(fs.existsSync(target), `Local asset/link exists: ${route} -> ${assetPath}`);
  }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(new Set(locations), new Set([...appRoutes].map(route => `${origin}${route}`)));
assert(!sitemap.includes('#'), 'Sitemap excludes fragments');
assert(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
const missing = fs.readFileSync(path.join(root, '404.html'), 'utf8');
assert(missing.includes('content="noindex, follow"'), '404 is noindex');
assert(!missing.includes('rel="canonical"'), '404 has no misleading canonical');
assert.equal(products.length, 10, 'All ten original catalogue models retained');
for (const product of products) assert(fs.existsSync(path.join(root, product.image)), `Product image exists: ${product.id}`);
console.log(`Validated ${appRoutes.size} PT/EN pages, 404, unique metadata, hreflang, JSON-LD, sitemap, robots and ${products.length} product assets.`);
