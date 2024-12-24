'use client'
import React from 'react'
import Image from 'next/image'
import { ProductWithDetails, CartItem } from '@/lib/store/types'
import useCartStore from '@/lib/store/store'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { IconShoppingCartCheck, IconShoppingCartPlus } from '@tabler/icons-react'



interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart,items,removeFromCart } = useCartStore()

  // Select first variant if available
  const firstVariant = product.product_variants[0]
  const firstImage = firstVariant?.images[0]
console.log(``)
  const handleAddToCart = () => {
    if (firstVariant) {
      const cartItem: CartItem = {
        variantId: firstVariant.id,
        quantity: 1,
        product_variant: { ...firstVariant, product },
      }
      addToCart(cartItem)
    }
  }
const handleRemoveFromCart = () => {
    if (firstVariant) {
      removeFromCart(firstVariant.id)
    }
  }
  const currentCartItem = items.find(item => item.variantId === firstVariant?.id)
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        {product.category && (
          <Badge variant="outline">{product.category.name}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {firstImage && (
          <div className="relative w-full aspect-square">
            <Link href={`/products/${product.id}`}>
              <Image 
                src={firstImage.url} 
                alt={product.name} 
                fill
                className="object-cover rounded-md"
              />
            </Link>
          </div>
        )}
        {firstVariant && (
          <div className="mt-2 font-bold">
            ${(firstVariant.price ?? product.price).toFixed(2)}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={currentCartItem ? handleRemoveFromCart : handleAddToCart} 
          disabled={!firstVariant || !firstVariant.stock[0]?.quantity}
          className="w-full"
        >
          {!firstVariant?.stock[0]?.quantity ? 'Out of Stock' : currentCartItem ? (<div className='flex items-center gap-2'>
            
            Added to Cart
            <IconShoppingCartCheck className='size-12' />
          </div>) : (<div className='flex items-center gap-2'>
            Add to Cart
            <IconShoppingCartPlus className='size-12' />
          </div>)}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ProductListingProps {
  products: ProductWithDetails[]
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

