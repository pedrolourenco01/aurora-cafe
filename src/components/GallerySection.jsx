import React from 'react'
import './GallerySection.css'

export default function GallerySection() {
  return (
    <section id="gallery" className="gallery-section">
      {/* Camadas de Fundo de Estúdio Marrom Quente Idêntico à Referência */}
      <div className="gallery-lighting-glow" aria-hidden="true" />
      <div className="gallery-camera-halo" aria-hidden="true" />
      <div className="gallery-grain-overlay" aria-hidden="true" />
    </section>
  )
}
