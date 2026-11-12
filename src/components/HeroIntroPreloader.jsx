import React, { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import './HeroIntroPreloader.css'

export default function HeroIntroPreloader({ onRevealStart, onComplete }) {
  const containerRef = useRef(null)
  const curtainRef = useRef(null)
  const progressRef = useRef(null)
  const progressBarRef = useRef(null)
  const logoDarkRef = useRef(null)
  const logoBeigeRef = useRef(null)
  const maskRef = useRef(null)
  const footerRef = useRef(null)

  const onRevealStartRef = useRef(onRevealStart)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onRevealStartRef.current = onRevealStart
    onCompleteRef.current = onComplete
  })

  useLayoutEffect(() => {
    document.getElementById('boot-curtain')?.remove()
    const container = containerRef.current
    const curtainEl = curtainRef.current
    const progressEl = progressRef.current
    const progressBar = progressBarRef.current
    const logoDarkEl = logoDarkRef.current
    const logoBeigeEl = logoBeigeRef.current
    const maskEl = maskRef.current
    const footerEl = footerRef.current

    if (
      !container ||
      !curtainEl ||
      !progressEl ||
      !progressBar ||
      !logoDarkEl ||
      !logoBeigeEl ||
      !maskEl ||
      !footerEl
    ) {
      return
    }

    // Função idempotente para popular os caracteres com máscara
    function populateChars(el) {
      el.innerHTML = ''
      const nodes = []
      const text = 'NOSTA.'
      ;[...text].forEach((ch) => {
        const mask = document.createElement('span')
        mask.className = 'hero7-inline-mask'
        const inner = document.createElement('span')
        inner.className = ch === '.' ? 'hero7-inline-char hero7-dot' : 'hero7-inline-char'
        inner.textContent = ch
        mask.appendChild(inner)
        el.appendChild(mask)
        nodes.push(inner)
      })
      return nodes
    }

    // Função idempotente para popular as linhas da legenda
    function populateFooter(el) {
      el.innerHTML = ''
      const lines = [
        'NOSTA® — A essência da fotografia analógica',
        'com design atemporal e ótica artesanal.'
      ]
      const nodes = []
      lines.forEach((lineText) => {
        const lineMask = document.createElement('span')
        lineMask.className = 'hero7-line-mask'
        const line = document.createElement('span')
        line.className = 'hero7-reveal-line'
        line.textContent = lineText
        lineMask.appendChild(line)
        el.appendChild(lineMask)
        nodes.push(line)
      })
      return nodes
    }

    const logoCharsDark = populateChars(logoDarkEl)
    const logoCharsBeige = populateChars(logoBeigeEl)
    const allLogoChars = [...logoCharsDark, ...logoCharsBeige]
    const footerLines = populateFooter(footerEl)

    // Contexto GSAP que limpa e reconstrói perfeitamente em React StrictMode
    const ctx = gsap.context(() => {
      // 1. Cortina sólida bloqueando totalmente o Hero
      gsap.set(curtainEl, { opacity: 1, display: 'block' })
      // 2. Máscara oculta até a hora da abertura
      gsap.set(maskEl, { scale: 1, opacity: 0, transformOrigin: 'center center' })
      // 3. Tipografia e barra de progresso no estado inicial
      gsap.set(allLogoChars, { xPercent: 100 })
      gsap.set(footerLines, { yPercent: 100 })
      gsap.set(progressBar, { clipPath: 'inset(0% 100% 0% 0% round 999px)' })
      gsap.set(progressEl, { scale: 0.86, opacity: 1 })

      // Simulação de preenchimento da barra
      function animateProgress(duration = 2.0) {
        const ptl = gsap.timeline()
        const counterSteps = 3
        let currentProgress = 0

        for (let i = 0; i < counterSteps; i++) {
          const finalStep = i === counterSteps - 1
          const targetProgress = finalStep
            ? 1
            : Math.min(currentProgress + Math.random() * 0.35 + 0.15, 0.88)
          currentProgress = targetProgress

          const clipRight = Math.max(0, (1 - targetProgress) * 100)
          ptl.to(progressBar, {
            clipPath: `inset(0% ${clipRight}% 0% 0% round 999px)`,
            duration: duration / counterSteps,
            ease: 'power3.out',
            onComplete: () => {
              if (finalStep) {
                progressBar.style.clipPath = 'none'
                progressEl.style.backgroundColor = '#F2E4CC'
              }
            }
          })
        }
        return ptl
      }

      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          if (container) {
            container.style.display = 'none'
          }
          onCompleteRef.current?.()
        }
      })

      // Animação 1: Cápsula entra
      tl.to(progressEl, {
        scale: 1,
        duration: 0.7,
        ease: 'power4.out'
      })
        // Animação 2: Letras do logotipo entram deslizando
        .to(
          allLogoChars,
          {
            xPercent: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power4.inOut'
          },
          '<'
        )
        // Animação 3: Legenda inferior sobe
        .to(
          footerLines,
          {
            yPercent: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power4.inOut'
          },
          '0.15'
        )
        // Animação 4: Barra bege avança revelando o texto em Marrom
        .add(animateProgress(2.0), '<')
        // Animação 5: Legenda inferior sai
        .to(
          footerLines,
          {
            yPercent: -100,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power4.inOut'
          },
          '+=0.1'
        )
        // Preparação para a transição: libertar overflow e ocultar elementos não necessários
        .add(() => {
          if (progressEl) {
            progressEl.style.overflow = 'visible'
            progressEl.style.backgroundColor = 'transparent'
          }
          if (progressBar) {
            progressBar.style.overflow = 'visible'
            progressBar.style.backgroundColor = 'transparent'
          }
          if (logoDarkEl) {
            logoDarkEl.style.display = 'none'
          }
        })
        // Ativar máscara e ocultar cortina sólida para revelação do Hero
        .set(maskEl, { opacity: 1 })
        .set(curtainEl, { display: 'none' })
        // Animação 6 & 7: Transição do NOSTA da cápsula para a Hero
        .to(
          maskEl,
          {
            scale: 8.5,
            duration: 1.6,
            ease: 'power3.inOut',
            onStart: () => {
              onRevealStartRef.current?.()
              const heroTitle = document.querySelector('.nosta-hero-title')
              if (heroTitle && logoBeigeEl) {
                const sourceRect = logoBeigeEl.getBoundingClientRect()
                const targetRect = heroTitle.getBoundingClientRect()

                const scaleRatio = sourceRect.width / targetRect.width
                const deltaX = (sourceRect.left + sourceRect.width / 2) - (targetRect.left + targetRect.width / 2)
                const deltaY = (sourceRect.top + sourceRect.height / 2) - (targetRect.top + targetRect.height / 2)

                // Esconde o clone da cápsula
                logoBeigeEl.style.opacity = '0'

                // Coloca o título nativo da Hero na cápsula e faz ele expandir perfeitamente
                gsap.fromTo(
                  heroTitle,
                  {
                    x: deltaX,
                    y: deltaY,
                    scale: scaleRatio,
                    transformOrigin: '50% 50%',
                    opacity: 1,
                    visibility: 'visible'
                  },
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.6,
                    ease: 'power3.inOut',
                    overwrite: 'auto'
                  }
                )
              }
            }
          }
        )
        // Animação 8: Fade out sutil da máscara
        .to(
          maskEl,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out'
          },
          '-=0.35'
        )
    }, container)

    return () => {
      // Revert apenas do container local do preloader
      ctx.revert()
      // Garante que o título da Hero nunca suma caso o preloader seja desmontado
      const heroTitle = document.querySelector('.nosta-hero-title')
      if (heroTitle) {
        gsap.set(heroTitle, { opacity: 1, visibility: 'visible', clearProps: 'transform' })
      }
    }
  }, []) // Nunca reinicia em eventos de scroll

  return (
    <aside className="hero7-preloader" ref={containerRef} aria-label="Introdução do site" aria-live="polite">
      {/* 1. Cortina sólida */}
      <div className="hero7-solid-curtain" ref={curtainRef}></div>

      {/* 2. Máscara recortada SVG */}
      <div className="hero7-mask" ref={maskRef}></div>

      {/* 3. Cápsula com texto dual */}
      <div className="hero7-progress" ref={progressRef}>
        {/* Camada Base: Fundo escuro com texto Bege */}
        <div className="hero7-logo-layer hero7-text-dark">
          <h1 ref={logoDarkRef} aria-label="NOSTA." />
        </div>

        {/* Camada Progresso: Preenchimento Bege revelando texto Marrom (#432817) */}
        <div className="hero7-progress-fill" ref={progressBarRef}>
          <div className="hero7-logo-layer hero7-text-beige">
            <h1 ref={logoBeigeRef} aria-label="NOSTA." />
          </div>
        </div>
      </div>

      {/* 4. Legenda */}
      <div className="hero7-content">
        <div className="hero7-footer">
          <p ref={footerRef} id="hero7-preloader-footer"></p>
        </div>
      </div>
    </aside>
  )
}
