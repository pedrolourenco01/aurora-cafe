import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateCenteredSplash() {
  const inputPath = path.resolve('./public/splash/splash chocolate.jpeg');
  const outputPathSrc = path.resolve('./src/assets/splash/chocolate_splash.png');
  const outputPathPub = path.resolve('./public/splash/chocolate_splash.png');

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  function isBg(r, g, b) {
    const maxDiff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(r-b));
    return ((maxDiff <= 14 && r >= 165) || (r >= 200 && g >= 200 && b >= 195));
  }

  // 1. Create transparent RGBA
  const outBuf = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 3;
      const d = (y * width + x) * 4;
      const r = data[s], g = data[s+1], b = data[s+2];

      outBuf[d] = r;
      outBuf[d+1] = g;
      outBuf[d+2] = b;

      if (isBg(r, g, b)) {
        outBuf[d+3] = 0;
      } else {
        outBuf[d+3] = 255;
      }
    }
  }

  // 2. Soft edge anti-aliasing
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      if (outBuf[idx + 3] === 255) {
        let bg = 0;
        if (outBuf[((y - 1) * width + x) * 4 + 3] === 0) bg++;
        if (outBuf[((y + 1) * width + x) * 4 + 3] === 0) bg++;
        if (outBuf[(y * width + (x - 1)) * 4 + 3] === 0) bg++;
        if (outBuf[(y * width + (x + 1)) * 4 + 3] === 0) bg++;
        if (bg >= 2) outBuf[idx + 3] = 160;
        else if (bg === 1) outBuf[idx + 3] = 215;
      }
    }
  }

  // Exact centering:
  // Center of cup crater is x = 705.
  // Half width = 600 -> cropX = 105, cropW = 1200.
  // CropY = 85, cropH = 540.
  const cropX = 105;
  const cropY = 85;
  const cropW = 1200;
  const cropH = 540;

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPathSrc);

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPathPub);

  console.log(`Generated mathematically centered chocolate splash: ${cropW}x${cropH} (center at exact 50%)`);
}

generateCenteredSplash();
