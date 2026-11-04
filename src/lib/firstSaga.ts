import type { Garment, Product, ProductCollection, ProductViewKind } from './catalogTypes'

const proposedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const views: ProductViewKind[] = ['front', 'back', 'detail', 'model']
const availableImages = new Set(__FIRST_SAGA_IMAGES__)

function draft(
  id: string,
  name: string,
  category: Garment,
  colorName: string,
  hex: string,
  direction: string,
): Product {
  const palette = [
    { name: 'Black', hex: '#0B0B0B', slug: 'black' },
    ...(category === 'T-shirt' ? [{ name: 'Bone white', hex: '#E8E4DA', slug: 'bone' }] : []),
    { name: 'Washed charcoal', hex: '#1E1E1E', slug: 'charcoal' },
  ]
  const options = [palette.find(c => c.hex === hex)!, ...palette.filter(c => c.hex !== hex)]
  return {
    id,
    name,
    category,
    color: hex,
    artwork: 'raven',
    artworkAsset: '/brand/ragnor-icon-light.svg',
    collectionId: 'first-saga',
    approval: 'draft',
    price: null,
    tag: 'THE FIRST SAGA / AWAITING APPROVAL',
    description: `${direction}. Collection proposal awaiting approval. Materials, measurements, pricing and availability are not confirmed.`,
    variants: options.flatMap((option) => proposedSizes.map((size) => ({
      id: option.hex === hex ? `${id}-${size.toLowerCase()}` : `${id}-${option.slug}-${size.toLowerCase()}`,
      color: { name: option.hex === hex ? colorName : option.name, hex: option.hex },
      size,
      price: null,
      currency: 'INR',
      stock: { status: 'unconfirmed', quantity: null },
    }))),
    mediaSlots: options.flatMap((option) => views.map((view) => {
      const folder = option.hex === hex ? '' : `${option.slug}/`
      const path = `/products/first-saga/${id}/${folder}${view}.webp`
      const slot = { view, color: option.hex, expectedPath: path }
      return availableImages.has(path)
        ? {
            ...slot,
            status: 'concept',
            image: {
              src: path,
              small: path,
              label: view[0].toUpperCase() + view.slice(1),
              alt: `AI-generated concept: ${name}, ${option.name}, ${view} view`,
              garmentOnly: view !== 'model',
              disclosure: 'AI-GENERATED CONCEPT',
            },
          }
        : { ...slot, status: 'missing', image: null }
    })),
  }
}

export const firstSagaProducts: Product[] = [
  draft('raven-oath', 'Raven Oath', 'T-shirt', 'Black', '#0B0B0B', 'Black oversized T-shirt'),
  draft(
    'north-sea',
    'North Sea',
    'T-shirt',
    'Bone white',
    '#E8E4DA',
    'Bone-white oversized T-shirt',
  ),
  draft(
    'iron-saga',
    'Iron Saga',
    'T-shirt',
    'Washed charcoal',
    '#1E1E1E',
    'Washed charcoal oversized T-shirt',
  ),
  draft('oathbound', 'Oathbound', 'Hoodie', 'Black', '#0B0B0B', 'Black heavyweight hoodie'),
  draft(
    'kattegat-echo',
    'Kattegat Echo',
    'Hoodie',
    'Charcoal',
    '#1E1E1E',
    'Charcoal heavyweight hoodie',
  ),
]

export const firstSaga: ProductCollection = {
  id: 'first-saga',
  name: 'RAGNOR — THE FIRST SAGA',
  approval: 'draft',
  productIds: firstSagaProducts.map((product) => product.id),
}
