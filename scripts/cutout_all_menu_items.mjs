import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const menuDir = './src/assets/menu';
const files = fs.readdirSync(menuDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

console.log(`Processing background removal on ${files.length} menu items...`);

for (const file of files) {
  const filePath = path.join(menuDir, file);
  const baseName = path.parse(file).name;
  const outPngPath = path.join(menuDir, `${baseName}.png`);

  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Grid visited array for BFS flood fill
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height * 2);
  let qHead = 0;
  let qTail = 0;

  // Sample outer corner background colors to get baseline background color
  const cornerColors = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
    [Math.floor(width/2), 0], [0, Math.floor(height/2)], [width - 1, Math.floor(height/2)]
  ].map(([x, y]) => {
    const idx = (y * width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  });

  const avgBgR = cornerColors.reduce((s, c) => s + c[0], 0) / cornerColors.length;
  const avgBgG = cornerColors.reduce((s, c) => s + c[1], 0) / cornerColors.length;
  const avgBgB = cornerColors.reduce((s, c) => s + c[2], 0) / cornerColors.length;

  function isBg(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a < 20) return true;

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const sat = maxVal - minVal;

    // High brightness near white/cream studio background
    if (r > 218 && g > 218 && b > 218) return true;
    if (r > 200 && g > 195 && b > 190 && sat < 24) return true;

    // Distance to average background color
    const dist = Math.hypot(r - avgBgR, g - avgBgG, b - avgBgB);
    if (dist < 40 && sat < 30) return true;

    return false;
  }

  // Seed borders
  function pushQueue(x, y) {
    const pIdx = y * width + x;
    if (!visited[pIdx] && isBg(x, y)) {
      visited[pIdx] = 1;
      queue[qTail++] = x;
      queue[qTail++] = y;
    }
  }

  for (let x = 0; x < width; x++) {
    pushQueue(x, 0);
    pushQueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushQueue(0, y);
    pushQueue(width - 1, y);
  }

  // BFS Flood Fill from edges
  while (qHead < qTail) {
    const cx = queue[qHead++];
    const cy = queue[qHead++];

    const pIdx = (cy * width + cx) * 4;
    data[pIdx + 3] = 0; // Transparent

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          visited[nIndex] = 1;
          if (isBg(nx, ny)) {
            queue[qTail++] = nx;
            queue[qTail++] = ny;
          }
        }
      }
    }
  }

  // Soft feathering & de-fringing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];

      if (a > 0) {
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (data[(ny * width + nx) * 4 + 3] === 0) {
                bgNeighbors++;
              }
            }
          }
        }

        const r = data[idx], g = data[idx+1], b = data[idx+2];
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);

        if (bgNeighbors >= 5 && maxVal > 210 && (maxVal - minVal) < 25) {
          data[idx + 3] = 0;
        } else if (bgNeighbors >= 1 && bgNeighbors < 5 && maxVal > 215) {
          data[idx + 3] = Math.round(255 * ((8 - bgNeighbors) / 8));
        }
      }
    }
  }

  // Find tight bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX > minX && maxY > minY) {
    const pad = 12;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(width - cropX, (maxX - minX + 1) + pad * 2);
    const cropH = Math.min(height - cropY, (maxY - minY + 1) + pad * 2);

    await sharp(data, {
      raw: { width, height, channels: 4 }
    })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(outPngPath);

    console.log(`✓ Generated ${baseName}.png (${cropW}x${cropH})`);
  } else {
    // Fallback save entire cleaned
    await sharp(data, { raw: { width, height, channels: 4 } })
      .png({ quality: 100 })
      .toFile(outPngPath);
    console.log(`✓ Generated ${baseName}.png (full)`);
  }
}

console.log('All menu item images have been processed with transparent backgrounds!');
