import * as z from 'zod';

export const BillboardSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  imageUrl: z.string().min(1, 'Image is required'),
});

export type BillboardFormValues = z.infer<typeof BillboardSchema>;