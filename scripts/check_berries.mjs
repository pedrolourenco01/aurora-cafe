import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './src/assets/ingredients';
const files = fs.readdirSync(dir).filter(f => f.includes('fruit') || f.includes('berries') || f.includes('fruta'));

for (const f of files) {
  const meta = await sharp(path.join(dir, f)).metadata();
  console.log(`${f}: ${meta.width}x${meta.height}, format: ${meta.format}, channels: ${meta.channels}`);
}
