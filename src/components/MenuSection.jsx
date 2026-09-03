import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag, Star, ArrowRight, Check } from 'lucide-react'
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData'
import './MenuSection.css'

const EASING = [0.19, 1, 0.22, 1]

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('cafes')
  const [cartCount, setCartCount] = useState(0)
  const [addedItemId, setAddedItemId] = useState(null)

  const currentItems = (MENU_ITEMS[activeCategory] || []).slice(0, 6)

  const handleAddToCart = (item) => {
    setCartCount((prev) => prev + 1)
    setAddedItemId(item.id)
    setTimeout(() => {
      setAddedItemId(null)
    }, 1300)
  }

  return (
    <section id="menu" className="menu-section">
      <motion.div
        className="menu-section-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.10,
              delayChildren: 0.1,
            }
          }
        }}
      >
        {/* 1. Header: Menu Title + Cursive Accent + My Basket Action */}
        <motion.div
          className="menu-header-row"
          variants={{
            hidden: { opacity: 0, y: 22, filter: 'blur(3px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.8, ease: EASING }
            }
          }}
        >
          <div className="menu-title-block">
            <h2 className="menu-main-title">
              Menu
              <span className="menu-cursive-subtitle">
                {activeCategory === 'cafes' ? 'cafés especiais' : 
                 activeCategory === 'doces' ? 'confeitaria fina' :
                 activeCategory === 'brunch' ? 'cozinha artesanal' : 'bebidas geladas'}
              </span>
            </h2>
          </div>

          <div className="menu-header-actions">
            <button className="menu-basket-btn" aria-label="Minha Sacola">
              <ShoppingBag size={17} strokeWidth={2.2} className="menu-basket-icon" />
              <span className="btn-text-roll">
                <span className="btn-text-primary">MINHA SACOLA</span>
                <span className="btn-text-secondary" aria-hidden="true">MINHA SACOLA</span>
              </span>
              {cartCount > 0 && (
                <span className="basket-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* 2. Category Filter Pills */}
        <motion.div
          className="menu-categories-nav"
          role="tablist"
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.75, ease: EASING }
            }
          }}
        >
          {MENU_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                className={`menu-category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            )
          })}
        </motion.div>

        {/* 3. Product Cards Grid (8 Cards: 4 top, 4 bottom) */}
        <motion.div
          className="menu-grid-wrapper"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.85, ease: EASING }
            }
          }}
        >
          <div className="menu-cards-grid">
            <AnimatePresence mode="wait">
              <motion.div
                key={`grid-${activeCategory}`}
                className="menu-cards-inner-grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.40, ease: EASING }}
              >
                {currentItems.map((item, index) => {
                  const isJustAdded = addedItemId === item.id

                  return (
                    <motion.div
                      key={item.id}
                      className="menu-brew-card"
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.70,
                        delay: index * 0.05,
                        ease: EASING,
                      }}
                    >
                      {/* Top Right Clean Rating */}
                      <div className="menu-card-rating-clean">
                        <span className="rating-number">{item.rating || '4.9'}</span>
                        <Star size={14} className="rating-star-icon" fill="#B57738" color="#B57738" />
                      </div>

                      {/* Product Image Stage (Dedicated upper section with white background) */}
                      <div className="menu-card-img-stage">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="menu-card-product-img"
                          loading="lazy"
                        />
                      </div>

                      {/* Bottom Content: Title, Subtitle, Price & Action CTA (Pure white space, 100% legible) */}
                      <div className="menu-card-bottom-content">
                        <div className="menu-card-content-block">
                          <h3 className="menu-card-item-title">{item.name}</h3>
                          <p className="menu-card-item-subtitle">{item.subtitle}</p>
                        </div>

                        <div className="menu-card-action-footer">
                          <span className="menu-card-price-tag">{item.price}</span>

                          <button
                            className={`menu-card-cta-link ${isJustAdded ? 'added' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(item)
                            }}
                            aria-label={`${item.ctaText || 'PEDIR AGORA'} - ${item.name}`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check size={14} strokeWidth={2.8} />
                                <span>ADICIONADO</span>
                              </>
                            ) : (
                              <>
                                <span>{item.ctaText || 'PEDIR AGORA'}</span>
                                <ArrowRight size={14} strokeWidth={2.6} className="cta-arrow-icon" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 4. Bottom Centered CTA */}
        <motion.div
          className="menu-bottom-cta-row"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.75, ease: EASING }
            }
          }}
        >
          <a href="#order" className="menu-more-btn" aria-label="Ver cardápio completo">
            <span className="btn-text-roll">
              <span className="btn-text-primary">FAZER PEDIDO COMPLETO</span>
              <span className="btn-text-secondary" aria-hidden="true">FAZER PEDIDO COMPLETO</span>
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
