const fs = require('fs');
const path = require('path');

function isoDate() {
  return new Date().toISOString().split('T')[0];
}

function buildUrlEntry(loc, changefreq = 'monthly', priority = '0.5', lastmod = isoDate()) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

function loadProducts() {
  try {
    const p = path.resolve(__dirname, 'src', 'assets', 'products.json');
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, 'utf8');
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    console.error('Failed to load products.json:', e.message || e);
    return [];
  }
}

function generate(sitemapPath) {
  const siteRoot = 'https://www.prochoco.com';
  const pages = [
    '/',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  const products = loadProducts();

  const entries = [];
  // root
  entries.push(buildUrlEntry(`${siteRoot}/`, 'daily', '1.0'));

  // pages
  pages.slice(1).forEach(page => entries.push(buildUrlEntry(`${siteRoot}${page}`)));

  // product anchors on homepage
  products.forEach(p => {
    const loc = `${siteRoot}/#product-${p.id}`;
    entries.push(buildUrlEntry(loc, 'monthly', '0.6'));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log('Wrote sitemap:', sitemapPath);
}

try {
  const rootSitemap = path.resolve(__dirname, 'sitemap.xml');
  const assetsSitemap = path.resolve(__dirname, 'src', 'assets', 'sitemap.xml');

  generate(rootSitemap);
  generate(assetsSitemap);
  console.log('Sitemap generation complete.');
} catch (e) {
  console.error('Error generating sitemap:', e.message || e);
  process.exit(1);
}
