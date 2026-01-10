// lib/schema/user.schema.ts
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne doit pas dépasser 50 caractères")
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne doit contenir que des lettres"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .max(100, "Le mot de passe est trop long")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const userSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["user", "assistant", "admin"]).default("user"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  avatar: z.string().url("URL invalide").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
