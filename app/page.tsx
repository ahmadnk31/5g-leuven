'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBillboards, searchProducts } from '@/lib/store/search-products'
import { ProductWithVariants, Billboard, Category } from '@/lib/store/types'
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CategoryCarousel } from '@/components/store/category-carousel'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [billboards, setBillboards] = useState<Billboard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()
  const [featuredSections, setFeaturedSections] = useState<{
    [key: string]: ProductWithVariants[]
  }>({
    'Product of the Week': [],
    'Discounted Items': [],
    'New Arrivals': []
  })

  useEffect(() => {
    async function fetchHomePageData() {
      // Fetch billboards
      const fetchedBillboards = await getBillboards()
      setBillboards(fetchedBillboards)

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
      setCategories(categoriesData || [])

      // Fetch featured products
      const productOfWeek = await searchProducts({ 
        sortBy: 'price-desc', 
      })
      const discountedItems = await searchProducts({ 
        sortBy: 'price-asc',  
      })
      const newArrivals = await searchProducts({ 
        sortBy: 'name-asc',  
      })

      setFeaturedSections({
        'Product of the Week': productOfWeek,
        'Discounted Items': discountedItems,
        'New Arrivals': newArrivals
      })
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
      {Object.entries(featuredSections).map(([sectionTitle, products]) => (
        <section key={sectionTitle} className="container mx-auto px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-6">{sectionTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map(product => {
              const firstVariant = product.variants[0]
              const firstImage = firstVariant?.images&&firstVariant?.images[0]

              return (
                <Card key={product.id}>
                  {firstImage && (
                    <div className="relative w-full aspect-square">
                      <Image 
                        src={firstImage} 
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
                        ${firstVariant.price.toFixed(2)}
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