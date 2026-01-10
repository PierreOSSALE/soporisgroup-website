// lib/schema/appointment.schema.ts
import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(2, "Le service est requis"),
  date: z.string().min(1, "La date est requise"),
  timeSlot: z.string().min(1, "L'horaire est requis"),
  message: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed"])
    .default("pending"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
