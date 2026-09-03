import path from 'path';
import sharp from 'sharp';

const files = [
  { in: 'classic aurora.jpeg', out: 'classic_aurora.png', type: 'classic' },
  { in: 'classic aurora (2).jpeg', out: 'classic_aurora_2.png', type: 'classic' },
  { in: 'caramelo.jpeg', out: 'caramelo.png', type: 'caramel_dark' },
  { in: 'caramelo (2).jpeg', out: 'caramelo_2.png', type: 'caramel_light' },
  { in: 'chocolate.jpeg', out: 'chocolate.png', type: 'chocolate' },
  { in: 'chocolate (2).jpeg', out: 'chocolate_2.png', type: 'chocolate_splash' },
  { in: 'chocolate (3).jpeg', out: 'chocolate_3.png', type: 'chocolate' },
  { in: 'chocolate (4).jpeg', out: 'chocolate_4.png', type: 'chocolate' },
  { in: 'frutas.jpeg', out: 'frutas.png', type: 'white_bg' },
  { in: 'frutas (2).jpeg', out: 'frutas_2.png', type: 'white_bg' },
  { in: 'frutas (3).jpeg', out: 'frutas_3.png', type: 'white_bg' },
  { in: 'frutas (4).jpeg', out: 'frutas_4.png', type: 'white_bg' },
  { in: 'frutas (5).jpeg', out: 'frutas_5.png', type: 'white_bg' },
  { in: 'matcha.jpeg', out: 'matcha.png', type: 'matcha_checker' },
  { in: 'matcha (2).jpeg', out: 'matcha_2.png', type: 'matcha_light' },
  { in: 'matcha (3).jpeg', out: 'matcha_3.png', type: 'matcha_light' },
  { in: 'matcha (4).jpeg', out: 'matcha_4.png', type: 'matcha_light' },
];

function isBgPixel(r, g, b, type) {
  const diffRG = Math.abs(r - g);
  const diffGB = Math.abs(g - b);
  const diffRB = Math.abs(r - b);
  const maxDiff = Math.max(diffRG, diffGB, diffRB);

  switch (type) {
    case 'white_bg':
      return r > 230 && g > 230 && b > 230;
    case 'classic':
      return r >= 170 && g >= 170 && b >= 170 && maxDiff <= 6;
    case 'caramel_dark':
      return r >= 80 && r <= 165 && g >= 80 && g <= 165 && b >= 80 && b <= 165 && maxDiff <= 6;
    case 'caramel_light':
      return r >= 185 && g >= 185 && b >= 185 && maxDiff <= 6;
    case 'chocolate':
    case 'chocolate_splash':
      return r >= 135 && g >= 135 && b >= 135 && maxDiff <= 6;
    case 'matcha_checker':
      return r >= 115 && r <= 195 && g >= 115 && g <= 195 && b >= 115 && b <= 195 && maxDiff <= 6;
    case 'matcha_light':
      return r >= 180 && g >= 175 && b >= 160 && maxDiff <= 25;
    default:
      return r > 220 && g > 220 && b > 220 && maxDiff <= 10;
  }
}

async function processImage(item) {
  const inputPath = path.resolve('./public/icones hero', item.in);
  const outputPath = path.resolve('./src/assets/ingredients', item.out);
  
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed borders
  for (let x = 0; x < width; x++) {
    const iTop = x * 3;
    if (isBgPixel(data[iTop], data[iTop+1], data[iTop+2], item.type)) {
      visited[x] = 1;
      queue.push(x, 0);
    }
    const iBot = ((height - 1) * width + x) * 3;
    if (isBgPixel(data[iBot], data[iBot+1], data[iBot+2], item.type)) {
      visited[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    const iLeft = (y * width) * 3;
    if (!visited[y * width] && isBgPixel(data[iLeft], data[iLeft+1], data[iLeft+2], item.type)) {
      visited[y * width] = 1;
      queue.push(0, y);
    }
    const iRight = (y * width + (width - 1)) * 3;
    if (!visited[y * width + (width - 1)] && isBgPixel(data[iRight], data[iRight+1], data[iRight+2], item.type)) {
      visited[y * width + (width - 1)] = 1;
      queue.push(width - 1, y);
    }
  }

  // BFS Flood Fill from borders
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx]) {
          const p = nIdx * 3;
          if (isBgPixel(data[p], data[p+1], data[p+2], item.type)) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Connected Component analysis to isolate the main hero object
  const compVisited = new Uint8Array(width * height);
  const components = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!visited[idx] && !compVisited[idx]) {
        const cQueue = [x, y];
        compVisited[idx] = 1;
        let cHead = 0;
        let minX = x, maxX = x, minY = y, maxY = y, count = 0;
        const pixelIndices = [];

        while (cHead < cQueue.length) {
          const px = cQueue[cHead++];
          const py = cQueue[cHead++];
          count++;
          pixelIndices.push(py * width + px);
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;

          for (const [nx, ny] of [[px+1, py], [px-1, py], [px, py+1], [px, py-1]]) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (!visited[nIdx] && !compVisited[nIdx]) {
                compVisited[nIdx] = 1;
                cQueue.push(nx, ny);
              }
            }
          }
        }
        components.push({ count, minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1, pixelIndices });
      }
    }
  }

  // Sort components by pixel count
  components.sort((a, b) => b.count - a.count);
  const mainComp = components[0];

  if (!mainComp) {
    console.error(`No object found in ${item.in}`);
    return;
  }

  // Build a mask for the main component (and any tightly associated large pieces if splash)
  const isMainMask = new Uint8Array(width * height);
  for (const idx of mainComp.pixelIndices) {
    isMainMask[idx] = 1;
  }

  // If chocolate_2 (splash), also include secondary splash chunks that are close to the center
  if (item.type === 'chocolate_splash') {
    for (let cIdx = 1; cIdx < components.length; cIdx++) {
      const c = components[cIdx];
      if (c.count > 2000) {
        for (const idx of c.pixelIndices) {
          isMainMask[idx] = 1;
        }
      }
    }
  }

  // Determine tight crop bounding box around the active main component pixels
  let cropMinX = width, cropMaxX = 0, cropMinY = height, cropMaxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isMainMask[y * width + x]) {
        if (x < cropMinX) cropMinX = x;
        if (x > cropMaxX) cropMaxX = x;
        if (y < cropMinY) cropMinY = y;
        if (y > cropMaxY) cropMaxY = y;
      }
    }
  }

  // Create 4-channel RGBA buffer
  const outBuf = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 3;
      const dstIdx = (y * width + x) * 4;

      outBuf[dstIdx] = data[srcIdx];
      outBuf[dstIdx + 1] = data[srcIdx + 1];
      outBuf[dstIdx + 2] = data[srcIdx + 2];

      if (isMainMask[y * width + x]) {
        outBuf[dstIdx + 3] = 255;
      } else {
        outBuf[dstIdx + 3] = 0;
      }
    }
  }

  // Soft edge anti-aliasing (smooth 1px boundary)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      if (outBuf[idx + 3] === 255) {
        let bgNeighbors = 0;
        if (outBuf[((y - 1) * width + x) * 4 + 3] === 0) bgNeighbors++;
        if (outBuf[((y + 1) * width + x) * 4 + 3] === 0) bgNeighbors++;
        if (outBuf[(y * width + (x - 1)) * 4 + 3] === 0) bgNeighbors++;
        if (outBuf[(y * width + (x + 1)) * 4 + 3] === 0) bgNeighbors++;

        if (bgNeighbors >= 2) {
          outBuf[idx + 3] = 160;
        } else if (bgNeighbors === 1) {
          outBuf[idx + 3] = 215;
        }
      }
    }
  }

  // Tight crop with small 4px margin so the icon fills its container beautifully
  const margin = 4;
  const cropX = Math.max(0, cropMinX - margin);
  const cropY = Math.max(0, cropMinY - margin);
  const cropW = Math.min(width - cropX, (cropMaxX - cropMinX + 1) + margin * 2);
  const cropH = Math.min(height - cropY, (cropMaxY - cropMinY + 1) + margin * 2);

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`Tightly cropped ${item.out}: ${cropW}x${cropH} (main object: ${mainComp.w}x${mainComp.h})`);
}

async function run() {
  for (const item of files) {
    try {
      await processImage(item);
    } catch (err) {
      console.error(`Error processing ${item.in}:`, err.message);
    }
  }
}

run();
