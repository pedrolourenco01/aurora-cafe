import React, { useEffect, useRef } from 'react'
import './CurvedTextScrollSection.css'

// Helper interpolation functions
function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

export default function CurvedTextScrollSection({
  idPrefix = 'curved-1',
  text = '✦ CAFÉ DE ALTITUDE ✦ TORRA ARTESANAL ✦ ALQUIMIA SENSORIAL ✦'
}) {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const textPathRef = useRef(null)

  useEffect(() => {
    let animId
    let isVisible = false
    let entered = false

    // Path total length
    const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 1400

    let startOffset = { value: pathLength, amt: 0.12 }

    const computeOffset = () => {
      if (!sectionRef.current) return 0
      const rect = sectionRef.current.getBoundingClientRect()
      const windowH = window.innerHeight || 800

      // Calculate startOffset based on element's relative viewport position
      return map(rect.top, windowH, -rect.height, pathLength * 0.85, -pathLength * 0.45)
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

  const pathId = `aurora-text-curve-${idPrefix}`

  return (
    <section className="curved-text-section" ref={sectionRef} aria-hidden="true">
      <div className="curved-text-track-wrap">
        {/* Single Wave SVG Path (100% Crisp Vector Rendering, No Blur) */}
        <svg
          className="curved-svg-canvas"
          viewBox="0 0 1440 120"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            ref={pathRef}
            id={pathId}
            d="M -100,60 Q 360,25 720,60 T 1540,60"
            fill="none"
          />
          <text className="curved-svg-text text-accent-primary">
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0px">
              {text}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  )
}
