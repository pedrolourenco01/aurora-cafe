import sharp from 'sharp';

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
      return r >= 135 && g >= 135 && b >= 135 && maxDiff <= 6;
    case 'matcha_checker':
      return r >= 115 && r <= 195 && g >= 115 && g <= 195 && b >= 115 && b <= 195 && maxDiff <= 6;
    case 'matcha_light':
      return r >= 180 && g >= 175 && b >= 160 && maxDiff <= 25;
    default:
      return r > 220 && g > 220 && b > 220 && maxDiff <= 10;
  }
}

const files = [
  { in: 'classic aurora.jpeg', out: 'classic_aurora.png', type: 'classic' },
  { in: 'classic aurora (2).jpeg', out: 'classic_aurora_2.png', type: 'classic' },
  { in: 'caramelo.jpeg', out: 'caramelo.png', type: 'caramel_dark' },
  { in: 'caramelo (2).jpeg', out: 'caramelo_2.png', type: 'caramel_light' },
  { in: 'chocolate.jpeg', out: 'chocolate.png', type: 'chocolate' },
  { in: 'chocolate (2).jpeg', out: 'chocolate_2.png', type: 'chocolate' },
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

async function analyze() {
  for (const item of files) {
    const { data, info } = await sharp('./public/icones hero/' + item.in).raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Outer BFS
    for (let x = 0; x < width; x++) {
      if (isBgPixel(data[x*3], data[x*3+1], data[x*3+2], item.type)) { visited[x] = 1; queue.push(x, 0); }
      const bIdx = (height - 1) * width + x;
      if (isBgPixel(data[bIdx*3], data[bIdx*3+1], data[bIdx*3+2], item.type)) { visited[bIdx] = 1; queue.push(x, height - 1); }
    }
    for (let y = 0; y < height; y++) {
      if (!visited[y*width] && isBgPixel(data[y*width*3], data[y*width*3+1], data[y*width*3+2], item.type)) { visited[y*width] = 1; queue.push(0, y); }
      const rIdx = y * width + (width - 1);
      if (!visited[rIdx] && isBgPixel(data[rIdx*3], data[rIdx*3+1], data[rIdx*3+2], item.type)) { visited[rIdx] = 1; queue.push(width - 1, y); }
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
            if (isBgPixel(data[p], data[p+1], data[p+2], item.type)) {
              visited[nIdx] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    // Connected components of object pixels
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

          while (cHead < cQueue.length) {
            const px = cQueue[cHead++];
            const py = cQueue[cHead++];
            count++;
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
          if (count > 200) { // filter noise
            components.push({ count, minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });
          }
        }
      }
    }

    components.sort((a, b) => b.count - a.count);
    console.log(`=== ${item.out} === (total >200px components: ${components.length})`);
    for (let i = 0; i < Math.min(3, components.length); i++) {
      const c = components[i];
      console.log(`  [${i}] ${c.w}x${c.h}, count: ${c.count}, bbox: [${c.minX}, ${c.minY}, ${c.maxX}, ${c.maxY}]`);
    }
  }
}

analyze();
