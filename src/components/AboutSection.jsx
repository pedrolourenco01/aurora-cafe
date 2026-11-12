import React from 'react'
import { motion } from 'motion/react'
import ResponsivePicture from './ResponsivePicture'
import { OPTIMIZED_IMAGES } from '../assets/optimized/manifest'
import './AboutSection.css'

const EASING = [0.19, 1, 0.22, 1]

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      {/* Camadas de Background de Estúdio Marrom Quente (Idêntico à Referência) */}
      <div className="about-lighting-overlay" aria-hidden="true" />
      <div className="about-camera-halo" aria-hidden="true" />
      <div className="about-grain-overlay" aria-hidden="true" />

      {/* Linhas Sutis de Grid Arquitetural */}
      <div className="about-grid-lines" aria-hidden="true">
        <span className="about-grid-line about-grid-line-1" />
        <span className="about-grid-line about-grid-line-2" />
      </div>

      {/* CANTO SUPERIOR ESQUERDO: Eyebrow + Headline Monumental */}
      <motion.div
        className="about-top-left"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: EASING }}
      >
        <span className="about-eyebrow">ABOUT US</span>
        <h2 className="about-headline">
          Built for the way<br />
          memories are made.
        </h2>
      </motion.div>

      {/* CANTO SUPERIOR DIREITO: Card com a Imagem Fornecida */}
      <motion.div
        className="about-top-right"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASING, delay: 0.1 }}
      >
        <div className="about-image-card">
          <ResponsivePicture
            image={OPTIMIZED_IMAGES.aboutImage}
            sizes="(max-width: 640px) 122px, (max-width: 900px) 164px, 300px"
            alt="Nosta 35mm analog camera in use"
            className="about-card-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      </motion.div>

      {/* CENTRO: Âncora para o Palco da Câmera 3D (Câmera descendo e de lado) */}
      <div className="about-center-stage-anchor" aria-hidden="true" />

      {/* CANTO INFERIOR ESQUERDO: Métricas / Números de Destaque */}
      <motion.div
        className="about-bottom-left"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: EASING, delay: 0.15 }}
      >
        <div className="about-metrics-row">
          <div className="about-metric-item">
            <span className="about-metric-number">35mm</span>
            <span className="about-metric-label">
              REUSABLE<br />ANALOG FILM
            </span>
          </div>
          <div className="about-metric-item">
            <span className="about-metric-number">100%</span>
            <span className="about-metric-label">
              MECHANICAL<br />PRECISION
            </span>
          </div>
        </div>
      </motion.div>

      {/* CANTO INFERIOR DIREITO: Parágrafo Editorial Estruturado */}
      <motion.div
        className="about-bottom-right"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: EASING, delay: 0.2 }}
      >
        <p className="about-editorial-text">
          <strong>NOSTA</strong> DELIVERS HIGH-PERFORMANCE ANALOG CAMERAS ENGINEERED FOR TACTILE STRENGTH, FLEXIBILITY, AND EVERYDAY RELIABILITY. FROM GOLDEN HOUR SUNSETS TO <strong>ADAPTABLE ADVENTURES</strong>, OUR CAMERAS ARE DESIGNED TO CAPTURE WHAT TRULY MATTERS AND PERFORM WHEREVER THEY’RE NEEDED.
        </p>
      </motion.div>
    </section>
  )
}
