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
import { type SizeFormValues,SizeSchema } from '@/lib/validations/size';



interface SizeFormProps {
  initialData?: SizeFormValues;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit size' : 'Create size';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(SizeSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const { error } = await supabase
          .from('sizes')
          .update({
            name: data.name,
            value: data.value,
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sizes')
          .insert({
            name: data.name,
            value: data.value,
          });

        if (error) throw error;
      }

      router.refresh();
      router.push('/dashboard/sizes');
      toast.success(initialData ? 'Size updated.' : 'Size created.');
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
        .from('sizes')
        .delete()
        .eq('id', initialData.id);

      if (error) throw error;

      router.refresh();
      router.push('/admin/sizes');
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
                  <Input placeholder="Size name" {...field} />
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
                <FormLabel>Size Value</FormLabel>
                
                  <FormControl>
                    <Input placeholder="XS,XL" {...field} />
                  </FormControl>

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