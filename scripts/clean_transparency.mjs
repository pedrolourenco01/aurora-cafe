import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './src/assets/ingredients';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

console.log('Inspecting transparency for', files.length, 'files...');

for (const file of files) {
  const filePath = path.join(dir, file);
  const image = sharp(filePath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  
  const { width, height, channels } = info;
  let hasWhitePixels = 0;
  let modified = false;

  if (channels === 4) {
    // Check pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Check if pixel is near white/light gray with high alpha
      if (a > 30) {
        // If it's near-pure white or checkered pattern background (e.g. R,G,B all > 230 and color variance is very low)
        const isWhite = r > 235 && g > 235 && b > 235;
        const isLightGray = r > 215 && g > 215 && b > 215 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10;
        
        // Also check if corner pixels have non-transparent white/gray
        const pixelIdx = i / 4;
        const x = pixelIdx % width;
        const y = Math.floor(pixelIdx / width);
        const isCorner = (x < width * 0.15 || x > width * 0.85) && (y < height * 0.15 || y > height * 0.85);

        if (isWhite || (isLightGray && isCorner)) {
          hasWhitePixels++;
        }
      }
    }
  }

  console.log(`${file}: size ${width}x${height}, channels ${channels}, white/light-gray pixels: ${hasWhitePixels}`);
}
