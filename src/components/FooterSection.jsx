import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FooterSection.css'

export default function FooterSection() {
  const footerRef = useRef(null)
  const stripe1Ref = useRef(null)
  const stripe2Ref = useRef(null)
  const stripe3Ref = useRef(null)
  const stripe1MobRef = useRef(null)
  const stripe2MobRef = useRef(null)
  const stripe3MobRef = useRef(null)

  useEffect(() => {
    const stripeGroups = [
      [stripe1Ref.current, stripe1MobRef.current].filter(Boolean),
      [stripe2Ref.current, stripe2MobRef.current].filter(Boolean),
      [stripe3Ref.current, stripe3MobRef.current].filter(Boolean),
    ]
    const allStripes = stripeGroups.flat()
    if (!allStripes.length) return

    const isMob = typeof window !== 'undefined' && window.innerWidth <= 900
    const getLen = (path) => {
      try {
        const l = path.getTotalLength() || 0
        if (l > 50) return Math.ceil(l) + 30
      } catch (e) { }
      return isMob ? 1500 : 2600
    }

    // Estado inicial: Escondido no topo com strokeDashoffset
    allStripes.forEach((path) => {
      const len = getLen(path)
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: -len,
        opacity: 0
      })
    })

    let hasAnimated = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true

            const tl = gsap.timeline({ delay: 0.15 })

            // Percorre as 3 listras desenhando de cima até a esquerda total
            stripeGroups.forEach((group, i) => {
              group.forEach((path) => {
                const len = getLen(path)
                tl.fromTo(
                  path,
                  {
                    strokeDasharray: len,
                    strokeDashoffset: -len,
                    opacity: 1
                  },
                  {
                    strokeDashoffset: 0,
                    duration: 1.4,
                    ease: 'power3.out',
                    onComplete: () => {
                      // Garante 100% que a linha vá até o final sem cortes
                      path.style.strokeDasharray = 'none'
                      path.style.strokeDashoffset = 'none'
                    }
                  },
                  i === 0 ? 0 : 0.08 * i
                )
              })
            })
          }
        })
      },
      { threshold: 0.01, rootMargin: '120px' }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <footer className="nosta-footer-wrap" id="footer" ref={footerRef} aria-label="Rodapé Nosta">
      {/* 1. Iluminação de estúdio suave idêntica à Hero */}
      <div className="footer-lighting" aria-hidden="true" />

      {/* 2. Textura granulada analógica vintage de papel fotográfico (4.5% idêntica à Hero) */}
      <div className="footer-grain" aria-hidden="true" />

      {/* 3. Três listras retrô contínuas dos anos 70 100% IDÊNTICAS À HERO:
             - Espessura de 60px com gap de 8px (step de 68px)
             - Cores exatas da Hero: Terracota #C66736, Laranja Mostarda #D58334, Verde Oliva #85713E
             - Animam começando de cima e percorrendo até a esquerda
      */}
      <div className="footer-stripes-container" aria-hidden="true">
        {/* Shared SVG Defs para Filtros Vintage do Rodapé */}
        <svg
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="retroStripeGrainFooter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.25   0 0 0 0 0.15   0 0 0 0 0.08  0 0 0 0.42 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="grainPattern" />
              <feBlend mode="multiply" in="grainPattern" in2="SourceGraphic" result="blend1" />
              <feBlend mode="overlay" in="grainPattern" in2="blend1" />
            </filter>
          </defs>
        </svg>

        {/* Versão Desktop (1792 x 1000) */}
        <svg
          className="footer-stripes-svg footer-stripes-desktop"
          viewBox="0 0 1792 1000"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grupo de Listras com Textura e Espessura 60px animadas do topo até a esquerda */}
          <g filter="url(#retroStripeGrainFooter)">
            {/* Listra 1 (Mais interna / Superior na curva): Terracota #C66736 */}
            <path
              ref={stripe1Ref}
              d="M 1540.0 -50 L 1540.0 600.0 A 180 180 0 0 1 1360.0 780.0 L -300.0 780.0"
              stroke="#C66736"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />

            {/* Listra 2 (Meio): Laranja Mostarda #D58334 */}
            <path
              ref={stripe2Ref}
              d="M 1608.0 -50 L 1608.0 600.0 A 248 248 0 0 1 1360.0 848.0 L -300.0 848.0"
              stroke="#D58334"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />

            {/* Listra 3 (Mais externa / Inferior na curva): Verde Oliva #85713E */}
            <path
              ref={stripe3Ref}
              d="M 1676.0 -50 L 1676.0 600.0 A 316 316 0 0 1 1360.0 916.0 L -300.0 916.0"
              stroke="#85713E"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* Versão Mobile / Tablet Retrato (ancorada à base inferior para permitir footer compacto sem espaço vazio) */}
        <svg
          className="footer-stripes-svg footer-stripes-mobile"
          viewBox="0 0 390 844"
          preserveAspectRatio="xMaxYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="footer-stripes-mobile-group">
            {/* Listra 1 (Mais interna / Superior na curva): Terracota #C66736 */}
            <path
              ref={stripe1MobRef}
              d="M 303 180 L 303 727 A 44 44 0 0 1 259 771 L -500 771"
              stroke="#C66736"
              strokeWidth="26"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />

            {/* Listra 2 (Meio): Laranja Mostarda #D58334 */}
            <path
              ref={stripe2MobRef}
              d="M 333 180 L 333 727 A 74 74 0 0 1 259 801 L -500 801"
              stroke="#D58334"
              strokeWidth="26"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />

            {/* Listra 3 (Mais externa / Inferior na curva): Verde Oliva #85713E */}
            <path
              ref={stripe3MobRef}
              d="M 363 180 L 363 727 A 104 104 0 0 1 259 831 L -500 831"
              stroke="#85713E"
              strokeWidth="26"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* 4. Conteúdo do Footer (Full Screen 100vh com logo gigante Nosta. bem próximo da linha) */}
      <div className="footer-inner-content">
        {/* Topo do Footer: 4 Colunas compactas e integradas */}
        <div className="footer-top-grid">
          {/* Coluna 1: NAVEGAÇÃO */}
          <div className="footer-col">
            <span className="footer-col-header">NAVEGAÇÃO</span>
            <ul className="footer-col-list">
              <li><a href="#features">PRODUTO</a></li>
              <li><a href="#about">SOBRE NÓS</a></li>
              <li><a href="#stories">HISTÓRIAS</a></li>
              <li><a href="#cta">PEDIDOS</a></li>
              <li><a href="#hero">FOTOGRAFIA PURA</a></li>
            </ul>
          </div>

          {/* Coluna 2: LEGAIS */}
          <div className="footer-col">
            <span className="footer-col-header">LEGAIS</span>
            <ul className="footer-col-list">
              <li><a href="#terms">TERMOS DE SERVIÇO</a></li>
              <li><a href="#privacy">POLÍTICA DE PRIVACIDADE</a></li>
              <li><a href="#refund">POLÍTICA DE REEMBOLSO</a></li>
              <li><a href="#cookies">COOKIES</a></li>
              <li><a href="#manage-cookies">GERENCIAR COOKIES</a></li>
            </ul>
          </div>

          {/* Coluna 3: CONTATO */}
          <div className="footer-col footer-col-contato">
            <span className="footer-col-header">CONTATO</span>
            <ul className="footer-col-list">
              <li>
                <a href="mailto:CONTATO@NOSTA.COM" className="footer-contact-link">
                  CONTATO@NOSTA.COM
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: COPYRIGHT & CRÉDITOS */}
          <div className="footer-col footer-col-copyright">
            <p className="footer-meta-line">2024 © Nosta. Todos os direitos reservados.</p>
            <p className="footer-meta-line">Um produto de Fotografia Pura.</p>
            <p className="footer-meta-design">Design by waka.</p>
          </div>
        </div>

        {/* Base do Footer: Logotipo Gigante Nosta. Aumentado e Bem Próximo da Linha */}
        <div className="footer-bottom-stage">
          <div className="footer-giant-logo-container">
            <h2 className="footer-giant-logo">
              Nosta<span className="footer-terracotta-dot" />
            </h2>
          </div>
        </div>
      </div>
    </footer>
  )
}
