import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { CAMERA_COLORS, DEFAULT_CAMERA_COLOR, getCameraColorPalette } from '../data/cameraColors'
import './CtaSection.css'

export default function CtaSection({ selectedColor = DEFAULT_CAMERA_COLOR, onSelectColor }) {
  const sectionRef = useRef(null)
  const activeColor = getCameraColorPalette(selectedColor)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })

  // Os textos surgem suavemente quando a section entra na tela e permanecem 100% visíveis
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1])
  const leftX = useTransform(scrollYProgress, [0.2, 0.7], [-35, 0])
  const rightX = useTransform(scrollYProgress, [0.2, 0.7], [35, 0])

  return (
    <section
      ref={sectionRef}
      className="nosta-cta-scroll-section"
      id="cta"
      aria-label="Nosta 35mm — Informações de compra e detalhes"
    >
      {/* 1. PALCO FIXO DE FUNDO CREME VINTAGE IDÊNTICO À HERO (Z-INDEX 1) */}
      <div className="cta-flow-sticky-backdrop" aria-hidden="true">
        <div className="cta-hero-lighting" />
        <div className="cta-hero-grain" />
        <div className="cta-grid-lines">
          <span className="cta-grid-line cta-grid-line-1" />
          <span className="cta-grid-line cta-grid-line-2" />
        </div>
      </div>

      {/* 2. PALCO STICKY DOS TEXTOS E BOTÃO (Z-INDEX 20 - NA FRENTE DA CÂMERA 3D Z-INDEX 10) */}
      <div className="cta-sticky-stage">
        <motion.div
          className="cta-final-overlay"
          style={{ opacity: textOpacity }}
        >
          <div className="cta-overlay-inner">
            {/* Lado Esquerdo: Eyebrow, Título com ponto terracota e Subtexto */}
            <motion.div className="cta-left-content" style={{ x: leftX }}>
              <div className="cta-eyebrow-wrapper">
                <span className="cta-eyebrow-dot" aria-hidden="true" />
                <span className="cta-eyebrow-text">SUA NOVA COMPANHEIRA DE HISTÓRIAS</span>
              </div>
              <h2 className="cta-title">
                Nosta 35mm<span className="cta-title-dot">.</span>
              </h2>
              <p className="cta-description">
                Design atemporal, qualidade mecânica<br />
                e toda a magia do filme 35mm para quem<br />
                valoriza o tátil e o intencional.
              </p>
            </motion.div>

            {/* Espaço central reservado onde a Câmera 3D para entre os textos */}
            <div className="cta-center-spacer" aria-hidden="true" />

            {/* Lado Direito: Preço, Botão 'Comprar agora' e Lista de Diferenciais */}
            <motion.div className="cta-right-content" style={{ x: rightX }}>
              <div className="cta-price-action-box">
                <span className="cta-price-label">APENAS</span>
                <div className="cta-price-row">
                  <span className="cta-price-value">
                    <span className="cta-price-prefix">R$</span> 699<span className="cta-price-cents">,00</span>
                  </span>
                </div>

                {/* Seletor de cores da câmera 3D */}
                <div className="cta-color-selector" role="group" aria-label="Escolha a cor da câmera">
                  <div className="cta-color-header">
                    <span className="cta-color-label">COR</span>
                    <span className="cta-color-name">{activeColor.label}</span>
                  </div>
                  <div className="cta-color-swatches">
                    {CAMERA_COLORS.map((color) => {
                      const isSelected = color.id === activeColor.id
                      return (
                        <button
                          key={color.id}
                          type="button"
                          className={`cta-color-btn${isSelected ? ' is-selected' : ''}`}
                          onClick={() => onSelectColor?.(color.id)}
                          aria-label={`Selecionar cor ${color.label}`}
                          aria-pressed={isSelected}
                          title={color.label}
                        >
                          <span
                            className="cta-color-swatch-fill"
                            style={{ backgroundColor: color.swatch }}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <a href="#comprar" className="cta-buy-btn">
                  <span>Comprar agora</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

              <div className="cta-features-list">
                {/* 1. Filme 35mm */}
                <div className="cta-feature-item">
                  <div className="cta-feature-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <div className="cta-feature-text">
                    <h4 className="cta-feature-title">FILME 35MM</h4>
                    <p className="cta-feature-desc">A experiência analógica no seu dia a dia.</p>
                  </div>
                </div>

                {/* 2. Design Atemporal */}
                <div className="cta-feature-item">
                  <div className="cta-feature-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div className="cta-feature-text">
                    <h4 className="cta-feature-title">DESIGN ATEMPORAL</h4>
                    <p className="cta-feature-desc">Minimalista, resistente e feita para durar.</p>
                  </div>
                </div>

                {/* 3. Registros Mais Reais */}
                <div className="cta-feature-item">
                  <div className="cta-feature-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </div>
                  <div className="cta-feature-text">
                    <h4 className="cta-feature-title">REGISTROS MAIS REAIS</h4>
                    <p className="cta-feature-desc">Cores, texturas e histórias como elas são.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
