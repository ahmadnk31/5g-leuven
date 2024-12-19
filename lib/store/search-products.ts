'use server'
import { createClient } from '@/lib/supabase/server';
import { Billboard, ProductSearchParams, ProductWithVariants } from './types'



export async function searchProducts(params: ProductSearchParams): Promise<ProductWithVariants[]> {
    const supabase = await createClient()
  let query = supabase
    .from('products')
    .select(`
      *,
      variants (
        *,
        variant_images (*)
      ),
      categories (*)
    `)

  // Text search
  if (params.query) {
    query = query.or(
      `name.ilike.%${params.query}%,description.ilike.%${params.query}%`
    )
  }

  // Category filter
  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId)
  }

  // Price range filter
  if (params.minPrice !== undefined) {
    query = query.gte('variants.price', params.minPrice)
  }

  if (params.maxPrice !== undefined) {
    query = query.lte('variants.price', params.maxPrice)
  }

  // Sorting
  switch (params.sortBy) {
    case 'price-asc':
      query = query.order('price', { 
        foreignTable: 'variants', 
        ascending: true 
      })
      break
    case 'price-desc':
      query = query.order('price', { 
        foreignTable: 'variants', 
        ascending: false 
      })
      break
    case 'name-asc':
      query = query.order('name', { ascending: true })
      break
    case 'name-desc':
      query = query.order('name', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as ProductWithVariants[]
}

export async function getProductById(id: string): Promise<ProductWithVariants | null> {
    const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants (
        *
      ),
      categories (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as ProductWithVariants
}

export async function getBillboards(): Promise<Billboard[]> {
    const supabase = await createClient()
  const { data, error } = await supabase
    .from('billboards')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching billboards:', error)
    return []
  }

  return data
}
// lib/store/search-suggestions.ts
export async function getProductsByCategoryId(id:string):Promise<ProductWithVariants|null>{
    const supabase=await createClient()
    const {data,error}=await supabase.from('products').select('*,variants(*),categories(*)').eq('category_id',id)
    if(error){
        console.log(error)
        return null
    }
    return data as unknown as ProductWithVariants
}

