export const CAMERA_COLORS = [
  {
    id: 'classic',
    label: 'Creme Clássico',
    swatch: '#E6D5B8',
    bodyHex: '#E6D5B8',
    rubberHex: '#3B2A22',
    seamHex: '#3B2A22',
    backSeamHex: '#6C5F50',
    lightText: false
  },
  {
    id: 'moss',
    label: 'Verde Musgo',
    swatch: '#9EB28D',
    bodyHex: '#9EB28D',
    rubberHex: '#343D2C',
    seamHex: '#343D2C',
    backSeamHex: '#4E5C42',
    lightText: false
  },
  {
    id: 'chocolate',
    label: 'Marrom Chocolate',
    swatch: '#5A3726',
    bodyHex: '#5A3726',
    rubberHex: '#2A1810',
    seamHex: '#2A1810',
    backSeamHex: '#331D13',
    lightText: true
  }
]

export const DEFAULT_CAMERA_COLOR = CAMERA_COLORS[0].id

export function getCameraColorPalette(colorId) {
  return CAMERA_COLORS.find((item) => item.id === colorId) || CAMERA_COLORS[0]
}

