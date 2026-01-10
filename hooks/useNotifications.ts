"use client";

import { useState, useEffect } from "react";
import { getNotifications } from "@/lib/actions/notification.actions";
import { markAsRead as markMessageAsRead } from "@/lib/actions/message.actions";

export interface Notification {
  id: string;
  type: "appointment" | "message";
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAppointments, setDismissedAppointments] = useState<
    Set<string>
  >(new Set());
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(
    new Set()
  );

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();

      // Filtrer les notifications supprimées localement
      const filtered = data.filter((notif) => {
        if (notif.type === "appointment") {
          return !dismissedAppointments.has(notif.id);
        } else if (notif.type === "message") {
          return !dismissedMessages.has(notif.id);
        }
        return true;
      });

      setNotifications(filtered);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    // Charger les IDs supprimés depuis localStorage
    const storedAppointments = localStorage.getItem("dismissedAppointmentIds");
    const storedMessages = localStorage.getItem("dismissedMessageIds");

    if (storedAppointments) {
      setDismissedAppointments(new Set(JSON.parse(storedAppointments)));
    }
    if (storedMessages) {
      setDismissedMessages(new Set(JSON.parse(storedMessages)));
    }

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsReadHandler = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;

    if (notification.type === "message") {
      try {
        await markMessageAsRead(notification.data.id);
        setDismissedMessages((prev) => {
          const newSet = new Set(prev);
          newSet.add(id);
          localStorage.setItem(
            "dismissedMessageIds",
            JSON.stringify([...newSet])
          );
          return newSet;
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    } else if (notification.type === "appointment") {
      // Pour les rendez-vous, on les considère comme lus localement
      setDismissedAppointments((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        localStorage.setItem(
          "dismissedAppointmentIds",
          JSON.stringify([...newSet])
        );
        return newSet;
      });
    }

    // Rafraîchir les notifications
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    try {
      // Marquer tous les messages non lus comme lus côté serveur
      const messageNotifications = notifications.filter(
        (n) => n.type === "message"
      );
      for (const notif of messageNotifications) {
        try {
          await markMessageAsRead(notif.data.id);
        } catch (error) {
          console.error(`Error marking message ${notif.id} as read:`, error);
        }
      }

      // Ajouter toutes les notifications aux sets locaux
      const allIds = notifications.map((n) => n.id);
      const messageIds = notifications
        .filter((n) => n.type === "message")
        .map((n) => n.id);
      const appointmentIds = notifications
        .filter((n) => n.type === "appointment")
        .map((n) => n.id);

      // Mettre à jour les sets locaux
      const newMessageSet = new Set([...dismissedMessages, ...messageIds]);
      const newAppointmentSet = new Set([
        ...dismissedAppointments,
        ...appointmentIds,
      ]);

      setDismissedMessages(newMessageSet);
      setDismissedAppointments(newAppointmentSet);

      // Sauvegarder dans localStorage
      localStorage.setItem(
        "dismissedMessageIds",
        JSON.stringify([...newMessageSet])
      );
      localStorage.setItem(
        "dismissedAppointmentIds",
        JSON.stringify([...newAppointmentSet])
      );

      // Rafraîchir les notifications
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const clearNotification = async (id: string) => {
    await markAsReadHandler(id);
  };

  const unreadCount = notifications.length;

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead: markAsReadHandler,
    markAllAsRead,
    clearNotification,
  };
}
