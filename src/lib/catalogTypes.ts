export type Garment = 'T-shirt' | 'Hoodie'
export type Design = {
  id: string
  name: string
  garment: Garment
  color: string
  size: string
  artwork: string
  scale: number
}
export type ProductImage = {
  src: string
  small: string
  alt: string
  label: string
  garmentOnly?: boolean
  objectPosition?: string
  disclosure?: string
}
export type Product = {
  id: string
  name: string
  category: Garment
  price: number | null
  color: string
  artwork: string
  tag: string
  images?: ProductImage[]
  colorImages?: Record<string, ProductImage[]>
  collectionId?: string
  approval?: 'draft' | 'approved'
  description?: string
  variants?: ProductVariant[]
  mediaSlots?: ProductMediaSlot[]
  artworkAsset?: string
}
export type StockStatus = 'unconfirmed' | 'in_stock' | 'out_of_stock' | 'preorder'
export type ProductVariant = {
  id: string
  color: { name: string; hex: string }
  size: string
  price: number | null
  currency: 'INR'
  stock: { status: StockStatus; quantity: number | null }
}
export type ProductViewKind = 'front' | 'back' | 'detail' | 'model'
export type ProductMediaSlot = {
  view: ProductViewKind
  color: string
  expectedPath: string
} & (
  | { status: 'missing' | 'pending'; image: null }
  | { status: 'approved' | 'concept'; image: ProductImage }
)
export type ProductCollection = {
  id: string
  name: string
  approval: 'draft' | 'approved'
  productIds: string[]
}
