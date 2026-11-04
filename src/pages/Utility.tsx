import { getProductImages } from '../lib/catalog'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Bookmark,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserRound,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { GarmentPreview } from '../components/GarmentPreview'
import { useStore } from '../lib/store'
import { colors, money, products } from '../lib/catalog'
function Intro({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  )
}
export function Cart() {
  const { cart, quantity } = useStore()
  const subtotal = cart.reduce(
    (sum, item) => sum + products.find((p) => p.id === item.productId)!.price * item.quantity,
    0,
  )
  return (
    <div className="section page">
      <Intro
        label="THE GOOD THINGS YOU FOUND"
        title="Your bag."
        text="A little more you. Saved on this device."
      />
      {!cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={35} />
          <h2>A blank canvas, for now.</h2>
          <p>Find something that feels like you.</p>
          <Button asChild>
            <Link to="/shop">
              Explore the collection <ArrowUpRight size={17} />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((item, index) => {
              const product = products.find((p) => p.id === item.productId)!
              return (
                <article className="cart-item" key={`${item.productId}-${item.color}-${item.size}`}>
                  <Link
                    to={`/product/${product.id}`}
                    className="cart-art"
                    aria-label={product.name}
                  >
                    {getProductImages(product, item.color).length > 0 ? (
                      <img
                        className="cart-model-photo"
                        src={getProductImages(product, item.color)[0].small}
                        alt={getProductImages(product, item.color)[0].alt}
                        width={480}
                        height={600}
                        loading="lazy"
                      />
                    ) : (
                      <GarmentPreview
                        garment={product.category}
                        color={item.color}
                        artwork={product.artwork}
                      />
                    )}
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/product/${product.id}`}>
                      <h2>{product.name}</h2>
                    </Link>
                    <p>
                      {colors.find((c) => c.hex === item.color)?.name} / {item.size}
                    </p>
                    <span>{money(product.price)}</span>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => quantity(index, item.quantity - 1)}
                      >
                        <Minus size={15} />
                      </button>
                      <output aria-label="Quantity">{item.quantity}</output>
                      <button
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={item.quantity >= 10}
                        onClick={() => quantity(index, item.quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-end">
                    <span>{money(product.price * item.quantity)}</span>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => quantity(index, 0)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <aside className="order-summary">
            <span className="eyebrow">THE DETAILS</span>
            <h2>Bag summary</h2>
            <div>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Shipping & taxes</span>
              <span>At launch</span>
            </div>
            <div className="summary-total">
              <span>Estimated total</span>
              <span>{money(subtotal)}</span>
            </div>
            <Button asChild className="w-full">
              <Link to="/checkout">
                Review checkout preview <ArrowUpRight size={17} />
              </Link>
            </Button>
            <p>No payment will be taken. Sample prices only; orders are not open.</p>
          </aside>
        </div>
      )}
    </div>
  )
}
export function Checkout() {
  const { cart } = useStore()
  const total = cart.reduce(
    (s, i) => s + products.find((p) => p.id === i.productId)!.price * i.quantity,
    0,
  )
  return (
    <div className="section page narrow">
      <Intro
        label="CHECKOUT / PHASE 01"
        title="Almost yours. Not quite live."
        text="This is a checkout preview. We’re not accepting orders or collecting payment details."
      />
      <div className="info-card">
        <LockKeyhole size={30} />
        <h2>Payments are not connected.</h2>
        <p>
          Your bag contains {cart.reduce((s, i) => s + i.quantity, 0)} items with an indicative
          subtotal of {money(total)}. Shipping, taxes, inventory and final prices are not verified.
        </p>
        <ol className="checkout-steps">
          <li>
            <span>01</span> Your bag <strong>Local preview</strong>
          </li>
          <li>
            <span>02</span> Delivery details <strong>Not connected</strong>
          </li>
          <li>
            <span>03</span> Secure payment <strong>Not connected</strong>
          </li>
        </ol>
        <Button disabled className="w-full">
          Orders are not open yet
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link to="/cart">Return to your bag</Link>
        </Button>
      </div>
    </div>
  )
}
export function SavedDesigns() {
  const { designs, removeDesign } = useStore()
  return (
    <div className="section page">
      <Intro
        label="YOUR PERSONAL ARCHIVE"
        title="Ideas, kept close."
        text="Your saved concepts live in this browser. They are not synced to an account."
      />
      {designs.length ? (
        <div className="design-grid">
          {designs.map((d) => (
            <article className="saved-card" key={d.id}>
              <Link
                to={`/forge?design=${encodeURIComponent(d.id)}`}
                className="saved-preview"
                aria-label={`Edit ${d.name}`}
              >
                <GarmentPreview
                  garment={d.garment}
                  color={d.color}
                  artwork={d.artwork}
                  scale={d.scale}
                />
              </Link>
              <div className="saved-info">
                <h2>{d.name}</h2>
                <p>
                  {d.garment} / {d.size}
                </p>
                <div className="flex justify-between items-center">
                  <Link className="text-link" to={`/forge?design=${encodeURIComponent(d.id)}`}>
                    Open in Forge <ArrowUpRight size={16} />
                  </Link>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${d.name}`}
                    onClick={() => removeDesign(d.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={35} />
          <h2>Your next idea belongs here.</h2>
          <p>Explore Forge, make a sample your own, and save your first design.</p>
          <Button asChild>
            <Link to="/forge">
              Enter Forge <ArrowUpRight size={17} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
export function Account() {
  const { designs, cart } = useStore()
  return (
    <div className="section page narrow">
      <Intro
        label="YOUR RAGNOR"
        title="A space of your own."
        text="You’re browsing as a guest. Authentication is not connected in Phase 1."
      />
      <div className="info-card">
        <UserRound size={30} />
        <h2>Welcome, independent mind.</h2>
        <p>
          Your bag and designs work locally without an account. Sign-in, order history and
          cross-device sync will arrive with the account service.
        </p>
        <div className="account-links">
          <Link to="/saved">
            <Bookmark size={20} /> Saved designs{' '}
            <span>
              {designs.length} <ArrowUpRight size={16} />
            </span>
          </Link>
          <Link to="/cart">
            <ShoppingBag size={20} /> Shopping bag{' '}
            <span>
              {cart.reduce((s, i) => s + i.quantity, 0)} <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
        <Button disabled className="w-full">
          Sign-in is not connected
        </Button>
      </div>
    </div>
  )
}
export function Admin() {
  return (
    <div className="section page">
      <Intro
        label="OPERATIONS / PUBLIC UI PREVIEW"
        title="Behind the seams."
        text="This is an admin layout placeholder, not a protected administration system. No customer data is present."
      />
      <div className="admin-grid">
        {[
          ['Catalog', `${products.length} sample products`],
          ['Orders', 'Not connected'],
          ['Customers', 'Not connected'],
          ['AI service', 'Not connected'],
        ].map(([title, value]) => (
          <div className="info-card" key={title}>
            <span className="eyebrow">{title}</span>
            <h2>{value}</h2>
          </div>
        ))}
      </div>
      <div className="info-card">
        <h2>Integration checklist</h2>
        <p>
          Server-side authentication and role checks are required before enabling administration.
          Catalog editing, inventory, order management and analytics are intentionally unavailable.
        </p>
        <div className="admin-table">
          <div>
            <strong>PRODUCT</strong>
            <strong>CONCEPT PRICE</strong>
            <strong>STATUS</strong>
          </div>
          {products.map((p) => (
            <div key={p.id}>
              <span>{p.name}</span>
              <span>{money(p.price)}</span>
              <span>Sample only</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export function About() {
  const [status, setStatus] = useState('')
  return (
    <div className="section page">
      <Intro
        label="INDEPENDENT MINDS. ORIGINAL THREADS."
        title="Wear your point of view."
        text="RAGNOR is a clothing brand being built in India around one simple idea: self-expression should feel like second nature."
      />
      <div className="about-layout">
        <div className="about-story">
          <span className="eyebrow">IMAGINE IT. WEAR IT.</span>
          <h2>
            A uniform for
            <br />
            <em>being yourself.</em>
          </h2>
          <p>
            We’re bringing considered streetwear and personal creativity into the same space. Easy
            silhouettes. A restrained palette. And a studio that starts with your imagination.
          </p>
          <p>
            Ragnor Forge is our vision for conversational clothing design. In this first phase,
            explore local artwork, customise a garment and save your ideas. AI generation and
            production will be introduced in future phases.
          </p>
          <Link className="text-link" to="/forge">
            Explore the studio <ArrowUpRight size={17} />
          </Link>
        </div>
        <form
          className="contact-form info-card"
          onSubmit={(e) => {
            e.preventDefault()
            setStatus('Contact delivery is not connected yet. Your message was not sent or stored.')
          }}
        >
          <h2>Start a conversation.</h2>
          <p>Contact form preview. Message delivery is not connected.</p>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" required autoComplete="name" maxLength={100} />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" required autoComplete="email" maxLength={254} />
          <label htmlFor="contact-message">Your message</label>
          <textarea id="contact-message" required rows={4} maxLength={2000} />
          <Button type="submit">
            Check contact availability <ArrowUpRight size={17} />
          </Button>
          <p role="status">{status}</p>
        </form>
      </div>
    </div>
  )
}
export function NotFound() {
  return (
    <div className="empty-state page">
      <span className="eyebrow">404 / OFF THE GRID</span>
      <h1>This thread ends here.</h1>
      <p>Let’s find your way back to something good.</p>
      <Button asChild>
        <Link to="/">Back to Ragnor</Link>
      </Button>
    </div>
  )
}
