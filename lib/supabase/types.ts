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
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category_id?: string
          created_at?: string
        }
      }
      variants: {
        Row: {
          id: string
          product_id: string
          name: string
          price: number
          stock: number
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          price: number
          images: string[]
          stock: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          price?: number
          images?: string[]
          stock?: number
          created_at?: string
        }
      }
      billboards: {
        Row: {
          id: string
          label: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          image_url?: string
          created_at?: string
        }
      }
    }
  }
}