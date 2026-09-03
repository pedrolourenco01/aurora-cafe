import sharp from 'sharp';

async function scanCup() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's check vertical profile at x = width / 2
  const midX = Math.floor(width / 2);
  for (let y = 180; y <= 700; y += 10) {
    const idx = (y * width + midX) * channels;
    console.log(`y=${y}: RGB(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
  }

  // Let's check horizontal profile at y = 400
  const midY = 400;
  for (let x = 400; x <= 950; x += 25) {
    const idx = (midY * width + x) * channels;
    console.log(`x=${x}, y=400: RGB(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
  }
}

scanCup();
