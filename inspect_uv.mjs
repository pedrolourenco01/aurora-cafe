import fs from 'fs'
import path from 'path'

const glbPath = path.resolve('public', 'copo 3d', '993fc949-f772-457a-a76d-359ed42a1984.glb')
const buffer = fs.readFileSync(glbPath)

const chunk0Length = buffer.readUInt32LE(12)
const jsonStr = buffer.toString('utf8', 20, 20 + chunk0Length)
const gltf = JSON.parse(jsonStr)

const chunk1Length = buffer.readUInt32LE(20 + chunk0Length)
const binBuffer = buffer.subarray(28 + chunk0Length, 28 + chunk0Length + chunk1Length)

console.log("Attributes in primitive 0:", gltf.meshes[0].primitives[0].attributes)
console.log("Accessors:", gltf.accessors)
