import classicUrl from '../assets/skins/classic.jpeg'
import carameloUrl from '../assets/skins/caramelo.jpeg'
import chocolateUrl from '../assets/skins/chocolate.jpeg'
import frutasVermelhasUrl from '../assets/skins/frutas_vermelhas.jpeg'
import matchaUrl from '../assets/skins/matcha.jpeg'

// Classic Ingredients
import classic1 from '../assets/ingredients/classic_1.png'
import classic2 from '../assets/ingredients/classic_2.png'
import classic3 from '../assets/ingredients/classic_3.png'
import classic4 from '../assets/ingredients/classic_4.png'
import classic5 from '../assets/ingredients/classic_5.png'

// Caramel Ingredients
import caramel1 from '../assets/ingredients/caramel_1.png'
import caramel2 from '../assets/ingredients/caramel_2.png'
import caramel3 from '../assets/ingredients/caramel_3.png'
import caramel4 from '../assets/ingredients/caramel_4.png'
import caramel5 from '../assets/ingredients/caramel_5.png'

// Chocolate Ingredients
import chocolate1 from '../assets/ingredients/chocolate_1.png'
import chocolate2 from '../assets/ingredients/chocolate_2.png'
import chocolate3 from '../assets/ingredients/chocolate_3.png'
import chocolate4 from '../assets/ingredients/chocolate_4.png'
import chocolate5 from '../assets/ingredients/chocolate_5.png'

// Berries Ingredients
import berries1 from '../assets/ingredients/berries_1.png'
import berries2 from '../assets/ingredients/berries_2.png'
import berries3 from '../assets/ingredients/berries_3.png'
import berries4 from '../assets/ingredients/berries_4.png'
import berries5 from '../assets/ingredients/berries_5.png'

// Matcha Ingredients
import matcha1 from '../assets/ingredients/matcha_1.png'
import matcha2 from '../assets/ingredients/matcha_2.png'
import matcha3 from '../assets/ingredients/matcha_3.png'
import matcha4 from '../assets/ingredients/matcha_4.png'
import matcha5 from '../assets/ingredients/matcha_5.png'

export const SKINS = [
  {
    id: 'classic',
    name: 'Aurora Classic',
    titleLine1: 'AURORA',
    titleLine2: 'CLASSIC',
    badgeText: 'ARÁBICA ESPECIAL',
    storyLabel: 'SOBRE O SABOR',
    description: 'Café especial 100% arábica com notas marcantes de cacau torrado, corpo aveludado e finalização suavemente doce.',
    ctaText: 'FAZER PEDIDO',
    url: classicUrl,
    color: '#8b5a2b',
    titleLine1Color: '#4A2814',
    titleLine2Color: '#96481E',
    tagBg: 'rgba(150, 72, 30, 0.12)',
    tagBorder: 'rgba(150, 72, 30, 0.3)',
    badgeColor: '#A86036',
    bgColor: '#D1B498',
    bgGradient: 'none',
    themeMode: 'light',
    textColor: '#4A2814',
    textSubtle: 'rgba(74, 40, 20, 0.85)',
    btnColor: '#9E5528',
    ingredients: [
      { id: 1, src: classic1, size: 140, x: '6%', y: '68%', blur: 4, rotate: -25, animDuration: 6.2, delay: 0 },
      { id: 2, src: classic2, size: 110, x: '46%', y: '16%', blur: 0, rotate: 18, animDuration: 5.5, delay: 0.4 },
      { id: 3, src: classic3, size: 95, x: '78%', y: '14%', blur: 0, rotate: -12, animDuration: 5.8, delay: 0.8 },
      { id: 4, src: classic4, size: 155, x: '88%', y: '72%', blur: 5, rotate: 30, animDuration: 6.8, delay: 1.2 },
      { id: 5, src: classic5, size: 85, x: '38%', y: '78%', blur: 1, rotate: -40, animDuration: 5.0, delay: 0.2 },
    ]
  },
  {
    id: 'caramelo',
    name: 'Caramelo Gold',
    titleLine1: 'CARAMELO',
    titleLine2: 'GOLD',
    badgeText: 'TOFFEE ARTESANAL',
    storyLabel: 'SOBRE O SABOR',
    description: 'Harmonia irresistível entre o espresso intenso e a doçura aveludada do caramelo artesanal com toque sutil de flor de sal.',
    ctaText: 'FAZER PEDIDO',
    url: carameloUrl,
    color: '#b87a3e',
    titleLine1Color: '#4E2B12',
    titleLine2Color: '#9C5806',
    tagBg: 'rgba(156, 88, 6, 0.14)',
    tagBorder: 'rgba(156, 88, 6, 0.35)',
    badgeColor: '#B06E35',
    bgColor: '#CBA077',
    bgGradient: 'none',
    themeMode: 'light',
    textColor: '#4E2B12',
    textSubtle: 'rgba(78, 43, 18, 0.85)',
    btnColor: '#A85F26',
    ingredients: [
      { id: 1, src: caramel1, size: 135, x: '6%', y: '68%', blur: 3, rotate: -20, animDuration: 6.0, delay: 0 },
      { id: 2, src: caramel2, size: 105, x: '45%', y: '18%', blur: 0, rotate: 15, animDuration: 5.4, delay: 0.5 },
      { id: 3, src: caramel3, size: 95, x: '76%', y: '15%', blur: 0, rotate: -10, animDuration: 5.7, delay: 0.9 },
      { id: 4, src: caramel4, size: 125, x: '86%', y: '74%', blur: 4, rotate: 25, animDuration: 6.5, delay: 1.1 },
      { id: 5, src: caramel5, size: 145, x: '39%', y: '78%', blur: 5, rotate: -35, animDuration: 5.2, delay: 0.3 },
    ]
  },
  {
    id: 'chocolate',
    name: 'Chocolate Cacau',
    titleLine1: 'CHOCOLATE',
    titleLine2: 'CACAU',
    badgeText: '70% CACAU NOBRE',
    storyLabel: 'SOBRE O SABOR',
    description: 'Uma infusão aveludada de chocolate 70% cacau, leite vaporizado cremoso e espresso duplo encorpado para momentos de puro prazer.',
    ctaText: 'FAZER PEDIDO',
    url: chocolateUrl,
    color: '#4a2c1d',
    titleLine1Color: '#F5E6DC',
    titleLine2Color: '#D67B54',
    tagBg: 'rgba(214, 123, 84, 0.18)',
    tagBorder: 'rgba(214, 123, 84, 0.38)',
    badgeColor: '#6B3A28',
    bgColor: '#4A2C22',
    bgGradient: 'none',
    themeMode: 'dark',
    textColor: '#F5E6DC',
    textSubtle: 'rgba(245, 230, 220, 0.82)',
    btnColor: '#C4704B',
    ingredients: [
      { id: 1, src: chocolate1, size: 145, x: '7%', y: '68%', blur: 4, rotate: -15, animDuration: 6.4, delay: 0 },
      { id: 2, src: chocolate2, size: 115, x: '44%', y: '16%', blur: 0, rotate: 20, animDuration: 5.6, delay: 0.4 },
      { id: 3, src: chocolate5, size: 95, x: '77%', y: '15%', blur: 0, rotate: -25, animDuration: 5.9, delay: 0.7 },
      { id: 4, src: chocolate4, size: 150, x: '87%', y: '73%', blur: 5, rotate: 30, animDuration: 6.7, delay: 1.3 },
      { id: 5, src: chocolate3, size: 95, x: '38%', y: '76%', blur: 1, rotate: 45, animDuration: 5.1, delay: 0.2 },
    ]
  },
  {
    id: 'frutas-vermelhas',
    name: 'Frutas Vermelhas',
    titleLine1: 'FRUTAS',
    titleLine2: 'VERMELHAS',
    badgeText: 'FRUTAS SILVESTRES',
    storyLabel: 'SOBRE O SABOR',
    description: 'Refrescância explosiva de framboesas, amoras e morangos combinados com a doçura natural de grãos arábica em extração cold brew.',
    ctaText: 'FAZER PEDIDO',
    url: frutasVermelhasUrl,
    color: '#b8244b',
    titleLine1Color: '#FCECEF',
    titleLine2Color: '#E83E66',
    tagBg: 'rgba(232, 62, 102, 0.18)',
    tagBorder: 'rgba(232, 62, 102, 0.4)',
    badgeColor: '#8C2740',
    bgColor: '#662835',
    bgGradient: 'none',
    themeMode: 'dark',
    textColor: '#FCECEF',
    textSubtle: 'rgba(252, 236, 239, 0.85)',
    btnColor: '#D94D6D',
    ingredients: [
      { id: 1, src: berries1, size: 140, x: '6%', y: '67%', blur: 3, rotate: -18, animDuration: 6.1, delay: 0 },
      { id: 2, src: berries2, size: 110, x: '46%', y: '17%', blur: 0, rotate: 12, animDuration: 5.3, delay: 0.6 },
      { id: 3, src: berries4, size: 100, x: '78%', y: '14%', blur: 0, rotate: -15, animDuration: 5.8, delay: 0.8 },
      { id: 4, src: berries3, size: 145, x: '88%', y: '73%', blur: 5, rotate: 28, animDuration: 6.6, delay: 1.2 },
      { id: 5, src: berries5, size: 90, x: '39%', y: '77%', blur: 1, rotate: -30, animDuration: 4.9, delay: 0.3 },
    ]
  },
  {
    id: 'matcha',
    name: 'Pistache Cream',
    titleLine1: 'PISTACHE',
    titleLine2: 'CREAM',
    badgeText: 'PISTACHE PURO & CREMOSO',
    storyLabel: 'SOBRE O SABOR',
    description: 'Pistache nobre selecionado combinado com leite vaporizado aveludado e espresso encorpado para momentos de pura sofisticação.',
    ctaText: 'FAZER PEDIDO',
    url: matchaUrl,
    color: '#4a7c59',
    titleLine1Color: '#EEF8F0',
    titleLine2Color: '#78C45A',
    tagBg: 'rgba(120, 196, 90, 0.18)',
    tagBorder: 'rgba(120, 196, 90, 0.38)',
    badgeColor: '#4F7856',
    bgColor: '#54835D',
    bgGradient: 'none',
    themeMode: 'dark',
    textColor: '#EEF8F0',
    textSubtle: 'rgba(238, 248, 240, 0.85)',
    btnColor: '#629E6C',
    ingredients: [
      { id: 1, src: matcha1, size: 145, x: '5%', y: '66%', blur: 3, rotate: -22, animDuration: 6.3, delay: 0 },
      { id: 2, src: matcha2, size: 110, x: '45%', y: '16%', blur: 0, rotate: 16, animDuration: 5.5, delay: 0.5 },
      { id: 3, src: matcha4, size: 95, x: '77%', y: '14%', blur: 0, rotate: -12, animDuration: 5.7, delay: 0.9 },
      { id: 4, src: matcha3, size: 150, x: '87%', y: '72%', blur: 5, rotate: 32, animDuration: 6.8, delay: 1.1 },
      { id: 5, src: matcha5, size: 90, x: '37%', y: '76%', blur: 1, rotate: -45, animDuration: 5.2, delay: 0.2 },
    ]
  }
]
