import * as z from 'zod';

export const ColorSchema = z.object({
 name: z.string().min(1, 'Name is required'),
   value: z.string().min(1, 'Color value is required'),
  id:z.string().optional(),
});

export type ColorFormValues = z.infer<typeof ColorSchema>;