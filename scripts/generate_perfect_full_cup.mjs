import sharp from 'sharp';

async function generatePerfectFullCup() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Real cup geometry with 100% full bounds:
  const xMid = 688.0;

  // Top lip endpoints and peak:
  const xTopLeft = 541.5, yTopLeft = 245.5;
  const xTopRight = 834.5, yTopRight = 245.5;
  const yTopMid = 239.5;

  // Bottom lip endpoints and dip:
  const xBotLeft = 587.5, yBotLeft = 673.5;
  const xBotRight = 788.5, yBotRight = 673.5;
  const yBotMid = 685.5;

  // Curvatures
  const kTop = (yTopLeft - yTopMid) / Math.pow(xTopLeft - xMid, 2);
  const kBot = (yBotLeft - yBotMid) / Math.pow(xBotLeft - xMid, 2);

  function isInsideCup(px, py) {
    // 1. Top ellipse curve:
    const topCurveY = yTopMid + kTop * Math.pow(px - xMid, 2);
    if (py < topCurveY) return false;

    // 2. Bottom ellipse curve:
    const botCurveY = yBotMid + kBot * Math.pow(px - xMid, 2);
    if (py > botCurveY) return false;

    // 3. Side straight lines:
    const t = Math.max(0, Math.min(1, (py - yTopLeft) / (yBotLeft - yTopLeft)));
    const leftX = xTopLeft * (1 - t) + xBotLeft * t;
    const rightX = xTopRight * (1 - t) + xBotRight * t;

    if (px < leftX || px > rightX) return false;

    return true;
  }

  const outChannels = 4;
  const outData = Buffer.alloc(width * height * outChannels);
  const SS = 8; // 8x8 supersampling

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

      let insideCount = 0;
      for (let sy = 0; sy < SS; sy++) {
        const subY = y + (sy + 0.5) / SS;
        for (let sx = 0; sx < SS; sx++) {
          const subX = x + (sx + 0.5) / SS;
          if (isInsideCup(subX, subY)) {
            insideCount++;
          }
        }
      }

      let alpha = Math.round((insideCount / (SS * SS)) * 255);

      // Extra check: If pixel is completely outside cup, alpha is 0
      if (insideCount === 0) {
        alpha = 0;
      }

      outData[dstIdx + 3] = alpha;
    }
  }

  // Crop around cup bounds
  const cropLeft = 538;
  const cropTop = 237;
  const cropWidth = 838 - 538 + 1; // 301px
  const cropHeight = 688 - 237 + 1; // 452px

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/copos menu/aurora_classic.png');

  console.log(`Saved 100% complete uncut cup: ${cropWidth}x${cropHeight}`);
}

generatePerfectFullCup();
