import * as z from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;