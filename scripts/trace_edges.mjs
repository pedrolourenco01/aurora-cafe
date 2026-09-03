import sharp from 'sharp';

async function traceEdges() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = 230; y <= 690; y += 10) {
    let leftX = -1;
    let rightX = -1;

    // Scan from midX to left
    const midX = 688;
    for (let x = midX; x >= 400; x--) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      const isChecker = (sat < 12 && (r > 175 || (r > 150 && Math.abs(r-g)<5 && Math.abs(g-b)<5)));
      if (isChecker && leftX === -1) {
        leftX = x + 1;
        break;
      }
    }

    // Scan from midX to right
    for (let x = midX; x <= 1000; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      const isChecker = (sat < 12 && (r > 175 || (r > 150 && Math.abs(r-g)<5 && Math.abs(g-b)<5)));
      if (isChecker && rightX === -1) {
        rightX = x - 1;
        break;
      }
    }

    console.log(`y=${y}: leftX=${leftX}, rightX=${rightX}, width=${rightX - leftX}`);
  }
}

traceEdges();
