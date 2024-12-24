'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, UploadIcon } from "lucide-react"

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .regex(/^[+\d\s-()]*$/, { message: "Invalid phone number format" }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  postalCode: z.string()
    .min(3, { message: "Postal code must be at least 3 characters." })
    .regex(/^[A-Za-z\d\s-]*$/, { message: "Invalid postal code format" }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone_number?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  avatar_url?: string
  updated_at?: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
  })
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to upload a profile picture.",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)
    try {
      // Remove old image if exists
      if (user.avatar_url) {
        const oldImagePath = user.avatar_url.split('/').pop()
        if (oldImagePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldImagePath])
        }
      }

      // Upload new image
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setUser(prev => prev ? { ...prev, avatar_url: publicUrl } : null)

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }, [user, supabase, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  })

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        if (!authUser) {
          toast({
            title: "Authentication Error",
            description: "Please sign in to view your profile.",
            variant: "destructive",
          })
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError
        }

        const userData = {
          id: authUser.id,
          email: authUser.email!,
          ...profile,
        }
        
        setUser(userData)
        
        if (profile) {
          form.reset({
            fullName: profile.full_name || '',
            phoneNumber: profile.phone_number || '',
            address: profile.address || '',
            city: profile.city || '',
            country: profile.country || '',
            postalCode: profile.postal_code || '',
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setInitialLoading(false)
      }
    }
    
    loadUserProfile()
  }, [supabase, form, toast])

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('No user found')

      const updates = {
        id: authUser.id,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        postal_code: data.postalCode,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)
        .eq('id', authUser.id)

      if (error) throw error

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null)

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
      <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div {...getRootProps()} className="relative cursor-pointer group">
              <input {...getInputProps()} />
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'Profile'} />
                <AvatarFallback>{user?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingImage ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <UploadIcon className="h-6 w-6 text-white" />
                )}
              </div>
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
                  <p className="text-white text-sm">Drop image here</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{user?.full_name || 'Your Profile'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click or drag image to update profile picture
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading||uploadingImage||form.formState.isSubmitting||!form.formState.isDirty}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}