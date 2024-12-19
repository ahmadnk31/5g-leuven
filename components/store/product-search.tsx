'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Category, ProductSearchParams } from '@/lib/store/types'
import { useSearchParams, useRouter } from 'next/navigation'

interface ProductSearchProps {
  categories: Category[]
  onSearch: (params: ProductSearchParams) => void
  initialParams: ProductSearchParams
}

const ALL_CATEGORIES = 'all'

export function ProductSearch({ categories, onSearch, initialParams }: ProductSearchProps) {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>(initialParams)
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  useEffect(() => {
    const params: ProductSearchParams = {
      query: urlSearchParams.get('query') || '',
      categoryId: urlSearchParams.get('categoryId') || ALL_CATEGORIES,
      minPrice: urlSearchParams.get('minPrice') ? Number(urlSearchParams.get('minPrice')) : undefined,
      maxPrice: urlSearchParams.get('maxPrice') ? Number(urlSearchParams.get('maxPrice')) : undefined,
      sortBy: (urlSearchParams.get('sortBy') as ProductSearchParams['sortBy']) || undefined,
    }
    setSearchParams(params)
  }, [urlSearchParams])

  const handleSearch = useCallback(() => {
    const searchParamsToSend = {
      ...searchParams,
      categoryId: searchParams.categoryId === ALL_CATEGORIES ? undefined : searchParams.categoryId,
    }
    onSearch(searchParamsToSend)
    const searchQuery = new URLSearchParams()
    Object.entries(searchParamsToSend).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchQuery.set(key, value.toString())
      }
    })
    router.push(`/products?${searchQuery.toString()}`)
  }, [searchParams, onSearch, router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }, [])

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          name="query"
          placeholder="Search products..." 
          value={searchParams.query || ''}
          onChange={handleInputChange}
          className="flex-grow"
          aria-label="Search products"
        />
        <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Select 
          value={searchParams.categoryId || ALL_CATEGORIES} 
          onValueChange={(value) => handleSelectChange('categoryId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input 
            name="minPrice"
            type="number" 
            placeholder="Min Price" 
            value={searchParams.minPrice || ''}
            onChange={handleInputChange}
            className="w-full"
            aria-label="Minimum price"
          />
          <Input 
            name="maxPrice"
            type="number" 
            placeholder="Max Price" 
            value={searchParams.maxPrice || ''}
            onChange={handleInputChange}
            className="w-full"
            aria-label="Maximum price"
          />
        </div>

        <Select 
          value={searchParams.sortBy || ''}
          onValueChange={(value) => handleSelectChange('sortBy', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

