import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ZoomIn } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './GallerySection.css'

gsap.registerPlugin(ScrollTrigger)

const EASING = [0.19, 1, 0.22, 1]

const GALLERY_ITEMS = [
  {
    id: 'ambiente',
    src: '/galeria/galeria_ambiente.jpeg',
    title: 'Atmosfera & Arquitetura',
    subtitle: 'Refúgio acolhedor com luz natural e design minimalista',
    tag: 'O Espaço',
    column: 'left',
  },
  {
    id: 'pistach',
    src: '/galeria/galeria pistach.jpeg',
    title: 'Pistachio Signature',
    subtitle: 'Cold brew cremoso e infusão de notas aromáticas',
    tag: 'Bebida Autoral',
    column: 'right',
  },
  {
    id: 'doces',
    src: '/galeria/galeria_doces.jpeg',
    title: 'Pâtisserie Artesanal',
    subtitle: 'Confeitaria fina feita diariamente com ingredientes puros',
    tag: 'Gastronomia',
    column: 'left',
  },
  {
    id: 'aurora',
    src: '/galeria/galeria aurora.jpeg',
    title: 'Alquimia & Ritual',
    subtitle: 'Extração precisa de microlotes especiais acima de 88 pontos',
    tag: 'Café Especial',
    column: 'right',
  },
]

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null)
  const sectionRef = useRef(null)
  const gridWrapperRef = useRef(null)
  const strokePathRef = useRef(null)

  // Frame-perfect fast bidirectional scroll tracking for the fluid trail
  useEffect(() => {
    if (!strokePathRef.current || !gridWrapperRef.current) return

    const path = strokePathRef.current
    const pathLength = path.getTotalLength()

    path.style.strokeDasharray = `${pathLength}`
    path.style.strokeDashoffset = `${pathLength}`

    let currentOffset = pathLength
    let animId

    const updateStroke = () => {
      if (!gridWrapperRef.current || !path) return

      const rect = gridWrapperRef.current.getBoundingClientRect()
      const windowH = window.innerHeight || 800

      // Starts right as user scrolls from the 1st photo, retracts 100% when returning to 1st photo
      const startY = windowH * 0.25
      const endY = -rect.height + windowH * 0.75
      const totalRange = Math.max(1, startY - endY)

      const currentDist = startY - rect.top
      const rawProgress = Math.min(1, Math.max(0, currentDist / totalRange))
      
      // Dynamic linear-responsive progress for perfect bidirectional visibility
      const progress = Math.min(1, Math.max(0, rawProgress * 1.15))

      const targetOffset = pathLength * (1 - progress)

      // Fast, responsive lerp (0.45) for immediate real-time feedback in both directions
      currentOffset += (targetOffset - currentOffset) * 0.45
      path.style.strokeDashoffset = `${currentOffset}`
    }

    const renderLoop = () => {
      updateStroke()
      animId = requestAnimationFrame(renderLoop)
    }

    animId = requestAnimationFrame(renderLoop)

    const onScroll = () => updateStroke()
    window.addEventListener('scroll', onScroll, { passive: true })
    if (window.lenis) {
      window.lenis.on('scroll', onScroll)
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScroll)
      if (window.lenis) {
        window.lenis.off('scroll', onScroll)
      }
    }
  }, [])

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  const leftItems = GALLERY_ITEMS.filter((item) => item.column === 'left')
  const rightItems = GALLERY_ITEMS.filter((item) => item.column === 'right')

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef}>
      <motion.div
        className="gallery-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* 1. Header: Clean Main Title */}
        <motion.div
          className="gallery-header-row"
          variants={{
            hidden: { opacity: 0, y: 24, filter: 'blur(3px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.85, ease: EASING },
            },
          }}
        >
          <div className="gallery-title-block">
            <h2 className="gallery-main-title">
              Galeria Sensorial
              <span className="gallery-cursive-subtitle">momentos aurora</span>
            </h2>
          </div>
        </motion.div>

        {/* 2. Grid Wrapper with Scroll Animation #33 SVG Path Emerging from Bottom of 1st Image with iconic loop */}
        <div className="gallery-grid-wrapper" ref={gridWrapperRef}>
          <div className="gallery-svg-path-bg" aria-hidden="true">
            <svg
              viewBox="0 0 1378 2260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMin meet"
            >
              <defs>
                <linearGradient id="galleryStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D2B79A" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#B57738" stopOpacity="0.75" />
                  <stop offset="65%" stopColor="#8A5832" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#542D17" stopOpacity="0.55" />
                </linearGradient>
              </defs>
              <path
                ref={strokePathRef}
                id="stroke-path"
                d="M 280 340 C 280 600, 680 700, 1100 800 C 1320 860, 1400 1200, 1180 1380 C 960 1540, -40 1560, 160 1180 C 360 820, 1360 1480, 1060 1780"
                stroke="url(#galleryStrokeGrad)"
                strokeWidth="140"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="gallery-grid">
            {/* Left Column */}
            <div className="gallery-col gallery-col-left">
              {leftItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setSelectedImage(item)}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.85, delay: index * 0.15, ease: EASING }}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="gallery-img"
                      loading="lazy"
                    />
                    <div className="gallery-card-overlay">
                      <div className="gallery-card-info">
                        <h3 className="gallery-card-title">{item.title}</h3>
                        <p className="gallery-card-sub">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column (Staggered offset downward) */}
            <div className="gallery-col gallery-col-right">
              {rightItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setSelectedImage(item)}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.85, delay: 0.1 + index * 0.15, ease: EASING }}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="gallery-img"
                      loading="lazy"
                    />
                    <div className="gallery-card-overlay">
                      <div className="gallery-card-info">
                        <h3 className="gallery-card-title">{item.title}</h3>
                        <p className="gallery-card-sub">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Section Bottom Copy & Instagram CTA */}
        <motion.div
          className="gallery-footer-row"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.85, ease: EASING },
            },
          }}
        >
          <p className="gallery-footer-desc">
            Cada ângulo do Aurora Café foi concebido como um refúgio sensorial — unindo arquitetura contemporânea, iluminação natural suave, torra artesanal de microlotes e a mais alta confeitaria autoral servida diariamente.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-pill-btn"
            aria-label="Ver no Instagram"
          >
            <span className="btn-text-roll">
              <span className="btn-text-primary">VER NO INSTAGRAM</span>
              <span className="btn-text-secondary" aria-hidden="true">VER NO INSTAGRAM</span>
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* 3. Interactive Modal / Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="gallery-lightbox-content"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.38, ease: EASING }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-lightbox-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Fechar visualização"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="gallery-lightbox-img-container">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="gallery-lightbox-img"
                />
              </div>

              <div className="gallery-lightbox-caption">
                <h3 className="gallery-lightbox-title">{selectedImage.title}</h3>
                <p className="gallery-lightbox-desc">{selectedImage.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
