// actions/appointment.ts
"use server";

import { prisma } from "@/lib/prisma";

// Définition du type d'input pour l'action
interface AppointmentState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function createAppointment(
  prevState: any,
  formData: FormData
): Promise<AppointmentState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      service: formData.get("service") as string,
      date: new Date(formData.get("date") as string),
      time_slot: formData.get("time_slot") as string,
      message: (formData.get("message") as string) || null,
    };

    // Validation simple (vous pouvez utiliser Zod ici pour être plus robuste)
    if (
      !rawData.name ||
      !rawData.email ||
      !rawData.service ||
      !rawData.date ||
      !rawData.time_slot
    ) {
      return {
        success: false,
        error: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    await prisma.appointments.create({
      data: rawData,
    });

    return { success: true, message: "Rendez-vous confirmé !" };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la prise de rendez-vous.",
    };
  }
}
