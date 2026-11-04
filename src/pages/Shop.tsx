import { firstSaga, firstSagaProducts } from '../lib/firstSaga'
import { FirstSagaDetails } from '../components/FirstSagaDetails'
import type { Product } from '../lib/catalogTypes'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Plus, Search, ShieldCheck, Truck } from 'lucide-react'
import { products, catalogProducts, colors, sizes, money, getProductImages } from '../lib/catalog'
import { ProductCard } from '../components/ProductCard'
import { GarmentPreview } from '../components/GarmentPreview'
import { Button } from '../components/ui/button'
import { useStore } from '../lib/store'
import { ProductGallery } from '../components/ProductGallery'
export function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend>
        Colour <span className="muted">/ {colors.find((c) => c.hex === value)?.name}</span>
      </legend>
      <div className="swatches">
        {colors.map((c) => (
          <button
            type="button"
            key={c.hex}
            className={c.hex === value ? 'selected' : ''}
            style={{ backgroundColor: c.hex }}
            aria-label={c.name}
            aria-pressed={value === c.hex}
            onClick={() => onChange(c.hex)}
          />
        ))}
      </div>
    </fieldset>
  )
}
export function SizePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend>Size</legend>
      <div className="sizes">
        {sizes.map((size) => (
          <button
            type="button"
            key={size}
            aria-pressed={size === value}
            className={size === value ? 'selected' : ''}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
export function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All pieces'
  const isFirstSaga = params.get('collection') === firstSaga.id
  const isArchive = params.get('collection') === 'archive'
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const result = (isFirstSaga ? firstSagaProducts : isArchive ? products.slice(2) : [...products.slice(0, 2), ...firstSagaProducts])
    .filter(
      (p) =>
        (category === 'All pieces' || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === 'featured') return 0
      if (a.price === null) return b.price === null ? 0 : 1
      if (b.price === null) return -1
      return sort === 'low' ? a.price - b.price : b.price - a.price
    })
  return (
    <div className="section page">
      <div className={`page-intro${isFirstSaga ? ' saga-intro' : ''}`}>
        <span className="eyebrow">
          {isFirstSaga ? firstSaga.name : 'COLLECTION 001 / THE NEW UNIFORM'}
        </span>
        <h1>
          {isFirstSaga ? (
            <>
              THE FIRST <em>SAGA</em>
            </>
          ) : (
            <>
              Built for your <em>everyday.</em>
            </>
          )}
        </h1>
        <p>
          {isFirstSaga
            ? 'The raven. The open sea. The strength of iron. Five proposed pieces draw on the imagery of the North to begin a new RAGNOR chapter.'
            : 'Room to move. Space to express. Find your starting point.'}
        </p>
        {isFirstSaga && <p className="saga-preview-note">Collection preview / Awaiting Approval<br />AI-generated concepts, not manufactured product photographs. Prices and availability remain unconfirmed.</p>}
      </div>
      <nav className="collection-switch" aria-label="Collections">
        <Link to="/shop" aria-current={!isFirstSaga && !isArchive ? 'page' : undefined}>
          Current collection
        </Link>
        <Link to="/shop?collection=first-saga" aria-current={isFirstSaga ? 'page' : undefined}>
          The First Saga / Preview
        </Link>
        <Link to="/shop?collection=archive" aria-current={isArchive ? 'page' : undefined}>
          Design archive
        </Link>
      </nav>
      <div className="shop-toolbar">
        <div className="filter-tabs" aria-label="Filter collection">
          {['All pieces', 'T-shirt', 'Hoodie'].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? 'selected' : ''}
              onClick={() =>
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  if (c === 'All pieces') next.delete('category')
                  else next.set('category', c)
                  return next
                })
              }
            >
              {c === 'T-shirt' ? 'T-shirts' : c === 'Hoodie' ? 'Hoodies' : c}
            </button>
          ))}
        </div>
        <div className="shop-tools">
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search products"
              placeholder="Find your piece"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>
      <p className="sample-note" aria-live="polite">
        {result.length} pieces ·{' '}
        {isFirstSaga
          ? 'Collection preview; prices and stock unconfirmed'
          : 'Concept collection; First Saga prices and stock unconfirmed'}
      </p>
      {result.length ? (
        <div className="product-grid">
          {result.map((p, index) => (
            <ProductCard key={p.id} product={p} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search />
          <h2>No pieces found.</h2>
          <p>Try another search or explore the full collection.</p>
          <Button
            onClick={() => {
              setQuery('')
              setParams(isFirstSaga ? { collection: firstSaga.id } : isArchive ? { collection: 'archive' } : {})
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
export function ProductDetails() {
  const { id } = useParams()
  const product = catalogProducts.find((p) => p.id === id)
  return product ? (
    product.collectionId === firstSaga.id ? (
      <FirstSagaDetails key={product.id} product={product} />
    ) : (
      <ProductView key={product.id} product={product} />
    )
  ) : (
    <div className="empty-state">
      <h1>Piece not found.</h1>
      <Button asChild>
        <Link to="/shop">Explore collection</Link>
      </Button>
    </div>
  )
}
function ProductView({ product }: { product: Product }) {
  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState('M')
  const { addToCart } = useStore()
  return (
    <div className="section page">
      <Link className="text-link mb-8" to="/shop">
        <ArrowLeft size={16} /> Back to collection
      </Link>
      <div className="product-detail">
        {getProductImages(product, color).length > 0 ? (
          <div className="detail-art detail-gallery">
            <ProductGallery key={color} product={product} color={color} detail />
            <p className="gallery-note">
              AI-generated model and garment concept. Graphic placement and fabric finish are
              illustrative, not a production proof.
            </p>
          </div>
        ) : (
          <div className="detail-art">
            <GarmentPreview color={color} garment={product.category} artwork={product.artwork} />
            <span>GARMENT CONCEPT / FRONT VIEW</span>
          </div>
        )}
        <div className="detail-copy">
          <span className="eyebrow">RAGNOR / COLLECTION 001</span>
          <h1>{product.name}</h1>
          <p className="price">
            {product.price === null ? 'Price to be confirmed' : money(product.price)}{' '}
            <span>Indicative price</span>
          </p>
          <p className="muted">
            An easy, oversized silhouette with an independent point of view. Designed as your
            everyday canvas. This is a sample product; specifications will be confirmed before
            launch.
          </p>
          <ColorPicker
            value={color}
            onChange={(value) => {
              setColor(value)
            }}
          />
          <SizePicker value={size} onChange={setSize} />
          <details>
            <summary>Concept size guide (cm)</summary>
            <p className="muted text-sm">
              Flat chest / length: XS 52/68 · S 55/70 · M 58/72 · L 61/74 · XL 64/76 · XXL 67/78.
              Illustrative measurements only.
            </p>
          </details>
          <Button
            className="w-full"
            onClick={() => addToCart({ productId: product.id, color, size })}
          >
            Add to bag <Plus size={18} />
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link
              to={`/forge?garment=${encodeURIComponent(product.category)}&art=${product.artwork}&color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`}
            >
              Make it yours in Forge <ArrowUpRight size={18} />
            </Link>
          </Button>
          {product.images && (
            <p className="gallery-note">
              Customise the Raven Sigil mockup in Forge: colour, garment, size and print scale.
              Forge uses an editable design mockup; the photos here are AI-generated concept
              references.
            </p>
          )}
          <div className="product-assurances">
            <span>
              <Truck size={17} /> Shipping details at launch
            </span>
            <span>
              <ShieldCheck size={17} /> No payment collected
            </span>
          </div>
          <details>
            <summary>Materials & care</summary>
            <p>
              Concept specification: cotton jersey for tees and cotton fleece for hoodies. Cold wash
              inside out; air dry. Final fabric weight and composition are pending production
              approval.
            </p>
          </details>
          <details>
            <summary>Delivery & returns</summary>
            <p>
              Orders are not open. Delivery estimates and the return policy will be published before
              checkout is enabled.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
