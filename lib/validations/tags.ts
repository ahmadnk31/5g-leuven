import * as z from 'zod';

export const TagsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
});

export type TagsFormValues = z.infer<typeof TagsSchema>;