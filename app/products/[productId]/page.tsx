'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProductById } from '@/lib/store/search-products'
import { ProductWithVariants, CartItem } from '@/lib/store/types'
import { useCartStore } from '@/lib/store/store'
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCartStore()

  // Get current variant's images
  const currentVariantImages = product?.variants.find(v => v.id === selectedVariant)?.images || []

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct = await getProductById(params.productId)
      setProduct(fetchedProduct)
      
      if (fetchedProduct?.variants.length) {
        setSelectedVariant(fetchedProduct.variants[0].id)
        setCurrentImageIndex(0)
      }
    }
    
    fetchProduct()
  }, [params.productId])

  // Reset image index when variant changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedVariant])

  if (!product) return <div>Loading...</div>

  const handleAddToCart = () => {
    if (selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant)
      if (variant) {
        const cartItem: CartItem = {
          variantId: variant.id,
          quantity,
          variant: {
            ...variant,
            product: product,
            images: variant.images
          }
        }
        addToCart(cartItem)
      }
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < currentVariantImages.length - 1 ? prev + 1 : prev
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    )
  }

  return (
    <div className="grid mx-auto py-4 px-4 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        {currentVariantImages.length > 0 && (
          <div 
            className="relative w-full aspect-square cursor-pointer group"
            onClick={() => setIsFullscreen(true)}
          >
            <Image 
              src={currentVariantImages[currentImageIndex]} 
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              fill 
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100">Click to enlarge</span>
            </div>
          </div>
        )}

        {/* Thumbnail Navigation */}
        {currentVariantImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {currentVariantImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Fullscreen Modal */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-screen-lg h-[90vh] flex items-center justify-center">
            <div className="relative w-full h-full">
              
              
              <div className="relative w-full h-full">
                <Image
                  src={currentVariantImages[currentImageIndex]}
                  alt={`${product.name} - Fullscreen`}
                  fill
                  className="object-contain"
                />
              </div>

              {currentVariantImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={previousImage}
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                    disabled={currentImageIndex === currentVariantImages.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        
        {/* Variant Selection */}
        <div className="mb-4">
          <label className="block mb-2">Select Variant</label>
          <Select 
            value={selectedVariant || ''}
            onValueChange={setSelectedVariant}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map(variant => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.name} - ${variant.price.toFixed(2)} 
                  {variant.stock > 0 
                    ? ` (${variant.stock} in stock)` 
                    : ' (Out of Stock)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Selection */}
        <div className="mb-4">
          <label className="block mb-2">Quantity</label>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="mx-4">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                const selectedVariantObj = product.variants.find(v => v.id === selectedVariant)
                setQuantity(Math.min(
                  quantity + 1, 
                  selectedVariantObj?.stock || 1
                ))
              }}
            >
              +
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          disabled={!selectedVariant || 
            product.variants.find(v => v.id === selectedVariant)?.stock === 0
          }
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}