import React, { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import latteImg from '../assets/menu/latte.png'
import croissantImg from '../assets/menu/croissant_benedict.png'
import pistachioImg from '../assets/menu/pistachio_coldbrew.png'
import './WhyVisitSection.css'

const EASING = [0.19, 1, 0.22, 1]

const WHY_VISIT_CARDS = [
  {
    id: 'specialty-coffee',
    title: 'Grãos de Altitude & Torra Fresca',
    description:
      'Selecionamos microlotes 100% arábica de fazendas sustentáveis acima de 88 pontos SCA. Cada lote é torrado artesanalmente toda semana para garantir máxima intensidade aromática e notas florais inigualáveis.',
    tags: ['100% Arábica', '88+ Pontos SCA', 'Torra Semanal'],
    image: latteImg,
    imageBg: '#FDEBE6',
    badgeText: '01 • Origem Nobre'
  },
  {
    id: 'artisan-patisserie',
    title: 'Pâtisserie & Alquimia Gastronômica',
    description:
      'Da clássica confeitaria francesa a receitas autorais exclusivas, cada croissant, bolo e sobremesa é preparado diariamente com manteiga de primeira linha, baunilha de Madagascar e frutas frescas selecionadas.',
    tags: ['Produção Diária', 'Manteiga Pura', 'Receitas Autorais'],
    image: croissantImg,
    imageBg: '#E4EEF8',
    badgeText: '02 • Feito à Mão'
  },
  {
    id: 'sensory-experience',
    title: 'Atmosfera Sensorial & Acolhedora',
    description:
      'Um refúgio urbano desenhado para inspirar. Iluminação natural suave, trilha sonora instrumental curada, Wi-Fi de alta velocidade e mesas confortáveis prontas para reuniões, leitura ou um momento de pausa.',
    tags: ['Design Minimalista', 'Wi-Fi Gigabit', 'Pet Friendly'],
    image: pistachioImg,
    imageBg: '#E7F2E6',
    badgeText: '03 • Experiência'
  }
]

// Pure GPU lerp helper
function lerp(start, end, progress) {
  return start + (end - start) * progress
}

// Clamp helper
function clamp(val, min = 0, max = 1) {
  return Math.min(max, Math.max(min, val))
}

// Smooth Hermite / Quintic Easing for ultra-gentle acceleration and deceleration
function smoothEase(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function WhyVisitSection() {
  const containerRef = useRef(null)
  const card0Ref = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)

  useEffect(() => {
    let animId
    let currentP = 0
    let targetP = 0

    const calculateTarget = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowH = window.innerHeight || 800
      const totalScrollable = rect.height - windowH

      if (totalScrollable <= 0) {
        targetP = 0
        return
      }
      const currentScroll = -rect.top
      targetP = clamp(currentScroll / totalScrollable, 0, 1)
    }

    // Direct GPU RAF Loop
    const renderLoop = () => {
      const isNonDesktop = window.innerWidth <= 1024

      if (isNonDesktop) {
        if (card0Ref.current) card0Ref.current.style.transform = ''
        if (card1Ref.current) card1Ref.current.style.transform = ''
        if (card2Ref.current) card2Ref.current.style.transform = ''
      } else {
        // Desktop smooth stacking card glide
        currentP += (targetP - currentP) * 0.08

        // --- CARD 0 (Base Card) ---
        const p0_1 = smoothEase(clamp((currentP - 0.05) / 0.44, 0, 1))
        const p0_2 = smoothEase(clamp((currentP - 0.48) / 0.44, 0, 1))
        const scale0 = lerp(1.0, 0.95, p0_1) * (1.0 - p0_2 * 0.05)
        const rotate0 = lerp(0, -2.4, p0_1) + lerp(0, -1.6, p0_2)
        const y0 = lerp(0, -12, p0_1) + lerp(0, -10, p0_2)

        if (card0Ref.current) {
          card0Ref.current.style.transform = `translate3d(0px, ${y0}px, 0px) scale(${scale0}) rotate(${rotate0}deg)`
        }

        // --- CARD 1 (Middle Card - [0.08 -> 0.50]) ---
        const p1_in = smoothEase(clamp((currentP - 0.08) / 0.42, 0, 1))
        const p1_phase2 = smoothEase(clamp((currentP - 0.50) / 0.42, 0, 1))
        const y1_vh = lerp(140, 0, p1_in)
        const y1_offset = -p1_phase2 * 8
        const scale1 = 1.0 - p1_phase2 * 0.05
        const rotate1 = lerp(6.0, 2.0, p1_in)

        if (card1Ref.current) {
          card1Ref.current.style.transform = `translate3d(0px, calc(${y1_vh}vh + ${y1_offset}px), 0px) scale(${scale1}) rotate(${rotate1}deg)`
        }

        // --- CARD 2 (Top Card - [0.50 -> 0.92]) ---
        const p2_in = smoothEase(clamp((currentP - 0.50) / 0.42, 0, 1))
        const y2_vh = lerp(140, 0, p2_in)
        const rotate2 = lerp(-6.0, -1.8, p2_in)

        if (card2Ref.current) {
          card2Ref.current.style.transform = `translate3d(0px, ${y2_vh}vh, 0px) scale(1.0) rotate(${rotate2}deg)`
        }
      }

      animId = requestAnimationFrame(renderLoop)
    }

    window.addEventListener('scroll', calculateTarget, { passive: true })
    window.addEventListener('resize', calculateTarget, { passive: true })
    calculateTarget()
    animId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('scroll', calculateTarget)
      window.removeEventListener('resize', calculateTarget)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section id="why-visit" className="why-visit-section" ref={containerRef}>
      {/* Sticky Viewport Container */}
      <div className="why-visit-sticky-viewport">
        <motion.div
          className="why-visit-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.08,
              }
            }
          }}
        >
          {/* Header Row with Staggered Fade-in & Blur Removal */}
          <motion.div
            className="why-visit-header"
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(3px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.85, ease: EASING }
              }
            }}
          >
            <div className="why-visit-header-content">
              <h2 className="why-visit-main-title">
                Por que Visitar
                <span className="why-visit-cursive-subtitle">a experiência aurora</span>
              </h2>
              <p className="why-visit-header-desc">
                Muito mais que uma cafeteria: um refúgio sensorial feito para desacelerar o ritmo,
                saborear cafés excepcionais e colecionar memórias inesquecíveis.
              </p>
            </div>
          </motion.div>

          {/* Pinned Card Deck Stage with Smooth Scale & Rise Reveal */}
          <motion.div
            className="why-visit-cards-stage"
            variants={{
              hidden: { opacity: 0, y: 32, scale: 0.97 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.90, ease: EASING }
              }
            }}
          >
            {/* Card 0 (Base Card) */}
            <div className="why-visit-card-deck-item" ref={card0Ref} style={{ zIndex: 1 }}>
              <div className="why-visit-card">
                <div
                  className="why-visit-card-media"
                  style={{ backgroundColor: WHY_VISIT_CARDS[0].imageBg }}
                >
                  <img
                    src={WHY_VISIT_CARDS[0].image}
                    alt={WHY_VISIT_CARDS[0].title}
                    className="why-visit-product-img"
                    loading="lazy"
                  />
                </div>
                <div className="why-visit-card-info">
                  <div className="why-visit-card-badge">{WHY_VISIT_CARDS[0].badgeText}</div>
                  <h3 className="why-visit-card-title">{WHY_VISIT_CARDS[0].title}</h3>
                  <p className="why-visit-card-desc">{WHY_VISIT_CARDS[0].description}</p>
                  <div className="why-visit-tags-row">
                    {WHY_VISIT_CARDS[0].tags.map((tag) => (
                      <span key={tag} className="why-visit-pill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 1 (Middle Card) */}
            <div className="why-visit-card-deck-item" ref={card1Ref} style={{ zIndex: 2 }}>
              <div className="why-visit-card">
                <div
                  className="why-visit-card-media"
                  style={{ backgroundColor: WHY_VISIT_CARDS[1].imageBg }}
                >
                  <img
                    src={WHY_VISIT_CARDS[1].image}
                    alt={WHY_VISIT_CARDS[1].title}
                    className="why-visit-product-img"
                    loading="lazy"
                  />
                </div>
                <div className="why-visit-card-info">
                  <div className="why-visit-card-badge">{WHY_VISIT_CARDS[1].badgeText}</div>
                  <h3 className="why-visit-card-title">{WHY_VISIT_CARDS[1].title}</h3>
                  <p className="why-visit-card-desc">{WHY_VISIT_CARDS[1].description}</p>
                  <div className="why-visit-tags-row">
                    {WHY_VISIT_CARDS[1].tags.map((tag) => (
                      <span key={tag} className="why-visit-pill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (Top Card) */}
            <div className="why-visit-card-deck-item" ref={card2Ref} style={{ zIndex: 3 }}>
              <div className="why-visit-card">
                <div
                  className="why-visit-card-media"
                  style={{ backgroundColor: WHY_VISIT_CARDS[2].imageBg }}
                >
                  <img
                    src={WHY_VISIT_CARDS[2].image}
                    alt={WHY_VISIT_CARDS[2].title}
                    className="why-visit-product-img"
                    loading="lazy"
                  />
                </div>
                <div className="why-visit-card-info">
                  <div className="why-visit-card-badge">{WHY_VISIT_CARDS[2].badgeText}</div>
                  <h3 className="why-visit-card-title">{WHY_VISIT_CARDS[2].title}</h3>
                  <p className="why-visit-card-desc">{WHY_VISIT_CARDS[2].description}</p>
                  <div className="why-visit-tags-row">
                    {WHY_VISIT_CARDS[2].tags.map((tag) => (
                      <span key={tag} className="why-visit-pill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
