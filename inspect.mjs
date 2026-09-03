import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

async function inspectAndComposite() {
  const origMeta = await sharp('public/original_texture.jpg').metadata()
  console.log('Original texture metadata:', origMeta)

  const skinMeta = await sharp('public/skins copo/rotulo_aurora_cafe_quadrado.jpg').metadata()
  console.log('Skin metadata:', skinMeta)
}

inspectAndComposite()
