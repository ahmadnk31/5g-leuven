'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBillboards, searchProducts } from '@/lib/store/search-products'

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CategoryCarousel } from '@/components/store/category-carousel'
import { createClient } from '@/lib/supabase/client'
import { Billboard, Category, ProductWithDetails } from '@/lib/store/types'

interface FeaturedSection {
  title: string
  query: {
    sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
    limit?: number
    categoryId?: string
    isFeatured?: boolean
  }
}

const featuredSections: FeaturedSection[] = [
  {
    title: 'Product of the Week',
    query: { sortBy: 'price-desc', limit: 1, isFeatured: true }
  },
  {
    title: 'Discounted Items',
    query: { sortBy: 'price-asc', limit: 4 }
  },
  {
    title: 'New Arrivals',
    query: { sortBy: 'name-asc', limit: 4 }
  }
]

export default function HomePage() {
  const [billboards, setBillboards] = useState<Billboard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()
  const [featuredProducts, setFeaturedProducts] = useState<{
    [key: string]: ProductWithDetails[]
  }>({})

  useEffect(() => {
    async function fetchHomePageData() {
      try {
        // Fetch billboards
        const fetchedBillboards = await getBillboards()
        setBillboards(fetchedBillboards)

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
        setCategories(categoriesData || [])

        // Fetch featured products
        const featuredProductsData: { [key: string]: ProductWithDetails[] } = {}
        for (const section of featuredSections) {
          const products = await searchProducts(section.query)
          featuredProductsData[section.title] = products
        }
        setFeaturedProducts(featuredProductsData)
      } catch (error) {
        console.error('Error fetching home page data:', error)
      }
    }

    fetchHomePageData()
  }, [])

  return (
    <div className="space-y-12">
      {/* Billboard Carousel */}
      {billboards.length > 0 && (
        <div className="relative">
          <Carousel className="w-full group">
            <CarouselContent className='relative'>
              {billboards.map((billboard) => (
                <CarouselItem key={billboard.id}>
                  <div className="relative w-full h-[500px]">
                    <Image 
                      src={billboard.image_url} 
                      alt={billboard.label} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">{billboard.label}</h2>
                        <Button variant="secondary">Shop Now</Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-10 invisible group-hover:visible' />
            <CarouselNext className='right-10 invisible group-hover:visible' />
          </Carousel>
        </div>
      )}

      {/* Category Carousel */}
      {categories.length > 0 && (
        <CategoryCarousel categories={categories} />
      )}

      {/* Featured Product Sections */}
      {featuredSections.map(({ title }) => (
        <section key={title} className="mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts[title]?.map(product => {
              const firstVariant = product.product_variants[0]
              const firstImage = product.product_variants[0]?.images[0]

              return (
                <Card key={product.id} className='overflow-hidden'>
                  {firstImage && (
                    <div className="relative w-full aspect-square">
                      <Image 
                        src={firstImage.url} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    {firstVariant && (
                      <p className="text-muted-foreground">
                        ${(firstVariant.price ?? product.price).toFixed(2)}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link 
                      href={`/products/${product.id}`} 
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

