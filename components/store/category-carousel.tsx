'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/lib/store/types'
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface CategoryCarouselProps {
  categories: Category[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <section className="py-8 px-4">
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <Carousel 
          opts={{
            align: "start",
            loop: true,
            
          }}
          className="w-full group"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem 
                key={category.id} 
                className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link href={`/products?categoryId=${category.id}`}>
                  <Card className="overflow-hidden transition-transform hover:scale-105">
                    <div className="relative aspect-square">
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden group-hover:flex left-8 md:group-hover:flex" />
          <CarouselNext className="hidden group-hover:flex right-8 md:group-hover:flex" />
        </Carousel>
      </div>
    </section>
  )
}