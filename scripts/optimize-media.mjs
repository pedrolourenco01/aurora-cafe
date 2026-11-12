import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'optimized')
fs.mkdirSync(OUT_DIR, { recursive: true })

const IMAGE_TARGETS = [
  { key: 'aboutImage', input: 'src/assets/about-image.png', widths: [320, 640], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta1', input: 'src/assets/nosta-fotos/imagem-1.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta2', input: 'src/assets/nosta-fotos/imagem-2.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta3', input: 'src/assets/nosta-fotos/imagem-3.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta4', input: 'src/assets/nosta-fotos/imagem-4.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta5', input: 'src/assets/nosta-fotos/imagem-5.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'nosta6', input: 'src/assets/nosta-fotos/imagem-6-landscape.png', widths: [640, 1280], qualityAvif: 54, qualityWebp: 82 },
  { key: 'infoLente', input: 'src/assets/infographic/lente-35mm.png', widths: [150], qualityAvif: 58, qualityWebp: 84 },
  { key: 'infoFormato', input: 'src/assets/infographic/formato-filme.png', widths: [150], qualityAvif: 58, qualityWebp: 84 },
  { key: 'infoMateriais', input: 'src/assets/infographic/materiais-grip.png', widths: [150], qualityAvif: 58, qualityWebp: 84 },
  { key: 'infoFunc', input: 'src/assets/infographic/funcionalidades-shutter.png', widths: [150], qualityAvif: 58, qualityWebp: 84 },
  { key: 'exp1', input: 'src/assets/fotos-exp/imagem-exp-1.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'exp2', input: 'src/assets/fotos-exp/imagem-exp-2.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'exp3', input: 'src/assets/fotos-exp/imagem-exp-3.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
  { key: 'exp4', input: 'src/assets/fotos-exp/imagem-exp-4.png', widths: [480, 960], qualityAvif: 52, qualityWebp: 80 },
]

let origTotal = 0
let optTotal = 0
const manifestLines = ['// Auto-generated responsive AVIF/WebP manifest via sharp\n']
const manifestEntries = []

for (const item of IMAGE_TARGETS) {
  const absIn = path.join(ROOT, item.input)
  const origBytes = fs.statSync(absIn).size
  origTotal += origBytes

  const meta = await sharp(absIn).metadata()
  const maxWidth = Math.max(...item.widths)
  const effectiveMaxW = Math.min(maxWidth, meta.width || maxWidth)
  const aspectHeight = Math.round((effectiveMaxW / (meta.width || effectiveMaxW)) * (meta.height || effectiveMaxW))

  const avifParts = []
  const webpParts = []
  let fallbackVar = null

  for (const w of item.widths) {
    const targetW = Math.min(w, meta.width || w)
    const slug = `${item.key}-${targetW}`
    const avifName = `${slug}.avif`
    const webpName = `${slug}.webp`

    await sharp(absIn)
      .resize({ width: targetW, withoutEnlargement: true })
      .avif({ quality: item.qualityAvif, effort: 5 })
      .toFile(path.join(OUT_DIR, avifName))

    await sharp(absIn)
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: item.qualityWebp, effort: 5 })
      .toFile(path.join(OUT_DIR, webpName))

    optTotal += fs.statSync(path.join(OUT_DIR, avifName)).size
    optTotal += fs.statSync(path.join(OUT_DIR, webpName)).size

    const avifVar = `${item.key}Avif${targetW}`
    const webpVar = `${item.key}Webp${targetW}`
    manifestLines.push(`import ${avifVar} from './${avifName}'`)
    manifestLines.push(`import ${webpVar} from './${webpName}'`)

    avifParts.push(`\${${avifVar}} ${targetW}w`)
    webpParts.push(`\${${webpVar}} ${targetW}w`)
    fallbackVar = webpVar
  }

  manifestEntries.push(
    `  ${item.key}: {\n` +
    `    width: ${effectiveMaxW},\n` +
    `    height: ${aspectHeight},\n` +
    `    fallback: ${fallbackVar},\n` +
    `    avifSrcSet: \`${avifParts.join(', ')}\`,\n` +
    `    webpSrcSet: \`${webpParts.join(', ')}\`,\n` +
    `  },`
  )
}

manifestLines.push('\nexport const OPTIMIZED_IMAGES = {\n' + manifestEntries.join('\n') + '\n}\n')
fs.writeFileSync(path.join(OUT_DIR, 'manifest.js'), manifestLines.join('\n'), 'utf8')

console.log(`Images converted: ${(origTotal / 1024 / 1024).toFixed(2)} MB raw -> ${(optTotal / 1024 / 1024).toFixed(2)} MB (AVIF+WebP combined)`)

// Optimize Hero smoke background video into compact WebM + faststart MP4
const smokeSrc = path.join(ROOT, 'public', 'hero7', 'smoke_final.mp4')
const smokeMp4 = path.join(ROOT, 'public', 'hero7', 'smoke-optimized.mp4')
const smokeWebm = path.join(ROOT, 'public', 'hero7', 'smoke-optimized.webm')
if (fs.existsSync(smokeSrc) && (!fs.existsSync(smokeMp4) || !fs.existsSync(smokeWebm))) {
  const ffmpeg = ffmpegInstaller.path

  execFileSync(ffmpeg, [
    '-y', '-i', smokeSrc,
    '-vf', 'scale=1280:-2',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    smokeMp4,
  ], { stdio: 'inherit' })

  execFileSync(ffmpeg, [
    '-y', '-i', smokeSrc,
    '-vf', 'scale=1280:-2',
    '-an', '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-deadline', 'good', '-cpu-used', '4',
    smokeWebm,
  ], { stdio: 'inherit' })

  const beforeMb = (fs.statSync(smokeSrc).size / 1024 / 1024).toFixed(2)
  const afterMp4Kb = Math.round(fs.statSync(smokeMp4).size / 1024)
  const afterWebmKb = Math.round(fs.statSync(smokeWebm).size / 1024)
  console.log(`Smoke video optimized: ${beforeMb} MB -> MP4 ${afterMp4Kb} KB, WebM ${afterWebmKb} KB`)
}
