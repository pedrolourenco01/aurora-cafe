import React, { useEffect, useRef } from 'react'
import './TextScrollMarquee.css'

// Helper interpolation functions
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

export default function TextScrollMarquee() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const textPathRef = useRef(null)
  const blurFilterRef = useRef(null)

  useEffect(() => {
    let animId
    let isVisible = false
    let entered = false

    // Path total length
    const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 2800

    let startOffset = { value: pathLength, amt: 0.12 }
    let scrollTracker = { value: window.pageYOffset || 0, amt: 0.15 }

    const computeOffset = () => {
      if (!sectionRef.current) return 0
      const rect = sectionRef.current.getBoundingClientRect()
      const windowH = window.innerHeight || 800

      // Calculate startOffset based on element's relative viewport position (same engine as CurvedTextScrollSection)
      return map(rect.top, windowH, -rect.height, pathLength * 0.70, -pathLength * 0.40)
    }

    const renderLoop = () => {
      if (isVisible) {
        const targetOffset = computeOffset()

        if (!entered) {
          startOffset.value = targetOffset
          entered = true
        } else {
          startOffset.value = lerp(startOffset.value, targetOffset, startOffset.amt)
        }

        if (textPathRef.current) {
          textPathRef.current.setAttribute('startOffset', `${startOffset.value}px`)
        }

        // SVG Dynamic Velocity Motion Blur
        const currentScroll = window.pageYOffset || 0
        scrollTracker.value = lerp(scrollTracker.value, currentScroll, scrollTracker.amt)
        const speed = Math.abs(scrollTracker.value - currentScroll)

        if (blurFilterRef.current) {
          const stdDev = clamp(map(speed, 0, 150, 0, 4.5), 0, 4.5)
          blurFilterRef.current.setAttribute('stdDeviation', `${stdDev},0`)
        }
      }

      animId = requestAnimationFrame(renderLoop)
    }

    // IntersectionObserver to pause RAF updates when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting
        if (!isVisible) entered = false
      })
    })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    animId = requestAnimationFrame(renderLoop)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="marquee-scroll-section" ref={sectionRef} aria-hidden="true">
      {/* SVG Filters for Dynamic Velocity Blur */}
      <svg className="marquee-scroll-defs" aria-hidden="true">
        <defs>
          <filter id="marqueeScrollBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur ref={blurFilterRef} stdDeviation="0,0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="marquee-scroll-track-wrap">
        {/* Tilted / Wave SVG Path matching exact scroll interaction */}
        <svg
          className="marquee-scroll-svg-canvas"
          viewBox="0 0 1600 110"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            ref={pathRef}
            id="aurora-marquee-curve-path"
            d="M -300,85 L 1900,25"
            fill="none"
          />
          <text className="marquee-scroll-svg-text text-accent-coffee" filter="url(#marqueeScrollBlur)">
            <textPath ref={textPathRef} href="#aurora-marquee-curve-path" startOffset="0px">
              ✦ CAFÉ DE ALTITUDE ✦ TORRA ARTESANAL ✦ ALQUIMIA ✦ GRÃOS SELECIONADOS ✦ NOTAS SENSORIAIS ✦ PÂTISSERIE FRESCA ✦ MOMENTOS AURORA ✦
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  )
}
