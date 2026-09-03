import sharp from 'sharp';

async function inspect(filename) {
  const { data, info } = await sharp('./public/icones hero/' + filename).raw().toBuffer({ resolveWithObject: true });
  console.log(`\n================== ${filename} ==================`);
  console.log(`Resolution: ${info.width}x${info.height}`);

  // Sample a grid across the image
  for (let y = 200; y < 600; y += 40) {
    let row = `y=${y}: `;
    for (let x = 400; x < 1000; x += 80) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      row += `[${r},${g},${b}] `;
    }
    console.log(row);
  }
}

async function run() {
  await inspect('matcha.jpeg');
  await inspect('matcha (2).jpeg');
  await inspect('matcha (3).jpeg');
  await inspect('matcha (4).jpeg');
}
run();
