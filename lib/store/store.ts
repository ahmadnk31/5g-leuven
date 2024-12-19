import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from './types'

interface CartState {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            item => item.variantId === newItem.variantId
          )
          
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.variantId === newItem.variantId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              )
            }
          }
          
          return { items: [...state.items, newItem] }
        })
      },
      
      removeFromCart: (variantId) => {
        set(state => ({
          items: state.items.filter(item => item.variantId !== variantId)
        }))
      },
      
      updateQuantity: (variantId, quantity) => {
        set(state => ({
          items: state.items.map(item => 
            item.variantId === variantId 
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0)
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: true
    }
  )
)