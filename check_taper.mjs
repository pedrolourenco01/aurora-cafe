import fs from 'fs'
import path from 'path'

// Let's check vertices around y = 0.2 and y = -0.3
const glbPath = path.resolve('public', 'copo 3d', '993fc949-f772-457a-a76d-359ed42a1984.glb')
const buffer = fs.readFileSync(glbPath)

const chunk0Length = buffer.readUInt32LE(12)
const jsonStr = buffer.toString('utf8', 20, 20 + chunk0Length)
const gltf = JSON.parse(jsonStr)

console.log("Meshes count:", gltf.meshes.length)
