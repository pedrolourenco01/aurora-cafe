import sharp from 'sharp';

async function generateCleanCup() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's find the exact cup silhouette
  // Center is x = 688
  // Top rim is between y = 243 and 250
  // Bottom rim is between y = 673 and 683
  // Top left: (548, 250), Top right: (828, 250)
  // Bottom left: (592, 673), Bottom right: (784, 673)

  const xMid = 688;
  const xTopLeft = 548.0, yTopLeft = 250.0;
  const xTopRight = 828.0, yTopRight = 250.0;
  const yTopMid = 243.0;

  const xBotLeft = 592.0, yBotLeft = 672.0;
  const xBotRight = 784.0, yBotRight = 672.0;
  const yBotMid = 682.0;

  const kTop = (yTopLeft - yTopMid) / Math.pow(xTopLeft - xMid, 2);
  const kBot = (yBotLeft - yBotMid) / Math.pow(xBotLeft - xMid, 2);

  function getAlpha(px, py, r, g, b) {
    // 1. Check if inside geometric cup envelope
    const topCurveY = yTopMid + kTop * Math.pow(px - xMid, 2);
    if (py < topCurveY) return 0;

    const botCurveY = yBotMid + kBot * Math.pow(px - xMid, 2);
    if (py > botCurveY) return 0;

    const t = (py - yTopLeft) / (yBotLeft - yTopLeft);
    const leftX = xTopLeft * (1 - t) + xBotLeft * t;
    const rightX = xTopRight * (1 - t) + xBotRight * t;

    if (px < leftX || px > rightX) return 0;

    // 2. Extra color safeguard: If pixel is neutral grey/white checkerboard, discard it
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat <= 8 && (r > 170 || (r > 130 && Math.abs(r-g)<=3 && Math.abs(g-b)<=3))) {
      return 0;
    }

    return 255;
  }

  const outChannels = 4;
  const outData = Buffer.alloc(width * height * outChannels);
  const SS = 8;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const srcIdx = pIdx * channels;
      const dstIdx = pIdx * outChannels;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      outData[dstIdx] = r;
      outData[dstIdx + 1] = g;
      outData[dstIdx + 2] = b;

      let sumAlpha = 0;
      for (let sy = 0; sy < SS; sy++) {
        const subY = y + (sy + 0.5) / SS;
        for (let sx = 0; sx < SS; sx++) {
          const subX = x + (sx + 0.5) / SS;
          sumAlpha += getAlpha(subX, subY, r, g, b);
        }
      }

      outData[dstIdx + 3] = Math.round(sumAlpha / (SS * SS));
    }
  }

  // Crop tightly around the cup with a 2px boundary
  const cropLeft = 546;
  const cropTop = 241;
  const cropWidth = 830 - 546 + 1; // 285px
  const cropHeight = 684 - 241 + 1; // 444px

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/copos menu/aurora_classic.png');

  console.log(`Successfully written 100% clean aurora_classic.png: ${cropWidth}x${cropHeight}`);
}

generateCleanCup();
