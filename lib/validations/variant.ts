import * as z from 'zod';

export const VariantSchema = z.object({
    id: z.string().optional(),  
  name: z.string().min(1, 'Name is required'),
  product_id: z.string().min(1, 'Product is required'),
    price: z.number().min(1, 'Price is required'),
    stock: z.number().min(1, 'Stock is required'),
    images: z.array(z.string()).optional(),
});

export type VariantFormValues = z.infer<typeof VariantSchema>;