// lib/schema/faq.schema.ts
import { z } from "zod";

export const faqSchema = z.object({
  question: z
    .string()
    .min(5, "La question doit contenir au moins 5 caractères"),
  answer: z.string().min(10, "La réponse doit contenir au moins 10 caractères"),
  category: z.string().min(2, "La catégorie est requise"),
  order: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqSchema>;
