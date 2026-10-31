// Export the individually retouched masters; preserve the original catalogue photos.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const names = ['cavala-japonesa', 'zebra', 'uva-brava', 'matador', 'lula-em-chamas', 'cobra'];

async function prepare() {
  const directory = path.join(root, 'src/images/products/predador');
  await fs.mkdir(directory, { recursive: true });
  const results = [];
  for (const name of names) {
    const source = path.join(root, 'source-assets/products/predador', `${name}.png`);
    const target = path.join(directory, `${name}.webp`);
    const result = await sharp(source).rotate()
      .resize({ width: 1200, height: 800, fit: 'contain', background: '#ffffff' })
      .webp({ quality: 86, effort: 6 }).toFile(target);
    results.push({ file: path.relative(root, target).replace(/\\/g, '/'), width: result.width, height: result.height, bytes: result.size });
  }
  await fs.mkdir(path.join(root, '.qa'), { recursive: true });
  await fs.writeFile(path.join(root, '.qa/predador-product-assets.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

prepare().catch(error => { console.error(error); process.exitCode = 1; });
