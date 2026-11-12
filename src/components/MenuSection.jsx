import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ResponsivePicture from './ResponsivePicture'
import { OPTIMIZED_IMAGES } from '../assets/optimized/manifest'
import './MenuSection.css'

const retroCamShutter = OPTIMIZED_IMAGES.nosta1
const retroCamLens = OPTIMIZED_IMAGES.nosta2
const retroCamTactile = OPTIMIZED_IMAGES.nosta3
const retroCamRolls = OPTIMIZED_IMAGES.nosta4
const retroCamViewfinder = OPTIMIZED_IMAGES.nosta5
const retroCamFlagship = OPTIMIZED_IMAGES.nosta6

export default function MenuSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // =========================================================================
  // COREOGRAFIA RIGOROSAMENTE SEPARADA EM 2 FASES DISTINTAS:
  //
  // FASE 1 (Progresso 0.00 até 0.45):
  // - O texto NOSTA. está fixo e centralizado.
  // - As 5 imagens orbitam o texto perfeitamente separadas em colunas independentes:
  //     * Imagem 1 (Shutter - GRANDE): topo centralizado
  //     * Imagem 2 (Lente): topo esquerdo
  //     * Imagem 3 (Controles R21): meio direito
  //     * Imagem 4 (Filmes 35mm): baixo centro-esquerdo
  //     * Imagem 5 (Viewfinder Leica): baixo direito
  //
  // FASE 2 (Progresso 0.45 até 0.65):
  // - Todas as 5 imagens sobem e somem completamente pelo topo (-160vh).
  // - Elas desaparecem da viewport com opacity -> 0.
  //
  // FASE 3 (Progresso 0.70 até 1.00) - SOMENTE AQUI A ÚLTIMA IMAGEM APARECE:
  // - A tela está 100% vazia (somente o texto NOSTA.).
  // - A 6ª imagem (flagship panorâmica gigante) sobe limpa, repousa exatamente
  //   no centro da tela cobrindo o texto NOSTA., e depois prossegue para a próxima seção.
  // =========================================================================

  // Movimento UNIFICADO: Todas as imagens sobem na mesma velocidade (1:1) — ZERO PARALLAX
  const yUnified = useTransform(
    scrollYProgress,
    [0, 0.28, 0.85, 1.0],
    ['90vh', '0vh', '-145vh', '-145vh']
  )

  // Crescimento sutil e elegante das 5 imagens menores:
  const scaleCard1 = useTransform(scrollYProgress, [0.00, 0.32], [0.85, 0.98])
  const scaleCard2 = useTransform(scrollYProgress, [0.08, 0.44], [0.85, 0.98])
  const scaleCard3 = useTransform(scrollYProgress, [0.04, 0.38], [0.85, 0.98])
  const scaleCard4 = useTransform(scrollYProgress, [0.24, 0.62], [0.85, 0.98])
  const scaleCard5 = useTransform(scrollYProgress, [0.22, 0.58], [0.85, 0.98])

  // Imagem final (flagship) repousa elegante no centro sem zoom excessivo
  const scaleFlagship = useTransform(
    scrollYProgress,
    [0.45, 0.85],
    [0.82, 0.95]
  )

  return (
    <section id="menu" ref={containerRef} className="nosta-manifesto-sticky-wrapper">
      {/* Background Vintage Cinematográfico */}
      <div className="manifesto-lighting-overlay" aria-hidden="true" />
      <div className="manifesto-grain-overlay" aria-hidden="true" />

      {/* Linhas Sutis de Grid Arquitetural */}
      <div className="manifesto-grid-lines" aria-hidden="true">
        <span className="manifesto-grid-line manifesto-grid-line-1" />
        <span className="manifesto-grid-line manifesto-grid-line-2" />
      </div>

      {/* ÚNICO FRAME STICKY DA VIEWPORT (Elimina conflitos de múltiplos elementos sticky) */}
      <div className="manifesto-sticky-frame">
        {/* 1. TEXTO ESTÁTICO / FIXADO NO FUNDO */}
        <div className="manifesto-static-backdrop">
          <div className="manifesto-content">
            <h2 className="manifesto-title">
              NOSTA<span className="manifesto-dot">.</span>
            </h2>
            <p className="manifesto-subtext">
              <span>It takes care of the background so you can stay focused,</span>
              <span>sharp, and in full control of your day.</span>
            </p>
          </div>
        </div>

        {/* 2. TODAS AS IMAGENS EM BLOCO ÚNICO — ZERO PARALLAX, VELOCIDADE 1:1 */}
        <motion.div
          className="manifesto-stage-1-group"
          style={{ y: yUnified }}
        >
          <div className="manifesto-stage-1-inner">
            {/* CARD 1: Topo-Esquerda (Shutter dial) */}
            <motion.div
              className="manifesto-img-card card-1-shutter"
              style={{ scale: scaleCard1 }}
            >
              <ResponsivePicture
                image={retroCamShutter}
                sizes="(max-width: 768px) 75vw, 460px"
                alt="Vintage analog camera mechanical shutter speed dial"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* CARD 2: Abaixo da 1ª imagem, deslocada à direita (Lente Carl Zeiss) */}
            <motion.div
              className="manifesto-img-card card-2-lens"
              style={{ scale: scaleCard2 }}
            >
              <ResponsivePicture
                image={retroCamLens}
                sizes="(max-width: 768px) 75vw, 460px"
                alt="Classic 35mm manual camera prime lens with aperture blades"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* CARD 3: Meio-Direita (Dispositivo tátil e controles mecânicos R21) */}
            <motion.div
              className="manifesto-img-card card-3-tactile"
              style={{ scale: scaleCard3 }}
            >
              <ResponsivePicture
                image={retroCamTactile}
                sizes="(max-width: 768px) 75vw, 460px"
                alt="Tactile knurled knobs and mechanical controllers"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* CARD 4: Baixo Centro-Esquerda (Rolos de filme 35mm e alavanca) */}
            <motion.div
              className="manifesto-img-card card-4-rolls"
              style={{ scale: scaleCard4 }}
            >
              <ResponsivePicture
                image={retroCamRolls}
                sizes="(max-width: 768px) 75vw, 460px"
                alt="Vintage 35mm analog film canisters and camera advance lever"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* CARD 5: Baixo-Direita (Viewfinder analógico vintage Leica M3) */}
            <motion.div
              className="manifesto-img-card card-5-viewfinder"
              style={{ scale: scaleCard5 }}
            >
              <ResponsivePicture
                image={retroCamViewfinder}
                sizes="(max-width: 768px) 75vw, 460px"
                alt="Vintage analog rangefinder camera viewfinder and prism housing"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            {/* CARD 6: IMAGEM FINAL (FLAGSHIP) — Integrada no mesmo bloco, sem parallax */}
            <motion.div
              className="manifesto-img-card card-6-flagship"
              style={{ y: '-50%', scale: scaleFlagship }}
            >
              <ResponsivePicture
                image={retroCamFlagship}
                sizes="(max-width: 768px) 92vw, 1120px"
                alt="Cinematic vintage analog camera workshop and optical studio desk"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
