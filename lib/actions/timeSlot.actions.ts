// lib/actions/timeSlot.actions.ts
// lib/actions/timeSlot.actions.ts - VERSION CORRIGÉE
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";

// Fonction UNIQUE pour récupérer les créneaux réservés
export async function getBookedSlotsForDate(
  dateStr: string
): Promise<string[]> {
  try {
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // INCLURE à la fois CONFIRMÉS et EN ATTENTE (PENDING)
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

// Fonction pour vérifier si un créneau est disponible
export async function isTimeSlotAvailable(
  dateStr: string,
  timeSlot: string
): Promise<boolean> {
  try {
    const bookedSlots = await getBookedSlotsForDate(dateStr);
    return !bookedSlots.includes(timeSlot);
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false;
  }
}

// Fonction pour obtenir les créneaux disponibles
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

    // Récupérer les créneaux déjà réservés
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

// Garder les autres fonctions inchangées
export async function getTimeSlots() {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      orderBy: [{ day_of_week: "asc" }, { start_time: "asc" }],
    });
    return timeSlots;
  } catch (error) {
    console.error("Erreur récupération créneaux:", error);
    throw new Error("Erreur lors de la récupération des créneaux horaires");
  }
}

export async function getBlockedDates() {
  try {
    const blockedDates = await prisma.blockedDate.findMany({
      orderBy: { date: "asc" },
    });
    return blockedDates;
  } catch (error) {
    console.error("Erreur récupération dates bloquées:", error);
    throw new Error("Erreur lors de la récupération des dates bloquées");
  }
}

export async function addTimeSlot(data: {
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_active: boolean;
}) {
  try {
    const timeSlot = await prisma.timeSlot.create({
      data,
    });
    revalidatePath("/assistant/appointments");
    revalidatePath("/rendez-vous");
    return timeSlot;
  } catch (error) {
    console.error("Erreur création créneau:", error);
    throw new Error("Erreur lors de la création du créneau horaire");
  }
}

export async function updateTimeSlot(
  id: string,
  data: Partial<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    is_active: boolean;
  }>
) {
  try {
    const timeSlot = await prisma.timeSlot.update({
      where: { id },
      data,
    });
    revalidatePath("/assistant/appointments");
    revalidatePath("/rendez-vous");
    return timeSlot;
  } catch (error) {
    console.error("Erreur mise à jour créneau:", error);
    throw new Error("Erreur lors de la mise à jour du créneau horaire");
  }
}

export async function deleteTimeSlot(id: string) {
  try {
    await prisma.timeSlot.delete({
      where: { id },
    });
    revalidatePath("/assistant/appointments");
    revalidatePath("/rendez-vous");
  } catch (error) {
    console.error("Erreur suppression créneau:", error);
    throw new Error("Erreur lors de la suppression du créneau horaire");
  }
}

export async function addBlockedDate(date: string, reason?: string) {
  try {
    const blockedDate = await prisma.blockedDate.create({
      data: { date, reason },
    });
    revalidatePath("/assistant/appointments");
    revalidatePath("/rendez-vous");
    return blockedDate;
  } catch (error) {
    console.error("Erreur création date bloquée:", error);
    throw new Error("Erreur lors de la création de la date bloquée");
  }
}

export async function deleteBlockedDate(id: string) {
  try {
    await prisma.blockedDate.delete({
      where: { id },
    });
    revalidatePath("/assistant/appointments");
    revalidatePath("/rendez-vous");
  } catch (error) {
    console.error("Erreur suppression date bloquée:", error);
    throw new Error("Erreur lors de la suppression de la date bloquée");
  }
}
