import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './NostaHero.css'

const EASING = [0.19, 1, 0.22, 1]

export default function NostaHero({ isIntroFinished = true }) {
  const capsuleRef = useRef(null)
  const dotsRef = useRef(null)
  const titleRef = useRef(null)
  const navRef = useRef(null)
  const linksRef = useRef([])
  const tlRef = useRef(null)
  const timeoutRef = useRef(null)

  // Refs para os caminhos das listras retrô (Desktop e Mobile)
  const stripe1Ref = useRef(null)
  const stripe2Ref = useRef(null)
  const stripe3Ref = useRef(null)
  const stripe1MobRef = useRef(null)
  const stripe2MobRef = useRef(null)
  const stripe3MobRef = useRef(null)

  // Refs para os elementos de conteúdo da Hero
  const eyebrowRef = useRef(null)
  const menuContainerRef = useRef(null)
  const rightCopyRef = useRef(null)
  const bottomCardRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const gridLinesRef = useRef(null)

  const hasAnimatedHeroRef = useRef(false)

  // 1. Menu Dropdown Interativo (Hover / Click)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200
      const h = typeof window !== 'undefined' ? window.innerHeight : 800
      const isMob = w <= 900 || (w <= 1180 && h > w)
      const initialH = isMob ? (w > 900 ? 44 : 38) : 44
      const targetH = isMob ? (w > 900 ? 176 : 160) : 180

      gsap.set(capsuleRef.current, { height: initialH })
      gsap.set(dotsRef.current, { rotation: 0 })
      gsap.set(titleRef.current, { opacity: 0.95 })
      gsap.set(navRef.current, { autoAlpha: 0 })
      gsap.set(linksRef.current, { y: 14, autoAlpha: 0 })

      const tl = gsap.timeline({ paused: true })
      tl.to(capsuleRef.current, {
        height: targetH,
        duration: 0.42,
        ease: "power3.out"
      }, 0)
        .to(dotsRef.current, {
          rotation: 90,
          duration: 0.38,
          ease: "power2.out"
        }, 0)
        .to(titleRef.current, {
          opacity: 0.65,
          duration: 0.3,
          ease: "power2.out"
        }, 0)
        .to(navRef.current, {
          autoAlpha: 1,
          duration: 0.22,
          ease: "power2.out"
        }, 0.08)
        .to(linksRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.36,
          stagger: 0.045,
          ease: "power3.out"
        }, 0.1)

      tlRef.current = tl
    }, menuContainerRef)

    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        tlRef.current?.timeScale(1.4).reverse()
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        tlRef.current?.timeScale(1.4).reverse()
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      ctx.revert()
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // 2. Animação de Entrada Orquestrada da Hero
  // Sequência:
  // 1. Logo NOSTA chega à Hero (isIntroFinished vira true)
  // 2. As Listras Retrô entram desenhando de cima e percorrendo até a esquerda
  // 3. A Câmera surge no centro com entrada cinematográfica
  // 4. Demais conteúdos (Eyebrow, Menu, Texto da Direita, Card, Scroll) surgem fluidamente
  useEffect(() => {
    const isMob = typeof window !== 'undefined' && window.innerWidth <= 900
    const activeStripes = (isMob
      ? [stripe1MobRef.current, stripe2MobRef.current, stripe3MobRef.current]
      : [stripe1Ref.current, stripe2Ref.current, stripe3Ref.current]
    ).filter(Boolean)

    const allStripes = [
      stripe1Ref.current, stripe2Ref.current, stripe3Ref.current,
      stripe1MobRef.current, stripe2MobRef.current, stripe3MobRef.current
    ].filter(Boolean)

    // Mede o comprimento exato dos caminhos com valores estritamente positivos (100% WebKit/Safari safe)
    const getLen = (path) => {
      let l = 0
      try {
        l = path.getTotalLength() || 0
      } catch (e) { }
      return l > 50 ? Math.ceil(l) + 20 : (isMob ? 800 : 1600)
    }

    if (!isIntroFinished) {
      // Estado inicial oculto aguardando a finalização da viagem do logo NOSTA
      allStripes.forEach((path) => {
        const len = getLen(path)
        gsap.set(path, {
          strokeDasharray: `${len} ${len}`,
          strokeDashoffset: len, // Positivo: perfeitamente compatível com Safari iOS e Chrome
          opacity: 0
        })
      })

      // Câmera oculta no início até o preloader terminar e as listras entrarem
      const cameraStage = document.querySelector('.unified-camera-sticky-stage')
      if (cameraStage) {
        gsap.set(cameraStage, { opacity: 0, scale: 0.85, y: 30 })
      }

      // Demais elementos de conteúdo ocultos
      const contentElements = [
        eyebrowRef.current,
        menuContainerRef.current,
        rightCopyRef.current,
        bottomCardRef.current,
        scrollIndicatorRef.current,
        gridLinesRef.current
      ].filter(Boolean)
      gsap.set(contentElements, { opacity: 0, y: 15 })

      return
    }

    if (hasAnimatedHeroRef.current) return
    hasAnimatedHeroRef.current = true

    // DISPARO DA ANIMAÇÃO DE ENTRADA QUANDO O LOGO NOSTA CHEGA (idêntico ao desktop)
    const heroTl = gsap.timeline({ delay: 0.15 })

    // PASSO 1: As 3 Listras Retrô entram desenhando do topo percorrendo a curva até a esquerda
    activeStripes.forEach((path, i) => {
      const len = getLen(path)
      heroTl.fromTo(
        path,
        {
          strokeDasharray: `${len} ${len}`,
          strokeDashoffset: len,
          opacity: 1
        },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.45,
          ease: 'power3.out'
        },
        i === 0 ? 0 : 0.08 * i
      )
    })

    // PASSO 2: A Câmera 3D entra com zoom cinematográfico e levitação sutil integrada à timeline
    const cameraStage = document.querySelector('.unified-camera-sticky-stage')
    if (cameraStage) {
      heroTl.fromTo(
        cameraStage,
        {
          opacity: 0,
          scale: 0.85,
          y: 40
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          ease: 'power3.out'
        },
        '-=0.9'
      )
    }

    // PASSO 3: Linhas de grid sutis revelam
    if (gridLinesRef.current) {
      heroTl.fromTo(
        gridLinesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: 'power2.out' },
        '-=0.7'
      )
    }

    // PASSO 4: Eyebrow ("BUILT FOR PURISTS...") e Menu Superior Direito
    if (eyebrowRef.current) {
      heroTl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
    }
    if (menuContainerRef.current) {
      heroTl.fromTo(
        menuContainerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '<+=0.05'
      )
    }

    // PASSO 5: Texto Descritivo à Direita (3 linhas)
    if (rightCopyRef.current) {
      const isMob = typeof window !== 'undefined' && (window.innerWidth <= 900 || (window.innerWidth <= 1180 && window.innerHeight > window.innerWidth))
      heroTl.fromTo(
        rightCopyRef.current,
        isMob ? { opacity: 0, x: 0, y: 15 } : { opacity: 0, x: 25 },
        isMob ? { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' } : { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.5'
      )
    }

    // PASSO 6: Card Inferior Esquerdo e Indicador de Scroll
    if (bottomCardRef.current) {
      heroTl.fromTo(
        bottomCardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
    }
    if (scrollIndicatorRef.current) {
      heroTl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
    }

    return () => {
      heroTl.kill()
    }
  }, [isIntroFinished])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    tlRef.current?.timeScale(1).play()
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      tlRef.current?.timeScale(1.35).reverse()
    }, 120)
  }

  const handleToggleMenu = (e) => {
    e.stopPropagation()
    if (!tlRef.current) return
    if (tlRef.current.progress() > 0.05) {
      tlRef.current.timeScale(1.4).reverse()
    } else {
      tlRef.current.timeScale(1).play()
    }
  }

  const handleLinkClick = () => {
    tlRef.current?.timeScale(1.6).reverse()
  }

  return (
    <section
      className="nosta-hero-section"
      id="hero-nosta"
      style={{ backgroundColor: '#F2E4CC' }}
    >
      {/* Camadas de Background Vintage Cinematográfico (Iluminação de Estúdio & Grão Analógico) */}
      <div className="nosta-hero-lighting" aria-hidden="true" />
      <div className="nosta-hero-grain" aria-hidden="true" />

      {/* Poster imediato e camada atmosférica de vídeo (vídeo inicia apenas após a intro) */}
      <img
        src="/hero7/smoke-poster.webp"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        className="nosta-hero-smoke opacity-100"
      />
      {isIntroFinished && (typeof window === 'undefined' || window.innerWidth > 900) ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero7/smoke-poster.webp"
          className="nosta-hero-smoke"
          aria-hidden="true"
        >
          <source src="/hero7/smoke-optimized.webm" type="video/webm" />
          <source src="/hero7/smoke-optimized.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/hero7/smoke-poster.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          className="nosta-hero-smoke opacity-100"
        />
      )}

      {/* Listras Retrô Anos 70 (Terracota #C66736, Mostarda #D58334, Verde Oliva #85713E) */}
      <div
        className="nosta-retro-stripes-container"
        aria-hidden="true"
      >
        {/* Shared SVG Defs para Filtros Vintage */}
        <svg
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="retroStripeGrain" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.25   0 0 0 0 0.15   0 0 0 0 0.08  0 0 0 0.42 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="grainPattern" />
              <feBlend mode="multiply" in="grainPattern" in2="SourceGraphic" result="blend1" />
              <feBlend mode="overlay" in="grainPattern" in2="blend1" />
            </filter>
          </defs>
        </svg>

        {/* Versão Desktop (1792 x 858) */}
        <svg
          className="nosta-retro-stripes-svg nosta-stripes-desktop"
          viewBox="0 0 1792 858"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grupo de Listras animadas de cima até a esquerda */}
          <g filter="url(#retroStripeGrain)">
            {/* Listra 1: Terracota #C66736 */}
            <path
              ref={stripe1Ref}
              d="M 1104 -50 L 1104 206 A 142 142 0 0 1 962 348 L -50 348"
              stroke="#C66736"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />

            {/* Listra 2: Laranja Mostarda #D58334 */}
            <path
              ref={stripe2Ref}
              d="M 1172 -50 L 1172 206 A 210 210 0 0 1 962 416 L -50 416"
              stroke="#D58334"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />

            {/* Listra 3: Verde Oliva Vintage #85713E */}
            <path
              ref={stripe3Ref}
              d="M 1240 -50 L 1240 206 A 278 278 0 0 1 962 484 L -50 484"
              stroke="#85713E"
              strokeWidth="60"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          </g>
        </svg>

        {/* Versão Mobile e Tablet Retrato (100% Estático, Idêntico ao Desktop, Ultra Fluido) */}
        <svg
          className="nosta-retro-stripes-svg nosta-stripes-mobile"
          viewBox="0 0 390 844"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="nosta-stripes-mobile-group">
            {/* Listra 1 (Mais interna / Superior na curva): Terracota #C66736 */}
            <path
              ref={stripe1MobRef}
              d="M 310 -40 L 310 337 A 36 36 0 0 1 274 373 L -40 373"
              stroke="#C66736"
              strokeWidth="22"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />

            {/* Listra 2 (Meio): Laranja Mostarda #D58334 */}
            <path
              ref={stripe2MobRef}
              d="M 336 -40 L 336 337 A 62 62 0 0 1 274 399 L -40 399"
              stroke="#D58334"
              strokeWidth="22"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />

            {/* Listra 3 (Mais externa / Inferior na curva): Verde Oliva Vintage #85713E */}
            <path
              ref={stripe3MobRef}
              d="M 362 -40 L 362 337 A 88 88 0 0 1 274 425 L -40 425"
              stroke="#85713E"
              strokeWidth="22"
              strokeLinecap="butt"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          </g>
        </svg>

        {/* Camada tátil de micro-textura áspera de papel impresso dos anos 70 */}
        <div className="nosta-stripes-grain-overlay" aria-hidden="true" />
      </div>

      {/* Linhas Sutis de Grid Arquitetural / Editorial */}
      <div className="nosta-grid-lines" ref={gridLinesRef} aria-hidden="true">
        <span className="nosta-grid-line nosta-grid-line-1" />
        <span className="nosta-grid-line nosta-grid-line-2" />
      </div>

      {/* Elemento 01 — Texto Superior Esquerdo */}
      <div className="nosta-eyebrow-wrapper" ref={eyebrowRef}>
        <span className="nosta-eyebrow-dot" aria-hidden="true" />
        <span className="nosta-eyebrow-text">BUILT FOR PURISTS. CRAFTED FOR MEMORIES.</span>
      </div>

      {/* Elemento 02 — Logo Gigante NOSTA. */}
      <h1 className="nosta-hero-title">
        NOSTA<span className="nosta-hero-dot">.</span>
      </h1>

      {/* Elemento 03 — Menu Superior Direito Fluido GSAP */}
      <div
        className="nosta-menu-container"
        ref={menuContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleToggleMenu}
      >
        <div className="nosta-menu-capsule" ref={capsuleRef}>
          <div className="nosta-capsule-header">
            <span className="nosta-capsule-title" ref={titleRef}>Menu</span>
            <span className="nosta-capsule-dots-wrapper" ref={dotsRef} aria-hidden="true">
              <span className="nosta-capsule-dot" />
              <span className="nosta-capsule-dot" />
            </span>
          </div>

          <nav className="nosta-capsule-nav" ref={navRef} aria-label="Navegação do Menu">
            {[
              { label: 'Product', href: '#camera' },
              { label: 'About Us', href: '#about' },
              { label: 'Blogs', href: '#specs' },
              { label: 'Contact', href: '#contact' }
            ].map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="nosta-capsule-link"
                ref={(el) => { linksRef.current[index] = el }}
                onClick={handleLinkClick}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Elemento 04 — Âncora Palco Central Câmera */}
      <div className="nosta-camera-stage-wrapper" aria-hidden="true" />

      {/* Elemento 05 — Texto Descritivo à Direita (3 linhas) */}
      <div className="nosta-hero-right-copy" ref={rightCopyRef}>
        <span className="nosta-copy-line">Designed to capture, preserve, and inspire.</span>
        <span className="nosta-copy-line">Nosta brings the timeless tactile magic</span>
        <span className="nosta-copy-line">of 35mm film into your hands.</span>
      </div>

      {/* Elemento 06 — Card Inferior Esquerdo */}
      <div className="nosta-hero-bottom-card" ref={bottomCardRef}>
        <div className="nosta-card-headline">
          DESIGNED FOR PURISTS, THE TIMELESS ANALOG SYSTEM.
        </div>
        <div className="nosta-card-divider" />
        <div className="nosta-card-subtext">
          The world's most beautifully crafted 35mm reusable camera.
        </div>
      </div>

      {/* Elemento 07 — Scroll Inferior Direito */}
      <a
        href="#specs"
        className="nosta-hero-scroll-indicator"
        ref={scrollIndicatorRef}
      >
        <span>↓ SCROLL TO CONTINUE</span>
      </a>
    </section>
  )
}
