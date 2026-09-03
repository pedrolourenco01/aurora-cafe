import path from 'path';
import sharp from 'sharp';

const matchaFiles = [
  { in: 'matcha.jpeg', out: 'matcha.png', id: 1 },
  { in: 'matcha (2).jpeg', out: 'matcha_2.png', id: 2 },
  { in: 'matcha (3).jpeg', out: 'matcha_3.png', id: 3 },
  { in: 'matcha (4).jpeg', out: 'matcha_4.png', id: 4 },
];

function isMatchaBackground(r, g, b, id) {
  const diffRG = Math.abs(r - g);
  const diffGB = Math.abs(g - b);
  const diffRB = Math.abs(r - b);
  const maxDiff = Math.max(diffRG, diffGB, diffRB);

  if (id === 1) {
    // matcha.jpeg: peeled green pistachio on neutral gray checkerboard with dark shadow
    // Neutral gray background / shadow has low saturation (maxDiff <= 14)
    if (maxDiff <= 14) return true;
    if (r > 160 && g > 160 && b > 150 && maxDiff <= 20) return true;
    return false;
  }

  if (id === 2) {
    // matcha (2).jpeg: green pistachio on cream/white checkerboard
    if (r > 190 && g > 185 && b > 165 && (r - g) <= 18) return true;
    if (maxDiff <= 14) return true;
    return false;
  }

  if (id === 3) {
    // matcha (3).jpeg: pistachio in shell on gray checkerboard
    if (maxDiff <= 12) return true;
    if (r > 200 && g > 200 && b > 200 && maxDiff <= 18) return true;
    return false;
  }

  if (id === 4) {
    // matcha (4).jpeg: pistachio shell on white/cream background with contact shadow
    // Background and table contact shadow:
    if (r >= 220 && g >= 215 && b >= 200) return true;
    if (r >= 185 && g >= 175 && b >= 160 && (r - b) <= 24) return true;
    if (maxDiff <= 14 && r > 90) return true;
    return false;
  }

  return false;
}

async function processMatcha(item) {
  const inputPath = path.resolve('./public/icones hero', item.in);
  const outputPath = path.resolve('./src/assets/ingredients', item.out);

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed borders
  for (let x = 0; x < width; x++) {
    const iTop = x * 3;
    if (isMatchaBackground(data[iTop], data[iTop+1], data[iTop+2], item.id)) {
      visited[x] = 1;
      queue.push(x, 0);
    }
    const iBot = ((height - 1) * width + x) * 3;
    if (isMatchaBackground(data[iBot], data[iBot+1], data[iBot+2], item.id)) {
      visited[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    const iLeft = (y * width) * 3;
    if (!visited[y * width] && isMatchaBackground(data[iLeft], data[iLeft+1], data[iLeft+2], item.id)) {
      visited[y * width] = 1;
      queue.push(0, y);
    }
    const iRight = (y * width + (width - 1)) * 3;
    if (!visited[y * width + (width - 1)] && isMatchaBackground(data[iRight], data[iRight+1], data[iRight+2], item.id)) {
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
          if (isMatchaBackground(data[p], data[p+1], data[p+2], item.id)) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Connected Component analysis
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

  components.sort((a, b) => b.count - a.count);
  const mainComp = components[0];

  const isMainMask = new Uint8Array(width * height);
  for (const idx of mainComp.pixelIndices) {
    isMainMask[idx] = 1;
  }

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

  // Soft edge anti-aliasing
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

  const margin = 4;
  const cropX = Math.max(0, cropMinX - margin);
  const cropY = Math.max(0, cropMinY - margin);
  const cropW = Math.min(width - cropX, (cropMaxX - cropMinX + 1) + margin * 2);
  const cropH = Math.min(height - cropY, (cropMaxY - cropMinY + 1) + margin * 2);

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`Cleaned matcha icon ${item.out}: ${cropW}x${cropH}, solid pixels: ${mainComp.count}`);
}

async function run() {
  for (const item of matchaFiles) {
    await processMatcha(item);
  }
}

run();
