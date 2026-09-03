import sharp from 'sharp';

const img = sharp('./src/assets/skins/classic.jpeg');
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// Look for the dark text pixels of "Aurora" / "AWAKEN TO THE AURORA"
let minX = width, maxX = 0;
for (let y = Math.floor(height * 0.25); y < Math.floor(height * 0.75); y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 3;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Dark brown text pixels:
    if (r < 110 && g < 75 && b < 50) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
}

console.log(`Logo bounds in texture: x=${minX} to x=${maxX}, center = ${(minX + maxX) / 2}, texture center = ${width / 2}`);
