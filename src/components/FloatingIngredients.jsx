import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './FloatingIngredients.css'

// 1. Classic Aurora
import classic1 from '../assets/ingredients/classic_aurora.png'
import classic2 from '../assets/ingredients/classic_aurora_2.png'

// 2. Caramelo
import caramelo1 from '../assets/ingredients/caramelo.png'
import caramelo2 from '../assets/ingredients/caramelo_2.png'

// 3. Chocolate
import choc1 from '../assets/ingredients/chocolate.png'
import choc2 from '../assets/ingredients/chocolate_2.png'
import choc3 from '../assets/ingredients/chocolate_3.png'
import choc4 from '../assets/ingredients/chocolate_4.png'

// 4. Frutas Vermelhas
import fruta1 from '../assets/ingredients/frutas.png'
import fruta2 from '../assets/ingredients/frutas_2.png'
import fruta3 from '../assets/ingredients/frutas_3.png'
import fruta4 from '../assets/ingredients/frutas_4.png'
import fruta5 from '../assets/ingredients/frutas_5.png'

// 5. Matcha
import matcha1 from '../assets/ingredients/matcha.png'
import matcha2 from '../assets/ingredients/matcha_2.png'
import matcha3 from '../assets/ingredients/matcha_3.png'
import matcha4 from '../assets/ingredients/matcha_4.png'

// Generic Component for Real Ingredient Cutout Photos with transparent backgrounds
function RealIngredientImage({ src, alt = "Ingrediente" }) {
  return (
    <img
      src={src}
      alt={alt}
      className="ingredient-vector-svg ingredient-photo-img"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  )
}

// 1. REAL PHOTOREALISTIC ROASTED COFFEE BEAN SVG
function RealCoffeeBeanSVG({ id = "bean" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        {/* Main roasted bean body radial gradient */}
        <radialGradient id={`beanBody-${id}`} cx="38%" cy="32%" r="68%" fx="32%" fy="26%">
          <stop offset="0%" stopColor="#9C522B" />
          <stop offset="22%" stopColor="#753818" />
          <stop offset="55%" stopColor="#4A1E0B" />
          <stop offset="82%" stopColor="#2E1105" />
          <stop offset="100%" stopColor="#150502" />
        </radialGradient>
        {/* Deep crevice gradient */}
        <linearGradient id={`beanCrease-${id}`} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#140502" />
          <stop offset="50%" stopColor="#050100" />
          <stop offset="100%" stopColor="#1E0A04" />
        </linearGradient>
        {/* Authentic chaff / silverskin fleck */}
        <linearGradient id={`beanChaff-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0D5B5" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#D2A87B" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8C6239" stopOpacity="0.45" />
        </linearGradient>
        {/* Oily roasted sheen filter */}
        <filter id={`beanSoftGlow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
        </filter>
      </defs>

      {/* Deep Grounding Drop Shadow */}
      <ellipse cx="80" cy="86" rx="54" ry="66" fill="#000000" opacity="0.3" transform="rotate(-18 80 86)" filter={`url(#beanSoftGlow-${id})`} />

      {/* Main Organic Roasted Coffee Bean Silhouette */}
      <path
        d="M80 14 C118 14, 142 42, 138 84 C134 122, 108 148, 76 146 C42 144, 20 120, 22 78 C24 38, 48 14, 80 14 Z"
        fill={`url(#beanBody-${id})`}
      />

      {/* Left Rounded Lobe Volume */}
      <path
        d="M78 18 C52 20, 26 44, 25 80 C24 116, 44 140, 74 142 C72 120, 70 80, 78 18 Z"
        fill={`url(#beanBody-${id})`}
        opacity="0.95"
      />

      {/* Left Lobe Specular Oily Gloss */}
      <path
        d="M40 38 C32 55, 33 80, 42 108"
        stroke="rgba(255, 200, 160, 0.26)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M42 44 C36 58, 37 78, 44 100"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Right Lobe Specular Roasted Gloss */}
      <path
        d="M92 28 C115 42, 126 68, 122 98"
        stroke="rgba(255, 210, 175, 0.32)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M96 32 C114 46, 122 66, 118 90"
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />

      {/* Deep Central Fissure / Crevice Shadow */}
      <path
        d="M80 16 C68 40, 94 62, 80 92 C68 118, 88 136, 76 144"
        stroke="#050100"
        strokeWidth="11.5"
        strokeLinecap="round"
      />
      <path
        d="M80 16 C68 40, 94 62, 80 92 C68 118, 88 136, 76 144"
        stroke={`url(#beanCrease-${id})`}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Authentic Golden-Buff Silverskin Chaff in Crevice */}
      <path
        d="M79 32 C74 46, 86 58, 81 74 C76 88, 84 104, 78 122"
        stroke={`url(#beanChaff-${id})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M80 44 C77 52, 84 62, 82 72"
        stroke="#FFF2DC"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}

// 2. REAL ROASTED WHOLE ALMOND SVG
function RealAlmondSVG({ id = "almond" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <radialGradient id={`almondSkin-${id}`} cx="44%" cy="36%" r="62%" fx="38%" fy="28%">
          <stop offset="0%" stopColor="#E5A467" />
          <stop offset="28%" stopColor="#C4793A" />
          <stop offset="68%" stopColor="#8C4617" />
          <stop offset="90%" stopColor="#5E2B0C" />
          <stop offset="100%" stopColor="#3C1705" />
        </radialGradient>
        <linearGradient id={`almondRidge-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A1F07" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#2E1103" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#58250B" stopOpacity="0.65" />
        </linearGradient>
        <filter id={`almondBlur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="80" cy="88" rx="46" ry="64" fill="#000000" opacity="0.25" transform="rotate(-15 80 88)" filter={`url(#almondBlur-${id})`} />

      {/* Organic Almond Body (Natural teardrop) */}
      <path
        d="M80 12 C114 42, 136 82, 126 118 C116 144, 94 150, 78 148 C56 146, 28 136, 26 104 C24 66, 52 30, 80 12 Z"
        fill={`url(#almondSkin-${id})`}
      />

      {/* Authentic Almond Skin Bark Grooves */}
      <path d="M80 22 C88 56, 92 98, 84 138" stroke={`url(#almondRidge-${id})`} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M66 34 C68 64, 69 96, 60 128" stroke={`url(#almondRidge-${id})`} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M96 36 C99 68, 102 98, 102 126" stroke={`url(#almondRidge-${id})`} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M48 55 C52 78, 52 102, 44 120" stroke={`url(#almondRidge-${id})`} strokeWidth="2" strokeLinecap="round" />
      <path d="M112 58 C116 80, 115 102, 116 118" stroke={`url(#almondRidge-${id})`} strokeWidth="2" strokeLinecap="round" />
      <path d="M36 80 C40 96, 38 108, 36 116" stroke={`url(#almondRidge-${id})`} strokeWidth="1.6" strokeLinecap="round" />

      {/* Surface Specular & Satin Ridge Highlights */}
      <path d="M68 28 C80 18, 92 24, 100 38" stroke="rgba(255, 235, 205, 0.5)" strokeWidth="4.8" strokeLinecap="round" />
      <path d="M72 32 C82 24, 90 28, 96 40" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M88 50 C92 72, 94 98, 90 120" stroke="rgba(255, 225, 185, 0.38)" strokeWidth="3" strokeLinecap="round" />
      <path d="M58 54 C60 76, 59 96, 54 114" stroke="rgba(255, 225, 185, 0.32)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// 3. REAL GOURMET CARAMEL TOFFEE CUBE SVG
function RealCaramelSVG({ id = "caramel" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <linearGradient id={`carTop-${id}`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#FFF4C2" />
          <stop offset="35%" stopColor="#FFCD5C" />
          <stop offset="100%" stopColor="#E69120" />
        </linearGradient>
        <linearGradient id={`carFrontLeft-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E58D20" />
          <stop offset="50%" stopColor="#C4660B" />
          <stop offset="100%" stopColor="#843A02" />
        </linearGradient>
        <linearGradient id={`carFrontRight-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C87012" />
          <stop offset="60%" stopColor="#9C4805" />
          <stop offset="100%" stopColor="#5E2401" />
        </linearGradient>
        <radialGradient id={`carGlow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE48A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFA624" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft drop shadow */}
      <ellipse cx="80" cy="128" rx="46" ry="18" fill="#421901" opacity="0.35" filter="blur(5px)" />

      {/* Rounded 3D Caramel Cube Faces */}
      {/* Top Face */}
      <path
        d="M80 26 C84 24, 88 25, 94 28 L130 48 C136 52, 137 57, 133 61 L89 83 C84 86, 76 86, 71 83 L27 61 C23 57, 24 52, 30 48 L66 28 C72 25, 76 24, 80 26 Z"
        fill={`url(#carTop-${id})`}
      />

      {/* Left Face */}
      <path
        d="M26 58 C24 62, 25 67, 26 72 L28 106 C29 113, 34 117, 40 120 L72 136 C77 138, 80 137, 80 132 L80 86 C80 83, 76 83, 72 81 L28 59 C27 58, 26 58, 26 58 Z"
        fill={`url(#carFrontLeft-${id})`}
      />

      {/* Right Face */}
      <path
        d="M80 86 L80 132 C80 137, 83 138, 88 136 L120 120 C126 117, 131 113, 132 106 L134 72 C135 67, 136 62, 134 58 L90 80 C86 82, 82 84, 80 86 Z"
        fill={`url(#carFrontRight-${id})`}
      />

      {/* Warm Amber Translucent Center Bloom */}
      <ellipse cx="80" cy="62" rx="36" ry="20" fill={`url(#carGlow-${id})`} opacity="0.7" />

      {/* Glossy Specular Highlights on Beveled Edges */}
      <path
        d="M32 50 L77 27 C80 25, 84 26, 88 28 L128 50"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M30 62 L76 84 C80 86, 84 86, 88 84 L130 62"
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M80 86 L80 130"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Specular Glisten Point */}
      <circle cx="82" cy="36" r="3.5" fill="#FFFFFF" opacity="0.9" />
    </svg>
  )
}

// 4. REAL GOURMET DARK CHOCOLATE BLOCK / SHARD SVG
function RealChocolateSVG({ id = "choc" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <linearGradient id={`chocTopPlate-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78452D" />
          <stop offset="50%" stopColor="#592E1C" />
          <stop offset="100%" stopColor="#3E1C0E" />
        </linearGradient>
        <linearGradient id={`chocLeftFacet-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4E2414" />
          <stop offset="100%" stopColor="#280E06" />
        </linearGradient>
        <linearGradient id={`chocRightFacet-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A170A" />
          <stop offset="100%" stopColor="#1A0703" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <polygon points="28,124 82,148 138,122 84,102" fill="#000000" opacity="0.38" filter="blur(6px)" />

      {/* Outer Chocolate Block Base */}
      <polygon points="22,62 82,32 142,62 142,98 82,134 22,98" fill="#1F0A04" />

      {/* Left Bottom Skirt */}
      <polygon points="22,62 82,98 82,134 22,98" fill={`url(#chocLeftFacet-${id})`} />
      {/* Right Bottom Skirt */}
      <polygon points="82,98 142,62 142,98 82,134" fill={`url(#chocRightFacet-${id})`} />

      {/* Raised Bevel Pyramid Inset */}
      <polygon points="82,32 142,62 124,67 82,46" fill="#6A3822" />
      <polygon points="22,62 82,32 82,46 40,67" fill="#85482F" />
      <polygon points="22,62 82,98 82,82 40,67" fill="#4F2615" />
      <polygon points="82,98 142,62 124,67 82,82" fill="#341509" />

      {/* Center Top Raised Flat Square */}
      <polygon points="40,67 82,46 124,67 82,82" fill={`url(#chocTopPlate-${id})`} />

      {/* Debossed Gourmet Logo Emblem / Cocoa Bean Line on Chocolate */}
      <ellipse cx="82" cy="64" rx="14" ry="7" fill="none" stroke="#2B1107" strokeWidth="2.2" transform="rotate(-15 82 64)" />
      <path d="M74 61 C82 59, 84 68, 90 66" stroke="#2B1107" strokeWidth="1.8" strokeLinecap="round" />

      {/* Crisp Highlight Specular Light along Sharp Mold Edges */}
      <path d="M24 62 L82 32 L140 62" stroke="rgba(255, 220, 200, 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 67 L82 46 L124 67" stroke="rgba(255, 235, 220, 0.8)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 62 L82 98 L142 62" stroke="rgba(255, 200, 180, 0.3)" strokeWidth="2" strokeLinecap="round" />
      <path d="M82 98 L82 134" stroke="rgba(255, 200, 180, 0.38)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 5. REAL RIPE STRAWBERRY SVG (WITH GOLDEN ACHENES & CALYX)
function RealStrawberrySVG({ id = "straw" }) {
  const seeds = [
    { cx: 80, cy: 52, r: 2.6 },
    { cx: 62, cy: 62, r: 2.6 },
    { cx: 98, cy: 62, r: 2.6 },
    { cx: 78, cy: 72, r: 2.8 },
    { cx: 50, cy: 78, r: 2.5 },
    { cx: 108, cy: 80, r: 2.5 },
    { cx: 64, cy: 90, r: 2.8 },
    { cx: 94, cy: 92, r: 2.8 },
    { cx: 80, cy: 108, r: 2.7 },
    { cx: 58, cy: 112, r: 2.4 },
    { cx: 100, cy: 114, r: 2.4 },
    { cx: 72, cy: 126, r: 2.4 },
    { cx: 88, cy: 126, r: 2.4 },
    { cx: 80, cy: 138, r: 2.0 },
  ]

  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <radialGradient id={`strawSkin-${id}`} cx="45%" cy="40%" r="62%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="25%" stopColor="#E6103A" />
          <stop offset="65%" stopColor="#B80028" />
          <stop offset="90%" stopColor="#80001B" />
          <stop offset="100%" stopColor="#540010" />
        </radialGradient>
        <linearGradient id={`calyxGrad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7CD936" />
          <stop offset="60%" stopColor="#3E9412" />
          <stop offset="100%" stopColor="#215B06" />
        </linearGradient>
        <radialGradient id={`seedHole-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B0014" />
          <stop offset="80%" stopColor="#8C001E" />
          <stop offset="100%" stopColor="#B30026" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="80" cy="138" rx="38" ry="14" fill="#38000B" opacity="0.32" filter="blur(6px)" />

      {/* Strawberry Body */}
      <path
        d="M80 34 C120 34, 138 66, 126 102 C116 130, 92 148, 80 150 C68 148, 44 130, 34 102 C22 66, 40 34, 80 34 Z"
        fill={`url(#strawSkin-${id})`}
      />


      {/* Strawberry Seed Pits & Golden Seeds */}
      {seeds.map((s, idx) => (
        <g key={idx}>
          {/* Pit dimple shadow */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.r * 1.5} ry={s.r * 1.2} fill={`url(#seedHole-${id})`} />
          {/* Pit dimple top rim highlight */}
          <path
            d={`M${s.cx - s.r * 1.2} ${s.cy + s.r * 0.4} C${s.cx} ${s.cy + s.r * 1.3}, ${s.cx + s.r * 1.2} ${s.cy + s.r * 0.4}, ${s.cx + s.r * 1.2} ${s.cy + s.r * 0.4}`}
            stroke="rgba(255, 120, 150, 0.45)"
            strokeWidth="1.2"
          />
          {/* Golden Seed */}
          <ellipse cx={s.cx} cy={s.cy} rx={s.r * 0.8} ry={s.r} fill="#FFE27A" transform={`rotate(${idx % 2 === 0 ? -12 : 12} ${s.cx} ${s.cy})`} />
          <circle cx={s.cx - 0.4} cy={s.cy - 0.4} r={s.r * 0.35} fill="#FFF9DF" />
        </g>
      ))}

      {/* Strawberry Calyx (Fresh Green Leaves at the Top) */}
      <path d="M80 34 C80 24, 84 14, 86 10" stroke="#377A14" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M80 34 C80 24, 84 14, 86 10" stroke="#72CC2B" strokeWidth="2.2" strokeLinecap="round" />

      {/* Leaves */}
      <path d="M80 36 C92 20, 114 18, 122 24 C112 34, 98 38, 80 36 Z" fill={`url(#calyxGrad-${id})`} />
      <path d="M80 36 C68 20, 46 18, 38 24 C48 34, 62 38, 80 36 Z" fill={`url(#calyxGrad-${id})`} />
      <path d="M80 36 C98 36, 124 44, 130 54 C116 56, 96 46, 80 36 Z" fill={`url(#calyxGrad-${id})`} />
      <path d="M80 36 C62 36, 36 44, 30 54 C44 56, 64 46, 80 36 Z" fill={`url(#calyxGrad-${id})`} />
      <path d="M80 36 C86 46, 84 62, 80 66 C76 62, 74 46, 80 36 Z" fill={`url(#calyxGrad-${id})`} />
    </svg>
  )
}

// 6. REAL FROSTED BLUEBERRY SVG
function RealBlueberrySVG({ id = "blue" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <radialGradient id={`blueBody-${id}`} cx="42%" cy="36%" r="62%" fx="36%" fy="30%">
          <stop offset="0%" stopColor="#7E9FE0" />
          <stop offset="25%" stopColor="#4364B5" />
          <stop offset="65%" stopColor="#213572" />
          <stop offset="90%" stopColor="#111B3D" />
          <stop offset="100%" stopColor="#080C1E" />
        </radialGradient>
        <radialGradient id={`bloomGrad-${id}`} cx="44%" cy="38%" r="48%">
          <stop offset="0%" stopColor="#C2D6FF" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#85A9F2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4364B5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`calyxHole-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#050813" />
          <stop offset="70%" stopColor="#0C1226" />
          <stop offset="100%" stopColor="#1B284E" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="80" cy="132" rx="44" ry="16" fill="#040712" opacity="0.36" filter="blur(6px)" />

      {/* Main Blueberry Sphere */}
      <circle cx="80" cy="80" r="58" fill={`url(#blueBody-${id})`} />

      {/* Velvety Frosted Bloom Sheen */}
      <circle cx="76" cy="74" r="46" fill={`url(#bloomGrad-${id})`} filter="blur(3px)" />

      {/* Top Specular Rim Reflection */}
      <path
        d="M48 44 C62 34, 94 34, 110 46"
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Blueberry Indented Calyx Crown (5-pointed star cup) */}
      <ellipse cx="80" cy="48" rx="20" ry="12" fill={`url(#calyxHole-${id})`} />
      
      {/* Crown teeth */}
      <path
        d="M64 48 L68 40 L74 46 L80 38 L86 46 L92 40 L96 48 L90 54 L80 56 L70 54 Z"
        fill="#0F1730"
        stroke="#1E2D58"
        strokeWidth="1.5"
      />
      <ellipse cx="80" cy="48" rx="7" ry="4" fill="#050813" />
    </svg>
  )
}

// 7. REAL JUICY RASPBERRY SVG
function RealRaspberrySVG({ id = "rasp" }) {
  const drupelets = [
    // Layer 1 (Back)
    { cx: 62, cy: 52, r: 16 }, { cx: 98, cy: 52, r: 16 },
    { cx: 48, cy: 74, r: 17 }, { cx: 112, cy: 74, r: 17 },
    { cx: 52, cy: 102, r: 16 }, { cx: 108, cy: 102, r: 16 },
    // Layer 2 (Middle)
    { cx: 80, cy: 46, r: 17 },
    { cx: 66, cy: 70, r: 18 }, { cx: 94, cy: 70, r: 18 },
    { cx: 62, cy: 96, r: 18 }, { cx: 98, cy: 96, r: 18 },
    { cx: 70, cy: 120, r: 16 }, { cx: 90, cy: 120, r: 16 },
    // Layer 3 (Front Highlights)
    { cx: 80, cy: 66, r: 18 },
    { cx: 80, cy: 92, r: 19 },
    { cx: 80, cy: 116, r: 17 },
    { cx: 80, cy: 136, r: 13 },
  ]

  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <radialGradient id={`drupeletGrad-${id}`} cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#FF7096" />
          <stop offset="35%" stopColor="#E61A54" />
          <stop offset="75%" stopColor="#A80738" />
          <stop offset="100%" stopColor="#5E001D" />
        </radialGradient>
      </defs>

      {/* Drupelet Cluster */}
      {drupelets.map((d, idx) => (
        <g key={idx}>
          <circle cx={d.cx} cy={d.cy} r={d.r} fill={`url(#drupeletGrad-${id})`} />
          {/* Specular Glisten on Drupelet */}
          <ellipse
            cx={d.cx - d.r * 0.3}
            cy={d.cy - d.r * 0.3}
            rx={d.r * 0.35}
            ry={d.r * 0.22}
            fill="#FFFFFF"
            opacity="0.65"
            transform={`rotate(-25 ${d.cx - d.r * 0.3} ${d.cy - d.r * 0.3})`}
          />
        </g>
      ))}
    </svg>
  )
}

// 8. REAL FRESH GREEN ALMOND (AMÊNDOA VERDE) SVG
function RealGreenAlmondSVG({ id = "green-almond" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        {/* Fresh Green Almond Skin Gradient */}
        <radialGradient id={`greenAlmondSkin-${id}`} cx="42%" cy="38%" r="62%" fx="36%" fy="30%">
          <stop offset="0%" stopColor="#D4F87F" />
          <stop offset="30%" stopColor="#A2DE45" />
          <stop offset="65%" stopColor="#64A826" />
          <stop offset="90%" stopColor="#3C7313" />
          <stop offset="100%" stopColor="#224808" />
        </radialGradient>
        <linearGradient id={`greenAlmondSeam-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#33630D" />
          <stop offset="50%" stopColor="#224808" />
          <stop offset="100%" stopColor="#488518" />
        </linearGradient>
        <linearGradient id={`leafGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94EA4A" />
          <stop offset="60%" stopColor="#4EA31D" />
          <stop offset="100%" stopColor="#27640A" />
        </linearGradient>
        <filter id={`greenAlmondBlur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="80" cy="132" rx="46" ry="18" fill="#152C05" opacity="0.3" filter={`url(#greenAlmondBlur-${id})`} />

      {/* Green Almond Teardrop/Oval Pod */}
      <path
        d="M80 20 C116 46, 138 84, 128 118 C118 144, 94 150, 78 148 C56 146, 28 136, 26 104 C24 68, 52 34, 80 20 Z"
        fill={`url(#greenAlmondSkin-${id})`}
      />

      {/* Characteristic Soft Longitudinal Seam of Green Almond */}
      <path
        d="M80 22 C88 56, 92 98, 82 144"
        stroke={`url(#greenAlmondSeam-${id})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Velvety Fuzzy Light Specular Glow */}
      <path
        d="M64 34 C76 24, 92 30, 102 46"
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth="5"
        strokeLinecap="round"
        filter="blur(1px)"
      />
      <path
        d="M48 60 C52 82, 54 104, 46 122"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Fresh Tiny Stem & Delicate Green Leaflet */}
      <path d="M80 20 C82 12, 86 6, 92 2" stroke="#467F18" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M80 20 C82 12, 86 6, 92 2" stroke="#87DB35" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Leaf */}
      <path
        d="M92 4 C112 2, 126 14, 128 26 C116 28, 102 20, 92 4 Z"
        fill={`url(#leafGrad-${id})`}
      />
      <path d="M92 4 C106 12, 118 18, 128 26" stroke="#255E09" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// 9. REAL FRESH MATCHA TEA LEAF SVG
function RealMatchaLeafSVG({ id = "matcha-leaf" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="ingredient-vector-svg">
      <defs>
        <linearGradient id={`matchaLeafGrad-${id}`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#B6F58C" />
          <stop offset="38%" stopColor="#6AC752" />
          <stop offset="82%" stopColor="#358225" />
          <stop offset="100%" stopColor="#1D5413" />
        </linearGradient>
      </defs>
      <path
        d="M26 138 C20 95, 42 36, 134 20 C140 70, 118 130, 26 138 Z"
        fill={`url(#matchaLeafGrad-${id})`}
      />
      <path d="M26 138 C52 104, 90 66, 134 20" stroke="#276819" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M52 110 C68 104, 88 106, 98 114" stroke="#449C2E" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
      <path d="M72 82 C90 74, 106 72, 118 78" stroke="#449C2E" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
      <path d="M94 56 C108 46, 120 44, 126 48" stroke="#449C2E" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <path d="M44 104 C72 66, 98 42, 120 32" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// CINEMATIC COMPOSITION WITH BALANCED DEPTH-OF-FIELD PARTICLES (REAL INGREDIENT PHOTOS)
const FLAVOR_PARTICLES = {
  classic: [
    // 1. FOREGROUND BOTTOM-LEFT (MASSIVE REAL COFFEE BEAN - CRISP SHARP)
    { id: 'fg-left', component: <RealIngredientImage src={classic2} alt="Grão de Café Aurora" />, size: 340, style: { left: '-3%', bottom: '-170px', zIndex: 40 }, blur: 0, rotate: 38, duration: 6.2, delay: 0 },
    // 2. FOREGROUND LOWER-RIGHT (MASSIVE REAL COFFEE BEAN - SOFT BLUR)
    { id: 'fg-right', component: <RealIngredientImage src={classic2} alt="Grão de Café Torrado" />, size: 340, style: { right: '-6%', top: '50%', zIndex: 40 }, blur: 3, rotate: -28, duration: 6.8, delay: 0.8 },
    // 3. MIDGROUND CENTER GAP (SHARP FOCUS REAL COFFEE BEAN)
    { id: 'mid-center', component: <RealIngredientImage src={classic2} alt="Grão de Café" />, size: 160, style: { left: '43%', top: '20%', zIndex: 20 }, blur: 0, rotate: 18, duration: 5.5, delay: 0.4 },
    // 4. MIDGROUND TOP-RIGHT (SHARP FOCUS REAL COFFEE BEAN)
    { id: 'mid-right', component: <RealIngredientImage src={classic2} alt="Grão de Café Especial" />, size: 145, style: { right: '12%', top: '10%', zIndex: 20 }, blur: 0, rotate: -16, duration: 5.8, delay: 1.2 },
    // 5. MIDGROUND BOTTOM-CENTER (GENTLE SOFT BLUR REAL COFFEE BEAN)
    { id: 'mid-bot', component: <RealIngredientImage src={classic2} alt="Grão de Café Especial" />, size: 135, style: { left: '39%', bottom: '8%', zIndex: 20 }, blur: 2, rotate: -35, duration: 5.0, delay: 0.2 },
  ],
  caramelo: [
    // 1. FOREGROUND BOTTOM-LEFT (MASSIVE REAL ALMOND - CRISP SHARP)
    { id: 'fg-left', component: <RealIngredientImage src={classic1} alt="Amêndoa Torrada Real" />, size: 340, style: { left: '-4%', bottom: '-170px', zIndex: 40 }, blur: 0, rotate: 42, duration: 6.0, delay: 0 },
    // 2. FOREGROUND LOWER-RIGHT (MASSIVE REAL CARAMELO - SOFT BLUR)
    { id: 'fg-right', component: <RealIngredientImage src={caramelo2} alt="Toffee Artesanal" />, size: 330, style: { right: '-5%', top: '50%', zIndex: 40 }, blur: 3, rotate: -32, duration: 6.6, delay: 0.7 },
    // 3. MIDGROUND CENTER GAP (SHARP REAL ALMOND)
    { id: 'mid-center', component: <RealIngredientImage src={classic1} alt="Amêndoa Crocante" />, size: 160, style: { left: '42%', top: '21%', zIndex: 20 }, blur: 0, rotate: 15, duration: 5.4, delay: 0.5 },
    // 4. MIDGROUND TOP-RIGHT (SHARP REAL CARAMELO)
    { id: 'mid-right', component: <RealIngredientImage src={caramelo1} alt="Caramelo Toffee" />, size: 150, style: { right: '13%', top: '11%', zIndex: 20 }, blur: 0, rotate: -12, duration: 5.7, delay: 1.0 },
    // 5. MIDGROUND BOTTOM-CENTER (GENTLE SOFT BLUR REAL CARAMELO)
    { id: 'mid-bot', component: <RealIngredientImage src={caramelo2} alt="Caramelo Doce" />, size: 135, style: { left: '40%', bottom: '8%', zIndex: 20 }, blur: 2, rotate: 25, duration: 5.2, delay: 0.3 },
  ],
  chocolate: [
    // 1. FOREGROUND BOTTOM-LEFT (MASSIVE REAL CHOCOLATE CHUNK - CRISP SHARP)
    { id: 'fg-left', component: <RealIngredientImage src={choc1} alt="Chocolate Nobre Real" />, size: 350, style: { left: '-4%', bottom: '-175px', zIndex: 40 }, blur: 0, rotate: 30, duration: 6.4, delay: 0 },
    // 2. FOREGROUND LOWER-RIGHT (MASSIVE REAL CHOCOLATE CHUNK - SOFT BLUR)
    { id: 'fg-right', component: <RealIngredientImage src={choc2} alt="Chocolate Cacau 70%" />, size: 340, style: { right: '-6%', top: '50%', zIndex: 40 }, blur: 3, rotate: -24, duration: 6.7, delay: 0.9 },
    // 3. MIDGROUND CENTER GAP (SHARP REAL CHOCOLATE BLOCK)
    { id: 'mid-center', component: <RealIngredientImage src={choc3} alt="Pedaço de Chocolate" />, size: 160, style: { left: '43%', top: '20%', zIndex: 20 }, blur: 0, rotate: 22, duration: 5.6, delay: 0.4 },
    // 4. MIDGROUND TOP-RIGHT (SHARP REAL CHOCOLATE BLOCK)
    { id: 'mid-right', component: <RealIngredientImage src={choc4} alt="Barra de Chocolate" />, size: 155, style: { right: '12%', top: '10%', zIndex: 20 }, blur: 0, rotate: -18, duration: 5.9, delay: 1.1 },
    // 5. MIDGROUND BOTTOM-CENTER (GENTLE SOFT BLUR REAL CHOCOLATE)
    { id: 'mid-bot', component: <RealIngredientImage src={choc1} alt="Chocolate Amargo" />, size: 135, style: { left: '39%', bottom: '8%', zIndex: 20 }, blur: 2, rotate: 45, duration: 5.1, delay: 0.2 },
  ],
  'frutas-vermelhas': [
    // 1. FOREGROUND BOTTOM-LEFT (MASSIVE REAL FRUIT CUTOUT - CRISP SHARP)
    { id: 'fg-left', component: <RealIngredientImage src={fruta4} alt="Morango Real" />, size: 350, style: { left: '-4%', bottom: '-175px', zIndex: 40 }, blur: 0, rotate: 36, duration: 6.1, delay: 0 },
    // 2. FOREGROUND LOWER-RIGHT (MASSIVE REAL FRUIT CUTOUT - SOFT BLUR)
    { id: 'fg-right', component: <RealIngredientImage src={fruta5} alt="Framboesa Real" />, size: 330, style: { right: '-5%', top: '50%', zIndex: 40 }, blur: 3, rotate: -20, duration: 6.6, delay: 0.8 },
    // 3. MIDGROUND CENTER GAP (SHARP REAL FRUIT CUTOUT)
    { id: 'mid-center', component: <RealIngredientImage src={fruta1} alt="Frutas Vermelhas" />, size: 165, style: { left: '44%', top: '21%', zIndex: 20 }, blur: 0, rotate: 14, duration: 5.3, delay: 0.6 },
    // 4. MIDGROUND TOP-RIGHT (SHARP REAL FRUIT CUTOUT)
    { id: 'mid-right', component: <RealIngredientImage src={fruta3} alt="Amora Real" />, size: 155, style: { right: '13%', top: '11%', zIndex: 20 }, blur: 0, rotate: -15, duration: 5.8, delay: 1.0 },
    // 5. MIDGROUND BOTTOM-CENTER (GENTLE SOFT BLUR REAL FRUIT CUTOUT)
    { id: 'mid-bot', component: <RealIngredientImage src={fruta2} alt="Mirtilo Real" />, size: 140, style: { left: '40%', bottom: '8%', zIndex: 20 }, blur: 2, rotate: -28, duration: 4.9, delay: 0.3 },
  ],
  matcha: [
    // 1. FOREGROUND BOTTOM-LEFT (MASSIVE REAL PISTACHIO CUTOUT - CRISP SHARP)
    { id: 'fg-left', component: <RealIngredientImage src={matcha1} alt="Pistache Verde Real" />, size: 350, style: { left: '-4%', bottom: '-175px', zIndex: 40 }, blur: 0, rotate: 44, duration: 6.3, delay: 0 },
    // 2. FOREGROUND LOWER-RIGHT (MASSIVE REAL PISTACHIO CUTOUT - SOFT BLUR)
    { id: 'fg-right', component: <RealIngredientImage src={matcha2} alt="Pistache Nobre" />, size: 350, style: { right: '-6%', top: '48%', zIndex: 40 }, blur: 3, rotate: -35, duration: 6.8, delay: 0.7 },
    // 3. MIDGROUND CENTER GAP (SHARP REAL PISTACHIO CUTOUT)
    { id: 'mid-center', component: <RealIngredientImage src={matcha3} alt="Pistache na Casca" />, size: 160, style: { left: '43%', top: '20%', zIndex: 20 }, blur: 0, rotate: 16, duration: 5.5, delay: 0.5 },
    // 4. MIDGROUND TOP-RIGHT (SHARP REAL PISTACHIO CUTOUT)
    { id: 'mid-right', component: <RealIngredientImage src={matcha4} alt="Pistache Aberto" />, size: 150, style: { right: '12%', top: '10%', zIndex: 20 }, blur: 0, rotate: -12, duration: 5.7, delay: 1.1 },
    // 5. MIDGROUND BOTTOM-CENTER (GENTLE SOFT BLUR REAL PISTACHIO CUTOUT)
    { id: 'mid-bot', component: <RealIngredientImage src={matcha1} alt="Pistache Selecionado" />, size: 140, style: { left: '38%', bottom: '8%', zIndex: 20 }, blur: 2, rotate: -42, duration: 5.2, delay: 0.2 },
  ],
}

export default function FloatingIngredients({ currentSkin }) {
  const particles = FLAVOR_PARTICLES[currentSkin?.id] || FLAVOR_PARTICLES.classic

  return (
    <motion.div
      className="floating-ingredients-container"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1], delay: 0.72 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`particles-${currentSkin?.id || 'classic'}`}
          className="floating-ingredients-group"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {particles.map((p, idx) => (
            <motion.div
              key={`${currentSkin?.id || 'classic'}-p-${p.id}`}
              className={`floating-ingredient-item particle-item-${p.id}`}
              style={{
                ...p.style,
                width: `${p.size}px`,
                height: `${p.size}px`,
                filter: p.blur > 0 
                  ? `blur(${p.blur}px) drop-shadow(0 14px 28px rgba(0,0,0,0.24))` 
                  : 'drop-shadow(0 12px 24px rgba(0,0,0,0.22))',
              }}
              animate={{
                y: [0, -18, 0],
                rotate: [p.rotate, p.rotate + 5, p.rotate - 3, p.rotate],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: p.delay || idx * 0.2,
              }}
            >
              {p.component}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
