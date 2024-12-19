'use client'
import React, { useState, useEffect } from 'react'

import { ProductWithVariants, ProductSearchParams } from '@/lib/store/types'
import { createClient } from '@/lib/supabase/client'
import { getProductsByCategoryId, searchProducts } from '@/lib/store/search-products'
import { ProductSearch } from '@/components/store/product-search'
import { ProductListing } from '@/components/store/product'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  const supabase=createClient()
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const searchParams=useSearchParams()
  const categoryId=searchParams.get('categoryId')
  
  
  useEffect(() => {
    // Fetch categories and initial products
    const fetchInitialData = async () => {
      try {
        // Fetch categories from Supabase
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')

        setCategories(categoriesData || [])
        if(categoryId){
            const data=await getProductsByCategoryId(categoryId)
            if(data){
                if (Array.isArray(data)) {
                    setProducts([...data])
                } else {
                    console.error('Expected data to be an array:', data)
                }
            }
        }else{
            const initialProducts = await searchProducts({})
            setProducts(initialProducts)
        }
        // Initial product fetch
        
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

        fetchInitialData()
  }, [])
 

console.log(categoryId)
  const handleSearch = async (params: ProductSearchParams) => {
    setLoading(true)
    try {
      const searchResults = await searchProducts(params)
      setProducts(searchResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <div className="container mx-auto px-4 py-8">
        
      <ProductSearch 
        categories={categories} 
        onSearch={handleSearch} 
      />
      <ProductListing products={products} />
      {
            loading&&(
                <span className='text-sm'>Loading</span>
            )
        }
        {
            products?.length===0&&!loading&&(
                <span className='text-sm'>No products found</span>
            )
        }
    </div>
  )
}