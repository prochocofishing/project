const fs = require('node:fs');
const path = require('node:path');

const origin = 'https://www.prochoco.com';
const pages = ['/', '/privacy/', '/terms/', '/cookies/'];
const urls = pages.flatMap(page => [page, `/en${page}`]);
// Only canonical, indexable documents belong in a sitemap; product fragments are not separate pages.
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${origin}${url}</loc></url>`).join('\n')}\n</urlset>\n`;
for (const destination of ['sitemap.xml', 'src/assets/sitemap.xml']) {
  fs.writeFileSync(path.resolve(__dirname, destination), xml, 'utf8');
}
console.log(`Generated sitemap with ${urls.length} canonical PT/EN pages.`);
