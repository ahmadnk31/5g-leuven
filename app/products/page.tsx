'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchParams, ProductWithDetails, Category, Size, Color, Tag } from '@/lib/store/types'
import { createClient } from '@/lib/supabase/client'
import { getProductsByCategoryId, searchProducts } from '@/lib/store/search-products'
import { ProductSearch } from '@/components/store/product-search'
import { ProductListing } from '@/components/store/product'
import useCartStore from '@/lib/store/store'

function ProductsPageContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const {items,removeFromCart,addToCart}=useCartStore()
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // Initialize search parameters from URL
  const currentParams: ProductSearchParams = {
    categoryId: searchParams.get('categoryId') || undefined,
    query: searchParams.get('query') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') || undefined,
    sizeId: searchParams.get('sizeId') || undefined,
    colorId: searchParams.get('colorId') || undefined,
    tagId: searchParams.get('tagId') || undefined,
  }

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesData, sizesData, colorsData, tagsData] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('sizes').select('*'),
          supabase.from('colors').select('*'),
          supabase.from('tags').select('*')
        ])

        setCategories(categoriesData.data || [])
        setSizes(sizesData.data || [])
        setColors(colorsData.data || [])
        setTags(tagsData.data || [])
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let fetchedProducts: ProductWithDetails[]
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
  }, [searchParams])

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
        sizes={sizes}
        colors={colors}
        tags={tags}
        onSearch={handleSearch}
        initialParams={currentParams}
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

