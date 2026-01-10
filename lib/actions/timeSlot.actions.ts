"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  } catch (error) {
    console.error("Erreur suppression date bloquée:", error);
    throw new Error("Erreur lors de la suppression de la date bloquée");
  }
}
