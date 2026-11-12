import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import NostaHero from './components/NostaHero'
import HeroIntroPreloader from './components/HeroIntroPreloader'
import { DEFAULT_CAMERA_COLOR } from './data/cameraColors'
import './App.css'

// Code splitting: heavy 3D WebGL stage & below-the-fold sections load asynchronously
const Camera3DViewer = lazy(() => import('./components/Camera3DViewer'))
const AboutSection = lazy(() => import('./components/AboutSection'))
const MenuSection = lazy(() => import('./components/MenuSection'))
const FeaturesCardsFlow = lazy(() => import('./components/FeaturesCardsFlow'))
const CtaSection = lazy(() => import('./components/CtaSection'))
const FooterSection = lazy(() => import('./components/FooterSection'))

export default function App() {
  const [cameraColor, setCameraColor] = useState(DEFAULT_CAMERA_COLOR)
  const [introFinished, setIntroFinished] = useState(false)
  const [mountCamera, setMountCamera] = useState(false)
  const [mountBelowFold, setMountBelowFold] = useState(false)

  useEffect(() => {
    if (!introFinished) return undefined
    const rafId = requestAnimationFrame(() => setMountCamera(true))
    const belowFoldTimer = setTimeout(() => setMountBelowFold(true), 120)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(belowFoldTimer)
    }
  }, [introFinished])

  const handleRevealStart = useCallback(() => {
    document.getElementById('boot-curtain')?.remove()
    document.documentElement.style.backgroundColor = '#F2E4CC'
    document.body.style.backgroundColor = '#F2E4CC'
  }, [])

  const handleIntroComplete = useCallback(() => {
    document.getElementById('boot-curtain')?.remove()
    document.documentElement.style.backgroundColor = '#F2E4CC'
    document.body.style.backgroundColor = '#F2E4CC'
    setIntroFinished(true)
    window.lenis?.start()
  }, [])

  // Initialize Lenis Smooth Scroll without triggering React state re-renders on scroll
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return undefined
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
    lenis.scrollTo(0, { immediate: true })
    lenis.stop()

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const targetId = anchor.getAttribute('href')
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement, {
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
        }
      }
    }

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }

    document.addEventListener('click', handleAnchorClick)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  useEffect(() => {
    if (!window.lenis) return
    if (!introFinished) {
      window.lenis.scrollTo(0, { immediate: true })
      window.lenis.stop()
    } else {
      window.lenis.start()
    }
  }, [introFinished])

  return (
    <div className="app-container theme-light" id="hero-landing">
      {/* 35mm Subtle Film Grain Overlay */}
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* Visual Entrance Effect: Pill Capsule Shutter Reveal */}
      {!introFinished && (
        <HeroIntroPreloader
          onRevealStart={handleRevealStart}
          onComplete={handleIntroComplete}
        />
      )}

      {/* MASTER UNIFIED 3D CAMERA FLOW */}
      <div className="master-camera-flow-wrapper">
        <div className="unified-camera-sticky-stage">
          <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <Suspense fallback={null}>
              {mountCamera && <Camera3DViewer cameraColor={cameraColor} />}
            </Suspense>
          </div>
        </div>

        {/* 1. HERO VIEWPORT */}
        <NostaHero isIntroFinished={introFinished} />

        {/* 2–5. LAZY BELOW-THE-FOLD SECTIONS (montam após a intro para 0 travamento no preloader) */}
        {mountBelowFold && (
          <Suspense fallback={null}>
            <AboutSection />
            <MenuSection />
            <FeaturesCardsFlow />
            <CtaSection selectedColor={cameraColor} onSelectColor={setCameraColor} />
          </Suspense>
        )}
      </div>

      {/* 6. FOOTER */}
      {mountBelowFold && (
        <Suspense fallback={null}>
          <FooterSection />
        </Suspense>
      )}
    </div>
  )
}
