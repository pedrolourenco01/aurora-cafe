import sharp from 'sharp';

const img = sharp('./src/assets/ingredients/frutas_4.png');
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

console.log('Inspecting corners of frutas_4.png:');
console.log('Top-left (0,0):', data[0], data[1], data[2], data[3]);
console.log('Top-right (w-1,0):', data[(width-1)*4], data[(width-1)*4+1], data[(width-1)*4+2], data[(width-1)*4+3]);
console.log('Bottom-left (0,h-1):', data[((height-1)*width)*4], data[((height-1)*width)*4+1], data[((height-1)*width)*4+2], data[((height-1)*width)*4+3]);
console.log('Bottom-right (w-1,h-1):', data[(height*width-1)*4], data[(height*width-1)*4+1], data[(height*width-1)*4+2], data[(height*width-1)*4+3]);

// Count non-zero alphas
let solidCount = 0;
let transparentCount = 0;
let semiCount = 0;

for (let i = 0; i < data.length; i += 4) {
  const a = data[i + 3];
  if (a === 255) solidCount++;
  else if (a === 0) transparentCount++;
  else semiCount++;
}

console.log(`Solid pixels: ${solidCount}, Transparent pixels: ${transparentCount}, Semi-transparent (edge feather): ${semiCount}`);
