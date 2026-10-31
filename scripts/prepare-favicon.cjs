// Resize the supplied logo without changing its artwork or colours.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function prepare() {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'source-assets/branding/logo1.png');
  const directory = path.join(root, 'src/assets/icons');
  await fs.mkdir(directory, { recursive: true });
  for (const size of [32, 180, 192]) {
    await sharp(source).resize(size, size, { fit: 'contain' }).png()
      .toFile(path.join(directory, `prochoco-logo1-${size}.png`));
  }
  const sizes = [16, 32, 48];
  const frames = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, index) => {
    const entry = 6 + 16 * index;
    header[entry] = sizes[index];
    header[entry + 1] = sizes[index];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(frame.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += frame.length;
  });
  const ico = Buffer.concat([header, ...frames]);
  await fs.writeFile(path.join(directory, 'prochoco-logo1.ico'), ico);
  await fs.writeFile(path.join(root, 'src/favicon.ico'), ico);
  console.log('Created PROCHOCO logo1 favicon (16/32/48), PNG (32/192) and Apple touch icon (180).');
}

prepare().catch(error => { console.error(error); process.exitCode = 1; });
