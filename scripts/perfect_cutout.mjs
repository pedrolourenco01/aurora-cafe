import sharp from 'sharp';

async function perfectCupCutout() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's trace top lip arc points
  // Mid top lip is around y=240, left corner is (538, 246), right corner is (838, 246)
  // Let's test the parametric boundary:
  // Top curve: y = y_mid + a * (x - x_mid)^2
  // Bottom curve: y = y_bot_mid + b * (x - x_mid)^2

  const xMid = 688;
  const yTopMid = 240.5;
  const yTopLeft = 247.0; // at x = 538
  const aTop = (yTopLeft - yTopMid) / Math.pow(538 - xMid, 2);

  const yBotMid = 684.0;
  const yBotLeft = 678.0; // at x = 591
  const aBot = (yBotLeft - yBotMid) / Math.pow(591 - xMid, 2);

  console.log('aTop:', aTop, 'aBot:', aBot);

  // For any y between top and bottom, the left and right boundary:
  // t from 0 (top) to 1 (bottom)
  // left(t) = 538 * (1-t) + 591 * t
  // right(t) = 838 * (1-t) + 785 * t

  // Let's create an anti-aliased subpixel mask
  const outChannels = 4;
  const outData = Buffer.alloc(width * height * outChannels);

  // Supersampling factor 4x4
  const SS = 4;
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

          // Check if (subX, subY) is inside cup silhouette
          // 1. Check vertical range at subX
          const topCurveY = yTopMid + aTop * Math.pow(subX - xMid, 2) - 1.0;
          const botCurveY = yBotMid + aBot * Math.pow(subX - xMid, 2) + 0.8;

          if (subY >= topCurveY && subY <= botCurveY) {
            // 2. Check horizontal range at subY
            // Normalized height fraction t:
            const t = Math.max(0, Math.min(1, (subY - 241) / (684 - 241)));
            const leftEdgeX = 537.5 * (1 - t) + 590.5 * t;
            const rightEdgeX = 838.5 * (1 - t) + 785.5 * t;

            if (subX >= leftEdgeX && subX <= rightEdgeX) {
              insideCount++;
            }
          }
        }
      }

      const alpha = Math.round((insideCount / (SS * SS)) * 255);
      outData[dstIdx + 3] = alpha;
    }
  }

  // Extract bounding box with tight padding
  const cropX = 530;
  const cropY = 236;
  const cropW = 316;
  const cropH = 454;

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toFile('public/copos menu/aurora_classic.png');

  console.log('Saved studio-perfect cutout: public/copos menu/aurora_classic.png');
}

perfectCupCutout();
