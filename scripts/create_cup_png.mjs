import sharp from 'sharp';

async function createCupPng() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's create an exact inset polygon/spline for the cup:
  const xMid = 688;
  const xTopLeft = 547.0, yTopLeft = 249.0;
  const xTopRight = 829.0, yTopRight = 249.0;
  const yTopMid = 241.5;

  const xBotLeft = 590.5, yBotLeft = 673.0;
  const xBotRight = 784.5, yBotRight = 673.0;
  const yBotMid = 683.0;

  const kTop = (yTopLeft - yTopMid) / Math.pow(xTopLeft - xMid, 2);
  const kBot = (yBotLeft - yBotMid) / Math.pow(xBotLeft - xMid, 2);

  function isInside(px, py) {
    const topCurveY = yTopMid + kTop * Math.pow(px - xMid, 2);
    if (py < topCurveY) return false;

    const botCurveY = yBotMid + kBot * Math.pow(px - xMid, 2);
    if (py > botCurveY) return false;

    const t = (py - yTopLeft) / (yBotLeft - yTopLeft);
    const leftX = xTopLeft * (1 - t) + xBotLeft * t;
    const rightX = xTopRight * (1 - t) + xBotRight * t;

    if (px < leftX || px > rightX) return false;

    return true;
  }

  const SS = 8;
  const outChannels = 4;
  const outData = Buffer.alloc(width * height * outChannels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const srcIdx = pIdx * channels;
      const dstIdx = pIdx * outChannels;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      let insideCount = 0;
      for (let sy = 0; sy < SS; sy++) {
        const subY = y + (sy + 0.5) / SS;
        for (let sx = 0; sx < SS; sx++) {
          const subX = x + (sx + 0.5) / SS;
          if (isInside(subX, subY)) {
            insideCount++;
          }
        }
      }

      outData[dstIdx + 3] = Math.round((insideCount / (SS * SS)) * 255);
    }
  }

  // Crop tight to the cup bounds with 2px margin
  const cropLeft = 544;
  const cropTop = 239;
  const cropWidth = 832 - 544 + 1; // 289px
  const cropHeight = 685 - 239 + 1; // 447px

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/copos menu/aurora_classic.png');

  console.log(`Successfully generated public/copos menu/aurora_classic.png (${cropWidth}x${cropHeight})`);
}

createCupPng();
