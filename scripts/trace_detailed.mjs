import sharp from 'sharp';

async function traceDetailed() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  console.log('--- TOP RIM ---');
  for (let y = 236; y <= 260; y++) {
    const row = [];
    for (let x = 530; x <= 845; x += 10) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      row.push(`(${x}):${r},${g},${b}`);
    }
    console.log(`y=${y}: ${row.slice(0, 3).join(' ')} ... ${row.slice(-3).join(' ')}`);
  }

  console.log('--- BOTTOM RIM ---');
  for (let y = 675; y <= 688; y++) {
    const row = [];
    for (let x = 580; x <= 795; x += 10) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      row.push(`(${x}):${r},${g},${b}`);
    }
    console.log(`y=${y}: ${row.slice(0, 3).join(' ')} ... ${row.slice(-3).join(' ')}`);
  }
}

traceDetailed();
