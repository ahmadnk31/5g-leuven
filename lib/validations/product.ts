import * as z from 'zod';
export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be at least $0.01'),
  is_featured: z.boolean(),
  is_archived: z.boolean(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;