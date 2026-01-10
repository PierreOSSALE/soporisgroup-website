//lib/schema/blog.schema.ts
import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets"
    ),
  excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  category: z.string().min(2, "La catégorie est requise"),
  readTime: z.string().default("5 min"),
  published: z.boolean().default(false),
  author: z.string().min(2, "L'auteur est requis"),
});

export type BlogInput = z.infer<typeof blogSchema>;
