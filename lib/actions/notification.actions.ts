"use server";

import { prisma } from "@/lib/prisma";
import { getAppointmentsByStatus } from "./appointment.actions";
import { getUnreadMessages } from "./message.actions";

export interface Notification {
  id: string;
  type: "appointment" | "message";
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}

export async function getNotifications() {
  try {
    const pendingAppointments = await getAppointmentsByStatus("pending");
    const unreadMessages = await getUnreadMessages();

    const appointmentNotifications = pendingAppointments.map((apt) => ({
      id: `apt-${apt.id}`,
      type: "appointment" as const,
      title: "Nouveau rendez-vous",
      description: `${apt.name} - ${apt.service}`,
      createdAt: apt.createdAt,
      read: false,
      data: apt,
    }));

    const messageNotifications = unreadMessages.map((msg) => ({
      id: `msg-${msg.id}`,
      type: "message" as const,
      title: "Nouveau message",
      description: `${msg.name} - ${msg.subject}`,
      createdAt: msg.createdAt,
      read: false,
      data: msg,
    }));

    return [...appointmentNotifications, ...messageNotifications].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    throw new Error("Erreur lors de la récupération des notifications");
  }
}
