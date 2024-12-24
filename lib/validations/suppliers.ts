import * as z from 'zod';

export const SuppliersSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
  id:z.string().optional(),
});

export type SuppliersFormValues = z.infer<typeof SuppliersSchema>;