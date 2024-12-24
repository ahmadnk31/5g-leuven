'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ProductSchema, type ProductFormValues } from '@/lib/validations/product';
import { Loader2 } from 'lucide-react';
import { CategoryFormValues } from '@/lib/validations/category';
import { Switch } from '../ui/switch';
import TipTapEditor from '../editor';
import { JSONContent } from '@tiptap/core';

interface ProductFormProps {
  initialData: ProductFormValues;
  categories: CategoryFormValues[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      category_id: '',
      is_featured: false,
      is_archived: false,
      price:0,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      console.log(data)
      console.log(initialData)

      if (initialData) {
        console.log('updating') 
        // Updating existing product
        const { error: productError } = await supabase
          .from('products')
          .update({
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            is_featured: data.is_featured,
            is_archived: data.is_archived,
            price: Number(data.price)
          })
          .eq('id', initialData.id);
  
        if (productError) throw productError;
      } else {
        // Creating new product
        console.log('creating')
        const { error: productError } = await supabase
          .from('products')
          .upsert({
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            is_featured: data.is_featured,
            is_archived: data.is_archived,
            price: Number(data.price)
          });
  
        if (productError) throw productError;
      }
  
      toast({
        title: 'Success',
        description: `Product ${initialData ? 'updated' : 'created'} successfully`,
      });
  
      router.push('/dashboard/products');
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
console.log(categories)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  type="number"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id||''}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
       
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
               <TipTapEditor 
               content={field.value }
               onChange={(value) => {
                console.log(`value from product form: ${value.getHTML()}`);
                field.onChange(value.getHTML());}}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-4">
        <div>
          <h3 className="mb-4 text-lg font-medium">
            Product Settings
          </h3>
          <div className="gap-4 flex flex-col md:flex-row w-full items-center">
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Is Featured
                    </FormLabel>
                    <FormDescription>
                      Switch on to mark this product as featured.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Is Archived</FormLabel>
                    <FormDescription>
                      Switch on to archive this product.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
          </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}