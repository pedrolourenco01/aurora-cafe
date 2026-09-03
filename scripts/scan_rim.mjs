import sharp from 'sharp';

async function scanRim() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  for (let y = 237; y <= 248; y++) {
    const row = [];
    for (let x = 535; x <= 845; x += 15) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const sat = Math.max(r,g,b) - Math.min(r,g,b);
      row.push(`[${x}]:${r},${g},${b}(s${sat})`);
    }
    console.log(`y=${y}:\n  ${row.join(' ')}`);
  }
}

scanRim();
