import { ArrowDown, ArrowRight, ArrowUpRight, MoveUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { ProductCard } from '../components/ProductCard'
import { GarmentPreview } from '../components/GarmentPreview'
import { products } from '../lib/catalog'
import { useReveal } from '../lib/useReveal'
export function Home() {
  const [newsletter, setNewsletter] = useState('')
  const reveal = useReveal()
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-entrance">
            <div className="eyebrow">
              <span className="tiny-dot" /> INDEPENDENT MINDS. ORIGINAL THREADS.
            </div>
            <h1>
              Not for everyone.
              <br />
              <em>Made for you.</em>
            </h1>
            <p>
              Considered streetwear. Uncompromising expression.
              <br className="desktop-break" /> A blank canvas for whatever makes you, you.
            </p>
            <div className="hero-buttons">
              <Button asChild>
                <Link to="/shop">
                  Shop Collection <ArrowUpRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/forge">
                  <Sparkles size={16} /> Enter Forge
                </Link>
              </Button>
            </div>
          </div>
          <div className="hero-bottom">
            <span>IMAGINE IT. WEAR IT.</span>
            <span className="flex items-center gap-3">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1529139513065-c5d66c1d25a7?auto=format&amp;fit=crop&amp;w=1100&amp;q=85"
            referrerPolicy="no-referrer"
            sizes="(max-width: 600px) 100vw, 50vw"
            srcSet="https://images.unsplash.com/photo-1529139513065-c5d66c1d25a7?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1529139513065-c5d66c1d25a7?auto=format&fit=crop&w=1100&q=85 1100w"
            decoding="async"
            alt="Fashion editorial placeholder: relaxed streetwear in a city setting"
            fetchPriority="high"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="hero-fallback">
            <GarmentPreview color="#292a26" artwork="origin" />
          </div>
          <div className="hero-image-top">
            <span>R / 001</span>
            <span>THE NEW UNIFORM</span>
          </div>
          <div className="hero-image-bottom">
            <div>
              <span className="eyebrow">COLLECTION 001</span>
              <h2>Everyday. Extraordinary.</h2>
            </div>
            <Link to="/shop" aria-label="Explore collection 001">
              <ArrowUpRight size={28} />
            </Link>
          </div>
          <span className="image-credit">EDITORIAL PLACEHOLDER</span>
        </div>
      </section>
      <div className="brand-strip">
        <span>LESS NOISE. MORE YOU.</span>
        <span>✳</span>
        <span>DESIGNED WITH INTENTION</span>
        <span>✳</span>
        <span>YOUR IDEAS. YOUR UNIFORM.</span>
        <span>✳</span>
        <span>RAGNOR FORGE</span>
      </div>
      <section className="section collection-section">
        <motion.div {...reveal} className="section-heading">
          <div>
            <span className="eyebrow">01 / THE COLLECTION</span>
            <h2>
              Good things. <em>On repeat.</em>
            </h2>
          </div>
          <Link className="text-link" to="/shop">
            Explore the collection <ArrowUpRight size={17} />
          </Link>
        </motion.div>
        <div className="product-grid home-products">
          {products.slice(0, 3).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <p className="sample-note">Concept collection · Sample garments and indicative pricing</p>
      </section>
      <section className="forge-feature">
        <motion.div {...reveal} className="forge-feature-art">
          <span className="eyebrow">AN IDEA IS ALL IT TAKES.</span>
          <div className="forge-orbit" />
          <GarmentPreview artwork="terrain" color="#e6e0d1" />
          <span className="floating-prompt">
            <Sparkles size={15} /> “Something a little out of this world.”
          </span>
          <span className="art-caption">LOCAL SAMPLE DESIGN / 002</span>
        </motion.div>
        <motion.div {...reveal} className="forge-feature-copy">
          <span className="eyebrow orange">
            <Sparkles size={15} /> INTRODUCING RAGNOR FORGE
          </span>
          <h2>
            Your imagination.
            <br />
            Your <em>next favourite.</em>
          </h2>
          <p>
            A new way to make it yours. Start with an idea. Find your canvas. Shape something that
            feels like you.
          </p>
          <div className="forge-steps">
            {[
              ['01', 'Imagine', 'Bring a thought, a mood, a wild idea.'],
              ['02', 'Make it yours', 'Explore garments, colours and artwork.'],
              ['03', 'Keep creating', 'Save your concept. Come back to it.'],
            ].map(([num, title, copy]) => (
              <div key={num}>
                <span>{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="accent" asChild>
            <Link to="/forge">
              Step inside Forge <ArrowUpRight size={17} />
            </Link>
          </Button>
          <p className="demo-disclaimer">
            Interactive studio preview. AI generation is not connected.
          </p>
        </motion.div>
      </section>
      <motion.section {...reveal} className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / FROM THE STUDIO</span>
            <h2>
              Ideas worth <em>wearing.</em>
            </h2>
          </div>
          <span className="muted text-sm">A few starting points. Make them your own.</span>
        </div>
        <div className="design-grid">
          {[
            ['terrain', 'Unknown terrain', '01 / EARTH & EXPLORATION', '#e6e0d1'],
            ['orbit', 'Outside the orbit', '02 / SPACE & POSSIBILITY', '#282925'],
            ['origin', 'Less, but louder', '03 / THE ORIGINAL', '#9d4b32'],
          ].map(([art, title, desc, color]) => (
            <Link to={`/forge?art=${art}`} className={`design-card design-${art}`} key={art}>
              <div className="design-card-preview">
                <GarmentPreview artwork={art} color={color} />
              </div>
              <div className="design-card-copy">
                <span className="eyebrow">{desc}</span>
                <h3>
                  {title}
                  <ArrowUpRight size={21} />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
      <motion.section {...reveal} className="philosophy">
        <span className="eyebrow">THE RAGNOR WAY</span>
        <h2>
          Clothes should say something.
          <br />
          <em>Make sure it’s you.</em>
        </h2>
        <p>
          We believe the best thing you can wear is your own point of view.
          <br />
          Thoughtful silhouettes. Space for individuality. No permission needed.
        </p>
        <Link className="text-link" to="/about">
          This is Ragnor <ArrowUpRight size={18} />
        </Link>
        <span className="philosophy-mark" aria-hidden="true">
          R.
        </span>
      </motion.section>
      <motion.section {...reveal} className="newsletter">
        <div>
          <span className="eyebrow">STAY IN THE LOOP</span>
          <h2>
            The next chapter. <em>First.</em>
          </h2>
          <p>Collection drops, studio notes, and a little inspiration.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setNewsletter(
              'Newsletter sign-up is not connected yet. No email was submitted or stored.',
            )
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="newsletter-input">
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              autoComplete="email"
              maxLength={254}
            />
            <button type="submit" aria-label="Check newsletter availability">
              <MoveUpRight size={23} />
            </button>
          </div>
          <p role="status">
            {newsletter || 'Newsletter preview · Subscriptions open in a future phase.'}
          </p>
        </form>
      </motion.section>
      <div className="prefooter">
        <span>YOUR NEXT CHAPTER STARTS WITH A BLANK CANVAS.</span>
        <Link to="/forge">
          MAKE IT YOURS <ArrowRight size={17} />
        </Link>
      </div>
    </>
  )
}
