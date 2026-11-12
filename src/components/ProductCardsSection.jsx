import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import CameraFrontViewer from './CameraFrontViewer'
import './WhyVisitSection.css'
import './ProductCardsSection.css'

// 5 Imagens Específicas de Lente, Formato, Materiais, Funcionalidades e Obturador
import cardLens from '../assets/cards/card-lens.jpg'
import cardForm from '../assets/cards/card-form.jpg'
import cardMaterials from '../assets/cards/card-materials.jpg'
import cardFeatures from '../assets/cards/card-features.jpg'
import cardShutter from '../assets/cards/card-shutter.jpg'

const CARDS_DATA = [
  // 1. LENTE (Card Grande com Texto & Foto Integrada estilo Oryzo)
  {
    id: 'card-1-lens-text',
    type: 'text',
    feature: 'lente',
    eyebrow: 'OPTICS // 01',
    headline: ['35mm Pure Optics.', 'Refuses the digital haze.'],
    description: 'Equipped with custom f/3.8 multi-coated optical glass. True organic depth, micro-contrast, and genuine analog grain without digital sharpening.',
    tagLeft: 'ON-DEVICE. // 35MM OPTICS',
    tagRight: 'F/3.8 PRIME • SHUTTER 1/125S',
    image: cardLens,
    className: 'feature-card-large card-theme-amber',
  },
  // 2. LENTE (Card de Imagem Vertical - Menor na largura)
  {
    id: 'card-2-lens-img',
    type: 'image',
    feature: 'lente',
    image: cardLens,
    alt: 'Macro photograph of vintage 35mm optical camera lens with aperture ring',
    badge: '35MM OPTICS',
    className: 'feature-card-small card-format-img-lens',
  },

  // 3. FORMATO (Card Grande com Texto & Foto Integrada estilo Oryzo)
  {
    id: 'card-3-form-text',
    type: 'text',
    feature: 'formato',
    eyebrow: 'ERGONOMICS // 02',
    headline: ['Contoured for hands,', 'not algorithms.'],
    description: 'Sculpted rangefinder silhouette engineered for effortless one-handed street shooting. Pocketable 118mm footprint always ready for spontaneous moments.',
    tagLeft: 'CHASSIS // 240G POCKET.',
    tagRight: '118 × 66 × 42 MM FORM FACTOR',
    image: cardForm,
    className: 'feature-card-large card-theme-sand',
  },
  // 4. FORMATO (Card de Imagem Vertical - Menor na largura)
  {
    id: 'card-4-form-img',
    type: 'image',
    feature: 'formato',
    image: cardForm,
    alt: 'Compact retro 35mm camera held in hand showcasing pocketable curved silhouette',
    badge: 'RANGEFINDER SILHOUETTE',
    className: 'feature-card-small card-format-img-form',
  },

  // 5. MATERIAIS (Card Grande com Texto & Foto Integrada estilo Oryzo)
  {
    id: 'card-5-materials-text',
    type: 'text',
    feature: 'materiais',
    eyebrow: 'CRAFTSMANSHIP // 03',
    headline: ['Anodized alloy.', 'Natural cork grip.'],
    description: 'Milled aluminum top plate paired with naturally harvested Portuguese cork body grip. Develops a warm, personal patina over years of adventures.',
    tagLeft: 'CRAFTSMANSHIP // ALLOY & CORK.',
    tagRight: 'KNURLED ORANGE RELEASE',
    image: cardMaterials,
    className: 'feature-card-large card-theme-cork',
  },
  // 6. MATERIAIS (Card de Imagem Vertical - Menor na largura)
  {
    id: 'card-6-materials-img',
    type: 'image',
    feature: 'materiais',
    image: cardMaterials,
    alt: 'Extreme macro texture of natural porous cork meeting brushed aluminum and orange button',
    badge: 'ORGANIC TACTILE',
    className: 'feature-card-small card-format-img-materials',
  },

  // 7. FUNCIONALIDADES (Card Grande com Texto & Foto Integrada estilo Oryzo)
  {
    id: 'card-7-features-text',
    type: 'text',
    feature: 'funcionalidades',
    eyebrow: 'MECHANICAL // 04',
    headline: ['Always ready.', 'No power required.'],
    description: 'Pure spring-wound mechanical clockwork shutter. Manual thumb-wheel film advance with calibrated haptic resistance. Operates anywhere on Earth without batteries.',
    tagLeft: '24/7 UPTIME. NO POWER REQUIRED.',
    tagRight: '100% MECHANICAL CLOCKWORK',
    image: cardFeatures,
    className: 'feature-card-large card-theme-espresso',
  },
  // 8. FUNCIONALIDADES (Card de Imagem Vertical - Menor na largura)
  {
    id: 'card-8-features-img',
    type: 'image',
    feature: 'funcionalidades',
    image: cardFeatures,
    alt: 'Mechanical camera interior with 35mm film canister loaded and advance gears',
    badge: 'PURE ANALOG',
    className: 'feature-card-small card-format-img-features',
  },

  // 9. OBTURADOR / CONTROLES (Card Grande com Texto & Foto Integrada estilo Oryzo)
  {
    id: 'card-9-shutter-text',
    type: 'text',
    feature: 'obturador',
    eyebrow: 'TACTILITY // 05',
    headline: ['1/1000s Pure Action.', 'Zero shutter lag.'],
    description: 'Calibrated mechanical leaf shutter with knurled speed selector dial. Crisp acoustic response and immediate mechanical actuation with zero sensor latency.',
    tagLeft: 'SHUTTER // 1/1000S TO 1S + B',
    tagRight: 'PHYSICAL HAPTIC FEEDBACK',
    image: cardShutter,
    className: 'feature-card-large card-theme-cognac',
  },
  // 10. OBTURADOR (Card de Imagem Vertical - Menor na largura)
  {
    id: 'card-10-shutter-img',
    type: 'image',
    feature: 'obturador',
    image: cardShutter,
    alt: 'Macro photograph of vintage tactile shutter speed dial and winding lever',
    badge: '1/1000S LEAF SHUTTER',
    className: 'feature-card-small card-format-img-shutter',
  },
]

export default function ProductCardsSection() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const [trackWidth, setTrackWidth] = useState(6200)
  const [winWidth, setWinWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))

  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth)
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth)
      }
    }
    handleResize()
    const timer = setTimeout(handleResize, 150)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ROLAGEM HORIZONTAL DOS CARDS MONUMENTAIS
  const targetScrollDistance = -(trackWidth - winWidth + 160)
  const trackX = useTransform(
    scrollYProgress,
    [0.01, 0.98],
    [winWidth * 0.88, targetScrollDistance]
  )

  return (
    <section
      id="product-cards"
      ref={containerRef}
      className="product-cards-scroll-wrapper"
    >
      <div id="specs" className="product-cards-gallery-anchor" />
      <div id="gallery" className="product-cards-gallery-anchor" />

      {/* STICKY STAGE (Mantém o palco de cards na tela durante a rolagem) */}
      <div className="product-cards-sticky-stage">
        {/* TRACK HORIZONTAL DOS CARDS MONUMENTAIS (Passam na frente da câmera) */}
        <div className="product-cards-track-container">
          <motion.div
            ref={trackRef}
            className="product-cards-track"
            style={{ x: trackX }}
          >
            {CARDS_DATA.map((card) => {
              if (card.type === 'text') {
                return (
                  <div
                    key={card.id}
                    className={`product-card ${card.className}`}
                  >
                    {/* Topo do Card: Headline Monumental & Descrição */}
                    <div className="card-top-content">
                      <span className="card-eyebrow-tag">{card.eyebrow}</span>
                      <h3 className="card-headline-text">
                        {card.headline.map((line, idx) => (
                          <span key={idx} className="headline-line">
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="card-description-text">
                        {card.description}
                      </p>
                    </div>

                    {/* Meio/Fundo: Fotografia Integrada de Alta Resolução */}
                    <div className="card-embedded-photo-wrapper">
                      <img
                        src={card.image}
                        alt={card.tagLeft}
                        className="card-embedded-photo"
                        loading="eager"
                      />
                      <div className="card-embedded-gradient" />
                    </div>

                    {/* Rodapé: Tags Técnicas Estilo Referência Oryzo (ON-DEVICE.) */}
                    <div className="card-specs-row">
                      <span className="spec-tag-badge">{card.tagLeft}</span>
                      <span className="spec-tag-sub">{card.tagRight}</span>
                    </div>
                  </div>
                )
              }

              // Card de Imagem Vertical (Menor na largura, mesma altura monumental)
              return (
                <div
                  key={card.id}
                  className={`product-card ${card.className}`}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="card-full-image"
                      loading="eager"
                    />
                    <div className="card-image-gradient-overlay" />
                    <span className="card-image-badge">{card.badge}</span>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
