import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'
import { SKINS } from '../data/skins'

// Create a warm kraft beige placeholder texture so the cup is NEVER black before textures finish downloading
function createPlaceholderTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 4
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#DDC7AE'
  ctx.fillRect(0, 0, 4, 4)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Helper to create a pre-configured MeshStandardMaterial for each skin with seamless cylindrical UV wrap
function createSkinMaterial(url) {
  const placeholder = createPlaceholderTexture()
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: placeholder,
    roughness: 0.32,
    metalness: 0.04,
    side: THREE.DoubleSide
  })

  const loader = new THREE.TextureLoader()
  loader.load(url, (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace
    loadedTexture.wrapS = THREE.RepeatWrapping
    loadedTexture.wrapT = THREE.ClampToEdgeWrapping
    loadedTexture.repeat.set(1, 1)
    loadedTexture.offset.set(0, 0)
    mat.map = loadedTexture
    mat.needsUpdate = true
  })

  return mat
}

// Pre-load all 5 skin textures into browser memory for instant display without texture flash
if (typeof window !== 'undefined') {
  SKINS.forEach((skin) => {
    const img = new Image()
    img.src = skin.url
  })
}

// Pre-create all 5 materials at module load time so they are instantly ready and cached on the GPU
const SKIN_MATERIALS = SKINS.map((skin) => createSkinMaterial(skin.url))

// Generate realistic coffee espresso crema foam texture with golden bubbles
function createCoffeeCremaTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Radial gradient: dark rich espresso edge to golden crema center
  const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 250)
  grad.addColorStop(0.00, '#EAB065')
  grad.addColorStop(0.25, '#C87E2C')
  grad.addColorStop(0.58, '#8D4518')
  grad.addColorStop(0.85, '#4E210A')
  grad.addColorStop(1.00, '#260F04')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  // Crema swirl patterns & micro-bubbles
  ctx.fillStyle = 'rgba(255, 228, 175, 0.32)'
  for (let i = 0; i < 350; i++) {
    const x = 256 + (Math.random() - 0.5) * 440
    const y = 256 + (Math.random() - 0.5) * 440
    const dist = Math.hypot(x - 256, y - 256)
    if (dist < 235) {
      const r = Math.random() * 3.2 + 0.6
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Roasted coffee swirl flecks
  ctx.fillStyle = 'rgba(35, 15, 5, 0.45)'
  for (let i = 0; i < 120; i++) {
    const x = 256 + (Math.random() - 0.5) * 400
    const y = 256 + (Math.random() - 0.5) * 400
    const dist = Math.hypot(x - 256, y - 256)
    if (dist < 225) {
      const r = Math.random() * 2.2 + 0.4
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Generate an ultra-subtle, soft contact occlusion shadow directly under the cup base
function createContactOcclusionTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const cx = 256
  const cy = 256

  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1.0, 0.46)

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 190)
  grad.addColorStop(0.00, 'rgba(28, 14, 7, 0.40)')
  grad.addColorStop(0.18, 'rgba(30, 15, 8, 0.28)')
  grad.addColorStop(0.42, 'rgba(34, 17, 9, 0.14)')
  grad.addColorStop(0.68, 'rgba(40, 20, 11, 0.045)')
  grad.addColorStop(0.88, 'rgba(45, 24, 14, 0.008)')
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0.00)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, 190, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Generate soft diffused ambient contact penumbra for natural surface anchoring
function createAmbientGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const cx = 256
  const cy = 256

  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1.22, 0.50)

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 220)
  grad.addColorStop(0.00, 'rgba(32, 16, 8, 0.20)')
  grad.addColorStop(0.25, 'rgba(36, 18, 10, 0.10)')
  grad.addColorStop(0.55, 'rgba(42, 22, 12, 0.035)')
  grad.addColorStop(0.82, 'rgba(48, 25, 15, 0.008)')
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0.00)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, 220, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Generate subtle directional studio shadow extending softly to the right
function createSubtleStudioCastTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.save()
  ctx.translate(215, 128)
  ctx.scale(1.65, 0.55)

  const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, 145)
  grad.addColorStop(0.00, 'rgba(30, 15, 8, 0.18)')
  grad.addColorStop(0.30, 'rgba(35, 18, 10, 0.09)')
  grad.addColorStop(0.62, 'rgba(42, 22, 12, 0.03)')
  grad.addColorStop(0.85, 'rgba(48, 26, 15, 0.006)')
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0.00)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, 145, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export default function Cup3DViewer({ currentSkinIndex, currentSkin, scrollProgress = 0 }) {
  const resolvedIndex = typeof currentSkinIndex === 'number'
    ? currentSkinIndex
    : (currentSkin ? SKINS.findIndex(s => s.id === currentSkin.id) : 0)
  const activeSkinIndex = resolvedIndex >= 0 ? resolvedIndex : 0

  const containerRef = useRef(null)
  const dragHitboxRef = useRef(null)
  const [loading] = useState(false)
  const [error] = useState(null)

  const cupMeshRef = useRef(null)
  const modelGroupRef = useRef(null)
  const isFirstRender = useRef(true)
  const prevSkinIndexRef = useRef(activeSkinIndex)
  const currentSkinIndexRef = useRef(activeSkinIndex)
  const scrollProgressRef = useRef(scrollProgress)
  const smoothProgressRef = useRef(scrollProgress)

  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  // Smooth directional spin animation state - initial entrance spin coming from the right
  const spinStateRef = useRef({
    active: true,
    startAngle: Math.PI * 2,
    targetAngle: 0,
    startTime: performance.now(),
    duration: 1.20
  })

  // React to currentSkin / currentSkinIndex prop changes: instantly update skin & smoothly rotate cup so logo is 100% FRONT & CENTER
  useEffect(() => {
    currentSkinIndexRef.current = activeSkinIndex
    const targetMat = SKIN_MATERIALS[activeSkinIndex] || SKIN_MATERIALS[0]

    if (cupMeshRef.current) {
      cupMeshRef.current.material = targetMat
      if (cupMeshRef.current.material) {
        cupMeshRef.current.material.needsUpdate = true
      }
    }

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Determine spin direction based on forward/backward navigation
    const diff = activeSkinIndex - prevSkinIndexRef.current
    const direction = (diff > 0 || diff === -(SKINS.length - 1)) && diff !== (SKINS.length - 1) ? 1 : -1
    prevSkinIndexRef.current = activeSkinIndex

    if (modelGroupRef.current) {
      const currentAngle = modelGroupRef.current.rotation.y
      const twoPi = Math.PI * 2
      let targetAngle

      if (direction > 0) {
        // Spin forward to next multiple of 2PI (front-facing logo)
        targetAngle = (Math.floor(currentAngle / twoPi) + 1) * twoPi
        if (targetAngle - currentAngle < Math.PI * 0.5) {
          targetAngle += twoPi
        }
      } else {
        // Spin backward to previous multiple of 2PI (front-facing logo)
        targetAngle = (Math.ceil(currentAngle / twoPi) - 1) * twoPi
        if (currentAngle - targetAngle < Math.PI * 0.5) {
          targetAngle -= twoPi
        }
      }

      spinStateRef.current = {
        active: true,
        startAngle: currentAngle,
        targetAngle: targetAngle,
        startTime: performance.now(),
        duration: 0.85
      }
    }
  }, [activeSkinIndex, currentSkinIndex, currentSkin])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const initialWidth = container.clientWidth || 550
    const initialHeight = container.clientHeight || 600

    // 1. Scene setup
    const scene = new THREE.Scene()

    // 2. Camera setup - fixed eye-level view at constant 2.75 distance (zero zoom)
    const camera = new THREE.PerspectiveCamera(
      45,
      initialWidth / initialHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 2.75)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(initialWidth, initialHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    let heroAngle = -Math.PI * 2
    let isDragging = false
    let prevX = 0

    const onPointerDown = (e) => {
      isDragging = true
      prevX = e.clientX
    }

    const onPointerMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevX
      prevX = e.clientX
      heroAngle += deltaX * 0.007
      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = heroAngle
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const hitbox = dragHitboxRef.current
    if (hitbox) {
      hitbox.addEventListener('pointerdown', onPointerDown)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // 5. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
    mainLight.position.set(-3, 6, 5)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0)
    fillLight.position.set(4, 3, 2)
    scene.add(fillLight)

    const topLight = new THREE.PointLight(0xffffff, 1.4, 50)
    topLight.position.set(-1, 5, 2)
    scene.add(topLight)

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5)
    bottomLight.position.set(0, -4, 2)
    scene.add(bottomLight)

    // 6. Realistic Contact Shadow System positioned precisely at cup base
    const contactOcclusionTexture = createContactOcclusionTexture()
    const ambientGlowTexture = createAmbientGlowTexture()
    const studioCastTexture = createSubtleStudioCastTexture()

    const contactOcclusionGeo = new THREE.PlaneGeometry(0.60, 0.60)
    const contactOcclusionMat = new THREE.MeshBasicMaterial({
      map: contactOcclusionTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    })
    const contactOcclusionMesh = new THREE.Mesh(contactOcclusionGeo, contactOcclusionMat)
    contactOcclusionMesh.rotation.x = -Math.PI / 2
    contactOcclusionMesh.position.set(0, -0.535, 0)
    contactOcclusionMesh.renderOrder = 1
    scene.add(contactOcclusionMesh)

    const ambientGlowGeo = new THREE.PlaneGeometry(0.92, 0.92)
    const ambientGlowMat = new THREE.MeshBasicMaterial({
      map: ambientGlowTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    })
    const ambientGlowMesh = new THREE.Mesh(ambientGlowGeo, ambientGlowMat)
    ambientGlowMesh.rotation.x = -Math.PI / 2
    ambientGlowMesh.position.set(0, -0.536, 0)
    ambientGlowMesh.renderOrder = 1
    scene.add(ambientGlowMesh)

    const studioCastGeo = new THREE.PlaneGeometry(1.40, 0.72)
    const studioCastMat = new THREE.MeshBasicMaterial({
      map: studioCastTexture,
      transparent: true,
      opacity: 0.30,
      depthWrite: false
    })
    const studioCastMesh = new THREE.Mesh(studioCastGeo, studioCastMat)
    studioCastMesh.rotation.x = -Math.PI / 2
    studioCastMesh.position.set(0.15, -0.537, 0.03)
    studioCastMesh.renderOrder = 1
    scene.add(studioCastMesh)

    // 7. High-End 3D Tapered Cup Group (Comfortable clearance above arrows and below navbar)
    const modelGroup = new THREE.Group()
    modelGroupRef.current = modelGroup
    modelGroup.position.set(0, 0.08, 0)
    modelGroup.scale.set(1.22, 1.22, 1.22)
    scene.add(modelGroup)

    const currentSkinMat = SKIN_MATERIALS[currentSkinIndexRef.current] || SKIN_MATERIALS[0]

    // 7.1 Outer Cup Body with 360° Cylindrical Skin UVs
    const cupGeo = new THREE.CylinderGeometry(0.355, 0.245, 1.00, 128, 32, true)
    const cupMesh = new THREE.Mesh(cupGeo, currentSkinMat)
    cupMesh.position.set(0, 0, 0)
    cupMesh.rotation.y = Math.PI
    cupMeshRef.current = cupMesh
    modelGroup.add(cupMesh)

    // 7.2 Cup Interior Lining
    const innerGeo = new THREE.CylinderGeometry(0.349, 0.239, 0.99, 128, 1, true)
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xF7F2EB,
      roughness: 0.5,
      metalness: 0.02,
      side: THREE.BackSide
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    innerMesh.position.set(0, 0.005, 0)
    modelGroup.add(innerMesh)

    // 7.3 Realistic Thick Rolled Cup Lip / Top Rim Collar (Matches reference)
    const rimGeo = new THREE.TorusGeometry(0.355, 0.022, 32, 128)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xFAF6EF,
      roughness: 0.35,
      metalness: 0.03
    })
    const rimMesh = new THREE.Mesh(rimGeo, rimMat)
    rimMesh.rotation.x = Math.PI / 2
    rimMesh.position.set(0, 0.498, 0)
    modelGroup.add(rimMesh)

    // 7.4 Coffee Foam / Espresso Crema Layer
    const cremaTexture = createCoffeeCremaTexture()
    const cremaGeo = new THREE.CircleGeometry(0.344, 64)
    const cremaMat = new THREE.MeshStandardMaterial({
      map: cremaTexture,
      roughness: 0.42,
      metalness: 0.0
    })
    const cremaMesh = new THREE.Mesh(cremaGeo, cremaMat)
    cremaMesh.rotation.x = -Math.PI / 2
    cremaMesh.position.set(0, 0.45, 0)
    modelGroup.add(cremaMesh)

    // 7.5 Bottom Base Seal
    const bottomGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.015, 64, 1, false)
    const bottomMat = new THREE.MeshStandardMaterial({
      color: 0xF7F2EB,
      roughness: 0.55
    })
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat)
    bottomMesh.position.set(0, -0.495, 0)
    modelGroup.add(bottomMesh)

    // 8. Animation loop: Continuous idle showroom spin in Hero + Absolute Front-Logo Lock in About
    let animationFrameId
    const initialEntranceAngle = -Math.PI * 2
    heroAngle = initialEntranceAngle
    modelGroup.rotation.y = initialEntranceAngle

    // Trigger visible initial entrance 360° spin right as the cup animates into the hero
    spinStateRef.current = {
      active: true,
      startAngle: initialEntranceAngle,
      targetAngle: 0,
      startTime: performance.now() + 350,
      duration: 1.45
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const now = performance.now()

      // Smooth progress interpolation from Hero (0) down into About (1)
      const targetP = scrollProgressRef.current || 0
      smoothProgressRef.current += (targetP - smoothProgressRef.current) * 0.10
      const p = Math.max(0, Math.min(1.0, smoothProgressRef.current))
      const flightCurve = Math.sin(p * Math.PI)

      if (modelGroupRef.current) {
        const spin = spinStateRef.current

        if (spin.active) {
          const elapsed = (now - spin.startTime) / (spin.duration * 1000)

          if (elapsed < 1) {
            // Silky quintic ease-out landing directly on front-facing logo angle
            const ease = 1 - Math.pow(1 - elapsed, 4)
            modelGroupRef.current.rotation.y = spin.startAngle + (spin.targetAngle - spin.startAngle) * ease
          } else {
            modelGroupRef.current.rotation.y = spin.targetAngle
            spin.active = false
            heroAngle = spin.targetAngle
          }
        } else {
          const twoPi = Math.PI * 2
          const targetFront = Math.round(heroAngle / twoPi) * twoPi

          if (p < 0.05) {
            // Settled in Hero - Continuous turntable spin
            heroAngle += 0.0022
            modelGroupRef.current.rotation.y = heroAngle
          } else if (p > 0.95) {
            // Settled in About - Continuous turntable spin
            heroAngle += 0.0022
            modelGroupRef.current.rotation.y = heroAngle
          } else {
            // In Flight (Scrolling Down OR Scrolling Up):
            // Smoothly align cup so it faces 100% front with logo on arrival in both directions
            let alignmentProgress = 1.0
            if (p < 0.35) {
              alignmentProgress = (p - 0.05) / 0.30
            } else if (p > 0.65) {
              alignmentProgress = (0.95 - p) / 0.30
            }
            alignmentProgress = Math.max(0, Math.min(1.0, alignmentProgress))
            const ease = 1 - Math.pow(1 - alignmentProgress, 3)

            modelGroupRef.current.rotation.y = heroAngle * (1 - ease) + targetFront * ease

            // Keep heroAngle synced to the front angle during flight so it begins spinning cleanly from the front
            if (alignmentProgress > 0.8) {
              heroAngle = targetFront
            }
          }
        }

        // Dynamic 3D Flight Tilt while descending between sections:
        modelGroupRef.current.rotation.z = -0.25 * flightCurve
        modelGroupRef.current.rotation.x = 0.12 * flightCurve
      }

      renderer.render(scene, camera)
    }

    animate()

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth || 550
      const height = container.clientHeight || 600

      if (width > 0 && height > 0) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (hitbox) {
        hitbox.removeEventListener('pointerdown', onPointerDown)
      }
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (contactOcclusionTexture) contactOcclusionTexture.dispose()
      if (ambientGlowTexture) ambientGlowTexture.dispose()
      if (studioCastTexture) studioCastTexture.dispose()
      if (cremaTexture) cremaTexture.dispose()
      if (contactOcclusionGeo) contactOcclusionGeo.dispose()
      if (contactOcclusionMat) contactOcclusionMat.dispose()
      if (ambientGlowGeo) ambientGlowGeo.dispose()
      if (ambientGlowMat) ambientGlowMat.dispose()
      if (studioCastGeo) studioCastGeo.dispose()
      if (studioCastMat) studioCastMat.dispose()
      if (cupGeo) cupGeo.dispose()
      if (innerGeo) innerGeo.dispose()
      if (innerMat) innerMat.dispose()
      if (rimGeo) rimGeo.dispose()
      if (rimMat) rimMat.dispose()
      if (cremaGeo) cremaGeo.dispose()
      if (cremaMat) cremaMat.dispose()
      if (bottomGeo) bottomGeo.dispose()
      if (bottomMat) bottomMat.dispose()
      renderer.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="cup-3d-container">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="cup-3d-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loader-spinner" />
            <span className="loader-text">Carregando 3D...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="cup-3d-error">{error}</div>}

      {/* Dedicated upper drag surface covering only the cup body, 100% clear of bottom arrows */}
      <div ref={dragHitboxRef} className="cup-3d-drag-hitbox" title="Arraste para girar" />

      <div ref={containerRef} className="cup-3d-canvas-wrapper" />
    </div>
  )
}
