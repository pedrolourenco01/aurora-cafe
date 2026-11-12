import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import nostaFrontTextureUrl from '../assets/front_print_nosta.png'
import { DEFAULT_CAMERA_COLOR, getCameraColorPalette } from '../data/cameraColors'

function createRoundedRectPath(cx, cy, w, h, r, path = new THREE.Path()) {
  const hw = w / 2
  const hh = h / 2
  const rad = Math.min(r, hw, hh)
  path.moveTo(cx - hw + rad, cy - hh)
  path.lineTo(cx + hw - rad, cy - hh)
  path.quadraticCurveTo(cx + hw, cy - hh, cx + hw, cy - hh + rad)
  path.lineTo(cx + hw, cy + hh - rad)
  path.quadraticCurveTo(cx + hw, cy + hh, cx + hw - rad, cy + hh)
  path.lineTo(cx - hw + rad, cy + hh)
  path.quadraticCurveTo(cx - hw, cy + hh, cx - hw, cy + hh - rad)
  path.lineTo(cx - hw, cy - hh + rad)
  path.quadraticCurveTo(cx - hw, cy - hh, cx - hw + rad, cy - hh)
  return path
}

function createCapsuleShape(cx, cy, w, h) {
  const r = w / 2
  const straightHalf = Math.max(0.001, h / 2 - r)
  const shape = new THREE.Shape()
  shape.moveTo(cx - r, cy - straightHalf)
  shape.absarc(cx, cy - straightHalf, r, Math.PI, 0, false)
  shape.lineTo(cx + r, cy + straightHalf)
  shape.absarc(cx, cy + straightHalf, r, 0, Math.PI, false)
  shape.closePath()
  return shape
}

function stripRearTriangles(mesh, rootObj, shouldStrip) {
  const geom = mesh.geometry
  if (!geom) return
  const pos = geom.getAttribute('position')
  if (!pos) return

  const toRootMatrix = new THREE.Matrix4().copy(rootObj.matrixWorld).invert().multiply(mesh.matrixWorld)
  const centroid = new THREE.Vector3()

  if (geom.index) {
    const idx = geom.index.array
    const kept = []
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i]
      const b = idx[i + 1]
      const c = idx[i + 2]
      centroid
        .set(
          (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3,
          (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3,
          (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3
        )
        .applyMatrix4(toRootMatrix)
      if (!shouldStrip(centroid.x, centroid.y, centroid.z)) {
        kept.push(a, b, c)
      }
    }
    geom.setIndex(kept)
  } else {
    const keptVerts = []
    const norm = geom.getAttribute('normal')
    const keptNorms = []
    for (let i = 0; i < pos.count; i += 3) {
      centroid
        .set(
          (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3,
          (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3,
          (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3
        )
        .applyMatrix4(toRootMatrix)
      if (!shouldStrip(centroid.x, centroid.y, centroid.z)) {
        for (let k = 0; k < 3; k++) {
          keptVerts.push(pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k))
          if (norm) keptNorms.push(norm.getX(i + k), norm.getY(i + k), norm.getZ(i + k))
        }
      }
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(keptVerts, 3))
    if (norm) geom.setAttribute('normal', new THREE.Float32BufferAttribute(keptNorms, 3))
  }
  geom.computeBoundingBox()
  geom.computeBoundingSphere()
}

function createSmokedFilmTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 384
  const ctx = canvas.getContext('2d')

  // Soft smoked frosted-charcoal acrylic look matching reference
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0.0, '#36383B')
  grad.addColorStop(0.16, '#56595D')
  grad.addColorStop(0.42, '#7D8186')
  grad.addColorStop(0.68, '#55585C')
  grad.addColorStop(0.88, '#2D2F31')
  grad.addColorStop(1.0, '#1E2022')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Gentle vertical inner edge shading
  const gloss = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gloss.addColorStop(0.0, 'rgba(18,18,20,0.48)')
  gloss.addColorStop(0.18, 'rgba(255,255,255,0.04)')
  gloss.addColorStop(0.50, 'rgba(255,255,255,0.16)')
  gloss.addColorStop(0.82, 'rgba(255,255,255,0.04)')
  gloss.addColorStop(1.0, 'rgba(18,18,20,0.45)')
  ctx.fillStyle = gloss
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createSculptedThumbPadGeometry() {
  // Smooth organic thumb-grip cushion spanning u in [0.375, 0.522], v in [-0.070, 0.145]
  const uMin = 0.375
  const uMax = 0.522
  const vMin = -0.070
  const vMax = 0.145
  const segsU = 24
  const segsV = 30
  const positions = []
  const indices = []

  for (let iv = 0; iv <= segsV; iv++) {
    const tv = iv / segsV
    const v = vMin + tv * (vMax - vMin)

    // Left boundary curves gracefully outward (rightward) as it sweeps down
    // Top starts around u = 0.382 (v = 0.145), curves smoothly out to u = 0.435 around v = 0.03,
    // and exits toward u = 0.518 at v = -0.070
    const s = 1 - tv // 0 at top, 1 at bottom
    const leftEdge = 0.382 + 0.136 * Math.pow(s, 1.35)

    // Fade top edge smoothly at v -> vMax, full plateau across middle-upper thumb area
    const topFade = Math.sin(Math.min(1, (vMax - v) / 0.028) * (Math.PI / 2))
    const bottomFade = Math.sin(Math.min(1, (v - vMin) / 0.055) * (Math.PI / 2))

    for (let iu = 0; iu <= segsU; iu++) {
      const tu = iu / segsU
      const u = uMin + tu * (uMax - uMin)

      let w = 0
      if (u > leftEdge) {
        const across = Math.min(1, (u - leftEdge) / Math.max(0.02, uMax - leftEdge))
        const rightDrop = Math.sin(Math.min(1, (uMax - u) / 0.016) * (Math.PI / 2))
        // Smooth S-curve rise from curved left edge into a soft rounded thumb ridge
        const innerRise = 0.5 - 0.5 * Math.cos(Math.min(1, across * 1.45) * Math.PI)
        w = 0.0115 * innerRise * rightDrop * topFade * bottomFade
      }
      positions.push(u, v, w)
    }
  }

  for (let iv = 0; iv < segsV; iv++) {
    for (let iu = 0; iu < segsU; iu++) {
      const a = iv * (segsU + 1) + iu
      const b = a + 1
      const c = (iv + 1) * (segsU + 1) + iu
      const d = c + 1
      indices.push(a, b, c, b, d, c)
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

function createNeutralLensGlassTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2
  const cy = size / 2

  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, cx)
  grad.addColorStop(0.0, '#040404')
  grad.addColorStop(0.28, '#090909')
  grad.addColorStop(0.62, '#141312')
  grad.addColorStop(0.88, '#1B1A18')
  grad.addColorStop(1.0, '#0D0C0B')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Sutil anel interno em grafite neutro (sem azul/roxo)
  ctx.strokeStyle = 'rgba(220, 214, 204, 0.10)'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(220, 214, 204, 0.06)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function buildStraightSeamMesh(points, radius, material) {
  const path = new THREE.CurvePath()
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1, z1 = 0] = points[i]
    const [x2, y2, z2 = 0] = points[i + 1]
    path.add(new THREE.LineCurve3(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)))
  }
  const tubularSegments = Math.max(points.length * 6, 48)
  const geom = new THREE.TubeGeometry(path, tubularSegments, radius, 6, false)
  return new THREE.Mesh(geom, material)
}

function applyReferenceCameraBack(cameraModel, bodyMaterial) {
  cameraModel.updateMatrixWorld(true)

  // 1. Remove old back decals/eyecup while keeping front face, top advance wheel & optical viewfinder glass
  cameraModel.traverse((child) => {
    if (!child.isMesh) return
    const name = child.name || ''
    if (name === 'backDoor' || name === 'filmWindow' || name === 'readyLed') {
      child.visible = false
      return
    }
    const isRearViewfinderRegion = (x, y) => x > -0.32 && x < -0.06 && y > 0.10 && y < 0.29
    if (name === 'grip') {
      stripRearTriangles(child, cameraModel, (x, y, z) => isRearViewfinderRegion(x, y) && z < -0.14)
    } else if (name === 'viewfinderBezel') {
      stripRearTriangles(child, cameraModel, (x, y, z) => isRearViewfinderRegion(x, y) && z < -0.210)
    }
  })

  const creamMat =
    bodyMaterial ||
    new THREE.MeshStandardMaterial({
      color: '#E6D5B8',
      roughness: 0.44,
      metalness: 0.08
    })

  // Subtle warm taupe shadow tone inside plastic seam grooves
  const seamMat = new THREE.MeshStandardMaterial({
    color: '#6C5F50',
    roughness: 0.82,
    metalness: 0.02
  })

  const linerMat = new THREE.MeshStandardMaterial({
    color: '#342B24',
    roughness: 0.72,
    metalness: 0.05
  })

  const screwWellMat = new THREE.MeshStandardMaterial({
    color: '#9C8F7E',
    roughness: 0.65,
    metalness: 0.08
  })

  const screwMat = new THREE.MeshStandardMaterial({
    color: '#EAE6DF',
    roughness: 0.20,
    metalness: 0.80
  })

  const screwSlotMat = new THREE.MeshStandardMaterial({
    color: '#6A6359',
    roughness: 0.60,
    metalness: 0.15
  })

  const smokedTexture = createSmokedFilmTexture()
  const smokedMat = new THREE.MeshStandardMaterial({
    map: smokedTexture,
    roughness: 0.12,
    metalness: 0.12,
    envMapIntensity: 1.4
  })

  // Back group anchored at Z = -0.1975 rotated 180 deg around Y
  // Inside backGroup: +X = screen-right, +Y = up, +Z = toward rear viewer
  const backGroup = new THREE.Group()
  backGroup.name = 'referenceCameraBack'
  backGroup.position.set(0, 0, -0.1975)
  backGroup.rotation.y = Math.PI

  // 2. Stepped cream film door panel kept strictly on flat rear plateau (u in [-0.518, 0.522])
  const doorShape = new THREE.Shape()
  doorShape.moveTo(-0.506, 0.114)
  doorShape.lineTo(0.354, 0.114)
  doorShape.lineTo(0.394, 0.152)
  doorShape.lineTo(0.516, 0.152)
  doorShape.quadraticCurveTo(0.524, 0.152, 0.524, 0.140)
  doorShape.lineTo(0.524, -0.244)
  doorShape.quadraticCurveTo(0.524, -0.278, 0.490, -0.278)
  doorShape.lineTo(-0.488, -0.278)
  doorShape.quadraticCurveTo(-0.518, -0.278, -0.518, -0.244)
  doorShape.lineTo(-0.518, 0.072)
  doorShape.lineTo(-0.506, 0.072)
  doorShape.closePath()

  const doorGeom = new THREE.ExtrudeGeometry(doorShape, {
    depth: 0.0022,
    bevelEnabled: true,
    bevelThickness: 0.0020,
    bevelSize: 0.0022,
    bevelSegments: 4,
    curveSegments: 16
  })
  const doorMesh = new THREE.Mesh(doorGeom, creamMat)
  doorMesh.position.z = -0.0002
  backGroup.add(doorMesh)

  // Razor-straight architectural molding seam lines proud of the door perimeter (zero clipping)
  const seamZ = 0.0036
  // Top stepped horizontal seam across camera back
  backGroup.add(
    buildStraightSeamMesh(
      [
        [-0.532, 0.114, seamZ - 0.002],
        [-0.506, 0.114, seamZ],
        [0.354, 0.114, seamZ],
        [0.394, 0.153, seamZ],
        [0.522, 0.153, seamZ],
        [0.542, 0.153, seamZ - 0.002]
      ],
      0.0017,
      seamMat
    )
  )

  // Left door hinge perimeter seam with clean top & bottom hinge recesses
  backGroup.add(
    buildStraightSeamMesh(
      [
        [-0.508, 0.114, seamZ],
        [-0.508, 0.072, seamZ],
        [-0.522, 0.072, seamZ],
        [-0.522, -0.232, seamZ],
        [-0.508, -0.232, seamZ],
        [-0.508, -0.268, seamZ],
        [-0.492, -0.281, seamZ - 0.0005]
      ],
      0.0016,
      seamMat
    )
  )

  // Bottom & right door perimeter seam with subtle bottom latch lip
  backGroup.add(
    buildStraightSeamMesh(
      [
        [-0.492, -0.281, seamZ - 0.0005],
        [-0.125, -0.281, seamZ - 0.0005],
        [-0.112, -0.275, seamZ - 0.0002],
        [0.486, -0.275, seamZ - 0.0002],
        [0.514, -0.266, seamZ - 0.0004],
        [0.526, -0.240, seamZ],
        [0.526, 0.136, seamZ],
        [0.522, 0.153, seamZ]
      ],
      0.0016,
      seamMat
    )
  )

  // 3. Sculpted smooth cream thumb-grip swell blended seamlessly onto the door surface
  const thumbMesh = new THREE.Mesh(createSculptedThumbPadGeometry(), creamMat)
  thumbMesh.position.z = 0.0038
  backGroup.add(thumbMesh)

  // 4. Cream rectangular viewfinder frame aligned cleanly to optical glass (center u = +0.18625, v = +0.1994)
  const vfX = 0.18625
  const vfY = 0.1994
  const vfOuterShape = createRoundedRectPath(vfX, vfY, 0.204, 0.142, 0.015, new THREE.Shape())
  const vfHole = createRoundedRectPath(vfX, vfY, 0.146, 0.091, 0.007, new THREE.Path())
  vfOuterShape.holes.push(vfHole)

  const vfFrameGeom = new THREE.ExtrudeGeometry(vfOuterShape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 4,
    curveSegments: 12
  })
  const vfFrame = new THREE.Mesh(vfFrameGeom, creamMat)
  vfFrame.position.z = 0.001
  backGroup.add(vfFrame)

  // Thin recessed dark inner optical channel liner inside the cream bezel
  const vfLinerShape = createRoundedRectPath(vfX, vfY, 0.149, 0.094, 0.006, new THREE.Shape())
  const vfLinerHole = createRoundedRectPath(vfX, vfY, 0.143, 0.088, 0.005, new THREE.Path())
  vfLinerShape.holes.push(vfLinerHole)
  const vfLinerGeom = new THREE.ExtrudeGeometry(vfLinerShape, {
    depth: 0.016,
    bevelEnabled: false,
    curveSegments: 10
  })
  const vfLiner = new THREE.Mesh(vfLinerGeom, linerMat)
  vfLiner.position.z = 0.000
  backGroup.add(vfLiner)

  // 5. Two delicate miniature brushed-silver screws flanking the viewfinder horizontally
  const screwOffsets = [-0.150, 0.150]
  screwOffsets.forEach((dx) => {
    const sx = vfX + dx
    const sy = vfY - 0.004

    const wellMesh = new THREE.Mesh(new THREE.RingGeometry(0.010, 0.0138, 24), screwWellMat)
    wellMesh.position.set(sx, sy, 0.0018)
    backGroup.add(wellMesh)

    const headGeom = new THREE.CylinderGeometry(0.0102, 0.0102, 0.003, 24)
    headGeom.rotateX(Math.PI / 2)
    const headMesh = new THREE.Mesh(headGeom, screwMat)
    headMesh.position.set(sx, sy, 0.0022)
    backGroup.add(headMesh)

    const slotH = new THREE.Mesh(new THREE.BoxGeometry(0.0095, 0.0014, 0.0012), screwSlotMat)
    slotH.position.set(sx, sy, 0.0035)
    backGroup.add(slotH)

    const slotV = new THREE.Mesh(new THREE.BoxGeometry(0.0014, 0.0095, 0.0012), screwSlotMat)
    slotV.position.set(sx, sy, 0.0035)
    backGroup.add(slotV)
  })

  // 6. Vertical capsule smoked film window on the right side of the film door
  const fwX = 0.242
  const fwY = -0.076
  const fwW = 0.056
  const fwH = 0.198

  // Subtle chamfered cream surround lip (no harsh dark ring)
  const fwSurround = createCapsuleShape(fwX, fwY, fwW + 0.014, fwH + 0.014)
  const fwHolePath = createCapsuleShape(fwX, fwY, fwW + 0.001, fwH + 0.001)
  fwSurround.holes.push(fwHolePath)
  const fwSurroundGeom = new THREE.ExtrudeGeometry(fwSurround, {
    depth: 0.0022,
    bevelEnabled: true,
    bevelThickness: 0.0018,
    bevelSize: 0.002,
    bevelSegments: 3,
    curveSegments: 20
  })
  const fwSurroundMesh = new THREE.Mesh(fwSurroundGeom, creamMat)
  fwSurroundMesh.position.z = 0.0035
  backGroup.add(fwSurroundMesh)

  // Smoked glossy vertical capsule core with normalized planar UVs
  const fwCoreShape = createCapsuleShape(fwX, fwY, fwW, fwH)
  const fwCoreGeom = new THREE.ShapeGeometry(fwCoreShape, 24)
  const posAttr = fwCoreGeom.getAttribute('position')
  const uvArr = new Float32Array(posAttr.count * 2)
  for (let i = 0; i < posAttr.count; i++) {
    uvArr[i * 2] = (posAttr.getX(i) - (fwX - fwW / 2)) / fwW
    uvArr[i * 2 + 1] = (posAttr.getY(i) - (fwY - fwH / 2)) / fwH
  }
  fwCoreGeom.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2))
  const fwCoreMesh = new THREE.Mesh(fwCoreGeom, smokedMat)
  fwCoreMesh.position.z = 0.0056
  backGroup.add(fwCoreMesh)

  cameraModel.add(backGroup)
  return { backSeamMat: seamMat }
}

function createLightPrintTexture(image) {
  if (!image || !image.width || !image.height) return null
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imgData.data
  const w = canvas.width
  const h = canvas.height

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a < 20) continue
    const px = (i / 4) % w
    const py = Math.floor(i / 4 / w)
    const inBadgeRegion = px < w * 0.16 && py >= h * 0.21 && py <= h * 0.44
    if (inBadgeRegion) continue

    if (data[i] < 95 && data[i + 1] < 95 && data[i + 2] < 95) {
      data[i] = 237
      data[i + 1] = 224
      data[i + 2] = 200
    }
  }
  ctx.putImageData(imgData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.flipY = false
  tex.needsUpdate = true
  return tex
}

function createLightPrintTextureAsync(image) {
  if (!image || !image.width || !image.height) return Promise.resolve(null)
  if (typeof Worker === 'undefined') {
    return Promise.resolve(createLightPrintTexture(image))
  }

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  return new Promise((resolve) => {
    let worker
    try {
      worker = new Worker(new URL('../workers/textureWorker.js', import.meta.url), { type: 'module' })
    } catch {
      resolve(createLightPrintTexture(image))
      return
    }

    worker.onmessage = (event) => {
      const { buffer, width, height } = event.data
      const updated = new ImageData(new Uint8ClampedArray(buffer), width, height)
      ctx.putImageData(updated, 0, 0)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.flipY = false
      tex.needsUpdate = true
      worker.terminate()
      resolve(tex)
    }

    worker.onerror = () => {
      worker.terminate()
      resolve(createLightPrintTexture(image))
    }

    const buf = imgData.data.buffer
    worker.postMessage({ buffer: buf, width: canvas.width, height: canvas.height }, [buf])
  })
}

export default function Camera3DViewer({ className = '', scrollProgress = 0, cameraColor = DEFAULT_CAMERA_COLOR }) {
  const containerRef = useRef(null)
  const scrollProgressRef = useRef(scrollProgress)
  const cameraColorRef = useRef(cameraColor)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    cameraColorRef.current = cameraColor
  }, [cameraColor])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup with natural focal length for product photography
    const width = container.clientWidth || 600
    const height = container.clientHeight || 600
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100)
    camera.position.set(0, -0.06, 3.4)

    // High quality WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = false
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    container.appendChild(renderer.domElement)

    // Lighting setup tailored for retro camera materials with warm 70s golden studio tones
    const ambientLight = new THREE.AmbientLight(0xfff3e3, 1.35)
    scene.add(ambientLight)

    // Key studio light (from top-left front, soft directional studio light)
    const keyLight = new THREE.DirectionalLight(0xfff8ed, 2.7)
    keyLight.position.set(-2.2, 4.6, 3.2)
    scene.add(keyLight)

    const lightTarget = new THREE.Object3D()
    lightTarget.position.set(0, -0.28, 0)
    scene.add(lightTarget)
    keyLight.target = lightTarget

    // Warm key/fill light for the right-facing lens and side details
    const fillLight = new THREE.DirectionalLight(0xffedd4, 2.2)
    fillLight.position.set(3.6, 2.2, 2.6)
    scene.add(fillLight)

    // Cool rim light (gentle champagne rim for chrome edge highlights)
    const rimLight = new THREE.DirectionalLight(0xfffaed, 2.0)
    rimLight.position.set(2, 3, -3.5)
    scene.add(rimLight)

    // Top soft accent light
    const topLight = new THREE.DirectionalLight(0xffeedd, 1.0)
    topLight.position.set(0, 5, 1)
    scene.add(topLight)

    // Back/bottom soft fill light so 360-degree inspection keeps rear and underside legible
    const backBottomLight = new THREE.DirectionalLight(0xffecd5, 1.05)
    backBottomLight.position.set(-2.4, -2.8, -3.2)
    scene.add(backBottomLight)



    // Root model holder group for animation and interactive rotation
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // Default angle for centered product (subtle 3D angle showing front logo and lens)
    const baseRotation = {
      x: 0.08,
      y: -0.22,
      z: 0
    }
    modelGroup.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z)

    // Drag interactivity & continuous window hover tracking (Hero e CTA com giro 360° livre)
    let targetRotY = baseRotation.y
    let targetRotX = baseRotation.x
    let targetRotZ = 0
    let isDragging = false
    let activePointerId = null
    let prevMouseX = 0
    let prevMouseY = 0
    let cameraModelInstance = null
    let cameraMaxDim = 1.0

    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    const AXIS_Y = new THREE.Vector3(0, 1, 0)
    const AXIS_X = new THREE.Vector3(1, 0, 0)
    const IDENTITY_QUAT = new THREE.Quaternion()
    const userDragQuat = new THREE.Quaternion()
    const displayDragQuat = new THREE.Quaternion()
    const qDeltaYaw = new THREE.Quaternion()
    const qDeltaPitch = new THREE.Quaternion()
    const baseEuler = new THREE.Euler(0, 0, 0, 'XYZ')
    const baseQuat = new THREE.Quaternion()
    let velYaw = 0
    let velPitch = 0
    let isHoveringCamera = false
    let isResettingDrag = false
    let canDragInCurrentSection = false

    const setCursorState = (nextCursor) => {
      if (document.body.style.cursor !== nextCursor) {
        document.body.style.cursor = nextCursor
      }
    }

    const isBlockedUiTarget = (target) => {
      if (!target || typeof target.closest !== 'function') return false
      return Boolean(
        target.closest(
          'a, button, input, select, textarea, label, [role="button"], .nosta-menu-drawer, .nosta-menu-backdrop, .hero-intro-preloader'
        )
      )
    }

    const hitsCameraModel = (clientX, clientY) => {
      if (!cameraModelInstance || !container) return false
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return false
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1
      camera.updateMatrixWorld()
      modelGroup.updateMatrixWorld(true)
      raycaster.setFromCamera(pointerNdc, camera)
      return raycaster.intersectObject(cameraModelInstance, true).length > 0
    }

    let mouseHoverX = 0
    let mouseHoverY = 0
    const handleWindowPointerMove = (e) => {
      if (isDragging) {
        if (activePointerId !== null && e.pointerId !== activePointerId) return
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        prevMouseX = e.clientX
        prevMouseY = e.clientY

        const rotYaw = deltaX * 0.0028
        const rotPitch = deltaY * 0.0028
        qDeltaYaw.setFromAxisAngle(AXIS_Y, rotYaw)
        qDeltaPitch.setFromAxisAngle(AXIS_X, rotPitch)
        userDragQuat.premultiply(qDeltaYaw).premultiply(qDeltaPitch).normalize()

        velYaw = rotYaw * 0.15
        velPitch = rotPitch * 0.15
        return
      }

      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      mouseHoverX = normX * 0.04
      mouseHoverY = normY * 0.025

      if (canDragInCurrentSection && e.pointerType !== 'touch' && !isBlockedUiTarget(e.target)) {
        const hit = hitsCameraModel(e.clientX, e.clientY)
        if (hit !== isHoveringCamera) {
          isHoveringCamera = hit
          setCursorState(hit ? 'grab' : '')
        }
      } else if (isHoveringCamera) {
        isHoveringCamera = false
        setCursorState('')
      }
    }
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })

    const handlePointerDown = (e) => {
      if (!canDragInCurrentSection) return
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return
      if (isBlockedUiTarget(e.target)) return
      if (!hitsCameraModel(e.clientX, e.clientY)) return

      isDragging = true
      isResettingDrag = false
      activePointerId = e.pointerId
      prevMouseX = e.clientX
      prevMouseY = e.clientY
      velYaw = 0
      velPitch = 0
      isHoveringCamera = true
      setCursorState('grabbing')
      document.body.style.userSelect = 'none'
      window.getSelection?.()?.removeAllRanges?.()
      window.lenis?.stop?.()
    }

    const handlePointerUp = (e) => {
      if (!isDragging) return
      if (activePointerId !== null && e?.pointerId !== undefined && e.pointerId !== activePointerId) return
      isDragging = false
      activePointerId = null
      document.body.style.userSelect = ''
      window.lenis?.start?.()
      if (canDragInCurrentSection && e?.clientX !== undefined && hitsCameraModel(e.clientX, e.clientY)) {
        isHoveringCamera = true
        setCursorState('grab')
      } else {
        isHoveringCamera = false
        setCursorState('')
      }
    }

    const handleTouchMove = (e) => {
      if (isDragging && e.cancelable) {
        e.preventDefault()
      }
    }

    const handleDoubleClick = (e) => {
      if (!canDragInCurrentSection || isBlockedUiTarget(e.target)) return
      if (!hitsCameraModel(e.clientX, e.clientY)) return
      velYaw = 0
      velPitch = 0
      isResettingDrag = true
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('blur', handlePointerUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('dblclick', handleDoubleClick)

    // Referências de materiais para alternar cores da câmera suavemente pelo CTA
    const colorTargets = {
      body: new THREE.Color(),
      rubber: new THREE.Color(),
      seam: new THREE.Color(),
      backSeam: new THREE.Color(),
      lightEmissive: new THREE.Color('#D8C8AE'),
      black: new THREE.Color('#000000')
    }
    const cameraColorMaterials = {
      body: [],
      rubber: [],
      seam: [],
      backSeam: [],
      print: [],
      secondaryPrint: []
    }
    let nostaDefaultTex = null
    let nostaLightTex = null
    let lastAppliedLightText = null

    // Load Camera.glb
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      encodeURI('/camera 3d/Camera.glb'),
      (gltf) => {
        const cameraModel = gltf.scene

        // Load custom Nosta front print texture (+ light-ink variant for dark Chocolate colorway via Web Worker)
        const textureLoader = new THREE.TextureLoader()
        const nostaTexture = textureLoader.load(nostaFrontTextureUrl, (loadedTex) => {
          createLightPrintTextureAsync(loadedTex.image).then((lightTex) => {
            nostaLightTex = lightTex
            lastAppliedLightText = null
          })
        })
        nostaTexture.colorSpace = THREE.SRGBColorSpace
        nostaTexture.flipY = false
        nostaDefaultTex = nostaTexture

        const initialPalette = getCameraColorPalette(cameraColorRef.current)
        let bodyMaterial = null

        const processMaterial = (mat) => {
          if (!mat) return

          // 1. Corpo (Creme Clássico / Verde Musgo / Marrom Chocolate)
          if (mat.name === 'body') {
            mat.color.set(initialPalette.bodyHex)
            mat.roughness = 0.44
            mat.metalness = 0.08
            mat.needsUpdate = true
            bodyMaterial = mat
            cameraColorMaterials.body.push(mat)
          }

          // 2. Logo Nosta. gravado na placa frontal
          if (mat.name === 'print') {
            mat.map = nostaTexture
            mat.transparent = true
            mat.needsUpdate = true
            cameraColorMaterials.print.push(mat)
          }

          if (mat.name === 'topPrint' || mat.name === 'bottomPrint' || mat.name === 'sidePrint') {
            cameraColorMaterials.secondaryPrint.push(mat)
          }

          // 3. Botão laranja (#C2640C)
          if (mat.name === 'button') {
            mat.color.set('#C2640C')
            mat.roughness = 0.30
            mat.metalness = 0.45
            mat.needsUpdate = true
          }

          // 4. LED / indicador em laranja queimado (#C2640C)
          if (mat.name === 'led') {
            mat.color.set('#C2640C')
            mat.emissive.set('#C2640C')
            mat.emissiveIntensity = 0.65
            mat.needsUpdate = true
          }

          // 5. Detalhes marrom / contraste — Borracha, costura, tampa
          if (mat.name === 'rubber') {
            mat.color.set(initialPalette.rubberHex)
            mat.roughness = 0.58
            mat.metalness = 0.04
            mat.needsUpdate = true
            cameraColorMaterials.rubber.push(mat)
          }
          if (mat.name === 'seam' || mat.name === 'door') {
            mat.color.set(initialPalette.seamHex)
            mat.roughness = 0.58
            mat.metalness = 0.04
            mat.needsUpdate = true
            cameraColorMaterials.seam.push(mat)
          }

          // 6. Lente preta (#191715) — Anéis acetinados e corpo da lente
          if (mat.name === 'lensSatin' || mat.name === 'blackSatin' || mat.name === 'blackMatte') {
            mat.color.set('#191715')
            mat.roughness = 0.35
            mat.metalness = 0.22
            mat.needsUpdate = true
          }

          // 7. Metais bege dourado (#B9A384) — Dials, anéis cromados
          if (mat.name?.toLowerCase().includes('chrome') || mat.name?.toLowerCase().includes('metal')) {
            mat.color.set('#B9A384')
            mat.roughness = 0.22
            mat.metalness = 0.85
            mat.needsUpdate = true
          }

          // 8. Vidro ótico da lente neutro (sem detalhe/reflexo azul)
          if (mat.name === 'glass') {
            mat.map = createNeutralLensGlassTexture()
            mat.color.set('#FFFFFF')
            mat.emissive.set('#000000')
            mat.emissiveIntensity = 0
            mat.roughness = 0.05
            mat.metalness = 0.14
            mat.transparent = true
            mat.opacity = 0.94
            mat.envMapIntensity = 1.4
            mat.needsUpdate = true
          } else if (mat.name?.toLowerCase().includes('glass')) {
            mat.roughness = 0.04
            mat.metalness = 0.1
            mat.transparent = true
            mat.opacity = 0.88
            mat.envMapIntensity = 1.6
            mat.needsUpdate = true
          }

          // 9. Neutraliza o brilho/anel azulado ('glint') da lente
          if (mat.name === 'glint') {
            mat.color.set('#EAE6E0')
            mat.emissive.set('#000000')
            mat.emissiveIntensity = 0
            mat.roughness = 0.08
            mat.metalness = 0.1
            mat.transparent = true
            mat.opacity = 0.08
            mat.needsUpdate = true
          }
        }

        // Enhance material aesthetics (shadows disabled)
        cameraModel.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = false
            child.receiveShadow = false
            if (Array.isArray(child.material)) {
              child.material.forEach(processMaterial)
            } else {
              processMaterial(child.material)
            }
          }
        })

        // Compute exact bounding box and center pivot perfectly
        const box = new THREE.Box3().setFromObject(cameraModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Replace back casing with clean cream molded reference design
        const backRefs = applyReferenceCameraBack(cameraModel, bodyMaterial)
        if (backRefs?.backSeamMat) {
          backRefs.backSeamMat.color.set(initialPalette.backSeamHex)
          cameraColorMaterials.backSeam.push(backRefs.backSeamMat)
        }

        cameraModel.position.x = -center.x
        cameraModel.position.y = -center.y
        cameraModel.position.z = -center.z

        // Normalize scale for centered product layout (calibrated with elegant breathing room)
        const maxDim = Math.max(size.x, size.y, size.z)
        cameraMaxDim = maxDim
        const scaleFactor = 1.16 / maxDim
        cameraModel.scale.setScalar(scaleFactor)
        cameraModelInstance = cameraModel

        modelGroup.add(cameraModel)
        setIsLoading(false)
      },
      undefined,
      (err) => {
        console.error('Error loading Camera.glb:', err)
        setLoadError(err.message || 'Failed to load model')
        setIsLoading(false)
      }
    )

    // Resize listener + ResizeObserver para atualizar proporção e tamanho ao redimensionar no DevTools
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth || 600
      const h = container.clientHeight || window.innerHeight || 600
      if (w <= 0 || h <= 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    window.addEventListener('resize', handleResize)
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null
    resizeObserver?.observe(container)

    // Animation render loop com trajetória contínua unificada
    let animationFrameId
    const startTime = performance.now()

    let cachedOffsets = {
      aboutTop: 800,
      menuTop: 1600,
      featuresTop: 4100,
      storiesTop: 7800,
      ctaTop: 11000,
      ctaHeight: 1576,
      footerTop: 12910
    }

    const getElementDocTop = (el, fallback) => {
      if (!el) return fallback
      let top = 0
      let curr = el
      while (curr) {
        top += curr.offsetTop
        curr = curr.offsetParent
      }
      return top
    }

    let ctaStickyStageEl = null
    let unifiedStageEl = null

    const updateOffsets = () => {
      const vh = window.innerHeight || 800
      const aboutEl = document.getElementById('about')
      const menuEl = document.getElementById('menu')
      const featuresEl = document.getElementById('features')
      const storiesEl = document.getElementById('stories')
      const ctaEl = document.getElementById('cta')
      const footerEl = document.getElementById('footer') || document.querySelector('.nosta-footer-wrap')
      ctaStickyStageEl = document.querySelector('.cta-sticky-stage')
      unifiedStageEl = document.querySelector('.unified-camera-sticky-stage')

      cachedOffsets.aboutTop = getElementDocTop(aboutEl, vh)
      cachedOffsets.menuTop = getElementDocTop(menuEl, vh * 2)
      cachedOffsets.featuresTop = getElementDocTop(featuresEl, vh * 5.1)
      cachedOffsets.storiesTop = getElementDocTop(storiesEl, cachedOffsets.featuresTop + vh * 4.2)
      cachedOffsets.ctaTop = getElementDocTop(ctaEl, cachedOffsets.featuresTop + (featuresEl?.offsetHeight || vh * 6.4))
      cachedOffsets.ctaHeight = ctaEl?.offsetHeight || (vh * 1.6)
      cachedOffsets.footerTop = getElementDocTop(footerEl, cachedOffsets.ctaTop + cachedOffsets.ctaHeight)
    }

    updateOffsets()
    setTimeout(updateOffsets, 300)
    setTimeout(updateOffsets, 1200)

    let lastOffsetsCheck = -1
    let lastFrameMs = performance.now()
    let currentScaleMult = 1.03

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const nowMs = performance.now()
      const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastFrameMs) * 0.001))
      lastFrameMs = nowMs
      const elapsedTime = (nowMs - startTime) * 0.001

      // Movimento contínuo sutil (flutuação e balanço lento constante na Hero, About e CTA)
      const swayActiveWeight = isDragging ? 0.25 : 1.0
      const idleRotY = Math.sin(elapsedTime * 0.55) * 0.085 * swayActiveWeight
      const idleRotX = Math.cos(elapsedTime * 0.42) * 0.045 * swayActiveWeight
      const idleRotZ = Math.sin(elapsedTime * 0.35) * 0.022 * swayActiveWeight
      const idlePosX = Math.cos(elapsedTime * 0.45) * 0.012 * swayActiveWeight
      const idlePosY = Math.sin(elapsedTime * 0.85) * 0.022 * swayActiveWeight

      // 1. Obtém scroll e posições dinâmicas das seções
      const scroll = window.lenis ? window.lenis.scroll : (window.scrollY || 0)
      const vh = window.innerHeight || 800

      if (elapsedTime - lastOffsetsCheck > 2.0) {
        lastOffsetsCheck = elapsedTime
        updateOffsets()
      }

      const { aboutTop, menuTop, featuresTop, storiesTop, ctaTop, ctaHeight, footerTop } = cachedOffsets

      // Aplica a cor escolhida apenas na seção de compra (#cta / saída para o footer);
      // ao subir e sair do CTA, a câmera retorna suavemente à cor padrão original
      const inCtaColorZone = scroll >= ctaTop - vh * 0.45
      const activePalette = getCameraColorPalette(inCtaColorZone ? cameraColorRef.current : DEFAULT_CAMERA_COLOR)
      const colorStep = Math.min(1, dt * 10)
      colorTargets.body.set(activePalette.bodyHex)
      colorTargets.rubber.set(activePalette.rubberHex)
      colorTargets.seam.set(activePalette.seamHex)
      colorTargets.backSeam.set(activePalette.backSeamHex)

      cameraColorMaterials.body.forEach((m) => m.color.lerp(colorTargets.body, colorStep))
      cameraColorMaterials.rubber.forEach((m) => m.color.lerp(colorTargets.rubber, colorStep))
      cameraColorMaterials.seam.forEach((m) => m.color.lerp(colorTargets.seam, colorStep))
      cameraColorMaterials.backSeam.forEach((m) => m.color.lerp(colorTargets.backSeam, colorStep))

      if (lastAppliedLightText !== activePalette.lightText) {
        const useLight = activePalette.lightText && nostaLightTex
        cameraColorMaterials.print.forEach((m) => {
          const nextMap = useLight ? nostaLightTex : nostaDefaultTex
          if (nextMap && m.map !== nextMap) {
            m.map = nextMap
            m.needsUpdate = true
          }
        })
        cameraColorMaterials.secondaryPrint.forEach((m) => {
          m.emissive.copy(activePalette.lightText ? colorTargets.lightEmissive : colorTargets.black)
          m.emissiveIntensity = activePalette.lightText ? 0.72 : 0
          m.needsUpdate = true
        })
        if (!activePalette.lightText || nostaLightTex) {
          lastAppliedLightText = activePalette.lightText
        }
      }

      let baseTargetRotX = 0
      let baseTargetRotY = 0
      let baseTargetRotZ = 0
      let baseTargetPosX = 0
      let baseTargetPosY = 0
      let targetScaleMult = 1.03

      const vw = container.clientWidth || window.innerWidth || 1000
      const activeVh = container.clientHeight || vh
      const isMobile = vw <= 900 || (vw <= 1180 && activeVh > vw)
      const mobileAspect = vw / Math.max(1, activeVh)
      const mobileScale = Math.max(0.55, Math.min(vw >= 900 ? 0.76 : 0.80, 1.37 * mobileAspect))

      if (scroll < aboutTop) {
        // --- 1. HERO (desce do Hero para o About) ---
        const p = Math.max(0, Math.min(1, scroll / Math.max(1, aboutTop)))
        const heroTargetRotY = -0.22 + idleRotY
        const aboutTargetRotY = (isMobile ? 0.35 : 1.45) + idleRotY * 0.5
        baseTargetRotY = heroTargetRotY + (aboutTargetRotY - heroTargetRotY) * p

        const heroTargetRotX = 0.08 + idleRotX
        const aboutTargetRotX = (isMobile ? 0.20 : 0.58) + idleRotX * 0.5
        baseTargetRotX = heroTargetRotX + (aboutTargetRotX - heroTargetRotX) * p

        baseTargetRotZ = idleRotZ * (1 - p * 0.5)

        const heroX = (isMobile ? 0.0 : -0.18) + idlePosX
        const aboutX = (isMobile ? 0.0 : -0.04) + idlePosX * 0.5
        baseTargetPosX = heroX + (aboutX - heroX) * p

        const heroY = (isMobile ? 0.0 : -0.28) + idlePosY
        const aboutY = (isMobile ? 0.02 : -0.06) + idlePosY * 0.9
        baseTargetPosY = heroY + (aboutY - heroY) * p
        targetScaleMult = isMobile ? mobileScale : 1.0
      } else if (scroll < menuTop) {
        // --- 2. ABOUT (lente apontada para a direita, repousando com movimento lento) ---
        baseTargetRotX = (isMobile ? 0.20 : 0.58) + idleRotX * 0.5
        baseTargetRotY = (isMobile ? 0.35 : 1.45) + idleRotY * 0.5
        baseTargetRotZ = idleRotZ * 0.5
        baseTargetPosX = (isMobile ? 0.0 : -0.04) + idlePosX * 0.5
        baseTargetPosY = (isMobile ? 0.02 : -0.06) + idlePosY * 0.9
        targetScaleMult = isMobile ? mobileScale : 1.0
      } else if (scroll < featuresTop) {
        // --- 3. PASSANDO POR TRÁS DA GALLERY (MenuSection) ---
        const gP = Math.max(0, Math.min(1, (scroll - menuTop) / Math.max(1, featuresTop - menuTop)))
        const easeG = gP * gP * (3 - 2 * gP)

        const startRotX = (isMobile ? 0.20 : 0.58) + idleRotX * 0.5
        const startRotY = (isMobile ? 0.35 : 1.45) + idleRotY * 0.5
        const startPosX = (isMobile ? 0.0 : -0.04) + idlePosX * 0.5
        const startPosY = (isMobile ? 0.02 : -0.06) + idlePosY * 0.9

        baseTargetRotX = startRotX * (1 - easeG)
        baseTargetRotY = startRotY * (1 - easeG)
        baseTargetRotZ = idleRotZ * 0.5 * (1 - easeG)
        baseTargetPosX = startPosX * (1 - easeG)
        baseTargetPosY = startPosY * (1 - easeG)
        targetScaleMult = isMobile ? mobileScale : (1.0 + 0.03 * easeG)
      } else {
        // --- 4. SECTION FEATURES (#why-visit, #infographic, #location, #stories) & 5. SEÇÃO CTA FINAL ---
        // Mantém câmera perfeitamente estável durante #why-visit, #infographic e #location, e aplica movimento 3D contínuo ao descer pelos relatos (#stories) e no CTA
        const storiesStart = storiesTop - vh * 0.50
        const storiesEnd = Math.max(storiesStart + 1, ctaTop - vh * 0.45)
        const sP = Math.max(0, Math.min(1, (scroll - storiesStart) / (storiesEnd - storiesStart)))
        const storiesEnv = Math.sin(sP * Math.PI)

        const storiesRotY = Math.sin(sP * Math.PI * 2.0) * (isMobile ? 0.58 : 0.44)
        const storiesRotX = storiesEnv * (isMobile ? 0.24 : 0.16) + Math.sin(sP * Math.PI * 3.0) * 0.08 * storiesEnv
        const storiesRotZ = Math.sin(sP * Math.PI * 2.0) * (isMobile ? -0.12 : -0.07)
        const storiesPosX = isMobile ? Math.sin(sP * Math.PI * 2.0) * 0.12 : 0
        const storiesPosY = Math.sin(sP * Math.PI * 3.0) * (isMobile ? 0.05 : 0.025) + storiesEnv * Math.sin(elapsedTime * 1.6) * 0.015

        // Transição contínua sem quebras rumo ao CTA (começa conforme Story 4 avança e CTA entra)
        const ctaTransStart = ctaTop - vh * 0.55
        const ctaTransEnd = ctaTop + vh * 0.35
        const ctaProgress = Math.max(0, Math.min(1, (scroll - ctaTransStart) / Math.max(1, ctaTransEnd - ctaTransStart)))
        // Curva cúbica Hermite (smoothstep): derivada inicial e final são perfeitamente zero
        const easeCTA = ctaProgress * ctaProgress * (3 - 2 * ctaProgress)

        // Rotação: transita com suavidade total da coreografia dos relatos para o ângulo fotográfico vivo no CTA
        baseTargetRotX = storiesRotX * (1 - easeCTA) + (0.04 + idleRotX) * easeCTA
        baseTargetRotY = storiesRotY * (1 - easeCTA) + (-0.16 + idleRotY) * easeCTA
        baseTargetRotZ = storiesRotZ * (1 - easeCTA) + idleRotZ * easeCTA

        // Posição: acompanha o balanço sutil durante os relatos e mantém flutuação suave contínua no CTA
        baseTargetPosX = storiesPosX * (1 - easeCTA) + idlePosX * easeCTA
        baseTargetPosY = storiesPosY * (1 - easeCTA) + idlePosY * easeCTA

        // Escala: mantém a escala proporcional do mobile sem diminuir na seção
        targetScaleMult = isMobile ? mobileScale : 1.03
      }

      // Saída natural do CTA rumo ao Footer:
      // Sincroniza 1:1 com a posição real da .cta-sticky-stage na tela para a câmera subir
      // alinhada exatamente entre "Nosta 35mm." e "APENAS R$ 699,00" sem apagar nem ser cortada.
      const ctaStageTop = ctaStickyStageEl ? ctaStickyStageEl.getBoundingClientRect().top : 0
      const camStageTop = unifiedStageEl ? unifiedStageEl.getBoundingClientRect().top : 0
      const ctaExitOffset = scroll >= ctaTop && ctaStageTop < 0 ? ctaStageTop - camStageTop : 0
      const ctaExitedOffscreen = scroll >= ctaTop && ctaStageTop <= -(vh + 120)

      const inHeroDrag = scroll < Math.max(80, aboutTop * 0.35)
      const inCtaDrag = scroll >= ctaTop - vh * 0.45 && !ctaExitedOffscreen
      canDragInCurrentSection = inHeroDrag || inCtaDrag

      if (!canDragInCurrentSection && isHoveringCamera && !isDragging) {
        isHoveringCamera = false
        setCursorState('')
      }

      if (containerRef.current) {
        containerRef.current.style.transform =
          ctaExitOffset < -0.5 ? `translate3d(0, ${ctaExitOffset}px, 0)` : 'none'
        containerRef.current.style.visibility = ctaExitedOffscreen ? 'hidden' : 'visible'
      }

      const hasCustomDrag = userDragQuat.angleTo(IDENTITY_QUAT) > 0.03
      const hoverWeight = isDragging || hasCustomDrag ? 0 : 1

      targetRotY += (baseTargetRotY + mouseHoverX * hoverWeight - targetRotY) * 0.08
      targetRotX += (baseTargetRotX + mouseHoverY * hoverWeight - targetRotX) * 0.08
      targetRotZ += (baseTargetRotZ - targetRotZ) * 0.08

      baseEuler.set(targetRotX, targetRotY, targetRotZ, 'XYZ')
      baseQuat.setFromEuler(baseEuler)

      if (!isDragging) {
        if (!canDragInCurrentSection || isResettingDrag) {
          velYaw = 0
          velPitch = 0
          userDragQuat.slerp(IDENTITY_QUAT, isResettingDrag ? 0.11 : 0.07)
          if (userDragQuat.angleTo(IDENTITY_QUAT) < 0.002) {
            userDragQuat.copy(IDENTITY_QUAT)
            isResettingDrag = false
          }
        } else if (Math.abs(velYaw) > 0.00005 || Math.abs(velPitch) > 0.00005) {
          const stepScale = dt * 60
          qDeltaYaw.setFromAxisAngle(AXIS_Y, velYaw * stepScale)
          qDeltaPitch.setFromAxisAngle(AXIS_X, velPitch * stepScale)
          userDragQuat.premultiply(qDeltaYaw).premultiply(qDeltaPitch).normalize()
          const coastDecay = Math.pow(0.955, stepScale)
          velYaw *= coastDecay
          velPitch *= coastDecay
        }
      }

      displayDragQuat.slerp(userDragQuat, 0.12)
      modelGroup.quaternion.copy(displayDragQuat).multiply(baseQuat)

      modelGroup.position.x += (baseTargetPosX - modelGroup.position.x) * 0.08
      modelGroup.position.y += (baseTargetPosY - modelGroup.position.y) * 0.08

      // Interpolação líquida da escala: impede rigorosamente qualquer pulo visual de tamanho
      currentScaleMult += (targetScaleMult - currentScaleMult) * 0.08
      if (cameraModelInstance && cameraMaxDim) {
        const baseScale = 1.16 / cameraMaxDim
        cameraModelInstance.scale.setScalar(baseScale * currentScaleMult)
      }



      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      resizeObserver?.disconnect()
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('blur', handlePointerUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('dblclick', handleDoubleClick)
      document.body.style.userSelect = ''
      setCursorState('')
      window.lenis?.start?.()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`camera-3d-viewer-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'default'
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4A4036',
            fontSize: '14px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.65
          }}
        >
          Carregando Câmera 3D...
        </div>
      )}
      {loadError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8A3B3B',
            fontSize: '13px'
          }}
        >
          {loadError}
        </div>
      )}
    </div>
  )
}
