//lib/schema/blog.schema.ts
import { z } from "zod";

export const BlogArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  imageUrl: z.string().url("URL invalide").optional().nullable(),
  category: z.string(),
  read_time: z.string(),
  published: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type BlogArticle = z.infer<typeof BlogArticleSchema>;
