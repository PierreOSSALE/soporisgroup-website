//lib/schema/blog.schema.ts
import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  avatar: z.string().url("URL d'avatar invalide"),
});

export const commentSchema = z.object({
  postId: z.string().min(1, "ID de l'article requis"),
  author: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .email("Email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  content: z
    .string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

export const blogPostSchema = z.object({
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
  image: z.string().url("URL d'image invalide").optional().or(z.literal("")),
  category: z.string().min(2, "La catégorie est requise"),
  readTime: z
    .number()
    .min(1, "Le temps de lecture doit être d'au moins 1 minute"),
  views: z.number().default(0).optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().nullable().optional(),
  authorId: z.string().min(1, "L'auteur est requis"),
  tableOfContents: z.array(z.string()).default([]),
});

// Pour la création, on ne met pas publishedAt (il sera défini automatiquement)
export const blogPostCreateSchema = blogPostSchema.omit({
  views: true,
  publishedAt: true,
});

// Pour la mise à jour, publishedAt est nullable
export const blogPostUpdateSchema = blogPostSchema.partial().extend({
  publishedAt: z.date().nullable().optional(),
});

export type AuthorInput = z.infer<typeof authorSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
