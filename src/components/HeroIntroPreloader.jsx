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

    // Garante leitura do fontSize original do CSS mesmo após re-execução do StrictMode / HMR
    ;[logoDarkEl, logoBeigeEl].forEach((el) => {
      el.style.fontFamily = ''
      el.style.fontSize = ''
      el.style.fontWeight = ''
      el.style.lineHeight = ''
      el.style.letterSpacing = ''
    })

    // Espelha tipografia e kerning exatos da Hero mantendo a entrada letra a letra original
    const heroTitleAtMount = document.querySelector('.nosta-hero-title')
    const heroCs = heroTitleAtMount ? getComputedStyle(heroTitleAtMount) : null
    const pillFontPx = parseFloat(getComputedStyle(logoDarkEl).fontSize) || 96
    const heroFontPx = heroCs ? parseFloat(heroCs.fontSize) || pillFontPx : pillFontPx
    const pillScale = heroFontPx > 0 ? pillFontPx / heroFontPx : 1

    ;[logoDarkEl, logoBeigeEl].forEach((el) => {
      if (heroCs) {
        el.style.fontFamily = heroCs.fontFamily
        el.style.fontSize = heroCs.fontSize
        el.style.fontWeight = heroCs.fontWeight
        el.style.lineHeight = heroCs.lineHeight
        el.style.letterSpacing = heroCs.letterSpacing
      }
    })

    // Mede offsets nativos de cada caractere na Hero (inclui kerning entre pares como T-A)
    let heroCharLeftOffsets = null
    if (heroTitleAtMount && heroTitleAtMount.firstChild?.nodeType === Node.TEXT_NODE) {
      const textNode = heroTitleAtMount.firstChild
      const dotSpan = heroTitleAtMount.querySelector('.nosta-hero-dot')
      const heroBaseLeft = heroTitleAtMount.getBoundingClientRect().left
      const range = document.createRange()
      heroCharLeftOffsets = []
      for (let i = 0; i < Math.min(textNode.textContent.length, 5); i++) {
        range.setStart(textNode, i)
        range.setEnd(textNode, i + 1)
        heroCharLeftOffsets.push(range.getBoundingClientRect().left - heroBaseLeft)
      }
      if (dotSpan) {
        heroCharLeftOffsets.push(dotSpan.getBoundingClientRect().left - heroBaseLeft)
      }
    }

    // Função idempotente para popular os caracteres com máscara mantendo espaçamento exato da Hero
    function populateChars(el) {
      el.innerHTML = ''
      const masks = []
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
        masks.push(mask)
        nodes.push(inner)
      })

      if (heroCharLeftOffsets && heroCharLeftOffsets.length === masks.length) {
        gsap.set(el, { scale: 1 })
        const elRect = el.getBoundingClientRect()
        const effectiveScale = el.offsetWidth > 0 && elRect.width > 0 ? elRect.width / el.offsetWidth : 1
        const elBaseLeft = elRect.left
        const deltas = masks.map((mask, i) => {
          const rawLeft = (mask.getBoundingClientRect().left - elBaseLeft) / effectiveScale
          return heroCharLeftOffsets[i] - rawLeft
        })
        masks.forEach((mask, i) => {
          const ml = i === 0 ? deltas[0] : deltas[i] - deltas[i - 1]
          if (Math.abs(ml) > 0.05) {
            mask.style.marginLeft = `${ml}px`
          }
        })
      }

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
    const logoBeigeLayerEl = progressBar.querySelector('.hero7-text-beige')
    const heroTextureSyncEl = progressBar.querySelector('.hero7-hero-texture-sync')

    let raf1 = 0
    let raf2 = 0
    let heroTitleTween = null
    let introDone = false

    // Contexto GSAP que limpa e reconstrói perfeitamente em React StrictMode
    const ctx = gsap.context(() => {
      // 1. Cortina sólida bloqueando totalmente o Hero
      gsap.set(curtainEl, { opacity: 1, display: 'block' })
      // 2. Máscara oculta até a hora da abertura
      gsap.set(maskEl, { scale: 1, opacity: 0, transformOrigin: 'center center' })
      // 3. Tipografia e barra de progresso no estado inicial (entrada original letra a letra)
      gsap.set([logoDarkEl, logoBeigeEl], {
        scale: pillScale,
        transformOrigin: '50% 50%'
      })
      gsap.set(allLogoChars, { xPercent: 100 })
      gsap.set(footerLines, { yPercent: 100 })
      gsap.set(progressBar, { x: 0, xPercent: -100, opacity: 1, clipPath: 'none' })
      if (logoBeigeLayerEl) {
        gsap.set(logoBeigeLayerEl, { x: 0, xPercent: 100 })
      }
      gsap.set(progressEl, { scale: 0.86, opacity: 1 })

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          introDone = true
          if (container) {
            container.style.display = 'none'
          }
          onCompleteRef.current?.()
        }
      })

      // Animação 1: Cápsula entra suavemente após primeiro paint estabilizado
      tl.to(progressEl, {
        scale: 1,
        duration: 0.7,
        ease: 'power4.out'
      })
        // Animação 2: Letras do logotipo entram deslizando em sincronia nas duas camadas
        .to(
          logoCharsDark,
          {
            xPercent: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power4.inOut'
          },
          '<'
        )
        .to(
          logoCharsBeige,
          {
            xPercent: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power4.inOut'
          },
          '<'
        )
        // Animação 3: Legenda inferior sobe suavemente
        .to(
          footerLines,
          {
            yPercent: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power4.inOut'
          },
          0.15
        )
        // Animação 4: Barra com textura idêntica à Hero (sem salto visual na transição)
        .to(
          progressBar,
          {
            xPercent: 0,
            duration: 1.45,
            ease: 'power2.inOut'
          },
          0.42
        )
        .to(
          logoBeigeLayerEl,
          {
            xPercent: 0,
            duration: 1.45,
            ease: 'power2.inOut'
          },
          0.42
        )
        // Animação 5: Legenda inferior sai
        .to(
          footerLines,
          {
            yPercent: -100,
            stagger: 0.04,
            duration: 0.35,
            ease: 'power3.inOut'
          },
          '-=0.1'
        )
        // Pré-posiciona o título real da Hero atrás do clone ANTES de revelar (evita piscar 1 frame)
        .add(() => {
          const heroTitle = document.querySelector('.nosta-hero-title')
          if (heroTitle && logoBeigeEl) {
            const sourceRect = logoBeigeEl.getBoundingClientRect()
            const targetRect = heroTitle.getBoundingClientRect()
            const scaleRatio = sourceRect.width / targetRect.width
            const deltaX = (sourceRect.left + sourceRect.width / 2) - (targetRect.left + targetRect.width / 2)
            const deltaY = (sourceRect.top + sourceRect.height / 2) - (targetRect.top + targetRect.height / 2)

            gsap.set(heroTitle, {
              x: deltaX,
              y: deltaY,
              scale: scaleRatio,
              transformOrigin: '50% 50%',
              opacity: 1,
              visibility: 'visible',
              willChange: 'transform'
            })
          }
        })
        // Aguarda 2 frames para o compositor garantir o título da Hero já na cápsula antes de ocultar o clone
        .to({}, { duration: 0.034 })
        .addLabel('reveal')
        .add(() => {
          onRevealStartRef.current?.()
          if (progressEl) {
            progressEl.style.overflow = 'visible'
            progressEl.style.backgroundColor = 'transparent'
          }
          if (progressBar) {
            progressBar.style.overflow = 'visible'
            progressBar.style.backgroundColor = 'transparent'
          }
          if (heroTextureSyncEl) {
            heroTextureSyncEl.style.display = 'none'
          }
          if (logoDarkEl) {
            logoDarkEl.style.display = 'none'
          }
          if (logoBeigeEl) {
            logoBeigeEl.style.opacity = '0'
          }
          const heroTitle = document.querySelector('.nosta-hero-title')
          if (heroTitle) {
            heroTitleTween = gsap.to(heroTitle, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.56,
              ease: 'power3.inOut',
              overwrite: 'auto'
            })
          }
        }, 'reveal')
        // Ativar máscara e ocultar cortina sólida sincronizado com o título já posicionado
        .set(maskEl, { opacity: 1 }, 'reveal')
        .set(curtainEl, { display: 'none' }, 'reveal')
        // Animação 6 & 7: Máscara abre suavemente para a Hero
        .to(
          maskEl,
          {
            scale: 8.5,
            duration: 1.6,
            ease: 'power3.inOut'
          },
          'reveal'
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

      // Inicia somente após o browser concluir o paint inicial (elimina travadinha no frame 0)
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          tl.play(0)
        })
      })
    }, container)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      heroTitleTween?.kill()
      ctx.revert()
      ;[logoDarkEl, logoBeigeEl].forEach((el) => {
        el.style.fontFamily = ''
        el.style.fontSize = ''
        el.style.fontWeight = ''
        el.style.lineHeight = ''
        el.style.letterSpacing = ''
      })
      const heroTitle = document.querySelector('.nosta-hero-title')
      if (heroTitle) {
        if (!introDone) {
          gsap.set(heroTitle, { x: 0, y: 0, scale: 1, opacity: 1, visibility: 'visible' })
        } else {
          gsap.set(heroTitle, { opacity: 1, visibility: 'visible' })
        }
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

        {/* Camada Progresso: Textura idêntica à Hero revelando texto Marrom (#432817) */}
        <div className="hero7-progress-fill" ref={progressBarRef}>
          <div className="hero7-logo-layer hero7-text-beige">
            <div className="hero7-hero-texture-sync" aria-hidden="true">
              <div className="nosta-hero-lighting" />
              <div className="nosta-hero-grain" />
              <img
                src="/hero7/smoke-poster.webp"
                alt=""
                loading="eager"
                decoding="sync"
                className="nosta-hero-smoke"
              />
              <img
                src="/hero7/smoke-poster.webp"
                alt=""
                loading="eager"
                decoding="sync"
                className="nosta-hero-smoke"
              />
              <div
                className="film-grain-overlay"
                style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 3 }}
              />
            </div>
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
