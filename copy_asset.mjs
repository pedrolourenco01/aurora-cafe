import fs from 'fs'
import path from 'path'

const srcDir = path.resolve('src', 'assets')
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true })
}

const skinSrc = path.resolve('public', 'skins copo', 'rotulo_aurora_cafe_quadrado.jpg')
const skinDest = path.resolve('src', 'assets', 'skin.jpg')

fs.copyFileSync(skinSrc, skinDest)
console.log('Copied', skinSrc, 'to', skinDest)
