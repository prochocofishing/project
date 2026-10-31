// Recreate web assets from the original PNG files without discarding the originals.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../src/images');

async function optimize(directory) {
  const results = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) { results.push(...await optimize(source)); continue; }
    if (!entry.name.endsWith('.png')) continue;
    const target = source.replace(/\.png$/, '.webp');
    let pipeline = sharp(source);
    if (entry.name === 'logo.png') pipeline = pipeline.resize({ width: 400, withoutEnlargement: true });
    const output = await pipeline.webp({ quality: 82, alphaQuality: 95, effort: 6 }).toFile(target);
    const original = await fs.stat(source);
    results.push({ file: path.relative(root, source), original: original.size, webp: output.size, width: output.width, height: output.height });
  }
  return results;
}
optimize(root).then(async results => {
  const original = results.reduce((sum, item) => sum + item.original, 0);
  const webp = results.reduce((sum, item) => sum + item.webp, 0);
  await fs.mkdir(path.resolve(__dirname, '../.qa'), { recursive: true });
  await fs.writeFile(path.resolve(__dirname, '../.qa/image-optimization.json'), JSON.stringify({ original, webp, reductionPercent: +(100 * (1 - webp / original)).toFixed(1), images: results }, null, 2));
  console.log(`${results.length} images: ${(original / 1024).toFixed(1)} KiB PNG → ${(webp / 1024).toFixed(1)} KiB WebP (${(100 * (1 - webp / original)).toFixed(1)}% smaller).`);
}).catch(error => { console.error(error); process.exitCode = 1; });
