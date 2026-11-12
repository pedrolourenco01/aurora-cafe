import React, { useRef } from 'react'
import WhyVisitSection from './WhyVisitSection'
import InfographicSection from './InfographicSection'
import LocationSection from './LocationSection'
import ExperienceStoriesSection from './ExperienceStoriesSection'
import './FeaturesCardsFlow.css'

export default function FeaturesCardsFlow() {
  const containerRef = useRef(null)

  return (
    <div id="features" ref={containerRef} className="features-cards-flow-container">
      {/* PALCO FIXO DE FUNDO ESTÚDIO MARROM QUENTE (Z-INDEX 1 - UNIFICA 100% DAS SEÇÕES) */}
      <div className="features-flow-sticky-backdrop" aria-hidden="true">
        <div className="features-lighting-glow" />
        <div className="features-grain-overlay" />
      </div>

      {/* 1. SEÇÃO WHY VISIT (100vh com textos limpos na esquerda e direita) */}
      <WhyVisitSection />

      {/* 2. INFOGRÁFICO PREMIUM MINIMALISTA 16:9 AO REDOR DA CÂMERA 3D */}
      <InfographicSection />

      {/* 3. SEÇÃO CÂMERA SOLO (100vh - EXPERIÊNCIA / NOSTA monumental estilo Oryzo) */}
      <LocationSection />

      {/* 4. SEÇÃO RELATOS DE EXPERIÊNCIA (Texto Esquerda | Câmera no Meio com Giro | Imagem na Direita) */}
      <ExperienceStoriesSection />
    </div>
  )
}


