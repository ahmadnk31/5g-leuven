'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Category, ProductSearchParams } from '@/lib/store/types'
import { useSearchParams } from 'next/navigation'

interface ProductSearchProps {
  categories: Category[]
  onSearch: (params: ProductSearchParams) => void
}

export function ProductSearch({ categories, onSearch }: ProductSearchProps) {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({})
  const handleSearch = () => {
    onSearch(searchParams)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input 
        placeholder="Search products..." 
        value={searchParams.query || ''}
        onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
        className="flex-grow"
      />

      <Select 
        value={searchParams.categoryId || ''} 
        onValueChange={(value) => setSearchParams(prev => ({ ...prev, categoryId: value }))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input 
          type="number" 
          placeholder="Min Price" 
          value={searchParams.minPrice || ''}
          onChange={(e) => setSearchParams(prev => ({ 
            ...prev, 
            minPrice: e.target.value ? Number(e.target.value) : undefined 
          }))}
          className="w-24"
        />
        <Input 
          type="number" 
          placeholder="Max Price" 
          value={searchParams.maxPrice || ''}
          onChange={(e) => setSearchParams(prev => ({ 
            ...prev, 
            maxPrice: e.target.value ? Number(e.target.value) : undefined 
          }))}
          className="w-24"
        />
      </div>

      <Select 
        value={searchParams.sortBy || ''} 
        onValueChange={(value) => setSearchParams(prev => ({ 
          ...prev, 
          sortBy: value as ProductSearchParams['sortBy'] 
        }))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}