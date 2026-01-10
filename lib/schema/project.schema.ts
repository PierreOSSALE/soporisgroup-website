// lib/schema/project.schema.ts
import { z } from "zod";

// Schéma pour les captures d'écran
const screenshotSchema = z.object({
  url: z.string().url("URL de capture d'écran invalide"),
  caption: z.string().min(2, "La légende est requise"),
});

// Schéma pour le témoignage
const testimonialSchema = z.object({
  quote: z.string().min(10, "La citation doit contenir au moins 10 caractères"),
  author: z.string().min(2, "L'auteur est requis"),
  role: z.string().min(2, "Le rôle est requis"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  subtitle: z
    .string()
    .min(5, "Le sous-titre doit contenir au moins 5 caractères"),
  slug: z
    .string()
    .min(3, "Le slug est requis")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets"
    ),
  category: z.string().min(2, "La catégorie est requise"),
  client: z.string().min(2, "Le client est requis"),
  duration: z.string().min(2, "La durée est requise"),
  pack: z.string().min(2, "Le pack est requis"),
  year: z
    .string()
    .min(4, "L'année est requise")
    .max(4, "L'année doit avoir 4 chiffres"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  imageUrl: z.string().url("URL d'image invalide").optional(),
  featured: z.boolean().default(false),

  // Nouveaux champs
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .optional(),
  technologies: z.array(z.string()).optional().default([]),
  challenges: z.array(z.string()).optional().default([]),
  solutions: z.array(z.string()).optional().default([]),
  results: z.array(z.string()).optional().default([]),
  screenshots: z.array(screenshotSchema).optional().default([]),
  testimonial: testimonialSchema.optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
