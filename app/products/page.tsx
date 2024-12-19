'use client'
import React, { useState, useEffect, Suspense } from 'react'

import { ProductWithVariants } from '@/lib/store/types'
import { createClient } from '@/lib/supabase/client'
import { getProductsByCategoryId, searchProducts } from '@/lib/store/search-products'
import { ProductSearch } from '@/components/store/product-search'
import { ProductListing } from '@/components/store/product'
import { useSearchParams } from 'next/navigation'
function SearchParamsWrapper({ onCategoryChange }: { onCategoryChange: (categoryId: string | null) => void }) {
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    
    useEffect(() => {
      onCategoryChange(categoryId)
    }, [categoryId, onCategoryChange])
    
    return null
  }

  export default function ProductsPage() {
    const supabase = createClient()
    const [products, setProducts] = useState<ProductWithVariants[]>([])
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState<any[]>([])
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
    
    useEffect(() => {
      // Fetch categories and initial products
      const fetchInitialData = async () => {
        try {
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
  
          setCategories(categoriesData || [])
          if(currentCategoryId){
              const data = await getProductsByCategoryId(currentCategoryId)
              if(data){
                  if (Array.isArray(data)) {
                      setProducts([...data])
                  } else {
                      console.error('Expected data to be an array:', data)
                  }
              }
          } else {
              const initialProducts = await searchProducts({})
              setProducts(initialProducts)
          }
        } catch (error) {
          console.error('Error fetching initial data:', error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchInitialData()
    }, [currentCategoryId])
  
    const handleSearch = (searchParams: any) => {
      // Implement search logic here
      console.log('Search params:', searchParams)
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={null}>
          <SearchParamsWrapper onCategoryChange={setCurrentCategoryId} />
        </Suspense>
        <ProductSearch 
          categories={categories} 
          onSearch={handleSearch} 
        />
        <Suspense fallback={<div>Loading...</div>}>
          <ProductListing products={products} />
        </Suspense>
        {loading && (
          <span className='text-sm'>Loading</span>
        )}
        {products?.length === 0 && !loading && (
          <span className='text-sm'>No products found</span>
        )}
      </div>
    )
  }