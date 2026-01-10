// lib/schema/service.schema.ts
import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  icon: z.string().min(1, "L'icône est requise"),
  price: z.string().min(1, "Le prix est requis"),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0),
  features: z.array(z.string()).default([]),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets"
    ),
  color: z.string().optional().default("#3B82F6"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
