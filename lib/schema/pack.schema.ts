// lib/schema/pack.schema.ts
import { z } from "zod";

export const packSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),

  // Prix Europe
  priceEUR: z.number().min(0).nullable().optional(),
  originalPriceEUR: z.number().min(0).nullable().optional(),

  // Prix Tunisie
  priceTND: z.number().min(0).nullable().optional(),
  originalPriceTND: z.number().min(0).nullable().optional(),

  // Prix Afrique (FCFA)
  priceCFA: z.number().min(0).nullable().optional(),
  originalPriceCFA: z.number().min(0).nullable().optional(),

  features: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité est requise"),
  isPopular: z.boolean().default(false),
  isPromo: z.boolean().default(false),
  promoLabel: z.string().optional().nullable(),
  promoEndDate: z.string().optional().nullable(),
  promoEndDateTND: z.string().optional().nullable(),
  promoEndDateCFA: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export type PackInput = z.infer<typeof packSchema>;
