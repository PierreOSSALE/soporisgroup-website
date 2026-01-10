// lib/actions/appointment.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  appointmentSchema,
  AppointmentInput,
} from "@/lib/schema/appointment.schema";
import { AppointmentStatus } from "@prisma/client";

export async function createAppointment(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    company: formData.get("company") as string,
    service: formData.get("service") as string,
    date: formData.get("date") as string,
    timeSlot: formData.get("timeSlot") as string,
    message: formData.get("message") as string,
    status: "pending" as const,
  };

  const validated = appointmentSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "",
      error: validated.error.issues[0]?.message || "Données invalides",
    };
  }

  try {
    await prisma.appointment.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        company: validated.data.company,
        service: validated.data.service,
        date: new Date(validated.data.date),
        timeSlot: validated.data.timeSlot,
        message: validated.data.message,
        status: validated.data.status,
      },
    });
    revalidatePath("/admin/appointments");
    return {
      success: true,
      message: "Rendez-vous créé avec succès",
      error: "",
    };
  } catch (error) {
    return {
      success: false,
      message: "",
      error: "Erreur lors de la création du rendez-vous",
    };
  }
}

export async function updateAppointment(
  id: string,
  data: Partial<AppointmentInput>
) {
  const validated = appointmentSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || "Données invalides");
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...validated.data,
        date: validated.data.date ? new Date(validated.data.date) : undefined,
      },
    });
    revalidatePath("/admin/appointments");
    return appointment;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du rendez-vous");
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });
    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error) {
    throw new Error("Erreur lors de la suppression du rendez-vous");
  }
}

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return appointments;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des rendez-vous");
  }
}

export async function getAppointmentById(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });
    return appointment;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du rendez-vous");
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/appointments");
    return appointment;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du statut du rendez-vous");
  }
}

export async function getAppointmentsByStatus(status: AppointmentStatus) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { status },
      orderBy: { date: "asc" },
    });
    return appointments;
  } catch (error) {
    console.error("Erreur récupération rendez-vous par statut:", error);
    throw new Error("Erreur lors de la récupération des rendez-vous");
  }
}

export async function getUpcomingAppointments(limit: number = 5) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: { in: ["pending", "confirmed"] },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: limit,
    });
    return appointments;
  } catch (error) {
    console.error("Erreur récupération prochains rendez-vous:", error);
    throw new Error("Erreur lors de la récupération des prochains rendez-vous");
  }
}

export async function getAppointmentsCountByStatus() {
  try {
    const counts = await prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return counts.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<AppointmentStatus, number>);
  } catch (error) {
    console.error("Erreur comptage rendez-vous:", error);
    return {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };
  }
}
