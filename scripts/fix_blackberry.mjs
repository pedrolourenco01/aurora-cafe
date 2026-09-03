import sharp from 'sharp';

// Load fruit_cutout_4.png or frutas_4.png
const img = sharp('./src/assets/ingredients/fruit_cutout_4.png');
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

console.log('fruit_cutout_4 dimensions:', width, height);

// Find the blackberry boundary
// We want all blackberry drupelets (black/dark-purple/reddish pixels) to have 100% SOLID alpha (255)
// And the outer background to have 0 alpha

// 1. Mark background using BFS from edges with strict threshold
const visited = new Uint8Array(width * height);
const q = [];

function isOuterBackground(x, y) {
  const idx = (y * width + x) * 4;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];

  if (a < 10) return true;
  // Outer background is light white/gray with brightness > 215
  return (r > 215 && g > 215 && b > 215);
}

for (let x = 0; x < width; x++) {
  if (isOuterBackground(x, 0)) { visited[0 * width + x] = 1; q.push(x, 0); }
  if (isOuterBackground(x, height - 1)) { visited[(height - 1) * width + x] = 1; q.push(x, height - 1); }
}

for (let y = 0; y < height; y++) {
  if (isOuterBackground(0, y) && !visited[y * width + 0]) { visited[y * width + 0] = 1; q.push(0, y); }
  if (isOuterBackground(width - 1, y) && !visited[y * width + (width - 1)]) { visited[y * width + (width - 1)] = 1; q.push(width - 1, y); }
}

let head = 0;
while (head < q.length) {
  const cx = q[head++];
  const cy = q[head++];
  visited[cy * width + cx] = 1;

  const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nIndex = ny * width + nx;
      if (!visited[nIndex]) {
        if (isOuterBackground(nx, ny)) {
          visited[nIndex] = 1;
          q.push(nx, ny);
        }
      }
    }
  }
}

// Now set alphas:
// If visited by background BFS -> alpha = 0
// If NOT visited (it is the berry!) -> alpha = 255 (100% solid opacity, NO transparency inside the berry!)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pIdx = (y * width + x) * 4;
    const isBg = visited[y * width + x] === 1;

    if (isBg) {
      data[pIdx + 3] = 0;
    } else {
      // It's the berry! Make it 100% solid opaque
      data[pIdx + 3] = 255;
    }
  }
}

// Also soften 1px boundary so it doesn't have jagged edges
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = (y * width + x) * 4;
    if (data[idx + 3] === 255) {
      let bgCount = 0;
      if (data[((y - 1) * width + x) * 4 + 3] === 0) bgCount++;
      if (data[((y + 1) * width + x) * 4 + 3] === 0) bgCount++;
      if (data[(y * width + (x - 1)) * 4 + 3] === 0) bgCount++;
      if (data[(y * width + (x + 1)) * 4 + 3] === 0) bgCount++;

      // If on the exact 1px edge
      if (bgCount >= 2) {
        data[idx + 3] = 180;
      }
    }
  }
}

// Save to frutas_4.png
await sharp(data, {
  raw: { width, height, channels: 4 }
})
.png({ quality: 100 })
.toFile('./src/assets/ingredients/frutas_4.png');

console.log('frutas_4.png reconstructed with 100% solid opacity!');
