import sharp from 'sharp';

async function analyze() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  console.log(`Image ${width}x${height}, channels: ${channels}`);

  // Sample corners and borders
  for (const [name, x, y] of [
    ['top-left', 10, 10],
    ['top-right', width - 10, 10],
    ['bottom-left', 10, height - 10],
    ['bottom-right', width - 10, height - 10],
    ['top-center', Math.floor(width/2), 10],
    ['center', Math.floor(width/2), Math.floor(height/2)],
    ['cup-rim', Math.floor(width/2), 240],
    ['cup-bottom', Math.floor(width/2), 650]
  ]) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx+1];
    const b = data[idx+2];
    console.log(`${name} (${x}, ${y}): RGB(${r}, ${g}, ${b})`);
  }
}

analyze();
