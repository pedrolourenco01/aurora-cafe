import path from 'path';
import sharp from 'sharp';

const files = ['caramelo.png', 'chocolate_2.png'];
const dir = './src/assets/ingredients';

for (const file of files) {
  const filePath = path.join(dir, file);
  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // If near white / light neutral background
    if (r > 210 && g > 210 && b > 210 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 }
  })
  .png({ quality: 100 })
  .toFile(filePath + '.tmp');

  import('fs').then(fs => fs.renameSync(filePath + '.tmp', filePath));
  console.log(`Cleaned extra for ${file}`);
}
