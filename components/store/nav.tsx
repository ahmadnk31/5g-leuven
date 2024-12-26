'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Home, Package, Settings, User, LogOut, ArrowRightIcon, InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import useCartStore  from '@/lib/store/store'
import { Alert, AlertDescription} from '@/components/ui/alert'

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
import { usePathname, useRouter} from 'next/navigation'
import { cn } from '@/lib/utils'


export function Navbar() {
    const { items, removeFromCart, updateQuantity } = useCartStore()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const pathname=usePathname()
    const [isHydrated, setIsHydrated] = useState(false)
    console.log(pathname)
    const totalItems = isHydrated ? items.reduce((total, item) => total + item.quantity, 0) : 0
    const totalPrice = isHydrated ? items.reduce((total, item) => 
        total + ((item.product_variant.price ?? item.product_variant.product.price) * item.quantity), 0
    ) : 0
    const router=useRouter()
    const [userRole, setUserRole] = useState<string | null>(null)
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            const {data:role}=await supabase.from('profiles').select('*').eq('id',user?.id).single()
            setUserRole(role?.role)
            setProfile(role.avatar_url)
        }
        fetchUser()
    }, [])
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

    console.log(profile)
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/signin')
        // You might want to redirect the user or update the app state here
    }

    return (
      <nav className={cn(" bg-white shadow-sm",{ 'sticky top-0 z-50': pathname.includes('dashboard') })}>
        <Alert className='bg-amber-500/50 rounded-none'>
  <InfoIcon className="h-4 w-4 " />
  <AlertDescription>
    Our platform is currently in development. Please <a href='tel:0467871205' className='underline hover:text-primary'>contact</a> or <a href='mailto:5gphonesfix@gmail.com' className="underline hover:text-primary"> email us
      </a> if you have any questions.

  </AlertDescription>
</Alert>

        <div className="px-4 mx-auto flex justify-between items-center  py-2">
          <Link href="/" className="flex items-center space-x-2">
          <Image src='/logo.svg' width={70} height={70} alt='logo' />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Products
            </Link>
            {
              userRole==='admin' && (
               <Button asChild >
                 <Link href={pathname.includes('dashboard')?'/':'dashboard'} className="flex items-center">
                {
                  pathname.includes('dashboard') ? 'Exit' : 'Admin Dashboard'
                }
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
               </Button>
              )
            }
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
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
    {item.product_variant&& (
      <Image 
        src={item.product_variant.images[0].url} 
        alt={item.product_variant.product.name}
        width={80} 
        height={80} 
        className="mr-4 object-cover rounded"
      />
    )}
    <div className="flex-grow">
      <h3 className="font-semibold">
        {item.product_variant.product.name} - {item.product_variant.size.name}, {item.product_variant.color.name}
      </h3>
      <p className="text-sm text-gray-500">
        ${(item.product_variant.price ?? item.product_variant.product.price).toFixed(2)} each
      </p>
      <div className="flex items-center mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
          className="mr-2"
          disabled={item.quantity <= 1}
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
        ${((item.product_variant.price ?? item.product_variant.product.price) * item.quantity).toFixed(2)}
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
                <Avatar className="cursor-pointer ring-2 ring-primary">
                  <AvatarImage src={user?.avatar_url||profile} />
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

