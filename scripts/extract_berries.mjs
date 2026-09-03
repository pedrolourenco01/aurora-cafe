import sharp from 'sharp';

// Extract high quality cutouts directly from berries_sheet.png
const sheet = sharp('./src/assets/ingredients/berries_sheet.png');
const { data, info } = await sheet.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

console.log('Sheet info:', width, height);

// Let's inspect where the blackberry is located in the sheet
// Typically in a 1024x1024 sprite sheet, there are 4-5 items.
// Let's find connected components in the sheet that are not transparent
const visited = new Uint8Array(width * height);
const components = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const a = data[idx + 3];
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Check if non-white / non-transparent
    const isFruit = a > 20 && !(r > 240 && g > 240 && b > 240);

    if (isFruit && !visited[y * width + x]) {
      // Start BFS for component
      let minX = x, maxX = x, minY = y, maxY = y;
      let count = 0;
      const q = [x, y];
      visited[y * width + x] = 1;

      let qHead = 0;
      while (qHead < q.length) {
        const cx = q[qHead++];
        const cy = q[qHead++];
        count++;

        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        const neighbors = [
          [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIndex = ny * width + nx;
            if (!visited[nIndex]) {
              visited[nIndex] = 1;
              const nIdx = nIndex * 4;
              const na = data[nIdx + 3];
              const nr = data[nIdx];
              const ng = data[nIdx + 1];
              const nb = data[nIdx + 2];
              if (na > 20 && !(nr > 240 && ng > 240 && nb > 240)) {
                q.push(nx, ny);
              }
            }
          }
        }
      }

      if (count > 2000) {
        components.push({ minX, maxX, minY, maxY, count, w: maxX - minX, h: maxY - minY });
      }
    }
  }
}

console.log('Found components in berries_sheet:', components);
