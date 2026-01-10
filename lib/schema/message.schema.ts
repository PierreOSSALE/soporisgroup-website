// lib/schema/message.schema.ts
import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Le sujet est requis"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
  isRead: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type MessageInput = z.infer<typeof messageSchema>;
