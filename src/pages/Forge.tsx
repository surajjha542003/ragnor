import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  Check,
  MessageSquare,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Shirt,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { GarmentPreview } from '../components/GarmentPreview'
import { ColorPicker, SizePicker } from './Shop'
import { colors, sizes } from '../lib/catalog'
import type { Garment } from '../lib/catalog'
import { useStore } from '../lib/store'
type Message = {
  role: 'you' | 'studio'
  text: string
}
const tabs = [
  { id: 'chat', label: 'Conversation', icon: MessageSquare },
  { id: 'preview', label: 'Preview', icon: Shirt },
  { id: 'options', label: 'Customise', icon: SlidersHorizontal },
]
export default function Forge() {
  const reducedMotion = useReducedMotion()
  const [params] = useSearchParams()
  const { designs, save } = useStore()
  const saved = designs.find((d) => d.id === params.get('design'))
  const [garment, setGarment] = useState<Garment>(
    saved?.garment || (params.get('garment') === 'Hoodie' ? 'Hoodie' : 'T-shirt'),
  )
  const [color, setColor] = useState(
    saved?.color || colors.find((c) => c.hex === params.get('color'))?.hex || colors[0].hex,
  )
  const [size, setSize] = useState(
    saved?.size || (sizes.includes(params.get('size') || '') ? params.get('size')! : 'M'),
  )
  const [artwork, setArtwork] = useState(
    saved?.artwork ||
      (['raven', 'origin', 'terrain', 'orbit'].includes(params.get('art') || '')
        ? params.get('art')!
        : 'terrain'),
  )
  const [scale, setScale] = useState(saved?.scale || 1)
  const [name, setName] = useState(saved?.name || 'Untitled expression')
  const [designId] = useState(saved?.id || crypto.randomUUID())
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'studio',
      text: 'Welcome to your blank canvas. This is a local studio demo, not an AI conversation. Try a sample idea below, or explore the garment controls. Nothing is sent to a server.',
    },
  ])
  const [activeTab, setActiveTab] = useState('preview')
  const [error, setError] = useState('')
  const [savedStatus, setSavedStatus] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)
  function submit(text: string) {
    if (!text.trim()) {
      setError('Add a few words to explore a sample.')
      return
    }
    const lower = text.toLowerCase()
    const art = /raven|sigil/.test(lower)
      ? 'raven'
      : /space|orbit|cosmic|world/.test(lower)
        ? 'orbit'
        : /earth|terrain|mountain|nature/.test(lower)
          ? 'terrain'
          : /minimal|logo|type|original/.test(lower)
            ? 'origin'
            : null
    if (art) setArtwork(art)
    setMessages((m) => [
      ...m,
      { role: 'you', text: text.trim() },
      {
        role: 'studio',
        text: art
          ? `Loaded the local “${art}” sample using a keyword match. This is pre-made artwork, not an AI-generated design. Use Customise to adjust it.`
          : 'AI generation is not connected, so I cannot create artwork from this request. Your idea stays in this session. Choose Raven, Terrain, Orbit or Origin in Customise to explore a local sample.',
      },
    ])
    setPrompt('')
    setError('')
    setSavedStatus(false)
    requestAnimationFrame(() =>
      historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'instant' }),
    )
  }
  function reset() {
    setGarment('T-shirt')
    setColor(colors[0].hex)
    setSize('M')
    setArtwork('terrain')
    setScale(1)
    setName('Untitled expression')
    setSavedStatus(false)
  }
  return (
    <div className="forge-page">
      <div className="studio-header">
        <div>
          <span className="studio-logo">
            <Sparkles size={22} /> Ragnor Forge<span className="studio-beta">LOCAL DEMO</span>
          </span>
          <p>Imagine it. Make it yours.</p>
        </div>
        <Link className="text-link" to="/saved">
          Saved designs <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="studio-notice">
        <span className="tiny-dot" /> Your canvas is live. AI generation and ordering are not
        connected.
      </div>
      <div className="studio-tabs" role="tablist" aria-label="Studio panels">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            onKeyDown={(e) => {
              let next: number
              if (e.key === 'ArrowRight') next = (index + 1) % 3
              else if (e.key === 'ArrowLeft') next = (index + 2) % 3
              else if (e.key === 'Home') next = 0
              else if (e.key === 'End') next = 2
              else return
              e.preventDefault()
              setActiveTab(tabs[next].id)
              document.getElementById(`tab-${tabs[next].id}`)?.focus()
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      <div className="studio-workspace">
        <section
          id="panel-chat"
          role="tabpanel"
          aria-labelledby="tab-chat"
          aria-label="Conversation"
          className={`studio-chat studio-panel ${activeTab === 'chat' ? 'mobile-active' : ''}`}
        >
          <div className="panel-heading">
            <span>
              <MessageSquare size={16} /> THE CONVERSATION
            </span>
            <span className="muted">01</span>
          </div>
          <div
            className="chat-history"
            ref={historyRef}
            role="log"
            aria-label="Local conversation history"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`chat-message ${message.role}`}
                initial={reducedMotion || index === 0 ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
              >
                <span>{message.role === 'you' ? 'YOU' : 'FORGE / SAMPLE GUIDE'}</span>
                <p>{message.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="suggestions">
            <span className="eyebrow">START SOMEWHERE</span>
            {[
              'Minimal typography, maximum impact',
              'Earth tones and unknown terrain',
              'A cosmic orbit graphic',
            ].map((suggestion) => (
              <button key={suggestion} onClick={() => submit(suggestion)}>
                {suggestion}
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
          <form
            className="prompt-form"
            onSubmit={(e) => {
              e.preventDefault()
              submit(prompt)
            }}
          >
            <label htmlFor="prompt">What’s on your mind?</label>
            <textarea
              id="prompt"
              placeholder="Describe your idea…"
              value={prompt}
              maxLength={600}
              onChange={(e) => setPrompt(e.target.value)}
              aria-describedby={error ? 'prompt-error' : 'prompt-help'}
            />
            <div>
              <span id="prompt-help">{prompt.length}/600 · Local samples only</span>
              <button type="submit" aria-label="Explore local sample">
                <ArrowUp size={20} />
              </button>
            </div>
            {error && (
              <p id="prompt-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </section>
        <section
          id="panel-preview"
          role="tabpanel"
          aria-labelledby="tab-preview"
          aria-label="Garment preview"
          className={`studio-preview studio-panel ${activeTab === 'preview' ? 'mobile-active' : ''}`}
        >
          <div className="preview-top">
            <span>YOUR CANVAS / FRONT</span>
            <button className="icon-button" aria-label="Reset garment design" onClick={reset}>
              <RotateCcw size={17} />
            </button>
          </div>
          <div className="preview-stage">
            <span className="preview-cross top-left">+</span>
            <span className="preview-cross top-right">+</span>
            <motion.div
              className="preview-garment"
              key={`${garment}-${artwork}`}
              initial={reducedMotion ? false : { opacity: 0.65, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <GarmentPreview garment={garment} color={color} artwork={artwork} scale={scale} />
            </motion.div>
            <span className="preview-cross bottom-left">+</span>
            <span className="preview-cross bottom-right">+</span>
          </div>
          <div className="preview-description">
            <h1>{name || 'Untitled expression'}</h1>
            <p>
              {garment} / {colors.find((c) => c.hex === color)?.name} / {size}
            </p>
            <span>CONCEPT MOCKUP · NOT A PRODUCTION PROOF</span>
          </div>
        </section>
        <section
          id="panel-options"
          role="tabpanel"
          aria-labelledby="tab-options"
          aria-label="Garment controls"
          className={`studio-options studio-panel ${activeTab === 'options' ? 'mobile-active' : ''}`}
        >
          <div className="panel-heading">
            <span>
              <SlidersHorizontal size={16} /> MAKE IT YOURS
            </span>
            <span className="muted">03</span>
          </div>
          <div className="options-body" onChange={() => setSavedStatus(false)}>
            <label htmlFor="design-name">Design name</label>
            <input
              id="design-name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
            />
            <fieldset>
              <legend>Your canvas</legend>
              <div className="garment-options">
                {(['T-shirt', 'Hoodie'] as const).map((g) => (
                  <button
                    key={g}
                    aria-pressed={garment === g}
                    className={garment === g ? 'selected' : ''}
                    onClick={() => {
                      setGarment(g)
                      setSavedStatus(false)
                    }}
                  >
                    <Shirt size={22} />
                    {g}
                  </button>
                ))}
              </div>
            </fieldset>
            <ColorPicker
              value={color}
              onChange={(v) => {
                setColor(v)
                setSavedStatus(false)
              }}
            />
            <SizePicker
              value={size}
              onChange={(v) => {
                setSize(v)
                setSavedStatus(false)
              }}
            />
            <fieldset>
              <legend>Local sample artwork</legend>
              <div className="artwork-options">
                {['raven', 'origin', 'terrain', 'orbit'].map((art) => (
                  <button
                    key={art}
                    aria-pressed={artwork === art}
                    className={artwork === art ? 'selected' : ''}
                    onClick={() => {
                      setArtwork(art)
                      setSavedStatus(false)
                    }}
                  >
                    {art}
                    {artwork === art && <Check size={13} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="art-scale" className="flex justify-between">
              Artwork size <span>{Math.round(scale * 100)}%</span>
            </label>
            <input
              type="range"
              id="art-scale"
              min="0.6"
              max="1.4"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
            <Button
              variant="accent"
              className="w-full"
              onClick={() => {
                if (!name.trim()) {
                  setError('Name your design before saving.')
                  setActiveTab('options')
                  document.getElementById('design-name')?.focus()
                  return
                }
                const persisted = save({
                  id: designId,
                  name: name.trim(),
                  garment,
                  color,
                  size,
                  artwork,
                  scale,
                })
                setSavedStatus(persisted)
                setError('')
              }}
            >
              <Bookmark size={17} />
              {savedStatus ? 'Saved on this device' : 'Save design'}
            </Button>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <Button
              variant="outline"
              className="w-full studio-show-preview"
              onClick={() => setActiveTab('preview')}
            >
              View updated preview
            </Button>
            <p className="demo-disclaimer">
              Saved in this browser. No account required. Custom designs cannot be ordered yet.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
