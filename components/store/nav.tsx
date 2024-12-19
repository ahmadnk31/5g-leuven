'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Home, Package, Settings, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCartStore } from '@/lib/store/store'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { StreamlineCellularNetwork5g } from '../logo'


export function Navbar() {
    const { items, removeFromCart, updateQuantity } = useCartStore()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const totalItems = items.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = items.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
    const router=useRouter()
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/signin')
        // You might want to redirect the user or update the app state here
    }

    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className=" mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center space-x-2">
          <StreamlineCellularNetwork5g className="h-10 text-primary w-10" aria-label='5G Leuven Logo' />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Products
            </Link>
  
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingCart className="h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div 
                          key={item.variantId} 
                          className="flex items-center border-b pb-4"
                        >
                          {item.variant.images[0] && (
                            <Image 
                              src={item.variant.images[0]} 
                              alt={item.variant.name}
                              width={80} 
                              height={80} 
                              className="mr-4 object-cover rounded"
                            />
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold">
                              {item.variant.product.name} - {item.variant.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${item.variant.price.toFixed(2)} each
                            </p>
                            <div className="flex items-center mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="mr-2"
                              >
                                -
                              </Button>
                              <span>{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="ml-2"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold">
                              ${(item.variant.price * item.quantity).toFixed(2)}
                            </p>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeFromCart(item.variantId)}
                              className="mt-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                
                {items.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4">Proceed to Checkout</Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {
                user?(
                    <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
                ):(
                    <Button asChild>
                        <Link href='/auth/signin'>
                        Sign in
                        </Link>
                    </Button>
                )
            }
          </div>
        </div>
      </nav>
    )
}

