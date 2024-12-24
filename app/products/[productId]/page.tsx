'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getProductById } from '@/lib/store/search-products'
import { ProductWithDetails, CartItem } from '@/lib/store/types'
import useCartStore from '@/lib/store/store'
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
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import TipTapEditorPreview from '@/components/tiptap-editor-preview'
import { JSONContent } from '@tiptap/core'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart,removeFromCart,items } = useCartStore()
  const [isHydrated, setIsHydrated] = useState(false)
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductById(params.productId)
      setProduct(fetchedProduct)
      
      if (fetchedProduct?.product_variants.length) {
        setSelectedVariant(fetchedProduct.product_variants[0].id)
        setCurrentImageIndex(0)
      }
    }
    
    fetchProduct()
  }, [params.productId])

  // Memoize current variant
  const currentVariant = product?.product_variants.find(v => v.id === selectedVariant)
  const currentImages = currentVariant?.images || []
  const stockQuantity = currentVariant?.stock[0]?.quantity || 0

  useEffect(() => {
    // Initialize the store with data from localStorage
    const stored = localStorage.getItem('cart-storage')
    if (stored) {
        try {
            const parsed = JSON.parse(stored)
            if (parsed.state) {
                useCartStore.setState(parsed.state)
            }
        } catch (error) {
            console.error('Error hydrating cart:', error)
        }
    }
    setIsHydrated(true)
}, [])
  // Update quantity if it exceeds stock
  const currentQuantity = items.find(item => item.variantId === selectedVariant)?.quantity || 0
  useEffect(() => {
    if (currentVariant) {
      setQuantity(prev => Math.min(prev, stockQuantity))
    }
  }, [currentVariant, stockQuantity])

  // Handle image navigation
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev < currentImages.length - 1 ? prev + 1 : prev
    )
  }, [currentImages.length])

  const previousImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : prev
    )
  }, [])

  // Handle cart operations
  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant || !currentVariant) return

    const cartItem: CartItem = {
      variantId: currentVariant.id,
      quantity,
      product_variant: {
        ...currentVariant,
        product
      }
    }
    addToCart(cartItem)
    setQuantity(1)
  }, [product, selectedVariant, currentVariant, quantity, addToCart])

  // Loading state
  if (!product) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
  }
  const handleIncrement = () => {
    const maxQuantity = currentVariant?.stock[0]?.quantity || 0
    setQuantity(prev => {
      const newQuantity = prev + 1
      return newQuantity <= maxQuantity ? newQuantity : prev
    })
  }

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }
  return (
    <div className="grid mx-auto py-4 px-4 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {currentVariant && currentImages.length > 0 && (
          <div 
            className="relative w-full aspect-square cursor-pointer group"
            onClick={() => setIsFullscreen(true)}
          >
            <Image 
              src={currentImages[currentImageIndex].url} 
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
        {currentImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {currentImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image.url}
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
              {currentImages.length > 0 && (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImages[currentImageIndex].url}
                    alt={`${product.name} - Fullscreen`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {currentImages.length > 1 && (
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
                    disabled={currentImageIndex === currentImages.length - 1}
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
        <TipTapEditorPreview content={product?.description ?? undefined} isEditable={false} />
        {/* Variant Selection */}
        <div className="my-4">
          <label className="block mb-2">Select Variant</label>
          <Select 
            value={selectedVariant || ''}
            onValueChange={setSelectedVariant}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {product.product_variants.map(variant => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.size.name}, {variant.color.name} - ${(variant.price ?? product.price).toFixed(2)} 
                  {variant.stock[0]?.quantity > 0 
                    ? ` (${variant.stock[0].quantity} in stock)` 
                    : ' (Out of Stock)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Selection */}
        <div className="mb-4">
    <label className="block mb-2">Quantity</label>
    <div className="flex items-center space-x-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center">
        {quantity||currentQuantity}
      </span>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= (currentVariant?.stock[0]?.quantity || 0)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      {currentVariant?.stock[0]?.quantity || 0} items available
    </p>
  </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={
            currentQuantity > 0 
              ? () => removeFromCart(selectedVariant||'') 
              : handleAddToCart
          }
          disabled={!currentVariant || stockQuantity === 0 || quantity > stockQuantity}
          className="w-full"
        >
          {
            currentQuantity > 0 ? 'Remove from cart' : 'Add to Cart'
          }
        </Button>
      </div>
    </div>
  )
}