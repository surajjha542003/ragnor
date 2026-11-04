import type { CartItem } from './store'

export const CART_LIMIT = 10

export function addCartItem(cart: CartItem[], item: Omit<CartItem, 'quantity'>) {
  const index = cart.findIndex(
    (entry) =>
      entry.productId === item.productId && entry.color === item.color && entry.size === item.size,
  )
  if (index >= 0 && cart[index].quantity >= CART_LIMIT) {
    return { cart, message: 'Limit reached: 10 of this colour and size. Nothing added.' }
  }
  return {
    cart:
      index < 0
        ? [...cart, { ...item, quantity: 1 }]
        : cart.map((entry, i) =>
            i === index ? { ...entry, quantity: entry.quantity + 1 } : entry,
          ),
    message: 'Added to your bag.',
  }
}

export function updateCartQuantity(cart: CartItem[], index: number, value: number) {
  if (!cart[index] || !Number.isInteger(value) || value < 0) return { cart, message: '' }
  if (value > CART_LIMIT) return { cart, message: 'Limit reached: 10 of this colour and size.' }
  if (cart[index].quantity === value) return { cart, message: '' }
  return {
    cart: cart
      .map((entry, i) => (i === index ? { ...entry, quantity: value } : entry))
      .filter((entry) => entry.quantity > 0),
    message: value === 0 ? 'Removed from your bag.' : 'Bag quantity updated.',
  }
}
