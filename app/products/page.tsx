'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchParams, ProductWithVariants } from '@/lib/store/types'
import { createClient } from '@/lib/supabase/client'
import { getProductsByCategoryId, searchProducts } from '@/lib/store/search-products'
import { ProductSearch } from '@/components/store/product-search'
import { ProductListing } from '@/components/store/product'

function ProductsPageContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])

  // Initialize search parameters from URL
  const currentParams: ProductSearchParams = {
    categoryId: searchParams.get('categoryId') || undefined,
    query: searchParams.get('query') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let fetchedProducts: ProductWithVariants[]
        if (currentParams.categoryId) {
          fetchedProducts = await getProductsByCategoryId(currentParams.categoryId)
        } else {
          fetchedProducts = await searchProducts(currentParams)
        }
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchParams]) // Dependencies changed to searchParams

  const handleSearch = useCallback((params: ProductSearchParams) => {
    const searchQuery = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchQuery.set(key, value.toString())
      }
    })
    router.push(`/products?${searchQuery.toString()}`)
  }, [router])

  return (
    <div className="mx-auto px-4 py-8">
      <ProductSearch 
        categories={categories} 
        onSearch={handleSearch}
        initialParams={currentParams}  // Pass current URL params
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListing products={products} />
      </Suspense>
      {loading && (
        <span className='text-sm'>Loading...</span>
      )}
      {products.length === 0 && !loading && (
        <span className='text-sm'>No products found</span>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}