// lib/actions/appointment.actions.ts - VERSION CORRIGÉE
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/schema/appointment.schema";
import { AppointmentStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  sendAppointmentEmail,
  sendAdminNotification,
} from "@/lib/email/email-service";

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
    // Vérifier si le créneau est toujours disponible
    // Utiliser la fonction isTimeSlotAvailable de timeSlot.actions.ts
    const { isTimeSlotAvailable } = await import(
      "@/lib/actions/timeSlot.actions"
    );
    const isAvailable = await isTimeSlotAvailable(
      validated.data.date,
      validated.data.timeSlot
    );

    if (!isAvailable) {
      return {
        success: false,
        message: "",
        error:
          "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
      };
    }

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
        reminder_sent: false,
      },
    });

    // Envoyer l'email de confirmation au client
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

    // Envoyer une notification à l'admin
    await sendAdminNotification({
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      company: appointment.company,
      service: appointment.service,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      message: appointment.message,
    });

    // REVALIDER TOUS les chemins critiques
    revalidatePath("/rendez-vous");
    revalidatePath("/api/appointments/available-slots");
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
    // Fetch the existing appointment first
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        // Réinitialiser reminder_sent si annulé et reprogrammé
        reminder_sent:
          status === "cancelled" ? false : existingAppointment.reminder_sent,
      },
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

    // REVALIDER TOUS les chemins
    revalidatePath("/rendez-vous");
    revalidatePath("/api/appointments/available-slots");
    revalidatePath("/admin/appointments");
    revalidatePath("/assistant-appointments");
    revalidatePath("/assistant-dashboard");

    return appointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw new Error("Erreur lors de la mise à jour du statut du rendez-vous");
  }
}

// Garder les autres fonctions sans duplication
export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: { id },
    });

    revalidatePath("/rendez-vous");
    revalidatePath("/admin/appointments");
    revalidatePath("/assistant-appointments");
    revalidatePath("/assistant-dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
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
    console.error("Error getting appointments:", error);
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

export async function getBookedSlotsForDate(
  dateStr: string
): Promise<string[]> {
  try {
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // Prendre uniquement les rendez-vous CONFIRMÉS et PENDING (pour éviter les doublons)
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        status: {
          in: [AppointmentStatus.confirmed, AppointmentStatus.pending],
        },
      },
      select: {
        timeSlot: true,
      },
    });

    return appointments.map((app) => app.timeSlot);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
}

export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  try {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    // Vérifier si la date est bloquée
    const blockedDate = await prisma.blockedDate.findFirst({
      where: { date: dateStr },
    });

    if (blockedDate) {
      return [];
    }

    // Récupérer les créneaux configurés pour ce jour
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        day_of_week: dayOfWeek,
        is_active: true,
      },
      orderBy: { start_time: "asc" },
    });

    if (timeSlots.length === 0) {
      return [];
    }

    // Récupérer les créneaux déjà réservés (uniquement confirmés)
    const bookedSlots = await getBookedSlotsForDate(dateStr);

    // Générer tous les créneaux possibles avec un Set pour éviter les doublons
    const allPossibleSlots = new Set<string>();

    for (const slot of timeSlots) {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      // Générer des créneaux selon la durée configurée
      for (
        let current = startMinutes;
        current + slot.duration_minutes <= endMinutes;
        current += slot.duration_minutes
      ) {
        const hour = Math.floor(current / 60);
        const min = current % 60;
        const timeString = `${hour.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")}`;

        // Vérifier si c'est aujourd'hui et si le créneau est dans le futur
        const isToday = date.toDateString() === new Date().toDateString();
        if (isToday) {
          const now = new Date();
          const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
          if (current > currentTimeInMinutes + 30) {
            allPossibleSlots.add(timeString);
          }
        } else {
          allPossibleSlots.add(timeString);
        }
      }
    }

    // Filtrer les créneaux déjà réservés
    const availableSlots = Array.from(allPossibleSlots).filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return availableSlots.sort();
  } catch (error) {
    console.error("Error getting available slots:", error);
    return [];
  }
}

export async function isTimeSlotAvailable(
  dateStr: string,
  timeSlot: string
): Promise<boolean> {
  try {
    const availableSlots = await getAvailableSlots(dateStr);
    return availableSlots.includes(timeSlot);
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false;
  }
}
