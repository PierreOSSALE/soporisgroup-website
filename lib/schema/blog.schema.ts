import { z } from "zod";

export const BlogArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  image_url: z.string().url().nullable(),
  category: z.string(),
  read_time: z.string(),
  published: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type BlogArticle = z.infer<typeof BlogArticleSchema>;
