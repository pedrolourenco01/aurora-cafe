import https from 'https';
import fs from 'fs';
import path from 'path';

const files = [
  'files/index.html',
  'files/script.js',
  'files/style.css',
  'files/img/img_1.svg',
  'files/img/img_2.svg',
  'files/img/img_3.svg',
  'files/img/img_4.svg'
];

const baseUrl = 'https://vancelib.vercel.app/components/Scroll%20Animation/33/extracted/';
const outDir = path.join(process.cwd(), 'temp_scroll_33');

async function downloadFile(relPath) {
  const fullUrl = baseUrl + encodeURI(relPath);
  const targetPath = path.join(outDir, relPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  return new Promise((resolve, reject) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${relPath}: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(targetPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const f of files) {
    try {
      await downloadFile(f);
      console.log('Downloaded:', f);
    } catch (e) {
      console.error('Error downloading:', f, e.message);
    }
  }
  console.log('All files downloaded successfully!');
}

main();
