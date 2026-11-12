import React, { useState } from 'react'
import { ArrowDownRight } from 'lucide-react'
import './NostaNavbar.css'

export default function NostaNavbar() {
  const [activeTab, setActiveTab] = useState('camera')

  return (
    <div className="nosta-navbar-wrapper">
      <nav className="nosta-navbar-container" aria-label="Navegação Principal">
        {/* 1. Logo à Esquerda */}
        <a href="#hero-nosta" className="nosta-nav-brand">
          <span className="nosta-nav-logo-text">
            NOSTA<span className="nosta-nav-logo-dot">.</span>
          </span>
        </a>

        {/* 2. Links de Navegação Centrais */}
        <div className="nosta-nav-links">
          {/* Link Ativo com Seta Laranja diagonal para baixo-direita */}
          <a
            href="#camera"
            className={`nosta-nav-link-item ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('camera')
            }}
          >
            <ArrowDownRight size={16} strokeWidth={2.6} className="nosta-nav-arrow-icon" />
            <span>Our camera</span>
          </a>

          <a
            href="#specifications"
            className={`nosta-nav-link-item ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('specs')
            }}
          >
            <span>Specifications</span>
          </a>

          <a
            href="#about"
            className={`nosta-nav-link-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('about')
            }}
          >
            <span>About NOSTA</span>
          </a>
        </div>

        {/* 3. Botão Menu Pill para Mobile (Conforme Screenshot 2) */}
        <button
          type="button"
          className="nosta-nav-menu-pill"
          aria-label="Abrir menu"
        >
          <span>Menu</span>
          <span className="nosta-menu-dots">:</span>
        </button>

        {/* 4. Botão CTA à Direita (com quadrado laranja e cantos arredondados) */}
        <a href="#contact" className="nosta-nav-cta-btn" aria-label="Entre em contato">
          <span className="nosta-nav-cta-square" aria-hidden="true" />
          <span>Contact us</span>
        </a>
      </nav>
    </div>
  )
}
