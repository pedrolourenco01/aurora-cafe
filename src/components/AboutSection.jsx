import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Cup3DViewer from './Cup3DViewer'
import './AboutSection.css'

const EASING = [0.19, 1, 0.22, 1]

// Match exact Hero animation variants
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.10,
      delayChildren: 0.12,
    }
  }
}

const fadeSlideVariant1 = {
  hidden: { opacity: 0, y: 22, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.80, ease: EASING }
  }
}

const fadeSlideVariant2 = {
  hidden: { opacity: 0, y: 26, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASING }
  }
}

const lineExpandVariant = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    originX: 0,
    transition: { duration: 0.90, ease: EASING }
  }
}

export default function AboutSection({ currentSkin, currentSkinIndex, isDesktop }) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let animId
    const checkScroll = () => {
      const currentY = window.scrollY || window.pageYOffset || 0
      const heroH = window.innerHeight || 800

      if (!isDesktop) {
        // On tablet & mobile: once triggered, content and cup stay visible (no disappearing on scroll up)
        if (currentY >= heroH * 0.15) {
          setIsActive(true)
        }
      } else {
        // Desktop: only reset to hidden when user returns all the way up to Hero
        if (currentY < heroH * 0.25) {
          setIsActive(false)
        } else if (currentY >= heroH * 0.35) {
          setIsActive(true)
        }
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(animId)
      animId = requestAnimationFrame(checkScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    checkScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(animId)
    }
  }, [isDesktop])

  const currentAnimState = isActive ? "visible" : "hidden"

  return (
    <section id="about" className="about-section">
      <div className="about-section-container">
        {/* 1. Giant Background Editorial Title */}
        <motion.div
          className="about-editorial-header"
          initial="hidden"
          animate={currentAnimState}
          variants={staggerContainerVariants}
        >
          <motion.h2 className="about-giant-title" variants={fadeSlideVariant1}>
            <span className="about-title-brand">Aurora Café</span>
          </motion.h2>
          <motion.div className="about-top-metadata" variants={fadeSlideVariant2}>
            <span className="about-meta-tag">Curadoria Gourmet • Sabores Exóticos & Autorais</span>
          </motion.div>
        </motion.div>

        {/* 2. 3-Column Spatial Grid (Left Text, Center 3D Cup Stage, Right Text) */}
        <div className="about-content-grid">
          {/* Left Column: Philosophy & Highlight Quote */}
          <motion.div
            className="about-col about-col-left"
            initial="hidden"
            animate={currentAnimState}
            variants={staggerContainerVariants}
          >
            <motion.div className="about-bullet-tag" variants={fadeSlideVariant1}>
              <span className="bullet-dot" />
              <span>Alquimia Gourmet & Origem</span>
            </motion.div>

            <motion.p className="about-quote-lead" variants={fadeSlideVariant2}>
              Cafés gourmet selecionados à mão e harmonizados com infusões botânicas e sabores exóticos que desafiam o paladar convencional.
            </motion.p>

            <motion.p className="about-quote-sub" variants={fadeSlideVariant1}>
              Elevamos o café especial a uma arte sensorial: de perfis aveludados com notas de cacau e especiarias nobres a criações exóticas com matcha cerimonial, frutas silvestres frescas, caramelo tostado e florais raros. Cada xícara revela uma nova dimensão de sabor.
            </motion.p>

            <motion.div className="about-metrics-row" variants={fadeSlideVariant1}>
              <div className="about-metric-item">
                <span className="metric-num">+20</span>
                <span className="metric-sub">Sabores Únicos</span>
              </div>
              <div className="about-metric-divider" />
              <div className="about-metric-item">
                <span className="metric-num">100%</span>
                <span className="metric-sub">Grãos Gourmet</span>
              </div>
              <div className="about-metric-divider" />
              <div className="about-metric-item">
                <span className="metric-num">88+</span>
                <span className="metric-sub">Pontos SCA</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Center Stage Anchor: Reserved space where the 3D Cup lands on Desktop / Displays Cup on Mobile & Tablet */}
          <div className="about-col about-col-center" id="about-cup-anchor">
            <div className="about-center-pedestal" />
            {!isDesktop && (
              <motion.div
                className="about-mobile-cup-wrapper"
                initial={{ opacity: 0, y: 24 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.90, ease: EASING, delay: 0.12 }}
              >
                <div className="about-mobile-cup-inner">
                  <Cup3DViewer
                    currentSkinIndex={currentSkinIndex}
                    currentSkin={currentSkin}
                    isInteractive={true}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Story Narrative & Technical Details */}
          <motion.div
            className="about-col about-col-right"
            initial="hidden"
            animate={currentAnimState}
            variants={staggerContainerVariants}
          >
            <motion.div className="about-year-tag" variants={fadeSlideVariant1}>
              2024–2026 • Laboratório Gourmet & Bar Sensorial
            </motion.div>

            <motion.h3 className="about-story-heading" variants={fadeSlideVariant2}>
              A Revolução dos Sabores Exóticos
            </motion.h3>

            <motion.p className="about-story-paragraph" variants={fadeSlideVariant1}>
              Na Aurora Café, unimos o rigor dos melhores microlotes gourmet de altitude com ingredientes exóticos do mundo inteiro. Criamos receitas autorais inovadoras que transcendem o café tradicional e criam momentos inesquecíveis.
            </motion.p>

            <motion.p className="about-story-paragraph" variants={fadeSlideVariant1}>
              Nossa carta de bebidas convida você a explorar harmonizações surpreendentes — combinando a riqueza do espresso artesanal com infusões de mirtilos silvestres, pistache nobre, flor de sal e especiarias aromáticas calibradas à perfeição.
            </motion.p>

            <motion.div className="about-specs-list" variants={fadeSlideVariant1}>
              <div className="about-spec-item">
                <span className="spec-label">Curadoria Sensorial</span>
                <span className="spec-value">Dezenas de perfis autorais: frutados, exóticos, florais e intensos</span>
              </div>
              <div className="about-spec-item">
                <span className="spec-label">Grãos Selecionados</span>
                <span className="spec-value">100% arábica gourmet de altitude com torra fresca artesanal</span>
              </div>
              <div className="about-spec-item">
                <span className="spec-label">Mixologia Botânica</span>
                <span className="spec-value">Harmonizações autorais com ingredientes nobres e infusões exclusivas</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Section Transition Divider to Next Section */}
        <motion.div
          className="about-section-divider"
          initial="hidden"
          animate={currentAnimState}
          variants={lineExpandVariant}
        />
      </div>
    </section>
  )
}
