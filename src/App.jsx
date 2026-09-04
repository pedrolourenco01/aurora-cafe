import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronLeft, Menu as MenuIcon, X as CloseIcon, MapPin, ShoppingBag } from 'lucide-react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Cup3DViewer from './components/Cup3DViewer'
import FloatingIngredients from './components/FloatingIngredients'
import AboutSection from './components/AboutSection'
import MenuSection from './components/MenuSection'
import CurvedTextScrollSection from './components/CurvedTextScrollSection'
import WhyVisitSection from './components/WhyVisitSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import FooterSection from './components/FooterSection'
import { SKINS } from './data/skins'
import './App.css'

const EASING = [0.19, 1, 0.22, 1]

// Steaming Hot Takeaway Coffee Cup Icon for Aurora Café
function HotCoffeeCupIcon({ size = 34, className = "" }) {
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
          <linearGradient id="gsapSteamGrad" x1="0" y1="10" x2="0" y2="-6" gradientUnits="userSpaceOnUse">
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
            stroke="url(#gsapSteamGrad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="gsap-steam-path gsap-steam-1"
          />
          <path
            d="M18.5 10 C21 7, 16.5 4, 19.5 0.5 C22.5 -3, 17.5 -6, 20 -9"
            stroke="url(#gsapSteamGrad)"
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

// Aurora Café Logo with animated steaming cup and centered "CAFÉ"
function AuroraCafeLogo() {
  return (
    <a href="#hero-landing" className="brand-center-link" aria-label="Aurora Café">
      <HotCoffeeCupIcon size={34} className="brand-cup-icon" />
      <div className="brand-text-stacked">
        <span className="brand-name-aurora">Aurora</span>
        <span className="brand-name-cafe">CAFÉ</span>
      </div>
    </a>
  )
}

export default function App() {
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [windowHeight, setWindowHeight] = useState(() => typeof window !== 'undefined' ? window.innerHeight : 800)

  const handlePrevSkin = () => {
    setCurrentSkinIndex((prev) => (prev - 1 + SKINS.length) % SKINS.length)
  }

  const handleNextSkin = () => {
    setCurrentSkinIndex((prev) => (prev + 1) % SKINS.length)
  }

  const currentSkin = SKINS[currentSkinIndex]

  // Track window resizing
  useLayoutEffect(() => {
    const handleWinResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleWinResize)
    return () => window.removeEventListener('resize', handleWinResize)
  }, [])

  const isDesktop = windowWidth > 1024
  const isTablet = windowWidth <= 1024 && windowWidth > 768
  const isMobile = windowWidth <= 768

  // Initialize Global Awwwards-Grade Lenis Smooth Scroll with Continuous Liquid Inertia
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      const onNativeScroll = () => setScrollY(window.scrollY || 0)
      window.addEventListener('scroll', onNativeScroll, { passive: true })
      return () => window.removeEventListener('scroll', onNativeScroll)
    }

    const lenis = new Lenis({
      lerp: 0.065,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.75,
      autoRaf: true,
      anchors: true,
    })

    window.lenis = lenis

    lenis.on('scroll', ({ scroll }) => {
      setScrollY(scroll)
    })

    setScrollY(window.scrollY || 0)

    // Smooth scroll for internal anchor links (#about, #menu, etc.)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const targetId = anchor.getAttribute('href')
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          setIsMobileMenuOpen(false)
          lenis.scrollTo(targetElement, { duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  // Synchronize full page body background
  useEffect(() => {
    document.body.style.backgroundColor = currentSkin.bgColor
    document.body.style.transition = 'background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
  }, [currentSkin.bgColor])

  // Measure dynamic hero stage center for 100% pixel-perfect alignment on any device
  const heroAnchorRef = useRef(null)
  const [heroPos, setHeroPos] = useState({ x: 360, y: 0 })

  useLayoutEffect(() => {
    const updateHeroPosition = () => {
      if (heroAnchorRef.current) {
        const rect = heroAnchorRef.current.getBoundingClientRect()
        const centerX = (rect.left + rect.width / 2) - (window.innerWidth / 2)
        const centerY = (rect.top + rect.height / 2) - (window.innerHeight / 2)
        setHeroPos({ x: centerX, y: centerY })
      }
    }

    updateHeroPosition()
    const timer = setTimeout(updateHeroPosition, 120)
    window.addEventListener('resize', updateHeroPosition)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateHeroPosition)
    }
  }, [windowWidth, windowHeight, currentSkinIndex])

  // Screen metrics & 3D Cup Flight Math (Active exclusively on Desktop)
  const heroH = windowHeight || 800
  const landingScroll = heroH * 0.90
  const flightProgress = isDesktop ? Math.min(1.0, Math.max(0, scrollY / landingScroll)) : 0

  // 1. Horizontal positioning: glides from hero stage center directly into About center (0px) on desktop
  const cupX = isDesktop ? `${(1 - flightProgress) * heroPos.x}px` : `${heroPos.x}px`

  // 2. Vertical positioning:
  // - On Desktop: flies smoothly from Hero down into About and locks 1:1 to the About pedestal
  // - On Mobile/Tablet: static in Hero, no descent animation
  const targetAboutY = 305
  let cupY = isDesktop 
    ? `${(1 - flightProgress) * heroPos.y + flightProgress * targetAboutY}px` 
    : `${heroPos.y - scrollY}px`

  if (isDesktop && scrollY > landingScroll) {
    const scrollBeyondAbout = scrollY - landingScroll
    cupY = `${targetAboutY - scrollBeyondAbout}px`
  }

  // Adaptive scale of 3D cup
  const cupScale = 1.0

  return (
    <div
      className={`app-container theme-${currentSkin.themeMode}`}
      id="hero-landing"
    >
      {/* PERSISTENT GLOBAL 3D CUP STAGE (Desktop Only: Transits across Hero and About with dynamic in-flight tilt) */}
      {isDesktop && (
        <div
          className="global-3d-cup-stage"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="global-3d-cup-mover"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              height: '520px',
              transform: `translate3d(${cupX}, ${cupY}, 0) scale(${cupScale})`,
              pointerEvents: 'none',
              willChange: 'transform',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.84, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.25,
                ease: EASING,
                delay: 0.40
              }}
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <Cup3DViewer
                currentSkin={currentSkin}
                currentSkinIndex={currentSkinIndex}
                isInteractive={false}
                scrollProgress={flightProgress}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* 1. DEDICATED HERO VIEWPORT SECTION */}
      <section
        className="hero-section"
        style={{
          '--theme-bg': currentSkin.bgColor,
          '--theme-text': currentSkin.textColor,
          '--theme-text-subtle': currentSkin.textSubtle,
          '--theme-pill-bg': currentSkin.pillBg,
          '--theme-btn-primary-bg': currentSkin.btnPrimaryBg,
          '--theme-btn-primary-text': currentSkin.btnPrimaryText,
          '--theme-btn-secondary-border': currentSkin.btnSecondaryBorder,
          '--theme-btn-secondary-text': currentSkin.btnSecondaryText,
          backgroundColor: currentSkin.bgColor
        }}
      >
        {/* Static Navbar at the top of Hero */}
        <motion.header
          className="navbar-wrapper"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: EASING, delay: 0.1 }}
        >
          <div className="navbar-container-outer">
            <nav className="navbar-inner" aria-label="Navegação Principal">
              {/* Left Nav Menu Links (Desktop) */}
              <div className="nav-links-left">
                <a href="#about" className="nav-link-item">SOBRE</a>
                <a href="#menu" className="nav-link-item">CARDÁPIO</a>
                <a href="#gallery" className="nav-link-item">GALERIA</a>
                <a href="#location" className="nav-link-item">VISITE</a>
              </div>

              {/* Center: Aurora Café Logo */}
              <div className="nav-brand-center">
                <AuroraCafeLogo />
              </div>

              {/* Right: Order Now Button & Mobile Hamburger Toggle */}
              <div className="nav-actions-right">
                <a href="#menu" className="nav-order-btn" aria-label="Fazer Pedido">
                  <span className="btn-text-roll">
                    <span className="btn-text-primary">PEDIR AGORA</span>
                    <span className="btn-text-secondary" aria-hidden="true">PEDIR AGORA</span>
                  </span>
                </a>

                {/* Mobile Menu Hamburger Button */}
                <button
                  type="button"
                  className="nav-mobile-toggle-btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
                </button>
              </div>
            </nav>
          </div>
        </motion.header>

        {/* Mobile Navigation Drawer Modal */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="mobile-nav-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease: EASING }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mobile-nav-header">
                  <AuroraCafeLogo />
                  <button
                    type="button"
                    className="mobile-nav-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Fechar Menu"
                  >
                    <CloseIcon size={24} />
                  </button>
                </div>

                <div className="mobile-nav-links-list">
                  <a
                    href="#about"
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-num">01</span>
                    <span className="mobile-nav-title">SOBRE</span>
                  </a>
                  <a
                    href="#menu"
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-num">02</span>
                    <span className="mobile-nav-title">CARDÁPIO</span>
                  </a>
                  <a
                    href="#gallery"
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-num">03</span>
                    <span className="mobile-nav-title">GALERIA</span>
                  </a>
                  <a
                    href="#location"
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-num">04</span>
                    <span className="mobile-nav-title">VISITE</span>
                  </a>
                </div>

                <div className="mobile-nav-footer">
                  <a
                    href="#menu"
                    className="mobile-nav-order-cta"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag size={18} />
                    <span>FAZER PEDIDO</span>
                  </a>
                  <div className="mobile-nav-subinfo">
                    <p className="mobile-nav-address">
                      <MapPin size={15} />
                      <span>Rua Oscar Freire, 1052 — Jardins, SP</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Dynamic Flavor Ingredients Layer (Confined strictly to Hero Viewport) */}
        <FloatingIngredients currentSkin={currentSkin} />

        {/* Split Hero: Text on Left, 3D Cup Anchor on Right */}
        <div className="hero-split-layout">
          {/* Left Column: Flavor Typography & Details */}
          <div className="hero-split-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`flavor-card-${currentSkin.id}`}
                className="flavor-content-card"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.10,
                      delayChildren: 0.12,
                    }
                  },
                  exit: {
                    opacity: 0,
                    y: -14,
                    transition: { duration: 0.25, ease: EASING }
                  }
                }}
              >
                {/* Stacked Flavor Title with Staggered Entrance (Enters 1st) */}
                <div className="flavor-hero-title-group">
                  <motion.div
                    className="flavor-title-line-1"
                    style={{ color: currentSkin.titleLine1Color }}
                    variants={{
                      hidden: { opacity: 0, y: 22, filter: 'blur(3px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.80, ease: EASING }
                      }
                    }}
                  >
                    {currentSkin.titleLine1}
                  </motion.div>

                  <motion.div
                    className="flavor-title-line-2 flavor-title-accent"
                    style={{ color: currentSkin.titleLine2Color }}
                    variants={{
                      hidden: { opacity: 0, y: 26, filter: 'blur(3px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.85, ease: EASING }
                      }
                    }}
                  >
                    {currentSkin.titleLine2}
                  </motion.div>
                </div>

                {/* Subtext Section (Sobre o Sabor) */}
                <motion.div
                  className="flavor-story-section"
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.75, ease: EASING }
                    }
                  }}
                >
                  <div className="flavor-story-header">
                    <span className="flavor-story-label">{currentSkin.storyLabel}</span>
                    <motion.div
                      className="flavor-story-line"
                      style={{ backgroundColor: currentSkin.titleLine2Color }}
                      variants={{
                        hidden: { scaleX: 0, originX: 0 },
                        visible: {
                          scaleX: 1,
                          originX: 0,
                          transition: { duration: 0.90, ease: EASING }
                        }
                      }}
                    />
                  </div>
                  <p className="flavor-story-description">
                    {currentSkin.description}
                  </p>
                </motion.div>

                {/* Clean Pill Button */}
                <motion.div
                  className="flavor-cta-row"
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.70, ease: EASING }
                    }
                  }}
                >
                  <a href="#order-now" className="flavor-cta-btn" aria-label={`Pedir ${currentSkin.name}`}>
                    <span className="btn-text-roll">
                      <span className="btn-text-primary">{currentSkin.ctaText}</span>
                      <span className="btn-text-secondary" aria-hidden="true">{currentSkin.ctaText}</span>
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Hero Stage Anchor & Static Hero Controls */}
          <div className="hero-split-right" ref={heroAnchorRef}>
            {!isDesktop && (
              <div className="hero-mobile-cup-stage">
                <Cup3DViewer
                  currentSkinIndex={currentSkinIndex}
                  currentSkin={currentSkin}
                  isInteractive={false}
                  scrollProgress={0}
                />
              </div>
            )}
            <motion.div
              className="cup-bottom-controls"
              initial={{ opacity: 0, x: isDesktop ? "-50%" : "0%", y: 18 }}
              animate={{
                opacity: isDesktop ? (scrollY > 60 ? 0 : 1) : 1,
                x: isDesktop ? "-50%" : "0%",
                y: isDesktop ? (scrollY > 60 ? 16 : 0) : 0,
                pointerEvents: isDesktop ? (scrollY > 60 ? 'none' : 'auto') : 'auto',
              }}
              transition={{ duration: 0.35, ease: EASING }}
            >
              <button
                className="cup-minimal-arrow-btn"
                onClick={handlePrevSkin}
                aria-label="Sabor Anterior"
              >
                <ChevronLeft size={!isDesktop ? 24 : 16} strokeWidth={!isDesktop ? 1.8 : 2.5} />
              </button>

              <div className="cup-flavor-indicators">
                {SKINS.map((skin, idx) => (
                  <button
                    key={`dot-${skin.id}`}
                    className={`cup-dot-indicator ${idx === currentSkinIndex ? 'active' : ''}`}
                    onClick={() => setCurrentSkinIndex(idx)}
                    aria-label={`Ver ${skin.name}`}
                  />
                ))}
              </div>

              <button
                className="cup-minimal-arrow-btn"
                onClick={handleNextSkin}
                aria-label="Próximo Sabor"
              >
                <ChevronRight size={!isDesktop ? 24 : 16} strokeWidth={!isDesktop ? 1.8 : 2.5} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT / ESSÊNCIA SECTION */}
      <AboutSection
        currentSkin={currentSkin}
        currentSkinIndex={currentSkinIndex}
        isDesktop={isDesktop}
      />

      {/* 3. MENU / CARDÁPIO SECTION */}
      <MenuSection />

      {/* 4. CURVED TEXT ON PATH SCROLL ANIMATION (Scroll Animation 1) */}
      <CurvedTextScrollSection
        idPrefix="menu-bottom"
        text="✦ CAFÉ DE ALTITUDE ✦ TORRA ARTESANAL ✦ ALQUIMIA SENSORIAL ✦"
      />

      {/* 5. WHY VISIT / EXPERIÊNCIA SECTION */}
      <WhyVisitSection />

      {/* 6. CURVED TEXT ON PATH SCROLL ANIMATION (Scroll Animation 2 - antes da Galeria) */}
      <CurvedTextScrollSection
        idPrefix="gallery-top"
        text="✦ CAFÉ DE ALTITUDE ✦ TORRA ARTESANAL ✦ ALQUIMIA SENSORIAL ✦"
      />

      {/* 7. GALERIA SENSORIAL (Print 1 & 2 - 4 Imagens) */}
      <GallerySection />

      {/* 8. LOCALIZAÇÃO & MAPA SECTION */}
      <LocationSection />

      {/* 9. FINAL FOOTER SECTION (Reference-Aligned) */}
      <FooterSection />
    </div>
  )
}
