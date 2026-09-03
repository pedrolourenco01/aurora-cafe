import sharp from 'sharp';

async function findExactContour() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's print out exact left and right pixel at every 20 pixels from y=240 to 684
  for (let y = 240; y <= 685; y += 15) {
    let firstX = -1, lastX = -1;
    for (let x = 500; x <= 880; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      
      // Cup pixel definition:
      // Kraft paper: r > b + 15, or coffee bean: r < 100 && g < 100 && b < 100 && r > b, or white rim: r > 210, g > 205, b > 195 with r - b > 4
      const isCup = (r - b >= 12 && r >= 100) || 
                    (r < 90 && g < 70 && b < 60 && (r > b || r > g)) ||
                    (r >= 220 && g >= 210 && b >= 195 && (r - b >= 6 || g - b >= 6));

      if (isCup) {
        if (firstX === -1) firstX = x;
        lastX = x;
      }
    }
    console.log(`y=${y}: left=${firstX}, right=${lastX}, width=${lastX - firstX + 1}`);
  }
}

findExactContour();
