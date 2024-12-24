'use server'
import { createClient } from '@/lib/supabase/server'
import { Billboard, ProductSearchParams, ProductWithDetails } from './types'

export async function searchProducts(params: ProductSearchParams): Promise<ProductWithDetails[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_variants(
        *,
        size:sizes(*),
        color:colors(*),
        stock:stock(*),
        images(*)
      ),
      product_features(*),
      product_tags(
        tag:tags(*)
      )
    `)

  if (params.query) {
    query = query.ilike('name', `%${params.query}%`)
  }

  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId)
  }

  if (params.minPrice !== undefined) {
    query = query.gte('price', params.minPrice)
  }

  if (params.maxPrice !== undefined) {
    query = query.lte('price', params.maxPrice)
  }

  if (params.sortBy) {
    const [field, order] = params.sortBy.split('-')
    query = query.order(field, { ascending: order === 'asc' })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as ProductWithDetails[]
}

export async function getProductsByCategoryId(categoryId: string): Promise<ProductWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_variants(
        *,
        size:sizes(*),
        color:colors(*),
        stock:stock(*),
        images(*)
      ),
      product_features(*),
      product_tags(
        tag:tags(*)
      )
    `)
    .eq('category_id', categoryId)

  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }

  return data as ProductWithDetails[]
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_variants(
        *,
        size:sizes(*),
        color:colors(*),
        stock:stock(*),
        images(*)
      ),
      product_features(*),
      product_tags(
        tag:tags(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as ProductWithDetails
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