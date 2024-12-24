import * as z from 'zod';

export const ImagesSchema = z.object({
  id:z.string().optional(),
  variant_id:z.string().optional(),
  position:z.number().optional(),
  url:z.string().optional(),
  is_primary:z.boolean().optional(),
});

export type ImagesFormValues = z.infer<typeof ImagesSchema>;