import sharp from 'sharp';

const meta = await sharp('./src/assets/skins/classic.jpeg').metadata();
console.log('classic.jpeg dimensions:', meta.width, meta.height);
