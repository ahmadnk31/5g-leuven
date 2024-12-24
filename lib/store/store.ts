import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { CartItem } from './types'

interface CartState {
  items: CartItem[]
  getTotalItems: () => number
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

type CartPersist = CartState

const persistOptions: PersistOptions<CartPersist> = {
  name: 'cart-storage',
  skipHydration: true,
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item: CartItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.variantId === item.variantId
          )

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += item.quantity
            return { items: updatedItems }
          } else {
            return { items: [...state.items, item] }
          }
        })
      },
      removeFromCart: (variantId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }))
      },
      updateQuantity: (variantId: string, quantity: number) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.variantId === variantId) {
              return { ...item, quantity }
            }
            return item
          })
          return { items: updatedItems }
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    persistOptions
  )
)

export default useCartStore

