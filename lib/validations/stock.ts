import * as z from 'zod';

export const StockSchema = z.object({
  id:z.string().optional(),
  variant_id:z.string().optional(),
  quantity:z.number().min(1, 'Quantity is required'),
  reserved_quantity:z.number().min(0, 'Reserved Quantity is required'),
});

export type StockFormValues = z.infer<typeof StockSchema>;