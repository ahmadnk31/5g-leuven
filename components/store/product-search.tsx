'use client'

//updated'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Category, ProductSearchParams, Size, Color, Tag } from '@/lib/store/types'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface ProductSearchProps {
  categories: Category[]
  sizes: Size[]
  colors: Color[]
  tags: Tag[]
  onSearch: (params: ProductSearchParams) => void
  initialParams: ProductSearchParams
}

const ALL_CATEGORIES = 'all'
const ALL_SIZES = 'all'
const ALL_COLORS = 'all'
const ALL_TAGS = 'all'

export function ProductSearch({ categories, sizes, colors, tags, onSearch, initialParams }: ProductSearchProps) {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>(initialParams)
  const [isSticky, setIsSticky] = useState(false)
  const [showFullSearch, setShowFullSearch] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const lastScrollY = useRef(0)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 100) { // Only show sticky bar after scrolling 100px
        setIsSticky(currentScrollY < lastScrollY.current) // Show when scrolling up
      } else {
        setIsSticky(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const params: ProductSearchParams = {
      query: urlSearchParams.get('query') || '',
      categoryId: urlSearchParams.get('categoryId') || ALL_CATEGORIES,
      minPrice: urlSearchParams.get('minPrice') ? Number(urlSearchParams.get('minPrice')) : undefined,
      maxPrice: urlSearchParams.get('maxPrice') ? Number(urlSearchParams.get('maxPrice')) : undefined,
      sortBy: (urlSearchParams.get('sortBy') as ProductSearchParams['sortBy']) || undefined,
      sizeId: urlSearchParams.get('sizeId') || ALL_SIZES,
      colorId: urlSearchParams.get('colorId') || ALL_COLORS,
      tagId: urlSearchParams.get('tagId') || ALL_TAGS,
    }
    setSearchParams(params)
  }, [urlSearchParams])

  const handleSearch = useCallback(() => {
    const searchParamsToSend = {
      ...searchParams,
      categoryId: searchParams.categoryId === ALL_CATEGORIES ? undefined : searchParams.categoryId,
      sizeId: searchParams.sizeId === ALL_SIZES ? undefined : searchParams.sizeId,
      colorId: searchParams.colorId === ALL_COLORS ? undefined : searchParams.colorId,
      tagId: searchParams.tagId === ALL_TAGS ? undefined : searchParams.tagId,
    }
    onSearch(searchParamsToSend)
    const searchQuery = new URLSearchParams()
    Object.entries(searchParamsToSend).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchQuery.set(key, value.toString())
      }
    })
    router.push(`/products?${searchQuery.toString()}`)
    setShowFullSearch(false)
  }, [searchParams, onSearch, router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }, [])

  return (
    <>
      {/* Main search section */}
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
          <Button
            variant="ghost"
            onClick={() => setShowFullSearch(!showFullSearch)}
            className="whitespace-nowrap"
          >
            Advanced Search
          </Button>
          <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
        </div>

        {
          showFullSearch && (
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
    
            <Select 
              value={searchParams.sizeId || ALL_SIZES} 
              onValueChange={(value) => handleSelectChange('sizeId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SIZES}>All Sizes</SelectItem>
                {sizes.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
    
            <Select 
              value={searchParams.colorId || ALL_COLORS} 
              onValueChange={(value) => handleSelectChange('colorId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_COLORS}>All Colors</SelectItem>
                {colors.map(color => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
    
            <Select 
              value={searchParams.tagId || ALL_TAGS} 
              onValueChange={(value) => handleSelectChange('tagId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TAGS}>All Tags</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
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
          )
        }
      </div>

      {/* Sticky search bar */}
      <div 
        ref={searchBarRef}
        className={`fixed top-0 left-0 right-0 bg-white shadow-md transform transition-transform duration-300 z-50 ${
          isSticky ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex-grow relative">
              <Input
                name="query"
                placeholder="Search products..."
                value={searchParams.query || ''}
                onChange={handleInputChange}
                className="pr-10"
                aria-label="Search products"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowFullSearch(!showFullSearch)}
              className="whitespace-nowrap"
            >
              Advanced Search
            </Button>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Expandable advanced search options */}
          {showFullSearch && (
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
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

        <Select 
          value={searchParams.sizeId || ALL_SIZES} 
          onValueChange={(value) => handleSelectChange('sizeId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_SIZES}>All Sizes</SelectItem>
            {sizes.map(size => (
              <SelectItem key={size.id} value={size.id}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={searchParams.colorId || ALL_COLORS} 
          onValueChange={(value) => handleSelectChange('colorId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_COLORS}>All Colors</SelectItem>
            {colors.map(color => (
              <SelectItem key={color.id} value={color.id}>
                {color.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={searchParams.tagId || ALL_TAGS} 
          onValueChange={(value) => handleSelectChange('tagId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TAGS}>All Tags</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
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
          )}
        </div>
      </div>
    </>
  )
}