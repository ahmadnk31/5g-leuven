import { Database } from '../supabase/types'

// Extract row types from Supabase schema
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Variant = Database['public']['Tables']['variants']['Row']
export type Billboard = Database['public']['Tables']['billboards']['Row']

// Extended types for more comprehensive data fetching
export interface ProductWithVariants extends Product {
  variants: (Variant)[]
  category?: Category
}

// Search and filter types
export interface ProductSearchParams {
  query?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
}

// Cart types for Zustand store
export interface CartItem {
  variantId: string
  quantity: number
  variant: Variant & { 
    product: Product, 
    images?: string[]
  }
}