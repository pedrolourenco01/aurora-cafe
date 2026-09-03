import sharp from 'sharp';

async function cutoutCup() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Create a mask: 0 = background, 255 = foreground (cup)
  const mask = new Uint8Array(width * height);
  // Initially set all to 255 (cup)
  mask.fill(255);

  // Helper to check if pixel is background checkerboard / watermark
  function isBgPixel(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    // Check if it's near-neutral grey/white (checkerboard / watermark)
    // The cup is kraft paper (tan/brown) where R > G > B and R-B >= 20, or coffee beans where R,G,B are dark warm brown.
    // The rim is white/cream with subtle warm tone, but sits between y=238 and y=684, x between 535 and 840.
    
    // Outside the cup bounding envelope, anything neutral or background is definitely bg
    if (sat <= 16 && (r > 165 || (r > 130 && Math.abs(r - g) <= 5 && Math.abs(g - b) <= 5))) {
      return true;
    }
    // High brightness near-white
    if (r > 240 && g > 240 && b > 240 && sat <= 15) {
      return true;
    }
    return false;
  }

  // Flood fill from all 4 borders
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  const visited = new Uint8Array(width * height);

  function pushQueue(x, y) {
    const pIdx = y * width + x;
    if (!visited[pIdx]) {
      visited[pIdx] = 1;
      queue[qTail++] = pIdx;
    }
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    pushQueue(x, 0);
    pushQueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushQueue(0, y);
    pushQueue(width - 1, y);
  }

  while (qHead < qTail) {
    const pIdx = queue[qHead++];
    const x = pIdx % width;
    const y = Math.floor(pIdx / width);
    const cIdx = pIdx * channels;

    // Check if this pixel is background
    let isBg = false;

    // Definite background zones
    if (y < 235 || y > 686 || x < 530 || x > 845) {
      isBg = true;
    } else {
      isBg = isBgPixel(cIdx);
    }

    if (isBg) {
      mask[pIdx] = 0; // mark as background

      // 4-neighborhood
      if (x > 0) pushQueue(x - 1, y);
      if (x < width - 1) pushQueue(x + 1, y);
      if (y > 0) pushQueue(x, y - 1);
      if (y < height - 1) pushQueue(x, y + 1);
    }
  }

  // Find tight bounding box of foreground mask
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      if (mask[pIdx] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Cup bounding box: x=[${minX}, ${maxX}] (w=${maxX - minX + 1}), y=[${minY}, ${maxY}] (h=${maxY - minY + 1})`);

  // Build RGBA output buffer
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

      let alpha = mask[pIdx];

      // Feathering edge smoothing
      if (alpha > 0) {
        // Check if neighbor is background to soften alpha (anti-aliasing)
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (mask[ny * width + nx] === 0) bgNeighbors++;
            }
          }
        }
        if (bgNeighbors >= 4) {
          alpha = Math.round(255 * ((8 - bgNeighbors) / 8));
        }
      }

      outData[dstIdx + 3] = alpha;
    }
  }

  // Save full transparent image
  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/copos menu/aurora_classic_transparent.png');

  // Also crop tight around cup with slight padding (12px)
  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, (maxX - minX + 1) + pad * 2);
  const cropH = Math.min(height - cropY, (maxY - minY + 1) + pad * 2);

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toFile('public/copos menu/aurora_classic_cropped.png');

  console.log(`Saved cropped image: ${cropW}x${cropH} at public/copos menu/aurora_classic_cropped.png`);
}

cutoutCup();
