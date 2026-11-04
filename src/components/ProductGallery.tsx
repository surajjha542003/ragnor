import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Product } from '../lib/catalog'
import { getProductImages } from '../lib/catalog'
import { ProductImagePending } from './ProductImagePending'

/** Hover previews on cards; accessible manual thumbnails on product details. */
export function ProductGallery({
  product,
  detail = false,
  color = product.color,
}: {
  product: Product
  detail?: boolean
  color?: string
}) {
  return product.collectionId === 'first-saga'
    ? <FirstSagaGallery key={`${product.id}-${color}`} product={product} detail={detail} color={color} />
    : <LegacyProductGallery product={product} detail={detail} color={color} />
}

/** Existing concepts only; back-first cards reveal each piece's distinct artwork. */
function FirstSagaGallery({ product, detail, color }: { product: Product; detail: boolean; color: string }) {
  const [selected, setSelected] = useState<string>()
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const images = getProductImages(product, color)
    .filter(image => !failed[image.src] && (detail || ['Front', 'Back'].includes(image.label)))
    .sort((a, b) => {
      const order = detail ? ['Front', 'Back', 'Detail', 'Model'] : ['Back', 'Front']
      return order.indexOf(a.label) - order.indexOf(b.label)
    })
  const chosen = images.find(image => image.src === selected) ?? images[0]
  const target = !detail && hovered
    ? images.find(image => image.src !== chosen?.src) ?? chosen
    : chosen
  // Retain a decoded image while the requested view loads, avoiding an empty flash.
  const current = target && loaded[target.src] ? target : images.find(image => loaded[image.src])
  if (!target) return <ProductImagePending name={product.name} />
  const picture = images.map((image, index) => (
    <img key={image.src}
      className={`gallery-photo${current?.src === image.src ? ' is-active' : ''}`}
      src={image.src} width={960} height={1200}
      loading={detail && index === 0 ? 'eager' : 'lazy'} decoding="async"
      alt={current?.src === image.src ? image.alt : ''}
      aria-hidden={current?.src !== image.src}
      onLoad={() => setLoaded(state => ({ ...state, [image.src]: true }))}
      onError={() => setFailed(state => ({ ...state, [image.src]: true }))} />
  ))
  return (
    <div className={`product-gallery first-saga-gallery${detail ? ' gallery-detail' : ''}`}>
      <div className="gallery-stage"
        onPointerEnter={event => {
          if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) setHovered(true)
        }}
        onPointerLeave={() => setHovered(false)}>
        {detail ? <div className="gallery-picture">{picture}</div> : (
          <Link className="gallery-picture" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>{picture}</Link>
        )}
        <span className="gallery-disclosure">AI-GENERATED CONCEPT</span>
        <span className="saga-view-label">{current?.label ?? target.label} view</span>
        {!loaded[target.src] && <span className="gallery-status" role="status">Loading {target.label.toLowerCase()} view…</span>}
      </div>
      {images.length > 1 && (
        <div className="saga-view-controls" role="group" aria-label={`${product.name} image views`}>
          {images.map(image => (
            <button key={image.src} type="button" aria-pressed={target.src === image.src}
              aria-label={`Show ${product.name} ${image.label.toLowerCase()} view`}
              onClick={() => { setSelected(image.src); setHovered(false) }}>
              {image.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LegacyProductGallery({
  product,
  detail = false,
  color = product.color,
}: {
  product: Product
  detail?: boolean
  color?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const visible = useInView(root, { amount: 0.15 })
  const reduced = useReducedMotion()
  const [position, setPosition] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [paused, setPaused] = useState(false)
  const [engaged, setEngaged] = useState(detail)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const images = getProductImages(product, color).filter((image) => !failed[image.src])
  const viewCount = images.length
  const active = viewCount ? position % viewCount : 0
  const current = images[active]
  const cycling =
    hovered && !focused && !paused && !reduced && visible && pageVisible && viewCount > 1
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  useEffect(() => {
    if (!cycling) return
    const timer = window.setInterval(() => setPosition((value) => value + 1), 1900)
    return () => window.clearInterval(timer)
  }, [cycling])
  function select(index: number) {
    setEngaged(true)
    setPaused(true)
    setPosition((index + viewCount) % viewCount)
  }
  if (!images.length && product.mediaSlots) return <ProductImagePending name={product.name} />
  const picture = (
    <>
      {images.map(
        (image, index) =>
          (index === 0 || engaged) && (
            <img
              key={image.src}
              className={`gallery-photo${index === active && loaded[image.src] ? ' is-active' : ''}`}
              style={{ objectPosition: image.objectPosition ?? 'center top' }}
              src={image.src}
              srcSet={
                image.small === image.src ? undefined : `${image.small} 480w, ${image.src} 960w`
              }
              sizes={detail ? '(max-width: 600px) 88vw, 45vw' : '(max-width: 600px) 44vw, 30vw'}
              width={960}
              height={1200}
              loading={index === 0 && !detail ? 'lazy' : 'eager'}
              decoding="async"
              alt={index === active ? image.alt : ''}
              aria-hidden={index !== active}
              onLoad={() => setLoaded((state) => ({ ...state, [image.src]: true }))}
              onError={() => setFailed((state) => ({ ...state, [image.src]: true }))}
            />
          ),
      )}
    </>
  )
  return (
    <div
      ref={root}
      className={`product-gallery${detail ? ' gallery-detail' : ''}`}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches
        ) {
          setHovered(true)
          setEngaged(true)
        }
      }}
      onPointerLeave={() => {
        setHovered(false)
        if (!detail) setPosition(0)
        setPaused(false)
      }}
      onFocusCapture={() => {
        setFocused(true)
        setEngaged(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className="gallery-stage">
        {detail ? (
          <div className="gallery-picture">{picture}</div>
        ) : (
          <Link
            className="gallery-picture"
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
          >
            {picture}
          </Link>
        )}
        <span className="gallery-disclosure">
          {current?.disclosure ??
            (current?.garmentOnly ? 'AI PRODUCT / CONCEPT' : 'AI MODEL / CONCEPT')}
        </span>
        {current && !loaded[current.src] && (
          <span className="gallery-status" role="status">
            Loading preview…
          </span>
        )}
        {!images.length && (
          <span className="gallery-status" role="status">
            Photos unavailable. Please reload to try again.
          </span>
        )}
      </div>
      {detail && (
        <div className="gallery-thumbnails" aria-label="Product views">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Show ${image.label.toLowerCase()} view`}
              aria-pressed={active === index}
              onClick={() => select(index)}
            >
              <img src={image.small} width={64} height={80} alt="" loading="lazy" />
              <span>{image.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
