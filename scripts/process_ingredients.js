import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Pedro/.gemini/antigravity-ide/brain/e89cd2be-e0e1-4492-96c8-2b01b9139e37';
const OUT_DIR = path.resolve('./public/ingredients');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const IMAGES = [
  {
    src: path.join(ARTIFACT_DIR, 'coffee_beans_pack_1787724434525.jpg'),
    prefix: 'classic',
    crops: [
      { name: '1', left: 100, top: 600, width: 340, height: 340, blur: 5 },  // foreground left blurred
      { name: '2', left: 420, top: 340, width: 350, height: 350, blur: 0 },  // sharp center
      { name: '3', left: 480, top: 40, width: 320, height: 320, blur: 1 },   // top sharp
      { name: '4', left: 660, top: 860, width: 300, height: 300, blur: 4 },  // bottom blurred
      { name: '5', left: 70, top: 120, width: 280, height: 280, blur: 3 },   // top left
    ]
  },
  {
    src: path.join(ARTIFACT_DIR, 'almonds_caramel_pack_1787724453929.jpg'),
    prefix: 'caramel',
    crops: [
      { name: '1', left: 420, top: 400, width: 360, height: 360, blur: 0 }, // sharp central almond
      { name: '2', left: 240, top: 460, width: 300, height: 300, blur: 0 }, // golden caramel cube
      { name: '3', left: 100, top: 520, width: 260, height: 260, blur: 4 }, // blurred left caramel
      { name: '4', left: 710, top: 590, width: 270, height: 270, blur: 0 }, // sharp right caramel
      { name: '5', left: 540, top: 700, width: 280, height: 280, blur: 5 }, // blurred foreground almond
    ]
  },
  {
    src: path.join(ARTIFACT_DIR, 'chocolate_chunks_pack_1787724476802.jpg'),
    prefix: 'chocolate',
    crops: [
      { name: '1', left: 270, top: 330, width: 380, height: 380, blur: 0 }, // sharp chocolate chunk
      { name: '2', left: 450, top: 460, width: 320, height: 320, blur: 0 }, // dark cocoa & chocolate
      { name: '3', left: 100, top: 610, width: 260, height: 260, blur: 2 }, // chunk bottom left
      { name: '4', left: 490, top: 760, width: 280, height: 280, blur: 4 }, // blurred foreground
      { name: '5', left: 690, top: 50, width: 260, height: 260, blur: 1 },  // top right bean
    ]
  },
  {
    src: path.join(ARTIFACT_DIR, 'berries_pack_1787724501576.jpg'),
    prefix: 'berries',
    crops: [
      { name: '1', left: 310, top: 570, width: 340, height: 340, blur: 0 }, // fresh strawberry slice
      { name: '2', left: 220, top: 430, width: 320, height: 320, blur: 0 }, // raspberry & blueberry
      { name: '3', left: 680, top: 590, width: 300, height: 300, blur: 5 }, // foreground blurred raspberry
      { name: '4', left: 540, top: 230, width: 300, height: 300, blur: 0 }, // sliced strawberry top
      { name: '5', left: 120, top: 620, width: 260, height: 260, blur: 2 }, // left raspberry
    ]
  },
  {
    src: path.join(ARTIFACT_DIR, 'matcha_leaves_pack_1787724529476.jpg'),
    prefix: 'matcha',
    crops: [
      { name: '1', left: 320, top: 310, width: 380, height: 380, blur: 0 }, // sharp tea leaves center
      { name: '2', left: 60, top: 210, width: 300, height: 300, blur: 1 },  // side tea leaf
      { name: '3', left: 780, top: 560, width: 240, height: 240, blur: 4 }, // blurred foreground leaf
      { name: '4', left: 460, top: 190, width: 260, height: 260, blur: 0 }, // curved tea leaf
      { name: '5', left: 620, top: 600, width: 280, height: 280, blur: 2 }, // lower leaf
    ]
  }
];

async function removeWhiteBackground(inputBuffer) {
  const image = sharp(inputBuffer);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Lightness threshold
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const avg = (r + g + b) / 3;

    if (minVal > 248) {
      data[i + 3] = 0; // pure transparent
    } else if (minVal > 235 && (maxVal - minVal) < 16) {
      // Smooth anti-aliased edge transition
      const alphaFactor = (248 - minVal) / 13;
      data[i + 3] = Math.round(data[i + 3] * alphaFactor);
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();
}

async function run() {
  console.log('Processing ingredient images...');
  for (const item of IMAGES) {
    console.log(`Processing ${item.prefix}...`);
    const sourceBuffer = fs.readFileSync(item.src);
    const transparentSource = await removeWhiteBackground(sourceBuffer);

    // Save full transparent sheet
    fs.writeFileSync(path.join(OUT_DIR, `${item.prefix}_sheet.png`), transparentSource);

    // Save individual crops
    for (const crop of item.crops) {
      const croppedBuffer = await sharp(transparentSource)
        .extract({
          left: Math.max(0, crop.left),
          top: Math.max(0, crop.top),
          width: Math.min(1024 - crop.left, crop.width),
          height: Math.min(1024 - crop.top, crop.height)
        })
        .png()
        .toBuffer();

      const outName = `${item.prefix}_${crop.name}.png`;
      fs.writeFileSync(path.join(OUT_DIR, outName), croppedBuffer);
      console.log(` -> Created ${outName}`);
    }
  }
  console.log('All ingredient assets generated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
