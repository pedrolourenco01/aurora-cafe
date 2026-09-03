// Menu Items Data for Aurora Café
import latteImg from '../assets/menu/latte.png'
import cappuccinoImg from '../assets/menu/cappuccino.png'
import affogatoImg from '../assets/menu/affogato.png'
import flatWhiteImg from '../assets/menu/flat_white.png'
import icedHazelnutImg from '../assets/menu/iced_hazelnut.png'
import pistachioColdbrewImg from '../assets/menu/pistachio_coldbrew.png'
import caramelCrunchFrappeImg from '../assets/menu/caramel_crunch_frappe.png'
import mochaTruffleIcedImg from '../assets/menu/mocha_truffle_iced.png'

import tiramisuImg from '../assets/menu/tiramisu.png'
import strawberryCakeImg from '../assets/menu/strawberry_cake.png'
import cinnamonRollsImg from '../assets/menu/cinnamon_rolls.png'
import macaronsImg from '../assets/menu/macarons.png'
import pistachioCheesecakeImg from '../assets/menu/pistachio_cheesecake.png'

import croissantBenedictImg from '../assets/menu/croissant_benedict.png'
import avocadoToastImg from '../assets/menu/avocado_toast.png'
import croqueMonsieurImg from '../assets/menu/croque_monsieur.png'

import icedCaramelImg from '../assets/menu/iced_caramel_coldbrew.png'
import strawberryMatchaImg from '../assets/menu/strawberry_matcha.png'
import strawberryShakeImg from '../assets/menu/strawberry_shake.png'
import coldbrewTonicImg from '../assets/menu/coldbrew_tonic.png'

export const MENU_CATEGORIES = [
  { id: 'cafes', name: 'Cafés', badge: 'Especiais' },
  { id: 'doces', name: 'Doces', badge: 'Confeitaria' },
  { id: 'brunch', name: 'Brunch', badge: 'Artesanal' },
  { id: 'bebidas-geladas', name: 'Bebidas', badge: 'Geladas' },
]

export const MENU_ITEMS = {
  cafes: [
    {
      id: 'espresso-aurora',
      name: 'AURORA CLASSIC',
      subtitle: 'espresso duplo • notas florais e caramelo',
      price: 'R$ 9,50',
      rating: '4.9',
      image: '/copos menu/classic.png',
      badge: 'Autoral',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'caramelo-gold',
      name: 'CARAMELO GOLD',
      subtitle: 'espresso suave • xarope toffee • flor de sal',
      price: 'R$ 16,50',
      rating: '4.9',
      image: '/copos menu/caramelo.png',
      badge: 'Favorito',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'chocolate-cacau',
      name: 'CHOCOLATE CACAU',
      subtitle: 'cacau 70% nobre • espresso duplo • crema sedosa',
      price: 'R$ 18,90',
      rating: '4.8',
      image: '/copos menu/chocolate.png',
      badge: 'Popular',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'frutas-vermelhas-brew',
      name: 'FRUTAS VERMELHAS',
      subtitle: 'infusão de frutas vermelhas • espresso suave • frescor floral',
      price: 'R$ 22,50',
      rating: '4.9',
      image: '/copos menu/frutas_vermelhas.png',
      badge: 'Destaque',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'pistache-cream-brew',
      name: 'PISTACHE CREAM',
      subtitle: 'cold brew 18h • creme de pistache siciliano • crocantes',
      price: 'R$ 24,90',
      rating: '5.0',
      image: '/copos menu/pistache.png',
      badge: 'Especial',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'cappuccino-italiano',
      name: 'CAPPUCCINO ITALIANO',
      subtitle: 'espresso intenso • leite vaporizado • cacau 70%',
      price: 'R$ 14,90',
      rating: '4.8',
      image: cappuccinoImg,
      badge: 'Clássico',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'salted-caramel-frappe',
      name: 'SALTED CARAMEL CRUNCH',
      subtitle: 'caramelo toffee salgado • café gelado • flocos crocantes',
      price: 'R$ 23,50',
      rating: '4.8',
      image: caramelCrunchFrappeImg,
      badge: 'Favorito',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'mocha-truffle-iced',
      name: 'MOCHA TRUFFLE ICED',
      subtitle: 'ganache de cacau belga 70% • espresso • pedaços de brownie',
      price: 'R$ 25,00',
      rating: '5.0',
      image: mochaTruffleIcedImg,
      badge: 'Autoral',
      ctaText: 'PEDIR AGORA'
    }
  ],
  doces: [
    {
      id: 'tiramisu-classico',
      name: 'TIRAMISÙ TRADIZIONALE',
      subtitle: 'savoiardi artesanais • mascarpone fresco • café espresso',
      price: 'R$ 22,00',
      rating: '4.9',
      image: tiramisuImg,
      badge: 'Escolha do Chef',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'cinnamon-roll-gourmet',
      name: 'CINNAMON ROLLS GLACIADOS',
      subtitle: 'massa brioche folhada • canela do ceilão • frosting',
      price: 'R$ 16,90',
      rating: '4.8',
      image: cinnamonRollsImg,
      badge: 'Recém-Saído',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'strawberry-velvet-cake',
      name: 'BOLO VELVET MORANGO',
      subtitle: 'pão de ló leve • chantilly fresco • morangos frescos',
      price: 'R$ 19,50',
      rating: '4.8',
      image: strawberryCakeImg,
      badge: 'Especial',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'macarons-franceses',
      name: 'MACARONS SORTIDOS',
      subtitle: 'pistache • fava de baunilha • chocolate belga (4 un)',
      price: 'R$ 24,00',
      rating: '4.7',
      image: macaronsImg,
      badge: 'Artesanal',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'pistachio-cheesecake',
      name: 'BASQUE PISTACHIO CAKE',
      subtitle: 'cheesecake basco queimado • creme pistache siciliano',
      price: 'R$ 26,00',
      rating: '5.0',
      image: pistachioCheesecakeImg,
      badge: 'Autoral',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'affogato-doce',
      name: 'AFFOGATO AL CARAMELLO',
      subtitle: 'gelato de fava de baunilha • calda toffee • espresso',
      price: 'R$ 18,90',
      rating: '4.8',
      image: affogatoImg,
      badge: 'Clássico',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'berry-parfait',
      name: 'PARFAIT BERRY VELVET',
      subtitle: 'camadas de iogurte artesanal • frutas vermelhas frescas',
      price: 'R$ 21,50',
      rating: '4.9',
      image: strawberryCakeImg,
      badge: 'Favorito',
      ctaText: 'EXPERIMENTAR'
    },
    {
      id: 'brownie-truffle-plate',
      name: 'BROWNIE TRUFFLE MOCHA',
      subtitle: 'brownie belga úmido • calda de café e avelã tostada',
      price: 'R$ 23,00',
      rating: '4.9',
      image: mochaTruffleIcedImg,
      badge: 'Popular',
      ctaText: 'EXPERIMENTAR'
    }
  ],
  brunch: [
    {
      id: 'croissant-benedict',
      name: 'CROISSANT BENEDICT',
      subtitle: 'croissant amanteigado • ovos poché • molho hollandaise',
      price: 'R$ 28,50',
      rating: '4.9',
      image: croissantBenedictImg,
      badge: 'Destaque',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'avocado-toast-rustico',
      name: 'AVOCADO TOAST RÚSTICO',
      subtitle: 'pão sourdough tostado • guacamole leve • sementes',
      price: 'R$ 24,90',
      rating: '4.8',
      image: avocadoToastImg,
      badge: 'Saudável',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'croque-monsieur-artisan',
      name: 'CROQUE MONSIEUR',
      subtitle: 'sourdough artesanal • queijo gruyère • béchamel gratinada',
      price: 'R$ 29,90',
      rating: '5.0',
      image: croqueMonsieurImg,
      badge: 'Escolha do Chef',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'croissant-misto-trufado',
      name: 'CROISSANT PRESUNTO CRU',
      subtitle: 'folhado francês • gruyère derretido • azeite trufado',
      price: 'R$ 26,00',
      rating: '4.8',
      image: croissantBenedictImg,
      badge: 'Gourmet',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'toast-cogumelos',
      name: 'TOAST COGUMELOS & BRIE',
      subtitle: 'shimeji salteado • queijo brie maçaricado • tomilho',
      price: 'R$ 27,90',
      rating: '4.9',
      image: avocadoToastImg,
      badge: 'Premium',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'flat-white-combo',
      name: 'COMBO BRUNCH HARMONIZADO',
      subtitle: 'croissant artesanal + flat white espresso duplo',
      price: 'R$ 32,00',
      rating: '4.8',
      image: flatWhiteImg,
      badge: 'Combo',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'cinnamon-brunch',
      name: 'COMBO DOCE DA MANHÃ',
      subtitle: 'cinnamon roll quente • chantilly fresco • café latte',
      price: 'R$ 25,50',
      rating: '4.9',
      image: cinnamonRollsImg,
      badge: 'Favorito',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'croissant-doce',
      name: 'CROISSANT DE AMÊNDOAS',
      subtitle: 'massa folhada • creme frangipane • amêndoas laminadas',
      price: 'R$ 24,00',
      rating: '4.7',
      image: croissantBenedictImg,
      badge: 'Artesanal',
      ctaText: 'PEDIR AGORA'
    }
  ],
  'bebidas-geladas': [
    {
      id: 'iced-hazelnut-cold',
      name: 'ICED HAZELNUT',
      subtitle: 'creme de avelã tostada • espresso duplo • chantilly aerado',
      price: 'R$ 22,50',
      rating: '4.8',
      image: icedHazelnutImg,
      badge: 'Mais Pedido',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'pistachio-coldbrew-item',
      name: 'PISTACHIO COLD BREW',
      subtitle: 'cold brew 18h • espuma de pistache siciliano • crocantes',
      price: 'R$ 24,90',
      rating: '4.9',
      image: pistachioColdbrewImg,
      badge: 'Tendência',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'salted-caramel-frappe',
      name: 'SALTED CARAMEL CRUNCH',
      subtitle: 'caramelo toffee salgado • café gelado • flocos crocantes',
      price: 'R$ 23,50',
      rating: '4.8',
      image: caramelCrunchFrappeImg,
      badge: 'Favorito',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'mocha-truffle-cold',
      name: 'MOCHA TRUFFLE ICED',
      subtitle: 'ganache de cacau belga 70% • espresso • pedaços de brownie',
      price: 'R$ 25,00',
      rating: '5.0',
      image: mochaTruffleIcedImg,
      badge: 'Autoral',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'iced-caramel-coldbrew',
      name: 'CARAMEL COLD BREW',
      subtitle: 'extração a frio 18h • caramelo salgado • espuma de leite',
      price: 'R$ 17,90',
      rating: '4.8',
      image: icedCaramelImg,
      badge: 'Clássico',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'strawberry-matcha-latte',
      name: 'STRAWBERRY MATCHA ICED',
      subtitle: 'purê artesanal de morango • leite gelado • matcha cerimonial',
      price: 'R$ 19,90',
      rating: '4.9',
      image: strawberryMatchaImg,
      badge: 'Popular',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'strawberry-velvet-shake',
      name: 'AURORA BERRY SHAKE',
      subtitle: 'sorvete cremoso • calda de frutas vermelhas • chantilly leve',
      price: 'R$ 21,50',
      rating: '4.8',
      image: strawberryShakeImg,
      badge: 'Refrescante',
      ctaText: 'PEDIR AGORA'
    },
    {
      id: 'coldbrew-tonic-item',
      name: 'COLD BREW TONIC',
      subtitle: 'cold brew cítrico • água tônica premium • alecrim e laranja',
      price: 'R$ 19,00',
      rating: '4.7',
      image: coldbrewTonicImg,
      badge: 'Artesanal',
      ctaText: 'PEDIR AGORA'
    }
  ]
}
