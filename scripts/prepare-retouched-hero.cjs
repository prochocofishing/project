// Create web delivery sizes from the approved, retouched masters. Originals are preserved.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'src/images/hero');
const photos = [
  { name: 'collection-predador-retouched', variants: [640] },
  { name: 'pesca-chocos-retouched', variants: [360, 640] },
];

async function prepare() {
  await fs.mkdir(output, { recursive: true });
  const results = [];
  for (const photo of photos) {
    const source = path.join(root, 'source-assets/hero', `${photo.name}.png`);
    const variants = [{ suffix: '', width: 1200 }, ...photo.variants.map(width => ({ suffix: `-${width}`, width }))];
    for (const variant of variants) {
      const target = path.join(output, `${photo.name}${variant.suffix}.webp`);
      const result = await sharp(source).rotate()
        .resize({ width: variant.width, height: 1400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, alphaQuality: 95, effort: 6 }).toFile(target);
      results.push({ file: path.relative(root, target).replace(/\\/g, '/'), width: result.width, height: result.height, bytes: result.size });
    }
  }
  await fs.mkdir(path.join(root, '.qa'), { recursive: true });
  await fs.writeFile(path.join(root, '.qa/retouched-hero-assets.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

prepare().catch(error => { console.error(error); process.exitCode = 1; });
