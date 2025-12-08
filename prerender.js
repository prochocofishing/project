const fs = require('fs');
const path = require('path');
const net = require('net');
const { URL } = require('url');
const { chromium } = require('playwright');

// Routes to snapshot. Anchors for product cards will be auto-generated from products.json.
const baseRoutes = ['/', '/privacy', '/terms', '/cookies'];

// Try to read products.json to build anchor routes dynamically.
function loadProductAnchors() {
  try {
    const productsPath = path.resolve(__dirname, 'src', 'assets', 'products.json');
    if (!fs.existsSync(productsPath)) return [];
    const raw = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(raw);
    if (!Array.isArray(products)) return [];
    return products.map(p => `/#product-${p.id}`);
  } catch (e) {
    console.warn('Could not load products.json for prerender anchors:', e.message || e);
    return [];
  }
}

const routes = baseRoutes.concat(loadProductAnchors());

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:4200';
  // Before launching Playwright, ensure the target server is reachable to avoid confusing errors.
  try {
    const parsed = new URL(base);
    const host = parsed.hostname;
    let port = parsed.port ? Number(parsed.port) : (parsed.protocol === 'https:' ? 443 : 80);

    await new Promise((resolve, reject) => {
      const socket = net.createConnection({ host, port }, () => {
        socket.destroy();
        resolve();
      });
      socket.setTimeout(3000);
      socket.on('error', (err) => reject(err));
      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('timeout'));
      });
    });
  } catch (err) {
    console.error(`Cannot connect to ${base} — Playwright prerender requires the built site to be served at that URL.`);
    console.error('Recommended steps:');
    console.error('  1) Build the app:');
    console.error('       npm run build:prod');
    console.error('  2) Serve the built files (example using http-server):');
    console.error('       npx http-server ./dist/prochoco -p 8080');
    console.error('  3) Re-run the prerender script (PowerShell example):');
    console.error("       $env:BASE_URL='http://localhost:8080'; npm run prerender");
    process.exit(1);
  }

  const outDir = path.resolve(__dirname, 'prerendered');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Prerendering routes from ${base} → ${outDir}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let failures = 0;

  for (const route of routes) {
    const url = route.startsWith('/') ? `${base}${route}` : `${base}/${route}`;
    try {
      console.log(`-> ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' , timeout: 30000 });
      // allow some client rendering if necessary
      await page.waitForTimeout(400);
      const html = await page.content();

      // Normalize filename: / -> index.html, /privacy -> privacy.html, /#product-1 -> product-1.html
      let filename = 'index.html';
      if (route === '/') filename = 'index.html';
      else if (route.startsWith('/#product-')) filename = `${route.replace('/#','')}.html`;
      else filename = `${route.replace(/[^a-z0-9]/gi, '-').replace(/^-+|-+$/g, '')}.html`;

      const outPath = path.join(outDir, filename);
      fs.writeFileSync(outPath, html, 'utf8');
      console.log(`  saved ${outPath}`);
    } catch (err) {
      failures++;
      console.error(`  failed ${url}:`, err.message || err);
    }
  }

  await browser.close();
  console.log('Prerender complete. Serve the built site and open files from ./prerendered for crawlers or use them as static snapshots.');
  if (failures > 0) {
    console.error(`${failures} prerender route(s) failed — failing the process to surface issues.`);
    process.exit(2);
  }
})();
