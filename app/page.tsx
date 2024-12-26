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
import { ArrowRight, ShoppingCart } from 'lucide-react'

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
  console.log('featuredProducts',Object.keys(featuredProducts))
  return (
    <div className="space-y-12">
      {/* Billboard Carousel */}
      {billboards.length > 0 && (
        <div className="relative">
          <Carousel className="w-full group">
            <CarouselContent className='relative'>
              {billboards.map((billboard) => (
                <CarouselItem key={billboard.id}>
                  <div className="relative bg-blend-overlay z-10 w-full h-[500px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
                    <Image 
                      src={billboard.image_url} 
                      alt={billboard.label} 
                      fill 
                      className="object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white space-y-6 max-w-2xl px-4">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">{billboard.label}</h2>
                        <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow-md max-w-lg mx-auto">
                          Discover our latest collection and exclusive offers
                        </p>
                        <Button 
                          variant="secondary" 
                          className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                        >
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-10 invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100' />
            <CarouselNext className='right-10 invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100' />
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
          <h2 className="text-2xl font-bold mb-6 relative inline-block">
            {title}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts[title]?.map(product => {
              const firstVariant = product.product_variants[0]
              const firstImage = product.product_variants[0]

              return (
                <Card key={product.id} className='overflow-hidden group relative hover:shadow-xl transition-shadow duration-300'>
                  {firstImage && (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <Image 
                        src={firstImage.images[0].url} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Quick View
                        </Button>
                      </div>
                    </div>
                  )}
                  <CardContent className="pt-4 relative">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      {firstVariant && (
                        <p className="text-muted-foreground font-medium">
                          ${(firstVariant.price ?? product.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      href={`/products/${product.id}`} 
                      className="w-full"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                      >
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

