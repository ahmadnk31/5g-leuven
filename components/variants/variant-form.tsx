'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type VariantFormValues, VariantSchema } from '@/lib/validations/variant';
import { ImageUpload } from './image-upload';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

interface VariantListProps {
  products: any[];
  initialData?: VariantFormValues;
}

export function VariantForm({ products, initialData }: VariantListProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const form = useForm<VariantFormValues>({
    resolver: zodResolver(VariantSchema),
    defaultValues: initialData || {
      name: '',
      price: 0,
      stock: 0,
    product_id: '',
    images: [],
    },
  });

  const onSubmit = async(data: VariantFormValues) => {
    setLoading(true);
    // Handle form submission here
    try{
        if(initialData){
            console.log('updating')
            // Updating existing variant
            const { error: variantError } = await supabase
            .from('variants')
            .update(data)
            .eq('id', initialData.id);
            if (variantError) throw variantError;
            toast({
                title: 'Success',
                description: 'Variant updated successfully',
            });
            router.push('/dashboard/product-variants');
        }
        else{
            console.log('creating')
            // Creating new variant
            const { error: variantError } = await supabase
            .from('variants')
            .insert(data);
            if (variantError) throw variantError;
            toast({
                title: 'Success',
                description: 'Variant created successfully',
            });
            router.push('/dashboard/product-variants');
        }
    }catch(error){console.error(error)}
    console.log(data);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Variant</h3>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id}
                        onClick={() => field.onChange(product.id)}
                      >
                        {product.name}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ImageUpload form={form} maxImages={4} loading={loading} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Variant'}
        </Button>
      </form>
    </Form>
  );
}

