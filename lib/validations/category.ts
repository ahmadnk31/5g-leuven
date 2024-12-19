import * as z from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().min(1, 'Image is required'),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;