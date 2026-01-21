// lib/schema/blog.schema.ts
import { z } from "zod";

// Schéma pour un item de table des matières
export const tableOfContentsItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  level: z.number().min(1).max(6).optional().default(2),
});

export const authorSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  avatar: z.string().url("URL d'avatar invalide"),
  bio: z.string().optional(),
});

export const authorCreateSchema = authorSchema.extend({
  id: z.string().optional(),
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
      "Le slug doit être en minuscules avec des tirets",
    ),
  excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),
  image: z.string().url("URL d'image invalide"),
  category: z.string().min(2, "La catégorie est requise"),
  readTime: z
    .number()
    .min(1, "Le temps de lecture doit être d'au moins 1 minute"),
  views: z.number().default(0).optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().nullable().optional(),
  authorId: z.string().optional(),
  authorInput: authorCreateSchema.optional(),
  // Table des matières est maintenant optionnelle et sera générée automatiquement
  tableOfContents: z.array(tableOfContentsItemSchema).optional().default([]),
});

// Schéma pour créer un article (sans publishedAt et views)
export const blogPostCreateSchema = blogPostSchema.omit({
  views: true,
  publishedAt: true,
});

// Schéma pour mettre à jour un article (tous les champs optionnels)
export const blogPostUpdateSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .optional(),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets",
    )
    .optional(),
  excerpt: z
    .string()
    .min(10, "L'extrait doit contenir au moins 10 caractères")
    .optional(),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères")
    .optional(),
  image: z.string().url("URL d'image invalide").optional(),
  category: z.string().min(2, "La catégorie est requise").optional(),
  readTime: z
    .number()
    .min(1, "Le temps de lecture doit être d'au moins 1 minute")
    .optional(),
  published: z.boolean().optional(),
  authorId: z.string().optional(),
  authorInput: authorCreateSchema.optional(),
  // La table des matières est optionnelle et sera générée automatiquement
  tableOfContents: z.array(tableOfContentsItemSchema).optional(),
});

export type TableOfContentsItem = z.infer<typeof tableOfContentsItemSchema>;
export type AuthorInput = z.infer<typeof authorSchema>;
export type AuthorCreateInput = z.infer<typeof authorCreateSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
