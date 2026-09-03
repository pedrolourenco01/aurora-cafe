import path from 'path';
import sharp from 'sharp';

async function testAlignment() {
  const { data, info } = await sharp('./public/splash/splash chocolate.jpeg').raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's find where the cup was in splash chocolate.jpeg
  // Look at row y = 500 in splash chocolate.jpeg:
  // Where is the bottom pool?
  const y = 500;
  let poolStart = -1, poolEnd = -1;
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const isBg = (Math.abs(r-g) <= 12 && Math.abs(g-b) <= 12 && r >= 170) || (r >= 200 && g >= 200 && b >= 195);
    if (!isBg) {
      if (poolStart === -1) poolStart = x;
      poolEnd = x;
    }
  }
  console.log('Pool at y=500 starts at x=' + poolStart + ' and ends at x=' + poolEnd + ', midX=' + (poolStart+poolEnd)/2);

  // Look at where the cup contour / cutout was
  // Let's check rows y = 300 to 550
  for (let testY = 250; testY <= 550; testY += 50) {
    let xs = [];
    for (let x = 0; x < width; x += 10) {
      const idx = (testY * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const isBg = (Math.abs(r-g) <= 12 && Math.abs(g-b) <= 12 && r >= 170) || (r >= 200 && g >= 200 && b >= 195);
      if (!isBg) xs.push(x);
    }
    console.log(`y=${testY}: minX=${Math.min(...xs)}, maxX=${Math.max(...xs)}, count=${xs.length}`);
  }
}

testAlignment();
