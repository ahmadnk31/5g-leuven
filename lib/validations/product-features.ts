import * as z from 'zod';

export const ProductFeaturesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
  id:z.string().optional(),
  product_id:z.string().optional(),
});

export type ProductFeaturesFormValues = z.infer<typeof ProductFeaturesSchema>;