// app/admin/colors/components/color-form.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { createClient} from '@/lib/supabase/client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { type ColorFormValues,ColorSchema } from '@/lib/validations/color';



interface ColorFormProps {
  initialData?: ColorFormValues;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit color' : 'Create color';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(ColorSchema),
    defaultValues: initialData || {
      name: '',
      value: '#',
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const { error } = await supabase
          .from('colors')
          .update({
            name: data.name,
            value: data.value,
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('colors')
          .insert({
            name: data.name,
            value: data.value,
          });

        if (error) throw error;
      }

      router.refresh();
      router.push('/admin/colors');
      toast.success(initialData ? 'Color updated.' : 'Color created.');
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!initialData) return;

      const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', initialData.id);

      if (error) throw error;

      router.refresh();
      router.push('/dashboard/colors');
      toast.success('Color deleted.');
    } catch (error) {
      toast.error('Make sure you removed all products using this color first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Color name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Value</FormLabel>
                <div className="flex gap-x-4">
                  <FormControl>
                    <Input type='color' {...field} />
                  </FormControl>
                  <div 
                    className="border rounded-md w-10 h-10"
                    style={{ backgroundColor: field.value }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="w-full" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
};