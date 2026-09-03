import sharp from 'sharp';

async function traceTrueCup() {
  const img = sharp('public/copos menu/aurora classic.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's analyze row by row: from y = 230 to 695
  // For each row, scan from left border (x=0) inwards until we hit the first cup pixel,
  // and scan from right border (x=width-1) inwards until we hit the first cup pixel.
  
  function isBackground(r, g, b) {
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    // Background is neutral gray or white checkerboard:
    // White squares: ~240-255, gray squares: ~180-205, faint lines: sat < 10
    // The cup rim is white/cream: (r=244, g=242, b=238) or (r=230, g=228, b=220)
    // But notice: background checkerboard is strictly neutral: |r-g| <= 3, |g-b| <= 3, |r-b| <= 3!
    // And watermark lines are also neutral: sat <= 6.
    return (sat <= 6 && (r > 160 || (r > 120 && Math.abs(r-g)<=2 && Math.abs(g-b)<=2)));
  }

  const bounds = [];
  for (let y = 235; y <= 690; y++) {
    let leftX = -1;
    let rightX = -1;

    for (let x = 300; x < 688; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isBackground(r, g, b)) {
        leftX = x;
        break;
      }
    }

    for (let x = width - 300; x > 688; x--) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isBackground(r, g, b)) {
        rightX = x;
        break;
      }
    }

    if (leftX !== -1 && rightX !== -1) {
      bounds.push({ y, leftX, rightX, width: rightX - leftX + 1 });
    }
  }

  console.log(`Found ${bounds.length} rows inside cup.`);
  console.log('Top rows:', bounds.slice(0, 15));
  console.log('Bottom rows:', bounds.slice(-15));
}

traceTrueCup();
