// lib/schema/pack.schema.ts
import { z } from "zod";

export const packSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  originalPrice: z
    .number()
    .min(0, "Le prix original doit être positif")
    .optional()
    .nullable(),
  features: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité est requise"),
  isPopular: z.boolean().default(false),
  isPromo: z.boolean().default(false),
  promoLabel: z.string().optional().nullable(),
  promoEndDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export type PackInput = z.infer<typeof packSchema>;
