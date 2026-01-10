// lib/schema/appointment.schema.ts
import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Veuillez sélectionner un service"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  timeSlot: z.string().min(1, "Veuillez sélectionner un créneau"),
  message: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed"])
    .default("pending"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
