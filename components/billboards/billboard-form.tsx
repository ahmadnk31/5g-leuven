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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BillboardSchema, type BillboardFormValues } from '@/lib/validations/billboard';
import { ImageUpload } from './image-upload';
import { Loader2 } from 'lucide-react';

interface BillboardFormProps {
  initialData: BillboardFormValues;
}

export function BillboardForm({ initialData }: BillboardFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData || {
      label: '',
      image_url: '',
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      const isNew = !initialData;

      const { error } = await supabase
        .from('billboards')
        [isNew ? 'insert' : 'update']({
          label: data.label,
          image_url: data.image_url,
          ...(isNew ? {} : { id: initialData.id }),
        })
        .eq('id', isNew ? undefined : initialData.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Billboard ${isNew ? 'created' : 'updated'} successfully`,
      });

      router.push('/dashboard/billboards');
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Billboard' : 'Create Billboard'}
        </Button>
      </form>
    </Form>
  );
}