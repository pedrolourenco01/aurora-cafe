import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processSplash() {
  const inputPath = path.resolve('./public/splash/splash chocolate.jpeg');
  const outDir = path.resolve('./src/assets/splash');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outputPathSrc = path.resolve('./src/assets/splash/chocolate_splash.png');
  const outputPathPub = path.resolve('./public/splash/chocolate_splash.png');

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  function isBg(r, g, b) {
    const diffRG = Math.abs(r - g);
    const diffGB = Math.abs(g - b);
    const diffRB = Math.abs(r - b);
    const maxDiff = Math.max(diffRG, diffGB, diffRB);

    // Light neutral background/checkerboard
    if (r >= 205 && g >= 205 && b >= 205 && maxDiff <= 12) return true;
    if (r >= 180 && g >= 180 && b >= 180 && maxDiff <= 6) return true;
    return false;
  }

  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    if (isBg(data[x*3], data[x*3+1], data[x*3+2])) { visited[x] = 1; queue.push(x, 0); }
    const bIdx = (height - 1) * width + x;
    if (isBg(data[bIdx*3], data[bIdx*3+1], data[bIdx*3+2])) { visited[bIdx] = 1; queue.push(x, height - 1); }
  }
  for (let y = 0; y < height; y++) {
    if (!visited[y*width] && isBg(data[y*width*3], data[y*width*3+1], data[y*width*3+2])) { visited[y*width] = 1; queue.push(0, y); }
    const rIdx = y * width + (width - 1);
    if (!visited[rIdx] && isBg(data[rIdx*3], data[rIdx*3+1], data[rIdx*3+2])) { visited[rIdx] = 1; queue.push(width - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    for (const [nx, ny] of [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]]) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx]) {
          const p = nIdx * 3;
          if (isBg(data[p], data[p+1], data[p+2])) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let solidPixels = 0;
  const outBuf = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 3;
      const d = (y * width + x) * 4;

      outBuf[d] = data[s];
      outBuf[d+1] = data[s+1];
      outBuf[d+2] = data[s+2];

      if (visited[y*width + x]) {
        outBuf[d+3] = 0;
      } else {
        outBuf[d+3] = 255;
        solidPixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Smooth edge anti-aliasing
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

  const margin = 6;
  const cropX = Math.max(0, minX - margin);
  const cropY = Math.max(0, minY - margin);
  const cropW = Math.min(width - cropX, (maxX - minX + 1) + margin * 2);
  const cropH = Math.min(height - cropY, (maxY - minY + 1) + margin * 2);

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPathSrc);

  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile(outputPathPub);

  console.log(`Extracted chocolate splash: ${cropW}x${cropH}, solid pixels: ${solidPixels}`);
}

processSplash();
