// lib/schema/user.schema.ts
import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["user", "assistant", "admin"]).default("user"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  avatar: z.string().url("URL invalide").optional(),
  isActive: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;
