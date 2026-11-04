import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, ShoppingBag, UserRound, X, LoaderCircle } from 'lucide-react'
import { MotionConfig, motion, useInView, useReducedMotion } from 'motion/react'
import { StoreProvider, useStore } from './lib/store'
import { Home } from './pages/Home'
import { BrandLogo } from './components/BrandLogo'
import { Shop, ProductDetails } from './pages/Shop'
import { Account, About, Admin, Cart, Checkout, SavedDesigns, NotFound } from './pages/Utility'
import './App.css'
import './refinements.css'
import './brand.css'
import './product-gallery.css'
const Forge = lazy(() => import('./pages/Forge'))
function RouteReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title =
      pathname === '/'
        ? 'RAGNOR — Imagine It. Wear It.'
        : `${pathname.split('/')[1].replace(/^./, (c) => c.toUpperCase())} — RAGNOR`
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}
function Header() {
  const [open, setOpen] = useState(false)
  const announcementRef = useRef<HTMLDivElement>(null)
  const navigationRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const header = navigationRef.current?.querySelector('header')
    if (!header) return
    const update = () =>
      document.documentElement.style.setProperty(
        '--navigation-height',
        `${header.getBoundingClientRect().height}px`,
      )
    const observer = new ResizeObserver(update)
    observer.observe(header)
    update()
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--navigation-height')
    }
  }, [])
  const announcementVisible = useInView(announcementRef, { initial: true })
  const reducedMotion = useReducedMotion()
  const { cart } = useStore()
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])
  return (
    <>
      <div className="announcement" ref={announcementRef}>
        A new canvas for self-expression.{' '}
        <Link to="/forge">
          Meet Ragnor Forge <ArrowUpRight size={12} />
        </Link>
        <span>DESIGNED IN INDIA. MADE FOR YOU.</span>
      </div>
      <div
        ref={navigationRef}
        className={`navigation-shell${announcementVisible ? '' : ' is-scrolled'}`}
        onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) setOpen(false)
        }}
      >
        <header className="site-header">
          <Link to="/" aria-label="Ragnor home" className="wordmark">
            <BrandLogo />
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            <NavLink to="/shop">Collection</NavLink>
            <NavLink to="/forge">
              Ragnor Forge <span className="tiny-dot" />
            </NavLink>
            <NavLink to="/about">Our story</NavLink>
          </nav>
          <div className="header-actions">
            <Link to="/account" aria-label="Your account" className="icon-button">
              <UserRound size={20} />
            </Link>
            <Link to="/cart" aria-label={`Shopping bag, ${count} items`} className="bag-link">
              <ShoppingBag size={19} />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{count}</span>
            </Link>
            <button
              ref={menuButtonRef}
              className="icon-button mobile-menu-button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <motion.nav
          id="mobile-nav"
          initial={false}
          animate={{ opacity: open ? 1 : 0, y: open || reducedMotion ? 0 : -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          inert={!open}
          aria-hidden={!open}
          data-open={open}
          aria-label="Mobile navigation"
          className="mobile-nav"
        >
          {[
            ['/shop', 'Collection'],
            ['/forge', 'Ragnor Forge'],
            ['/saved', 'Saved designs'],
            ['/about', 'Our story'],
          ].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </motion.nav>
      </div>
    </>
  )
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="wordmark" to="/">
            <BrandLogo variant="light" />
          </Link>
          <p>
            For the ones who don’t fit the mould.
            <br />
            Imagine It. Wear It.
          </p>
        </div>
        <nav aria-label="Explore">
          <span className="eyebrow">EXPLORE</span>
          <Link to="/shop">Collection</Link>
          <Link to="/forge">Ragnor Forge</Link>
          <Link to="/saved">Saved designs</Link>
        </nav>
        <nav aria-label="Information">
          <span className="eyebrow">THE DETAILS</span>
          <Link to="/about">Our story & contact</Link>
          <Link to="/account">Your account</Link>
          <Link to="/admin">Admin preview</Link>
        </nav>
        <div>
          <span className="eyebrow">INDEPENDENT EXPRESSION.</span>
          <p>
            Conceived in India.
            <br />
            For wherever you take it.
          </p>
          <span className="footer-badge">PHASE 01 · STOREFRONT PREVIEW</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} RAGNOR. All rights reserved.</span>
        <span>Sample collection. Orders are not open yet.</span>
        <span>INDIA / INR ₹</span>
      </div>
    </footer>
  )
}
class ErrorBoundary extends Component<
  {
    children: ReactNode
  },
  {
    failed: boolean
  }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <div className="empty-state">
        <h1>Something went off course.</h1>
        <p>The page couldn’t load. Your saved browser data has not been deleted.</p>
        <button className="button button-dark" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    ) : (
      this.props.children
    )
  }
}
function Shell() {
  const { notice, setNotice } = useStore()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <RouteReset />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="loading-state" role="status">
              <LoaderCircle className="spinner" /> Opening your workspace…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/forge" element={<Forge />} />
            <Route path="/account" element={<Account />} />
            <Route path="/saved" element={<SavedDesigns />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  )
}
export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <StoreProvider>
            <Shell />
          </StoreProvider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  )
}
