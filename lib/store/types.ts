import { Database } from '../supabase/types'

// Extract row types from Supabase schema
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Variant = Database['public']['Tables']['product_variants']['Row']
export type Billboard = Database['public']['Tables']['billboards']['Row']
export type Size = Database['public']['Tables']['sizes']['Row']
export type Color = Database['public']['Tables']['colors']['Row']
export type Image = Database['public']['Tables']['images']['Row'] & {
  is_primary?: boolean
}
export type ProductFeature = Database['public']['Tables']['product_features']['Row']
export type Stock = Database['public']['Tables']['stock']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']

// Extended types for more comprehensive data fetching
export interface ProductWithDetails extends Product {
  category: Category
  product_variants: (Variant & {
    size: Size
    color: Color
    stock: Stock[]
    images: Image[]
  })[]
  product_features: ProductFeature[]
  product_tags: {
    tag: Tag
  }[]
}

// Search and filter types
export interface ProductSearchParams {
  query?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sizeId?: string
  colorId?: string
  tagId?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
}

// Cart types for Zustand store
export interface CartItem {
  variantId: string
  quantity: number
  product_variant: Variant & { 
    product: Product
    size: Size
    color: Color
    stock: Stock[]
    images: Image[]
  }
}