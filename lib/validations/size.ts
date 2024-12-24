import * as z from 'zod';

export const SizeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
  id:z.string().optional(),
});

export type SizeFormValues = z.infer<typeof SizeSchema>;