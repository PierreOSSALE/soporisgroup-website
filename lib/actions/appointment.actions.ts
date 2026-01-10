"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/schema/appointment.schema";
import { AppointmentStatus } from "@prisma/client"; // <-- Import depuis @prisma/client

import { randomUUID } from "crypto";
import { sendAppointmentEmail } from "@/lib/email/email-service";

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
    const cancellationToken = randomUUID();

    const appointment = await prisma.appointment.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone || null,
        company: validated.data.company || null,
        service: validated.data.service,
        date: new Date(validated.data.date),
        timeSlot: validated.data.timeSlot,
        message: validated.data.message || null,
        status: validated.data.status,
        cancellation_token: cancellationToken,
      },
    });

    // Envoyer l'email de confirmation
    await sendAppointmentEmail(
      "created",
      {
        name: appointment.name,
        email: appointment.email,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        service: appointment.service,
        company: appointment.company || undefined,
        phone: appointment.phone || undefined,
        message: appointment.message || undefined,
        cancellation_token: cancellationToken,
      },
      process.env.ADMIN_EMAIL || "contact@soporisgroup.com",
      process.env.NEXT_PUBLIC_SITE_URL
    );

    revalidatePath("/admin/appointments");
    revalidatePath("/assistant-appointments");
    revalidatePath("/assistant-dashboard");

    return {
      success: true,
      message: "Demande de rendez-vous envoyée avec succès",
      error: "",
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      message: "",
      error: "Erreur lors de la création du rendez-vous",
    };
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    // Envoyer un email selon le statut
    if (status === "confirmed" || status === "cancelled") {
      await sendAppointmentEmail(
        status === "confirmed" ? "confirmed" : "cancelled",
        {
          name: appointment.name,
          email: appointment.email,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          service: appointment.service,
          company: appointment.company || undefined,
          phone: appointment.phone || undefined,
          message: appointment.message || undefined,
          cancellation_token: appointment.cancellation_token || undefined,
        },
        undefined,
        process.env.NEXT_PUBLIC_SITE_URL
      );
    }

    revalidatePath("/admin/appointments");
    revalidatePath("/assistant-appointments");
    revalidatePath("/assistant-dashboard");
    return appointment;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du statut du rendez-vous");
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });
    revalidatePath("/admin/appointments");
    revalidatePath("/assistant-appointments");
    revalidatePath("/assistant-dashboard");
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
        status: {
          in: [AppointmentStatus.pending, AppointmentStatus.confirmed],
        },
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
      [AppointmentStatus.pending]: 0,
      [AppointmentStatus.confirmed]: 0,
      [AppointmentStatus.cancelled]: 0,
      [AppointmentStatus.completed]: 0,
    };
  }
}
