import * as z from 'zod';
import {ImagesSchema } from './images';

export const VariantSchema = z.object({
    id: z.string().optional(),  
  name: z.string().min(1, 'Name is required'),
  size_id: z.string().min(1, 'Size is required'),
  color_id: z.string().min(1, 'Color is required'),
  sku: z.string().min(1, 'SKU is required'),
  product_id: z.string().min(1, 'Product is required'),
    price: z.number().min(1, 'Price is required'),
    stock: z.number().min(1, 'Stock is required'),
    images: ImagesSchema.array().min(1, 'At least one image is required'),
});

export type VariantFormValues = z.infer<typeof VariantSchema>;