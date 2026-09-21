const { spawn, spawnSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.error) throw res.error;
  if (res.status !== 0) process.exit(res.status);
}

async function waitUntil(url, timeout = 30000, interval = 500) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      http.get(url, (res) => {
        res.resume();
        resolve();
      }).on('error', (err) => {
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(check, interval);
      });
    })();
  });
}

async function copyAssets(srcDir, dstDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      await copyAssets(srcPath, dstPath);
    } else {
      if (path.extname(entry.name).toLowerCase() === '.html') continue;
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

(async () => {
  try {
    console.log('1) Building production bundle (generate-sitemap + ng build)...');
    run('npm', ['run', 'build:prod']);

    const servePort = process.env.SERVE_PORT || '8080';
    const serveHost = process.env.SERVE_HOST || '127.0.0.1';
    const baseUrl = `http://${serveHost}:${servePort}`;

    console.log(`2) Starting local static server for prerender at ${baseUrl} ...`);
    const serverProc = spawn('npx', ['http-server', './dist/prochoco', '-p', servePort, '-a', serveHost], { stdio: 'inherit', shell: true });

    // wait for server to be ready
    await waitUntil(baseUrl, 30000, 500);
    console.log('Local server is up.');

    console.log('3) Running prerender against', baseUrl);
    // run prerender with BASE_URL env
    run('node', ['prerender.js'], { env: { ...process.env, BASE_URL: baseUrl } });

    console.log('4) Copying static assets from dist/prochoco into prerendered...');
    const src = path.resolve(__dirname, '..', 'dist', 'prochoco');
    const dst = path.resolve(__dirname, '..', 'prerendered');
    await copyAssets(src, dst);

    // copy CNAME if exists
    const cnameSrc = path.resolve(__dirname, '..', 'src', 'CNAME.txt');
    const cnameDst = path.join(dst, 'CNAME');
    if (fs.existsSync(cnameSrc)) {
      fs.copyFileSync(cnameSrc, cnameDst);
      console.log('Copied CNAME to prerendered/CNAME');
    }

    console.log('5) Deploying prerendered to GitHub Pages (this will push to gh-pages)...');
    run('npx', ['angular-cli-ghpages', '--dir=prerendered']);

    console.log('6) Shutting down local server...');
    try { serverProc.kill(); } catch (e) { /* ignore */ }

    console.log('Deploy complete.');
  } catch (err) {
    console.error('Error during deploy: ', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
