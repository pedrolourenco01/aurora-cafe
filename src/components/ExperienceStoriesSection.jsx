import React, { useState, useEffect, useRef } from 'react'
import ResponsivePicture from './ResponsivePicture'
import { OPTIMIZED_IMAGES } from '../assets/optimized/manifest'
import './ExperienceStoriesSection.css'

const photoExp1 = OPTIMIZED_IMAGES.exp1
const photoExp2 = OPTIMIZED_IMAGES.exp2
const photoExp3 = OPTIMIZED_IMAGES.exp3
const photoExp4 = OPTIMIZED_IMAGES.exp4

const STORIES_DATA = [
  {
    id: 'story-1',
    lines: [
      <>"{'Esta é a '}<span className="story-highlight">melhor sensação analógica</span></>,
      <>{'que já experimentei no formato 35mm.'}</>,
      <>{'O clique mecânico do obturador'}</>,
      <>{'devolve o prazer da fotografia pura."'}</>,
    ],
    author: 'MARCUS V.',
    role: 'FOTÓGRAFO DE RUA — BERLIM',
    image: photoExp1,
    objectPosition: 'center 46%',
    alt: 'Fotógrafo utilizando a câmera analógica Nosta 35mm'
  },
  {
    id: 'story-2',
    lines: [
      <>{'"A ótica 35mm em vidro entrega'}</>,
      <><span className="story-highlight">profundidade e contraste orgânico</span></>,
      <>{'que nenhum sensor digital ou filtro'}</>,
      <>{'de smartphone consegue reproduzir."'}</>,
    ],
    author: 'ELENA R.',
    role: 'CURADORA DE LABORATÓRIO ANALÓGICO — TÓQUIO',
    image: photoExp2,
    objectPosition: 'center 67%',
    alt: 'Câmera Nosta sobre a mesa de trabalho com vista ao fundo'
  },
  {
    id: 'story-3',
    lines: [
      <>{'"Com apenas 240g no bolso da jaqueta,'}</>,
      <>{'ela se tornou uma '}<span className="story-highlight">extensão natural</span></>,
      <>{'da minha mão em cada viagem e'}</>,
      <>{'expedição ao redor do mundo."'}</>,
    ],
    author: 'JULIAN K.',
    role: 'FOTOJORNALISTA & EXPLORADOR — NOVA YORK',
    image: photoExp3,
    objectPosition: 'center 62%',
    alt: 'Câmera Nosta segurada na mão no dia a dia urbano'
  },
  {
    id: 'story-4',
    lines: [
      <>{'"Sem telas, sem menus, sem distrações.'}</>,
      <>{'Olhar diretamente pelo visor de vidro'}</>,
      <>{'força você a desacelerar e enquadrar'}</>,
      <><span className="story-highlight">o momento decisivo da cena</span>{`."`}</>,
    ],
    author: 'SOFIA M.',
    role: 'ARTISTA VISUAL & RETRATISTA — SÃO PAULO',
    image: photoExp4,
    objectPosition: 'center 40%',
    alt: 'Câmera Nosta sendo segurada contra manta e sofá acolhedor'
  }
]

export default function ExperienceStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let rafId = 0
    let inView = false

    const updateClosest = () => {
      rafId = 0
      const vCenter = window.innerHeight * 0.5
      let closestIdx = 0
      let minDistance = Infinity

      itemRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height * 0.5
        const dist = Math.abs(elCenter - vCenter)
        if (dist < minDistance) {
          minDistance = dist
          closestIdx = idx
        }
      })

      setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx))
    }

    const onScroll = () => {
      if (!inView || rafId) return
      rafId = window.requestAnimationFrame(updateClosest)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView && !rafId) {
          rafId = window.requestAnimationFrame(updateClosest)
        }
      },
      { rootMargin: '120px 0px' }
    )

    observer.observe(section)
    window.addEventListener('scroll', onScroll, { passive: true })
    updateClosest()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="experience-stories-section"
      id="stories"
      aria-label="Relatos de Experiência Nosta"
    >
      {/* 1. Header Bar idêntico à Referência Oryzo (100% da largura) */}
      <div className="stories-header-strip">
        <span className="stories-header-left">EXPERIÊNCIA // RELATOS</span>
        <span className="stories-header-center">HISTÓRIAS DA COMUNIDADE [ 4 ]</span>
        <span className="stories-header-right">NOSTA EM USO</span>
      </div>

      {/* 2. Lista dos 4 Conteúdos (100% da largura da section) */}
      <div className="stories-list-container">
        {STORIES_DATA.map((story, index) => {
          const isActive = activeIndex === index

          return (
            <div
              key={story.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`story-row ${isActive ? 'is-active' : ''}`}
              data-story-index={index}
            >
              {/* Coluna da Esquerda: Citação rigorosamente em 4 linhas com termo em destaque */}
              <div className="story-col-left">
                <blockquote className="story-quote">
                  {story.lines.map((line, lIdx) => (
                    <span key={lIdx} className="story-quote-line">
                      {line}
                    </span>
                  ))}
                </blockquote>

                <div className="story-author-block">
                  <span className="story-author-name">{story.author}</span>
                  <span className="story-author-role">{story.role}</span>
                </div>
              </div>

              {/* Coluna Central: Espaço reservado para a Câmera 3D Sticky girar com o scroll */}
              <div className="story-col-center" aria-hidden="true" />

              {/* Coluna da Direita: Imagem correspondente à experiência com efeito acendido */}
              <div className="story-col-right">
                <div className="story-image-card">
                  <ResponsivePicture
                    image={story.image}
                    sizes="(max-width: 1024px) 92vw, 520px"
                    alt={story.alt}
                    className="story-img"
                    style={{ objectPosition: story.objectPosition || 'center center' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="story-img-glow" aria-hidden="true" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
