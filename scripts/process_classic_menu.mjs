import sharp from 'sharp';

async function processClassicMenu() {
  const img = sharp('public/copos menu/classic menu.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let nonZeroAlpha = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = data[idx + 3];
      if (a > 10) {
        nonZeroAlpha++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Non-zero alpha pixels: ${nonZeroAlpha}`);
  console.log(`Bounds: x=[${minX}, ${maxX}] (w=${maxX - minX + 1}), y=[${minY}, ${maxY}] (h=${maxY - minY + 1})`);

  // Crop tightly around the cup with a 2px padding
  const pad = 4;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropLeft, (maxX - minX + 1) + pad * 2);
  const cropH = Math.min(height - cropTop, (maxY - minY + 1) + pad * 2);

  await sharp('public/copos menu/classic menu.png')
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .png({ quality: 100 })
    .toFile('public/copos menu/classic_menu_cropped.png');

  console.log(`Saved cropped image: ${cropW}x${cropH} at public/copos menu/classic_menu_cropped.png`);
}

processClassicMenu();
