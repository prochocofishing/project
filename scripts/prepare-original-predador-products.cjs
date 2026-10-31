// Genuine crops from the supplied JPEG. No generation, relighting, sharpening or reconstruction.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const original = path.join(root, 'src/images/hero/collection-predador.jpg');
const masters = path.join(root, 'source-assets/products/predador-original');
const output = path.join(root, 'src/images/products/predador-original');
// Polygon coordinates are relative to each source rectangle. They only exclude neighbouring jigs.
const photos = [
  { name: 'cavala-japonesa', left: 35, top: 280, width: 840, height: 315,
    selection: [[0,0],[825,0],[840,20],[840,150],[680,150],[680,315],[0,315]] },
  { name: 'zebra', left: 735, top: 75, width: 840, height: 250,
    selection: [[0,0],[840,0],[840,250],[105,250],[105,200],[0,200]] },
  { name: 'uva-brava', left: 45, top: 580, width: 850, height: 260,
    selection: [[0,30],[230,30],[320,0],[695,0],[850,60],[850,175],[640,175],[640,260],[0,260]] },
  { name: 'matador', left: 725, top: 400, width: 845, height: 240,
    selection: [[0,70],[175,30],[300,0],[845,0],[845,240],[210,240],[180,230],[140,215],[110,190],[85,180],[50,175],[0,175]] },
  { name: 'lula-em-chamas', left: 55, top: 855, width: 845, height: 280,
    selection: [[0,0],[680,0],[700,20],[750,58],[785,75],[790,66],[800,66],[845,110],[845,280],[0,280]] },
  { name: 'cobra', left: 725, top: 710, width: 850, height: 250,
    selection: [[0,35],[160,35],[160,0],[850,0],[850,250],[270,240],[215,237],[185,220],[165,235],[148,235],[130,222],[95,205],[90,185],[0,150]] },
];

async function prepare() {
  await fs.mkdir(masters, { recursive: true });
  await fs.mkdir(output, { recursive: true });
  // Use real blank paper from the same JPEG as a backing for excluded neighbours.
  // Only the surroundings are filled; every product still consists of source-photo pixels.
  const paper = await sharp(original).extract({ left: 1320, top: 1040, width: 200, height: 100 })
    .resize(1140, 490, { fit: 'fill' }).toBuffer();
  const results = [];
  for (const photo of photos) {
    const { name, selection, ...rectangle } = photo;
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${photo.width}" height="${photo.height}"><polygon fill="white" points="${selection.map(point => point.join(',')).join(' ')}"/></svg>`);
    const crop = await sharp(original).extract(rectangle).ensureAlpha()
      .composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    await fs.writeFile(path.join(masters, `${name}.png`), crop);
    const framed = await sharp(crop).resize({ width: 1140, height: 490, fit: 'inside' }).toBuffer({ resolveWithObject: true });
    const photoWindow = await sharp(paper).composite([{ input: framed.data, left: Math.round((1140 - framed.info.width) / 2), top: Math.round((490 - framed.info.height) / 2) }]).toBuffer();
    const result = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#ffffff' } })
      .composite([{ input: photoWindow, left: 30, top: 10 }])
      .webp({ quality: 90, effort: 6 }).toFile(path.join(output, `${name}.webp`));
    results.push({ name, rectangle, selection, width: result.width, height: result.height, bytes: result.size });
  }
  await fs.writeFile(path.join(masters, 'crop-regions.json'), JSON.stringify({ source: 'src/images/hero/collection-predador.jpg', processing: 'Source pixels preserved in PNG crops; selection excludes neighbouring products. WebP resizes into a white canvas; the backing is a real blank-paper patch from the same JPEG at x1320,y1040,w200,h100. No generative processing.', photos: results }, null, 2));
  console.log(`Prepared ${results.length} genuine product crops from the original JPEG.`);
}

prepare().catch(error => { console.error(error); process.exitCode = 1; });
