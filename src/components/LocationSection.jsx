import React from 'react'
import { motion } from 'motion/react'
import './LocationSection.css'

const EASING = [0.19, 1, 0.22, 1]

export default function LocationSection() {
  return (
    <section className="location-section" id="location" aria-label="Nosta Experiência">
      <motion.div
        className="location-content-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASING }}
      >
        <span className="location-eyebrow">EXPERIÊNCIA</span>
        <h2 className="location-hero-title">NOSTA</h2>
      </motion.div>
    </section>
  )
}


