// lib/schema/testimonial.schema.ts
import { z } from "zod";

export const testimonialSchema = z.object({
  author: z.string().min(2, "L'auteur est requis"),
  role: z.string().min(2, "Le rôle est requis"),
  company: z.string().min(2, "L'entreprise est requise"),
  content: z
    .string()
    .min(20, "Le témoignage doit contenir au moins 20 caractères"),
  rating: z.number().int().min(1).max(5),
  avatar: z.string().url("URL invalide").optional(),
  isActive: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
