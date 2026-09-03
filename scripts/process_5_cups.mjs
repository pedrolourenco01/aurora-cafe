import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/copos menu';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

console.log('Inspecting and processing 5 menu cup images:', files);

for (const file of files) {
  const filePath = path.join(dir, file);
  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let nonZeroAlpha = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = data[idx + 3];
      if (a > 15) {
        nonZeroAlpha++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`${file}: ${width}x${height}, non-zero alpha: ${nonZeroAlpha}, bounds: [${minX}, ${maxX}]x[${minY}, ${maxY}]`);

  if (maxX > minX && maxY > minY) {
    const pad = 6;
    const cropLeft = Math.max(0, minX - pad);
    const cropTop = Math.max(0, minY - pad);
    const cropW = Math.min(width - cropLeft, (maxX - minX + 1) + pad * 2);
    const cropH = Math.min(height - cropTop, (maxY - minY + 1) + pad * 2);

    await sharp(filePath)
      .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
      .png({ quality: 100 })
      .toFile(path.join(dir, `cropped_${file}`));

    console.log(`Saved cropped_${file} (${cropW}x${cropH})`);
  }
}
