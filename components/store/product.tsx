'use client'
import React from 'react'
import Image from 'next/image'
import { ProductWithVariants, CartItem } from '@/lib/store/types'
import { useCartStore } from '@/lib/store/store'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface ProductCardProps {
  product: ProductWithVariants
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore()

  // Select first variant if available
  const firstVariant = product.variants&&product?.variants[0]
  const firstImage = firstVariant?.images&&firstVariant?.images[0]
  console.log(firstVariant)
  const handleAddToCart = () => {
    if (firstVariant) {
      const cartItem: CartItem = {
        variantId: firstVariant.id,
        quantity: 1,
        variant: {
          ...firstVariant,
          product: product,
          images: firstVariant?.images
        }
      }
      addToCart(cartItem)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        {product.category && (
          <Badge variant="outline">{product.category.name}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {firstImage && (
          <div className="relative w-full aspect-square">
            <Link href={`/products/${product.id}`}>
            
                <Image 
                  src={firstImage} 
                  alt={product.name} 
                  layout="fill" 
                  objectFit="cover" 
                />
             
            </Link>
          </div>
        )}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        {firstVariant && (
          <div className="mt-2 font-bold">
            ${firstVariant.price.toFixed(2)}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddToCart} 
          disabled={!firstVariant || firstVariant.stock === 0}
          className="w-full"
        >
          {firstVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ProductListingProps {
  products: ProductWithVariants[]
}

export function ProductListing({ products }: ProductListingProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}