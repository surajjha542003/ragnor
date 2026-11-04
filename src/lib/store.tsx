import { addCartItem, updateCartQuantity } from './cartActions'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { colors, products, sizes } from './catalog'
import type { Design } from './catalog'
export type CartItem = {
  productId: string
  size: string
  color: string
  quantity: number
}
type State = {
  cart: CartItem[]
  designs: Design[]
}
type Store = State & {
  notice: string
  setNotice: (text: string) => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  quantity: (index: number, value: number) => void
  save: (design: Design) => boolean
  removeDesign: (id: string) => void
}
const Context = createContext<Store | null>(null)
const key = 'ragnor:v1'
function read(): {
  state: State
  error: string
} {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { state: { cart: [], designs: [] }, error: '' }
    const value = JSON.parse(raw) as State
    if (!Array.isArray(value.cart) || !Array.isArray(value.designs))
      throw new Error('Invalid storage')
    const cart = value.cart.filter(
      (i) =>
        i &&
        products.some((p) => p.id === i.productId) &&
        sizes.includes(i.size) &&
        colors.some((c) => c.hex === i.color) &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0 &&
        i.quantity <= 10,
    )
    const designs = value.designs.filter(
      (d) =>
        d &&
        typeof d.id === 'string' &&
        typeof d.name === 'string' &&
        ['T-shirt', 'Hoodie'].includes(d.garment) &&
        sizes.includes(d.size) &&
        colors.some((c) => c.hex === d.color) &&
        ['raven', 'origin', 'terrain', 'orbit'].includes(d.artwork) &&
        Number.isFinite(d.scale) &&
        d.scale >= 0.6 &&
        d.scale <= 1.4,
    )
    return { state: { cart, designs }, error: '' }
  } catch {
    return {
      state: { cart: [], designs: [] },
      error: 'Browser data could not be loaded. You can continue with a fresh collection.',
    }
  }
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(read)
  const [state, setState] = useState(initial.state)
  const [notification, setNotification] = useState({ text: initial.error })
  const setNotice = useCallback((text: string) => setNotification({ text }), [])
  const notice = notification.text
  const currentState = useRef(state)
  useEffect(() => {
    if (!notification.text) return
    const timer = window.setTimeout(() => setNotification({ text: '' }), 6000)
    return () => window.clearTimeout(timer)
  }, [notification])
  function commit(next: State, message = '') {
    currentState.current = next
    setState(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
      if (message) setNotice(message)
      return true
    } catch {
      setNotice('Browser storage is unavailable. Changes will only last for this session.')
      return false
    }
  }
  const store: Store = {
    ...state,
    notice,
    setNotice,
    addToCart: (item) => {
      // Draft collection entries must never enter the legacy sample bag.
      if (!products.some((product) => product.id === item.productId)) {
        setNotice('This collection is awaiting approval. Nothing added to your bag.')
        return
      }
      const current = currentState.current
      const result = addCartItem(current.cart, item)
      if (result.cart === current.cart) {
        if (result.message) setNotice(result.message)
        return
      }
      commit({ ...current, cart: result.cart }, result.message)
    },
    quantity: (index, value) => {
      const current = currentState.current
      const result = updateCartQuantity(current.cart, index, value)
      if (result.cart === current.cart) {
        if (result.message) setNotice(result.message)
        return
      }
      commit({ ...current, cart: result.cart }, result.message)
    },
    save: (design) =>
      commit(
        { ...state, designs: [...state.designs.filter((d) => d.id !== design.id), design] },
        'Design saved on this device.',
      ),
    removeDesign: (id) => commit({ ...state, designs: state.designs.filter((d) => d.id !== id) }),
  }
  return <Context.Provider value={store}>{children}</Context.Provider>
}
// Kept alongside its provider so all consumers share one state contract.
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const store = useContext(Context)
  if (!store) throw new Error('StoreProvider is missing')
  return store
}
