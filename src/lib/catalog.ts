import type { Product, ProductImage } from './catalogTypes'
import { firstSagaProducts } from './firstSaga'
export type {
  Garment,
  Design,
  Product,
  ProductImage,
  ProductVariant,
  ProductMediaSlot,
  ProductCollection,
} from './catalogTypes'
export const colors = [
  { name: 'Washed black', hex: '#282925' },
  { name: 'Bone', hex: '#e6e0d1' },
  { name: 'Burnt clay', hex: '#9d4b32' },
  { name: 'Graphite', hex: '#606260' },
]
export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
function ravenImages(garment: 'tee' | 'hoodie', colorIndex: number): ProductImage[] {
  const slug = ['black', 'bone', 'clay', 'graphite'][colorIndex]
  return ['front', 'angle', 'garment'].map((view) => {
    const base =
      colorIndex === 0 && view !== 'garment' ? `${garment}-${view}` : `${garment}-${slug}-${view}`
    return {
      src: `/products/raven/${base}-960.jpg`,
      small: `/products/raven/${base}-480.jpg`,
      label: view === 'garment' ? 'Garment only' : view === 'front' ? 'Model front' : 'Model angle',
      garmentOnly: view === 'garment',
      alt: `AI-generated ${colors[colorIndex].name} Raven Sigil ${garment === 'tee' ? 'T-shirt' : 'hoodie'}, ${view === 'garment' ? 'realistic garment-only product view' : `${view} view on a fictional adult model`}`,
    }
  })
}
function ravenColorImages(garment: 'tee' | 'hoodie') {
  return Object.fromEntries(colors.map((color, index) => [color.hex, ravenImages(garment, index)]))
}
export function getProductImages(product: Product, color = product.color): ProductImage[] {
  if (product.mediaSlots)
    return product.mediaSlots.flatMap((slot) =>
      slot.color === color && (slot.status === 'approved' || slot.status === 'concept')
        ? [slot.image]
        : [],
    )
  return product.colorImages?.[color] ?? (color === product.color ? (product.images ?? []) : [])
}
export const products: (Product & { price: number })[] = [
  {
    id: 'raven-sigil-tee',
    name: 'Raven Sigil Oversized Tee',
    category: 'T-shirt',
    price: 1899,
    color: colors[0].hex,
    artwork: 'raven',
    tag: 'RAVEN SIGIL / NEW CONCEPT',
    images: ravenImages('tee', 0),
    colorImages: ravenColorImages('tee'),
  },
  {
    id: 'raven-sigil-hoodie',
    name: 'Raven Sigil Heavyweight Hoodie',
    category: 'Hoodie',
    price: 3299,
    color: colors[0].hex,
    artwork: 'raven',
    tag: 'RAVEN SIGIL / NEW CONCEPT',
    images: ravenImages('hoodie', 0),
    colorImages: ravenColorImages('hoodie'),
  },
  {
    id: 'origin-tee',
    name: 'The Origin Tee',
    category: 'T-shirt',
    price: 1499,
    color: colors[0].hex,
    artwork: 'origin',
    tag: 'THE EVERYDAY ORIGINAL',
  },
  {
    id: 'terrain-tee',
    name: 'Terrain Oversized Tee',
    category: 'T-shirt',
    price: 1799,
    color: colors[1].hex,
    artwork: 'terrain',
    tag: 'A DIFFERENT PERSPECTIVE',
  },
  {
    id: 'afterhours-hoodie',
    name: 'Afterhours Hoodie',
    category: 'Hoodie',
    price: 2999,
    color: colors[0].hex,
    artwork: 'orbit',
    tag: 'MADE FOR THE LATE HOURS',
  },
  {
    id: 'clay-tee',
    name: 'Clay Studio Tee',
    category: 'T-shirt',
    price: 1699,
    color: colors[2].hex,
    artwork: 'origin',
    tag: 'EARTH, REIMAGINED',
  },
  {
    id: 'bone-hoodie',
    name: 'Sunday Heavyweight',
    category: 'Hoodie',
    price: 3199,
    color: colors[1].hex,
    artwork: 'origin',
    tag: 'ROOM TO SLOW DOWN',
  },
  {
    id: 'orbit-tee',
    name: 'Orbit Graphic Tee',
    category: 'T-shirt',
    price: 1899,
    color: colors[3].hex,
    artwork: 'orbit',
    tag: 'OUTSIDE THE ORDINARY',
  },
]
export const catalogProducts: Product[] = [...products, ...firstSagaProducts]
export const money = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
