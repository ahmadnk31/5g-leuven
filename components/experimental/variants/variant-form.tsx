'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { type ProductFormValues } from '@/lib/validations/product'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Size {
  id: string
  name: string
}

interface Color {
  id: string
  name: string
  value: string
}

interface Variant {
  id: string
  product_id: string
  size_id: string
  color_id: string
  sku: string
  price: number
  stock: number
}

interface Image {
  id: string
  url: string
  is_primary: boolean
  position: number
}

interface VariantFormProps {
  initialData?: Variant | null
  initialImages?: Image[]
  products: ProductFormValues[]
  sizes: Size[]
  colors: Color[]
  edit?: boolean
}

const formSchema = z.object({
  size_id: z.string().min(1, 'Size is required'),
  color_id: z.string().min(1, 'Color is required'),
  sku: z.string().min(1, 'SKU is required'),
  product_id: z.string().min(1, 'Product is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
})

type VariantFormValues = z.infer<typeof formSchema>

export const ExperimentalVariantForm: React.FC<VariantFormProps> = ({
  initialData,
  initialImages = [],
  products,
  sizes,
  colors,
  edit
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<Image[]>(initialImages)
  const [previews, setPreviews] = useState<string[]>([])

  const supabase = createClient()
  console.log('initialData:', initialData)
  const title = edit ? 'Edit variant' : 'Create variant'
  const action = edit ? 'Save changes' : 'Create'
  const toastMessage = edit ? 'Variant updated.' : 'Variant created.'

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      size_id: '',
      color_id: '',
      product_id: '',
      sku: '',
      price: 0,
      stock: 0,
    },
  })

  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      previews.forEach(URL.revokeObjectURL)
    }
  }, [previews])

  const onDrop = (acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles])
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.webp'],
    },
    multiple: true,
  })

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setPreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index])
      return prevPreviews.filter((_, i) => i !== index)
    })
  }

  const removeExistingImage = async (imageId: string) => {
    try {
      setLoading(true)
      
      // Delete image from database
      const { error: deleteError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (deleteError) throw deleteError

      // Update local state
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    } finally {
      setLoading(false)
    }
  }

  const setPrimaryImage = async (imageId: string) => {
    try {
      setLoading(true)

      // Update primary status in database
      const { error } = await supabase
        .from('images')
        .update({ is_primary: false })
        .eq('variant_id', initialData?.id)

      if (error) throw error

      const { error: updateError } = await supabase
        .from('images')
        .update({ is_primary: true })
        .eq('id', imageId)

      if (updateError) throw updateError

      // Update local state
      setExistingImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      )

      toast.success('Primary image updated')
    } catch (error) {
      console.error('Error updating primary image:', error)
      toast.error('Failed to update primary image')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)

      if (!initialData?.id) return

      // Delete variant images
      const { error: imagesError } = await supabase
        .from('images')
        .delete()
        .eq('variant_id', initialData.id)

      if (imagesError) throw imagesError

      // Delete variant
      const { error: variantError } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', initialData.id)

      if (variantError) throw variantError

      router.refresh()
      router.push('/dashboard/variants')
      toast.success('Variant deleted')
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setLoading(false)
      setShowDeleteAlert(false)
    }
  }

  const onSubmit = async (data: VariantFormValues) => {
    try {
      setLoading(true);
  
      // 1. Handle variant creation/update
      let variantId: string

      if (edit && initialData?.id) {
        const { data: updatedVariant, error } = await supabase
          .from('product_variants')
          .update({
            product_id: data.product_id,
            size_id: data.size_id,
            color_id: data.color_id,
            sku: data.sku,
            price: data.price,
          })
          .eq('id', initialData.id)
          .select()
          .single()
          console.log('updatedVariant:', updatedVariant)
        if (error) throw error
        await supabase.from('stock').update({ quantity: data.stock }).eq('variant_id', initialData.id)
        variantId = updatedVariant.id
      } else {
        const { data: newVariant, error } = await supabase
          .rpc('create_variant_with_stock', {
            p_product_id: data.product_id,
            p_size_id: data.size_id,
            p_color_id: data.color_id,
            p_sku: data.sku,
            p_price: data.price,
            p_initial_quantity: data.stock
          })
          console.log('newVariant:', newVariant)
        if (error) throw error
        variantId = newVariant.id
      }

  
     
      // 2. Handle image uploads for new images
      if (images.length > 0) {
        // Upload images to storage
        const imageUploadPromises = images.map(async (image) => {
          const filename = `${variantId}-${Date.now()}-${image.name}`;
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('variant-images')
            .upload(filename, image);
  
          if (uploadError) throw uploadError;
  
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('variant-images')
            .getPublicUrl(filename);
  
          return publicUrl;
        });
  
        const imageUrls = await Promise.all(imageUploadPromises);
  
        // 3. Create image records in the database
        const { error: imagesError } = await supabase
          .from('images')
          .insert(
            imageUrls.map((url, index) => ({
              variant_id: variantId,
              url,
              position: index,
              is_primary: index === 0 && existingImages.length === 0 // Only set as primary if there are no existing images
            }))
          );
  
        if (imagesError) throw imagesError;
      }
  
  
      router.refresh();
      router.push(`/dashboard/variants`);
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-center text-sm text-gray-600">
                    Drag & drop images here, or click to select files
                  </p>
                </div>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {existingImages.map((image) => (
                      <Card key={image.id} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={image.url}
                            alt="Product variant"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => setPrimaryImage(image.id)}
                              disabled={image.is_primary}
                              className={image.is_primary ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {image.is_primary ? "★" : "☆"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeExistingImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* New Image Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previews.map((preview, index) => (
                      <Card key={preview} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Rest of the form fields remain the same */}
          {/* ... */}
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product?.id||''}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
            />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="size_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          key={color.id}
                          value={color.id}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Variant specific price"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of items in stock"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {action}
            </Button>
        </form>
      </Form>

     {edit&&(
       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete the variant
             and all associated images.
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction
             onClick={handleDelete}
             className="bg-red-600 hover:bg-red-700"
           >
             Delete
           </AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
     )}
    </div>
  )
}