export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      billboards: {
        Row: {
          id: string
          label: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          is_featured: boolean
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id?: string | null
          is_featured?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string | null
          is_featured?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sizes: {
        Row: {
          id: string
          name: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      colors: {
        Row: {
          id: string
          name: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size_id: string
          color_id: string
          sku: string | null
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size_id: string
          color_id: string
          sku?: string | null
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size_id?: string
          color_id?: string
          sku?: string | null
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          product_id: string
          url: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_features: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      stock: {
        Row: {
          id: string
          variant_id: string
          quantity: number
          reserved_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          quantity: number
          reserved_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          quantity?: number
          reserved_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          product_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          product_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

