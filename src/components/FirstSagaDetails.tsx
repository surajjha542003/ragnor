import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../lib/catalogTypes'
import { getProductImages, money } from '../lib/catalog'
import { ProductGallery } from './ProductGallery'
import { ProductImagePending } from './ProductImagePending'

export function FirstSagaDetails({ product }: { product: Product }) {
  const variants = product.variants ?? []
  const [variantId, setVariantId] = useState(variants[0]?.id)
  const selected = variants.find((variant) => variant.id === variantId)
  const color = selected?.color.hex ?? product.color
  const images = getProductImages(product, color)
  const colorOptions = [...new Map(variants.map(v => [v.color.hex, v.color])).values()]
  const sizeOptions = variants.filter(v => v.color.hex === color)
  return (
    <div className="section page">
      <Link className="text-link mb-8" to="/shop?collection=first-saga">
        Back to The First Saga
      </Link>
      <div className="product-detail">
        <div>
          {images.length ? (
            <ProductGallery key={color} product={product} color={color} detail />
          ) : (
            <ProductImagePending name={product.name} />
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">RAGNOR — THE FIRST SAGA / COLLECTION PREVIEW</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="price">
            {selected?.price == null ? 'Price pending' : money(selected.price)}
          </p>
          <fieldset>
            <legend>Colour <span className="muted">/ {selected?.color.name}</span></legend>
            <div className="swatches">
              {colorOptions.map(option => (
                <button type="button" key={option.hex}
                  className={option.hex === color ? 'selected' : ''}
                  style={{ backgroundColor: option.hex }}
                  aria-label={option.name} aria-pressed={option.hex === color}
                  onClick={() => setVariantId(variants.find(v => v.color.hex === option.hex && v.size === selected?.size)?.id ?? variants.find(v => v.color.hex === option.hex)?.id)} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Proposed size</legend>
            <div className="sizes">
              {sizeOptions.map(variant => (
                <button type="button" key={variant.id}
                  aria-pressed={variant.id === variantId}
                  className={variant.id === variantId ? 'selected' : ''}
                  onClick={() => setVariantId(variant.id)}>{variant.size}</button>
              ))}
            </div>
          </fieldset>
          <p className="gallery-note">AI-generated colour studies. Choose a colour, then use the thumbnails for front, back, detail and model views. Fit and construction may vary between concepts.</p>
          <p className="muted">
            Size range is configurable; measurements and availability await approval.
          </p>
          <p role="status">
            Stock status: {selected?.stock.status.replaceAll('_', ' ') ?? 'unconfirmed'}
          </p>
          <button className="button button-dark w-full" disabled>
            Collection awaiting approval — ordering unavailable
          </button>
          <details open>
            <summary>Product photography</summary>
            <ul>
              {product.mediaSlots
                ?.filter((slot) => slot.color === color)
                .map((slot) => (
                  <li key={slot.view}>
                    {slot.view}:{' '}
                    {slot.status === 'approved'
                      ? 'Approved image'
                      : slot.status === 'concept'
                        ? 'AI-generated concept / needs review'
                        : 'Awaiting image'}
                  </li>
                ))}
            </ul>
          </details>
          <p className="gallery-note">
            Raven Sigil Concept 01 is the approved identity. Product artwork placement, materials
            and care instructions will be confirmed separately.
          </p>
        </div>
      </div>
    </div>
  )
}
