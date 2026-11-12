import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ResponsivePicture from './ResponsivePicture'
import { OPTIMIZED_IMAGES } from '../assets/optimized/manifest'
import './InfographicSection.css'

const imgLente = OPTIMIZED_IMAGES.infoLente
const imgFormato = OPTIMIZED_IMAGES.infoFormato
const imgMateriais = OPTIMIZED_IMAGES.infoMateriais
const imgFuncionalidades = OPTIMIZED_IMAGES.infoFunc

function getLayoutBoxRelativeTo(el, ancestor) {
  if (!el || !ancestor) return null
  let left = 0
  let top = 0
  let cur = el
  while (cur && cur !== ancestor) {
    left += cur.offsetLeft || 0
    top += cur.offsetTop || 0
    cur = cur.offsetParent
  }
  const width = el.offsetWidth || 0
  const height = el.offsetHeight || 0
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    cx: left + width * 0.5,
    cy: top + height * 0.5,
  }
}

export default function InfographicSection() {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const funcItemRef = useRef(null)
  const formatoItemRef = useRef(null)
  const materiaisItemRef = useRef(null)
  const lenteItemRef = useRef(null)
  const formatoBubbleRef = useRef(null)
  const materiaisBubbleRef = useRef(null)
  const lenteBubbleRef = useRef(null)

  const getLayoutMode = () => {
    if (typeof window === 'undefined') return 'desktop'
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (vw <= 900) return 'mobile'
    if (vw <= 1180 && vh > vw) return 'tabletPortrait'
    return 'desktop'
  }

  const [layoutMode, setLayoutMode] = useState(getLayoutMode)
  const isMobile = layoutMode === 'mobile'
  const isTabletPortrait = layoutMode === 'tabletPortrait'
  const [mobileSvgData, setMobileSvgData] = useState(null)

  useEffect(() => {
    const checkLayout = () => setLayoutMode(getLayoutMode())
    window.addEventListener('resize', checkLayout)
    return () => window.removeEventListener('resize', checkLayout)
  }, [])

  useEffect(() => {
    if (layoutMode === 'desktop') {
      setMobileSvgData(null)
      return
    }

    const computeConnectors = () => {
      const stage = stageRef.current
      if (!stage) return
      const vw = stage.clientWidth
      const vh = stage.clientHeight
      if (!vw || !vh) return

      const funcBox = getLayoutBoxRelativeTo(funcItemRef.current, stage)
      const formBox = getLayoutBoxRelativeTo(formatoItemRef.current, stage)
      const matBubbleBox = getLayoutBoxRelativeTo(materiaisBubbleRef.current, stage)
      const lenBubbleBox = getLayoutBoxRelativeTo(lenteBubbleRef.current, stage)
      if (!funcBox || !formBox || !matBubbleBox || !lenBubbleBox) return

      if (layoutMode === 'tabletPortrait') {
        const formBubbleBox = getLayoutBoxRelativeTo(formatoBubbleRef.current, stage)
        const matBox = getLayoutBoxRelativeTo(materiaisItemRef.current, stage)
        if (!formBubbleBox || !matBox) return

        const winW = window.innerWidth || vw
        const winH = window.innerHeight || vh
        const mobileAspect = winW / Math.max(1, winH)
        const mobileScale = Math.max(0.55, Math.min(winW >= 900 ? 0.76 : 0.80, 1.37 * mobileAspect))
        const camUnit = winH * mobileScale
        const cx = vw * 0.5
        const cy = winH * 0.47285 - (stage.offsetTop || 0)

        const funcX0 = cx - 0.1976 * camUnit
        const funcY0 = cy - 0.1022 * camUnit
        const funcEndX = Math.max(funcBox.right + 14, funcX0 + 28)
        const funcEndY = funcBox.cy
        const funcElbowX = funcEndX + 18

        const formX0 = cx + 0.0791 * camUnit
        const formY0 = cy - 0.0315 * camUnit
        const formEndX = formBubbleBox.left - 14
        const formEndY = formBubbleBox.cy
        const formElbowX = formEndX - 24

        const matX0 = cx - 0.1934 * camUnit
        const matY0 = cy + 0.1082 * camUnit
        const matEndX = Math.max(matBox.right + 14, matX0 + 28)
        const matEndY = matBox.cy
        const matElbowX = matEndX + 18

        const lenX0 = cx + 0.0621 * camUnit
        const lenY0 = cy + 0.1012 * camUnit
        const lenEndX = lenBubbleBox.left - 14
        const lenEndY = lenBubbleBox.cy
        const lenElbowX = lenEndX - 24

        setMobileSvgData({
          vw,
          vh,
          connectors: [
            {
              id: 'funcionalidades',
              d: `M ${funcX0} ${funcY0} L ${funcElbowX} ${funcEndY} L ${funcEndX} ${funcEndY}`,
              x0: funcX0,
              y0: funcY0,
              x1: funcEndX,
              y1: funcEndY,
            },
            {
              id: 'formato',
              d: `M ${formX0} ${formY0} L ${formElbowX} ${formEndY} L ${formEndX} ${formEndY}`,
              x0: formX0,
              y0: formY0,
              x1: formEndX,
              y1: formEndY,
            },
            {
              id: 'materiais',
              d: `M ${matX0} ${matY0} L ${matElbowX} ${matEndY} L ${matEndX} ${matEndY}`,
              x0: matX0,
              y0: matY0,
              x1: matEndX,
              y1: matEndY,
            },
            {
              id: 'lente',
              d: `M ${lenX0} ${lenY0} L ${lenElbowX} ${lenEndY} L ${lenEndX} ${lenEndY}`,
              x0: lenX0,
              y0: lenY0,
              x1: lenEndX,
              y1: lenEndY,
            },
          ],
        })
        return
      }

      const u = Math.min(vw, 0.5985 * vh)
      const cx = vw * 0.5
      const cy = vh * 0.47285
      const topCardsBottom = Math.max(funcBox.bottom, formBox.bottom)

      const funcX0 = cx - 0.255 * u
      const funcY0 = cy - 0.228 * u
      const funcEndX = funcBox.cx
      const funcEndY = Math.min(funcY0 - 16, topCardsBottom + 10)
      const funcElbowX = funcEndX + 18

      const formX0 = cx + 0.135 * u
      const formY0 = cy - 0.068 * u
      const formEndX = formBox.cx
      const formEndY = funcEndY
      const formElbowX = formEndX - 20

      const matX0 = cx - 0.285 * u
      const matY0 = cy + 0.155 * u
      const matEndX = matBubbleBox.right + 10
      const matEndY = matBubbleBox.cy
      const matElbowX = matEndX + 20

      const lenX0 = cx + 0.125 * u
      const lenY0 = cy + 0.105 * u
      const lenEndX = lenBubbleBox.left - 10
      const lenEndY = lenBubbleBox.cy
      const lenElbowX = lenEndX - 20

      setMobileSvgData({
        vw,
        vh,
        connectors: [
          {
            id: 'funcionalidades',
            d: `M ${funcX0} ${funcY0} L ${funcElbowX} ${funcEndY} L ${funcEndX} ${funcEndY}`,
            x0: funcX0,
            y0: funcY0,
            x1: funcEndX,
            y1: funcEndY,
          },
          {
            id: 'formato',
            d: `M ${formX0} ${formY0} L ${formElbowX} ${formEndY} L ${formEndX} ${formEndY}`,
            x0: formX0,
            y0: formY0,
            x1: formEndX,
            y1: formEndY,
          },
          {
            id: 'materiais',
            d: `M ${matX0} ${matY0} L ${matElbowX} ${matEndY} L ${matEndX} ${matEndY}`,
            x0: matX0,
            y0: matY0,
            x1: matEndX,
            y1: matEndY,
          },
          {
            id: 'lente',
            d: `M ${lenX0} ${lenY0} L ${lenElbowX} ${lenEndY} L ${lenEndX} ${lenEndY}`,
            x0: lenX0,
            y0: lenY0,
            x1: lenEndX,
            y1: lenEndY,
          },
        ],
      })
    }

    computeConnectors()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(computeConnectors) : null
    if (ro) {
      if (stageRef.current) ro.observe(stageRef.current)
      if (funcItemRef.current) ro.observe(funcItemRef.current)
      if (formatoItemRef.current) ro.observe(formatoItemRef.current)
      if (materiaisItemRef.current) ro.observe(materiaisItemRef.current)
      if (lenteItemRef.current) ro.observe(lenteItemRef.current)
    }
    document.fonts?.ready?.then(computeConnectors)
    window.addEventListener('resize', computeConnectors)
    const rafId = requestAnimationFrame(computeConnectors)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', computeConnectors)
      ro?.disconnect()
    }
  }, [layoutMode])

  // O container tem 220vh para dar uma parada deliberada e confortável para a câmera e a coreografia
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // =========================================================================
  // COREOGRAFIA DE ENTRADA E SAÍDA COMPLETA (desktop e mobile):
  // 1. (0.00 -> 0.12): Parada deliberada da câmera no centro
  // 2. (0.12 -> 0.38): Linhas progridem até a câmera (pathLength: 0 -> 1)
  // 3. (0.35 -> 0.48): Círculos e textos surgem suaves (opacity: 0 -> 1)
  // 4. (0.48 -> 0.75): Leitura estável do infográfico completo
  // 5. (0.75 -> 0.90): QUANDO DESCER, AS LINHAS, PONTOS, CÍRCULOS E TEXTOS SOMEM COMPLETAMENTE (opacity: 1 -> 0)
  // =========================================================================

  // Progresso de desenho das Linhas SVG
  const lineProgress = useTransform(scrollYProgress, [0.12, 0.38], [0, 1])

  // Opacidade geral do SVG das linhas (surge e quando descer além de 0.75, desaparece completamente)
  const linesOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.75, 0.90], [0, 1, 1, 0])
  const startDotOpacity = useTransform(scrollYProgress, [0.12, 0.20], [0, 1])
  const endDotOpacity = useTransform(scrollYProgress, [0.33, 0.39], [0, 1])

  // Opacidade, escala e entrada horizontal dos 4 círculos e textos (mesma coreografia no desktop e mobile)
  const elementsOpacity = useTransform(scrollYProgress, [0.35, 0.48, 0.75, 0.90], [0, 1, 1, 0])
  const bubbleScale = useTransform(scrollYProgress, [0.35, 0.48, 0.78, 0.92], [0.65, 1.0, 1.0, 0.85])

  const textTranslateL = useTransform(scrollYProgress, [0.35, 0.48, 0.78, 0.92], [isMobile ? -12 : -20, 0, 0, isMobile ? -12 : -20])
  const textTranslateR = useTransform(scrollYProgress, [0.35, 0.48, 0.78, 0.92], [isMobile ? 12 : 20, 0, 0, isMobile ? 12 : 20])

  return (
    <section id="infographic" ref={containerRef} className="nosta-infographic-scroll-track" aria-label="Infográfico Nosta 35mm">
      {/* FRAME STICKY QUE RETÉM A TELA E A CÂMERA NO CENTRO DURANTE TODA A EXPERIÊNCIA */}
      <div className="infographic-sticky-viewport">
        <div className="infographic-stage" ref={stageRef}>
          {/* Camada SVG dos Conectores e Linhas Minimalistas (#F5F0E8 com 75% de opacidade e 1.2px de espessura uniforme) */}
          {(isMobile || isTabletPortrait) && mobileSvgData ? (
            <motion.svg
              className="infographic-lines-svg infographic-lines-svg--mobile"
              viewBox={`0 0 ${mobileSvgData.vw} ${mobileSvgData.vh}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ opacity: linesOpacity }}
            >
              {mobileSvgData.connectors.map((c) => (
                <g key={c.id} className="connector-group">
                  <motion.path
                    d={c.d}
                    stroke="#F5F0E8"
                    strokeWidth="1.2"
                    strokeOpacity="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength: lineProgress }}
                  />
                  <motion.circle cx={c.x0} cy={c.y0} r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: startDotOpacity }} />
                  <motion.circle cx={c.x1} cy={c.y1} r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: endDotOpacity }} />
                </g>
              ))}
            </motion.svg>
          ) : (
            <motion.svg
              className="infographic-lines-svg"
              viewBox="0 0 1024 574"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
              style={{ opacity: linesOpacity }}
            >
              {/* 1. FUNCIONALIDADES: Conecta o botão de disparo laranja no topo da câmera (x: 372, y: 196) com amplo respiro (x: 350, y: 40) */}
              <g className="connector-group">
                <motion.path
                  d="M 372 196 L 362 40 L 350 40"
                  stroke="#F5F0E8"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: lineProgress }}
                />
                <motion.circle cx="372" cy="196" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
                <motion.circle cx="350" cy="40" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
              </g>

              {/* 2. FORMATO: Conecta o topo-direito da lente (x: 568, y: 246) com amplo respiro antes do círculo (x: 682, y: 112) */}
              <g className="connector-group">
                <motion.path
                  d="M 568 246 L 626 112 L 682 112"
                  stroke="#F5F0E8"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: lineProgress }}
                />
                <motion.circle cx="568" cy="246" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
                <motion.circle cx="682" cy="112" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
              </g>

              {/* 3. MATERIAIS: Conecta a empunhadura marrom da câmera (x: 375, y: 345) com amplo respiro (x: 325, y: 460) */}
              <g className="connector-group">
                <motion.path
                  d="M 375 345 L 345 460 L 325 460"
                  stroke="#F5F0E8"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: lineProgress }}
                />
                <motion.circle cx="375" cy="345" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
                <motion.circle cx="325" cy="460" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
              </g>

              {/* 4. LENTE: Conecta a base inferior da lente (x: 556, y: 340) com amplo respiro antes do círculo (x: 682, y: 463) */}
              <g className="connector-group">
                <motion.path
                  d="M 556 340 L 626 463 L 682 463"
                  stroke="#F5F0E8"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: lineProgress }}
                />
                <motion.circle cx="556" cy="340" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
                <motion.circle cx="682" cy="463" r="2.8" fill="#F5F0E8" fillOpacity="0.85" style={{ opacity: lineProgress }} />
              </g>
            </motion.svg>
          )}

          {/* 1. FUNCIONALIDADES — Superior Esquerdo (ao lado do botão de disparo) */}
          <div className="infographic-item item-funcionalidades" ref={funcItemRef}>
            <motion.div
              className="infographic-bubble"
              style={{ opacity: elementsOpacity, scale: bubbleScale }}
            >
              <ResponsivePicture
                image={imgFuncionalidades}
                sizes="150px"
                alt="Botão de disparo tátil laranja e comandos intuitivos"
                className="bubble-img"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              className="infographic-text-block text-left-side"
              style={{ opacity: elementsOpacity, x: textTranslateL }}
            >
              <div className="title-wrapper">
                <h3 className="infographic-title">FUNCIONALIDADES</h3>
              </div>
              <p className="infographic-description">
                Simples e intuitiva. Visor óptico para enquadrar suas fotos, flash integrado para ambientes com pouca luz e botão de disparo fácil de usar.
              </p>
            </motion.div>
          </div>

          {/* 2. FORMATO — Superior Direito (Círculo na esquerda, texto na direita) */}
          <div className="infographic-item item-formato" ref={formatoItemRef}>
            <motion.div
              ref={formatoBubbleRef}
              className="infographic-bubble"
              style={{ opacity: elementsOpacity, scale: bubbleScale }}
            >
              <ResponsivePicture
                image={imgFormato}
                sizes="150px"
                alt="Rolo de filme fotográfico 35mm padrão"
                className="bubble-img"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              className="infographic-text-block text-right-side"
              style={{ opacity: elementsOpacity, x: textTranslateR }}
            >
              <div className="title-wrapper">
                <h3 className="infographic-title">FORMATO</h3>
              </div>
              <p className="infographic-description">
                Utiliza filmes padrão 35 mm, facilmente encontrados no mundo todo. Liberdade para escolher o seu filme favorito e explorar diferentes cores, estilos e sensibilidades.
              </p>
            </motion.div>
          </div>

          {/* 3. MATERIAIS — Inferior Esquerdo */}
          <div className="infographic-item item-materiais" ref={materiaisItemRef}>
            <motion.div
              ref={materiaisBubbleRef}
              className="infographic-bubble"
              style={{ opacity: elementsOpacity, scale: bubbleScale }}
            >
              <ResponsivePicture
                image={imgMateriais}
                sizes="150px"
                alt="Corpo leve e empunhadura texturizada da câmera Nosta"
                className="bubble-img"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              className="infographic-text-block text-left-side"
              style={{ opacity: elementsOpacity, x: textTranslateL }}
            >
              <div className="title-wrapper">
                <h3 className="infographic-title">MATERIAIS</h3>
              </div>
              <p className="infographic-description">
                Corpo em plástico ABS resistente e leve, com acabamento fosco e detalhes emborrachados. Projetada para uma pegada firme e confortável.
              </p>
            </motion.div>
          </div>

          {/* 4. LENTE — Inferior Direito (Círculo na esquerda, texto na direita) */}
          <div className="infographic-item item-lente" ref={lenteItemRef}>
            <motion.div
              ref={lenteBubbleRef}
              className="infographic-bubble"
              style={{ opacity: elementsOpacity, scale: bubbleScale }}
            >
              <ResponsivePicture
                image={imgLente}
                sizes="150px"
                alt="Lente fixa 35mm da câmera Nosta"
                className="bubble-img"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              className="infographic-text-block text-right-side"
              style={{ opacity: elementsOpacity, x: textTranslateR }}
            >
              <div className="title-wrapper">
                <h3 className="infographic-title">LENTE</h3>
              </div>
              <p className="infographic-description">
                Lente fixa de 35 mm com foco a partir de 1 metro. Captura imagens autênticas com o charme e as imperfeições únicas do filme.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
