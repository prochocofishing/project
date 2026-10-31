const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const appRoutes = new Set(['/', '/en/', '/privacy/', '/terms/', '/cookies/', '/en/privacy/', '/en/terms/', '/en/cookies/']);

function createSiteServer(directory, { appFallback = false } = {}) {
  const root = path.resolve(directory);
  return http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400); response.end(); return; }
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403); response.end(); return;
    }
    let status = 200;
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        const search = new URL(request.url, 'http://localhost').search;
        response.writeHead(308, { Location: `${pathname}/${search}` }); response.end(); return;
      }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      const route = pathname.endsWith('/') ? pathname : `${pathname}/`;
      if (appFallback && appRoutes.has(route)) file = path.join(root, 'index.html');
      else {
        status = 404;
        file = path.join(root, fs.existsSync(path.join(root, '404.html')) ? '404.html' : 'index.html');
      }
    }
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    const extension = path.extname(file);
    const headers = {
      'Content-Type': types[extension] || 'application/octet-stream',
      'Cache-Control': /\.[a-f0-9]{8,}\.(js|css)$/.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    let body = fs.readFileSync(file);
    if (/\btext\/|application\/(?:json|xml)/.test(headers['Content-Type']) && /\bgzip\b/.test(request.headers['accept-encoding'] || '')) {
      body = zlib.gzipSync(body);
      headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
    }
    headers['Content-Length'] = body.length;
    response.writeHead(status, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  });
}

if (require.main === module) {
  const directory = process.argv[2] || 'dist/static';
  const port = Number(process.env.PORT || 8080);
  const server = createSiteServer(directory, { appFallback: process.argv.includes('--app') });
  server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/ (${path.resolve(directory)})`));
  process.once('SIGINT', () => server.close());
  process.once('SIGTERM', () => server.close());
}

module.exports = { createSiteServer, appRoutes };
