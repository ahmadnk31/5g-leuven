import * as z from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_url: z.string().min(1, 'Image is required'),
  id: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;