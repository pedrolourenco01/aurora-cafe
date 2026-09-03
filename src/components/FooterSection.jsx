import React from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowUp, Coffee } from 'lucide-react'
import './FooterSection.css'

const EASING = [0.19, 1, 0.22, 1]

// Steaming Hot Takeaway Coffee Cup Icon matching the Navbar
function HotCoffeeCupIcon({ size = 30, className = "" }) {
  return (
    <div className={`steaming-cup-icon-wrapper ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="steaming-cup-svg"
      >
        <defs>
          <linearGradient id="footerSteamGrad" x1="0" y1="10" x2="0" y2="-6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="25%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.45" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* GSAP-Inspired Fluid Continuous Steam Waves */}
        <g className="gsap-steam-group">
          <path
            d="M13.5 10 C11 7, 15.5 4, 12.5 0.5 C9.5 -3, 14.5 -6, 12 -9"
            stroke="url(#footerSteamGrad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="gsap-steam-path gsap-steam-1"
          />
          <path
            d="M18.5 10 C21 7, 16.5 4, 19.5 0.5 C22.5 -3, 17.5 -6, 20 -9"
            stroke="url(#footerSteamGrad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="gsap-steam-path gsap-steam-2"
          />
        </g>

        {/* Cup Lid Cap */}
        <rect x="8.5" y="10" width="15" height="3" rx="1.2" fill="currentColor" />
        <path d="M12 9H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

        {/* Takeaway Cup Body */}
        <path
          d="M9.5 13.5L11.8 28.2C11.9 28.7 12.3 29 12.8 29H19.2C19.7 29 20.1 28.7 20.2 28.2L22.5 13.5H9.5Z"
          fill="currentColor"
        />

        {/* Cup Sleeve (Central Wrap Overlay) */}
        <path
          d="M10.2 17.5L11 23H21L21.8 17.5H10.2Z"
          fill="rgba(255, 255, 255, 0.28)"
        />
      </svg>
    </div>
  )
}

export default function FooterSection() {
  const scrollToTop = (e) => {
    e.preventDefault()
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer-section" id="footer" aria-label="Rodapé do site">
      {/* 1. Upper Banner: Rich Warm Espresso Satin Background */}
      <div className="footer-banner-wrap">
        <motion.div 
          className="footer-hero-headline"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASING }}
        >
          <h2 className="footer-headline-text">
            Seu próximo café favorito está aqui.
          </h2>
        </motion.div>
      </div>

      {/* 2. Lower Sheet: Cream Card Sheet Container */}
      <div className="footer-sheet-container">
        <motion.div 
          className="footer-sheet-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.95, ease: EASING, delay: 0.1 }}
        >
          {/* Top Row: Left Brand Info & Right Navigation Columns */}
          <div className="footer-sheet-top">
            
            {/* Left Brand Column (Replaces email form as requested) */}
            <div className="footer-brand-col">
              <div className="footer-brand-header">
                <HotCoffeeCupIcon size={30} className="footer-brand-icon" />
                <span className="footer-brand-title">Aurora Café</span>
              </div>
              <p className="footer-brand-desc">
                Microlotes selecionados acima de 88 pontos, torra artesanal diária e confeitaria autoral servida em um espaço concebido para pausar o tempo.
              </p>
              <div className="footer-brand-action">
                <a href="#menu" className="footer-menu-link">
                  <span className="btn-text-roll">
                    <span className="btn-text-primary">
                      <span>Explorar Cardápio</span>
                      <ArrowUpRight size={16} />
                    </span>
                    <span className="btn-text-secondary" aria-hidden="true">
                      <span>Explorar Cardápio</span>
                      <ArrowUpRight size={16} />
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Right Nav Grid (4 Columns matching reference) */}
            <div className="footer-nav-grid">
              {/* Column 1: Cardápio */}
              <div className="footer-nav-col">
                <h3 className="footer-nav-heading">Cardápio</h3>
                <ul className="footer-nav-list">
                  <li><a href="#menu">Cafés Especiais</a></li>
                  <li><a href="#menu">Pâtisserie Artesanal</a></li>
                  <li><a href="#menu">Cold Brews & Tonics</a></li>
                  <li><a href="#menu">Salgados & Toasts</a></li>
                </ul>
              </div>

              {/* Column 2: Experiência */}
              <div className="footer-nav-col">
                <h3 className="footer-nav-heading">Experiência</h3>
                <ul className="footer-nav-list">
                  <li><a href="#about">A Nossa História</a></li>
                  <li><a href="#why-visit">Ritual de Torra</a></li>
                  <li><a href="#gallery">Galeria Sensorial</a></li>
                  <li><a href="#about">Microlotes Selecionados</a></li>
                </ul>
              </div>

              {/* Column 3: Visite */}
              <div className="footer-nav-col">
                <h3 className="footer-nav-heading">Visite</h3>
                <ul className="footer-nav-list">
                  <li><a href="#location">Rua das Flores, 128</a></li>
                  <li><span className="footer-static-info">Seg – Sex: 08h – 20h</span></li>
                  <li><span className="footer-static-info">Sáb – Dom: 09h – 18h</span></li>
                  <li><a href="#location">Como Chegar</a></li>
                </ul>
              </div>

              {/* Column 4: Conecte */}
              <div className="footer-nav-col">
                <h3 className="footer-nav-heading">Conecte</h3>
                <ul className="footer-nav-list">
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a></li>
                  <li><a href="https://spotify.com" target="_blank" rel="noopener noreferrer">Playlist Aurora</a></li>
                  <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Giant Wordmark: Aurora aligned to the right */}
          <div className="footer-wordmark-wrap">
            <svg 
              className="footer-wordmark-svg" 
              viewBox="0 0 940 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Aurora"
            >
              <text
                x="940"
                y="175"
                textAnchor="end"
                fill="#3E1E09"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="240"
                fontWeight="600"
                letterSpacing="-0.03em"
              >
                Aurora
              </text>
            </svg>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © {new Date().getFullYear()} Aurora Café. Todos os direitos reservados.
            </div>

            <div className="footer-legal-links">
              <a href="#privacy">Privacidade</a>
              <span className="footer-dot-sep">•</span>
              <a href="#terms">Termos</a>
              <span className="footer-dot-sep">•</span>
              <button onClick={scrollToTop} className="footer-back-to-top" aria-label="Voltar ao topo">
                <span>Voltar ao topo</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </footer>
  )
}
