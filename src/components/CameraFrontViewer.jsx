import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import nostaFrontTextureUrl from '../assets/front_print_nosta.png'

export default function CameraFrontViewer({
  className = '',
  scrollProgress = 0,
  globalScrollProgress = null
}) {
  const containerRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const globalScrollProgressRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (scrollProgress && typeof scrollProgress.get === 'function') {
      const unsubscribe = scrollProgress.on('change', (latest) => {
        scrollProgressRef.current = latest
      })
      scrollProgressRef.current = scrollProgress.get()
      return () => unsubscribe()
    } else {
      scrollProgressRef.current = typeof scrollProgress === 'number' ? scrollProgress : 0
    }
  }, [scrollProgress])

  useEffect(() => {
    if (globalScrollProgress && typeof globalScrollProgress.get === 'function') {
      const unsubscribe = globalScrollProgress.on('change', (latest) => {
        globalScrollProgressRef.current = latest
      })
      globalScrollProgressRef.current = globalScrollProgress.get()
      return () => unsubscribe()
    } else {
      globalScrollProgressRef.current = typeof globalScrollProgress === 'number' ? globalScrollProgress : 0
    }
  }, [globalScrollProgress])


  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()

    // Camera setup com FOV e distância IDÊNTICOS à Hero
    const width = container.clientWidth || window.innerWidth || 1200
    const height = container.clientHeight || window.innerHeight || 800
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100)
    camera.position.set(0, 0, 3.4)

    // WebGL Renderer com qualidade cinematográfica
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    renderer.shadowMap.enabled = false

    container.appendChild(renderer.domElement)

    // Iluminação calibrada para fundo marrom quente
    const ambientLight = new THREE.AmbientLight(0xfff3e3, 1.35)
    scene.add(ambientLight)

    // Key light de estúdio (top-left front)
    const keyLight = new THREE.DirectionalLight(0xfff8ed, 2.7)
    keyLight.position.set(-2.0, 4.2, 3.2)
    scene.add(keyLight)

    // Luz de preenchimento âmbar
    const fillLight = new THREE.DirectionalLight(0xeddac2, 1.4)
    fillLight.position.set(3.5, -0.5, 2.0)
    scene.add(fillLight)

    // Luz de recorte (rim) superior
    const rimLight = new THREE.DirectionalLight(0xfffaed, 2.0)
    rimLight.position.set(0, 3.5, -3.0)
    scene.add(rimLight)

    // Grupo do modelo
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // Rotação estritamente de frente (0, 0)
    modelGroup.rotation.set(0, 0, 0)

    let cameraModelInstance = null
    let cameraMaxDim = 1.232

    // Load Camera.glb
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      encodeURI('/camera 3d/Camera.glb'),
      (gltf) => {
        const cameraModel = gltf.scene
        cameraModelInstance = cameraModel

        // Carrega textura frontal Nosta
        const textureLoader = new THREE.TextureLoader()
        const nostaTexture = textureLoader.load(nostaFrontTextureUrl)
        nostaTexture.colorSpace = THREE.SRGBColorSpace
        nostaTexture.flipY = false

        const processMaterial = (mat) => {
          if (!mat) return

          // 1. Corpo creme (#E6D5B8)
          if (mat.name === 'body') {
            mat.color.set('#E6D5B8')
            mat.roughness = 0.44
            mat.metalness = 0.08
            mat.needsUpdate = true
          }

          // 2. Logo Nosta gravado
          if (mat.name === 'print') {
            mat.map = nostaTexture
            mat.transparent = true
            mat.needsUpdate = true
          }

          // 3. Botão laranja queimado (#C2640C)
          if (mat.name === 'button') {
            mat.color.set('#C2640C')
            mat.roughness = 0.30
            mat.metalness = 0.45
            mat.needsUpdate = true
          }

          // 4. LED indicador
          if (mat.name === 'led') {
            mat.color.set('#C2640C')
            mat.emissive.set('#C2640C')
            mat.emissiveIntensity = 0.65
            mat.needsUpdate = true
          }

          // 5. Detalhes marrom (#3B2A22)
          if (mat.name === 'rubber' || mat.name === 'seam' || mat.name === 'door') {
            mat.color.set('#3B2A22')
            mat.roughness = 0.58
            mat.metalness = 0.04
            mat.needsUpdate = true
          }

          // 6. Lente preta acetinada
          if (mat.name === 'lensSatin' || mat.name === 'blackSatin' || mat.name === 'blackMatte') {
            mat.color.set('#191715')
            mat.roughness = 0.35
            mat.metalness = 0.22
            mat.needsUpdate = true
          }

          // 7. Metais cromados e botões
          if (mat.name?.toLowerCase().includes('chrome') || mat.name?.toLowerCase().includes('metal')) {
            mat.color.set('#B9A384')
            mat.roughness = 0.22
            mat.metalness = 0.85
            mat.needsUpdate = true
          }

          // 8. Vidro ótico
          if (mat.name?.toLowerCase().includes('glass')) {
            mat.roughness = 0.04
            mat.metalness = 0.1
            mat.transparent = true
            mat.opacity = 0.88
            mat.envMapIntensity = 1.6
            mat.needsUpdate = true
          }
        }

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

        // Centraliza pivô com precisão absoluta
        const box = new THREE.Box3().setFromObject(cameraModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        cameraModel.position.x = -center.x
        cameraModel.position.y = -center.y
        cameraModel.position.z = -center.z

        // ESCALA PROPORCIONAL REFINADA (1.12 / maxDim) - visualmente mais equilibrada com os cards e textos
        const maxDim = Math.max(size.x, size.y, size.z)
        cameraMaxDim = maxDim
        const scaleFactor = 1.12 / maxDim
        cameraModel.scale.setScalar(scaleFactor)

        modelGroup.add(cameraModel)
        setIsLoading(false)
      },
      undefined,
      (err) => {
        console.error('Error loading Camera.glb in CameraFrontViewer:', err)
        setIsLoading(false)
      }
    )

    // Suave rastreamento de mouse para micro-paralaxe dinâmica
    let mouseX = 0
    let mouseY = 0
    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      mouseX = normX * 0.06
      mouseY = normY * 0.035
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // Resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Render loop com flutuação suave sutil e transição pelo scroll
    let animationFrameId
    const startTime = performance.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = (performance.now() - startTime) * 0.001

      const p = Math.min(1, Math.max(0, scrollProgressRef.current || 0))
      const gP = Math.min(1, Math.max(0, globalScrollProgressRef.current || 0))

      // Rotação dinâmica: Na seção de histórias e transição para o CTA (gP > 0.58)
      let storiesRotY = 0
      let storiesRotX = 0
      let storiesRotZ = 0
      let easeCta = 0

      if (gP > 0.58) {
        const storiesP = Math.max(0, Math.min(1, (gP - 0.58) / 0.42))

        // Histórias 1 a 3 (storiesP: 0.0 a 0.58): micro-ângulos dinâmicos
        const waveP = Math.min(1, storiesP / 0.58)
        const waveRotY = Math.sin(waveP * Math.PI * 2.4) * 0.24
        const waveRotX = Math.cos(waveP * Math.PI * 2.0) * 0.05
        const waveRotZ = Math.sin(waveP * Math.PI * 1.2) * 0.02

        // Transição para o CTA (storiesP: 0.58 a 0.86 e travando perfeitamente até 1.0)
        // Ao chegar na última história (Sofia M.) e ir para o CTA, a câmera gira suavemente para ficar de lado
        const ctaProgress = Math.max(0, Math.min(1, (storiesP - 0.58) / 0.28))
        easeCta = ctaProgress * ctaProgress * (3 - 2 * ctaProgress)

        // 90° exatos de perfil (Math.PI / 2): lente apontando para a direita, idêntico ao vídeo da referência
        const SIDE_ANGLE_Y = Math.PI / 2
        storiesRotY = (1 - easeCta) * waveRotY + easeCta * SIDE_ANGLE_Y
        storiesRotX = (1 - easeCta) * waveRotX
        storiesRotZ = (1 - easeCta) * waveRotZ
      }

      // Parallax do mouse e respiração se atenuam suavemente para alinhar precisamente ao vídeo do CTA
      const mouseFactor = 1 - easeCta
      const breathingFactor = 1 - easeCta
      const descentDip = Math.sin(p * Math.PI) * -0.28
      const breathing = Math.sin(elapsedTime * 1.5) * 0.015 * breathingFactor
      const targetY = descentDip + breathing
      modelGroup.position.y += (targetY - modelGroup.position.y) * 0.08

      const targetRotY = (gP > 0.58 ? storiesRotY : Math.sin(p * Math.PI) * 0.12) + mouseX * mouseFactor
      const targetRotX = (gP > 0.58 ? storiesRotX : (1 - p) * 0.015) + mouseY * mouseFactor
      const targetRotZ = storiesRotZ

      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.08
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08
      modelGroup.rotation.z += (targetRotZ - modelGroup.rotation.z) * 0.08

      // Escala suave para conexão impecável com o enquadramento do vídeo
      if (cameraModelInstance) {
        const baseScale = 1.12 / cameraMaxDim
        const targetScaleFactor = baseScale * (1.0 + easeCta * 0.16)
        cameraModelInstance.scale.setScalar(targetScaleFactor)
      }

      renderer.render(scene, camera)
    }


    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`camera-front-viewer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
            color: '#BFA17A',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          Loading Optics...
        </div>
      )}
    </div>
  )
}
