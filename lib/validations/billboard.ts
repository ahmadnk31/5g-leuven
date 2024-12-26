import * as z from 'zod';

export const BillboardSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  image_url: z.string().min(1, 'Image is required'),
  id: z.string().optional(),
});

export type BillboardFormValues = z.infer<typeof BillboardSchema>;