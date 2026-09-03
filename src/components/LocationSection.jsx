import React, { useState } from 'react'
import { motion } from 'motion/react'
import { 
  MapPin, 
  Clock, 
  ArrowRight, 
  Navigation, 
  Copy, 
  Check, 
  Coffee, 
  Wifi, 
  Heart, 
  ExternalLink 
} from 'lucide-react'
import './LocationSection.css'

const EASING = [0.19, 1, 0.22, 1]

export default function LocationSection() {
  const [copied, setCopied] = useState(false)

  const addressText = "Rua das Flores, 128 - Centro"
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Rua das Flores, 128, Centro")}`
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent("Rua das Flores, 128, Centro")}`

  const handleCopyAddress = (e) => {
    e.preventDefault()
    navigator.clipboard?.writeText("Rua das Flores, 128, Centro")
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  return (
    <section className="location-section" id="location" aria-labelledby="location-title">
      <div className="location-container">
        
        {/* Top Header & Copy (Matching Galeria Sensorial hierarchy) */}
        <motion.div 
          className="location-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASING }}
        >
          <div className="location-title-block">
            <h2 className="location-main-title">
              Venha nos Visitar
              <span className="location-cursive-subtitle">momentos aurora</span>
            </h2>
            <p className="location-main-copy" id="location-title">
              Um café, uma pausa, um lugar para ficar.
            </p>
          </div>
        </motion.div>

        {/* 2 Columns Grid: Left Information Card | Right Interactive Map */}
        <div className="location-grid">
          
          {/* Left Column: Information Card */}
          <motion.div 
            className="location-card location-info-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: EASING, delay: 0.1 }}
          >
            {/* Card Brand Header */}
            <div className="location-card-header">
              <div className="location-brand-name">
                <Coffee size={22} className="location-brand-icon" />
                <span>AURORA CAFÉ</span>
              </div>
              <div className="location-status-badge">
                <span className="status-indicator-dot" />
                <span className="status-text">Aberto hoje</span>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="location-info-body">
              
              {/* Address Block */}
              <div className="location-detail-block address-block">
                <div className="location-icon-wrapper pin-icon-bg">
                  <MapPin size={22} className="location-icon pin-icon" />
                </div>
                <div className="location-detail-content">
                  <span className="location-label">Endereço</span>
                  <p className="location-street">Rua das Flores, 128</p>
                  <p className="location-neighborhood">Centro • Curitiba, PR</p>
                </div>
                <button 
                  onClick={handleCopyAddress}
                  className={`location-copy-btn ${copied ? 'copied' : ''}`}
                  title="Copiar endereço"
                  aria-label="Copiar endereço"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="copy-tooltip">{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="location-divider" />

              {/* Schedules */}
              <div className="location-schedules-wrap">
                {/* Weekday Schedule */}
                <div className="location-detail-block">
                  <div className="location-icon-wrapper clock-icon-bg">
                    <Clock size={20} className="location-icon clock-icon" />
                  </div>
                  <div className="location-detail-content">
                    <span className="location-label">Seg – Sex</span>
                    <p className="location-time">08:00 – 20:00</p>
                  </div>
                </div>

                {/* Weekend Schedule */}
                <div className="location-detail-block">
                  <div className="location-icon-wrapper clock-icon-bg">
                    <Clock size={20} className="location-icon clock-icon" />
                  </div>
                  <div className="location-detail-content">
                    <span className="location-label">Sáb – Dom</span>
                    <p className="location-time">09:00 – 18:00</p>
                  </div>
                </div>
              </div>

              {/* Amenities Tags */}
              <div className="location-amenities">
                <span className="amenity-tag">
                  <Wifi size={13} /> Wi-Fi Alta Velocidade
                </span>
                <span className="amenity-tag">
                  <Heart size={13} /> Pet Friendly
                </span>
                <span className="amenity-tag">
                  Tomadas nas Mesas
                </span>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="location-card-footer">
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="location-cta-btn"
                aria-label="Como chegar no Aurora Café (Google Maps)"
              >
                <span className="btn-text-roll">
                  <span className="btn-text-primary">
                    <span>Como chegar</span>
                    <ArrowRight size={18} className="cta-arrow-icon" />
                  </span>
                  <span className="btn-text-secondary" aria-hidden="true">
                    <span>Como chegar</span>
                    <ArrowRight size={18} className="cta-arrow-icon" />
                  </span>
                </span>
              </a>

              <a 
                href={wazeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="location-secondary-link"
                title="Abrir rota no Waze"
              >
                <span className="btn-text-roll">
                  <span className="btn-text-primary">
                    <span>Waze</span>
                    <ExternalLink size={13} />
                  </span>
                  <span className="btn-text-secondary" aria-hidden="true">
                    <span>Waze</span>
                    <ExternalLink size={13} />
                  </span>
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Map Card */}
          <motion.div 
            className="location-card location-map-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: EASING, delay: 0.2 }}
          >
            {/* Live Interactive Map Iframe */}
            <div className="map-iframe-container">
              <iframe
                title="Mapa de Localização - Aurora Café"
                src="https://maps.google.com/maps?q=Rua+das+Flores+128+Centro&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe-element"
              />
            </div>

            {/* Elegant Floating Pin Card Overlay */}
            <div className="map-floating-badge">
              <div className="map-pin-pulse">
                <span className="pulse-wave" />
                <span className="pulse-center">
                  <Coffee size={14} color="#FFFFFF" />
                </span>
              </div>
              <div className="map-badge-info">
                <strong>Aurora Café</strong>
                <span>Rua das Flores, 128</span>
              </div>
              <a 
                href={googleMapsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="map-open-link"
                aria-label="Abrir mapa ampliado"
              >
                <Navigation size={14} />
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
