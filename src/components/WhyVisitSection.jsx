import React from 'react'
import { motion } from 'motion/react'
import './WhyVisitSection.css'

const EASING = [0.19, 1, 0.22, 1]

export default function WhyVisitSection() {
  return (
    <section id="why-visit" className="nosta-features-section">
      <div className="features-stage-container">
        {/* TEXTO DA ESQUERDA (Exatamente 3 linhas como na referência, no topo) */}
        <motion.div
          className="features-col-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: EASING }}
        >
          <h2 className="features-headline">
            <span>PEOPLE ALL AROUND</span>
            <span>THE WORLD LOVE</span>
            <span>NOSTA</span>
          </h2>
        </motion.div>

        {/* TEXTO DA DIREITA (Exatamente 3 linhas como na referência, centralizado) */}
        <motion.div
          className="features-col-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: EASING, delay: 0.1 }}
        >
          <p className="features-lead-text">
            <span>Do not take our word for it,</span>
            <span>see what people say after</span>
            <span>living with Nosta.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
