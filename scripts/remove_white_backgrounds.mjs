import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './src/assets/ingredients';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') && !f.endsWith('_sheet.png'));

console.log('Processing transparency cleanup on', files.length, 'ingredient PNGs...');

for (const file of files) {
  const filePath = path.join(dir, file);
  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  
  // Grid visited array for BFS flood fill
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Helper to check if a pixel is background (near white / light gray / translucent white)
  function isBackgroundPixel(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // If already transparent
    if (a < 15) return true;

    // Check if near white or light gray / checkerboard
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isGrayish = (maxVal - minVal) < 25;

    // High brightness near white / gray
    if (r > 200 && g > 200 && b > 200 && isGrayish) {
      return true;
    }

    // Light neutral fringe
    if (r > 220 && g > 220 && b > 220) {
      return true;
    }

    return false;
  }

  // Add all 4 borders to queue
  for (let x = 0; x < width; x++) {
    // Top border
    if (isBackgroundPixel(x, 0)) {
      visited[0 * width + x] = 1;
      queue.push(x, 0);
    }
    // Bottom border
    if (isBackgroundPixel(x, height - 1)) {
      visited[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    if (isBackgroundPixel(0, y) && !visited[y * width + 0]) {
      visited[y * width + 0] = 1;
      queue.push(0, y);
    }
    // Right border
    if (isBackgroundPixel(width - 1, y) && !visited[y * width + (width - 1)]) {
      visited[y * width + (width - 1)] = 1;
      queue.push(width - 1, y);
    }
  }

  // Perform BFS Flood Fill from edges
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    // Make this pixel completely transparent
    const pIdx = (cy * width + cx) * 4;
    data[pIdx + 3] = 0; // Alpha = 0

    // Check 4 neighbors
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
          if (isBackgroundPixel(nx, ny)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // De-fringe: Remove semi-transparent near-white boundary pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];
      if (a > 0) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);

        // Check if neighboring any transparent pixel
        let hasTransparentNeighbor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (data[(ny * width + nx) * 4 + 3] === 0) {
                hasTransparentNeighbor = true;
                break;
              }
            }
          }
          if (hasTransparentNeighbor) break;
        }

        if (hasTransparentNeighbor && (maxVal > 210 && (maxVal - minVal) < 30)) {
          data[idx + 3] = 0; // eliminate edge white halo
        }
      }
    }
  }

  // Save the cleaned PNG
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(filePath + '.tmp.png');

  fs.renameSync(filePath + '.tmp.png', filePath);
  console.log(`Cleaned ${file}: cleared ${queue.length / 2} background pixels.`);
}

console.log('All ingredient images cleaned successfully!');
