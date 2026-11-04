import { ProductImagePending } from './ProductImagePending'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useReveal } from '../lib/useReveal'
import type { Product } from '../lib/catalog'
import { money, getProductImages } from '../lib/catalog'
import { GarmentPreview } from './GarmentPreview'
import { ProductGallery } from './ProductGallery'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reveal = useReveal((index % 3) * 0.06)
  return (
    <motion.article {...reveal} className="product-card group">
      {getProductImages(product).length > 0 ? (
        <ProductGallery product={product} />
      ) : product.mediaSlots ? (
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <ProductImagePending name={product.name} />
        </Link>
      ) : (
        <Link
          to={`/product/${product.id}`}
          className="product-image"
          aria-label={`View ${product.name}`}
        >
          <span className="product-tag">
            {product.category === 'Hoodie' ? 'HEAVYWEIGHT' : 'OVERSIZED FIT'}
          </span>
          <GarmentPreview
            garment={product.category}
            color={product.color}
            artwork={product.artwork}
          />
          <span className="product-arrow">
            <ArrowUpRight size={19} />
          </span>
        </Link>
      )}
      <div className="flex justify-between gap-3 mt-5">
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <span>{product.price === null ? 'Price pending' : money(product.price)}</span>
      </div>
      <p className="text-xs muted mt-2">{product.tag}</p>
    </motion.article>
  )
}
