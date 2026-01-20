// hooks/useTimeSlots.ts
"use client";

import { useState, useEffect } from "react";
import {
  getTimeSlots as getTimeSlotsAction,
  getBlockedDates as getBlockedDatesAction,
  addTimeSlot as addTimeSlotAction,
  updateTimeSlot as updateTimeSlotAction,
  deleteTimeSlot as deleteTimeSlotAction,
  addBlockedDate as addBlockedDateAction,
  deleteBlockedDate as deleteBlockedDateAction,
} from "@/lib/actions/timeSlot.actions";

export interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
  created_at: Date;
}

const DAY_NAMES = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const data = await getTimeSlotsAction();
      setTimeSlots(data);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const fetchBlockedDates = async () => {
    try {
      const data = await getBlockedDatesAction();
      setBlockedDates(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
    fetchBlockedDates();
  }, []);

  const addTimeSlot = async (
    slot: Omit<TimeSlot, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const data = await addTimeSlotAction(slot);
      setTimeSlots([...timeSlots, data]);
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const updateTimeSlot = async (id: string, updates: Partial<TimeSlot>) => {
    try {
      const data = await updateTimeSlotAction(id, updates);
      setTimeSlots(timeSlots.map((s) => (s.id === id ? data : s)));
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      await deleteTimeSlotAction(id);
      setTimeSlots(timeSlots.filter((s) => s.id !== id));
    } catch (error: any) {
      throw error;
    }
  };

  const addBlockedDate = async (date: string, reason?: string) => {
    try {
      const data = await addBlockedDateAction(date, reason);
      setBlockedDates([...blockedDates, data]);
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const deleteBlockedDate = async (id: string) => {
    try {
      await deleteBlockedDateAction(id);
      setBlockedDates(blockedDates.filter((d) => d.id !== id));
    } catch (error: any) {
      throw error;
    }
  };

  const getDayName = (dayOfWeek: number) => DAY_NAMES[dayOfWeek];

  // Nouvelle fonction pour générer les créneaux selon la durée du rendez-vous
  const getAvailableSlotsForDateWithDuration = (
    date: Date,
    meetingDuration: number = 30,
    bookedSlots: string[] = []
  ): string[] => {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    // Vérifier si la date est bloquée
    if (blockedDates.some((bd) => bd.date === dateStr)) {
      return [];
    }

    // Obtenir les créneaux pour ce jour de la semaine
    const daySlots = timeSlots.filter(
      (slot) => slot.day_of_week === dayOfWeek && slot.is_active
    );

    // Générer les créneaux disponibles
    const availableSlots: string[] = [];

    daySlots.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      // Générer des créneaux selon la durée du rendez-vous
      for (
        let current = startMinutes;
        current + meetingDuration <= endMinutes;
        current += slot.duration_minutes // Incrément par la durée de base du créneau
      ) {
        // Vérifier si nous pouvons allouer la durée complète du rendez-vous
        if (current + meetingDuration <= endMinutes) {
          const hour = Math.floor(current / 60);
          const min = current % 60;
          const timeString = `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}`;

          // Vérifier si le créneau n'est pas déjà réservé
          if (!bookedSlots.includes(timeString)) {
            // Vérifier si c'est aujourd'hui et si le créneau est dans le futur
            const isToday = date.toDateString() === new Date().toDateString();
            if (isToday) {
              const now = new Date();
              const currentTimeInMinutes =
                now.getHours() * 60 + now.getMinutes();
              if (current > currentTimeInMinutes + 30) {
                // Buffer de 30 minutes
                availableSlots.push(timeString);
              }
            } else {
              availableSlots.push(timeString);
            }
          }
        }
      }
    });

    return availableSlots.sort();
  };

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    // Ne pas permettre les dates passées
    if (selectedDay < today) return false;

    // Vérifier si la date est bloquée
    const dateStr = date.toISOString().split("T")[0];
    if (blockedDates.some((bd) => bd.date === dateStr)) {
      return false;
    }

    // Vérifier s'il y a des créneaux pour ce jour
    const dayOfWeek = date.getDay();
    return timeSlots.some(
      (slot) => slot.day_of_week === dayOfWeek && slot.is_active
    );
  };

  // Fonction pour générer les horaires d'ouverture à afficher
  const getOpeningHours = () => {
    const hoursByDay: Record<number, { open: string; close: string }[]> = {};

    timeSlots
      .filter((slot) => slot.is_active)
      .forEach((slot) => {
        if (!hoursByDay[slot.day_of_week]) {
          hoursByDay[slot.day_of_week] = [];
        }
        hoursByDay[slot.day_of_week].push({
          open: slot.start_time,
          close: slot.end_time,
        });
      });

    return hoursByDay;
  };

  // Fonction pour formater les horaires d'ouverture en texte lisible
  const getFormattedOpeningHours = () => {
    const hoursByDay = getOpeningHours();
    const formatted: { day: string; hours: string }[] = [];

    DAY_NAMES.forEach((dayName, index) => {
      if (hoursByDay[index]) {
        const hours = hoursByDay[index]
          .map((h) => `${h.open} - ${h.close}`)
          .join(" et ");
        formatted.push({ day: dayName, hours });
      } else if (index !== 0) {
        // Dimanche
        formatted.push({ day: dayName, hours: "Fermé" });
      }
    });

    return formatted;
  };

  return {
    timeSlots,
    blockedDates,
    loading,
    error,
    fetchTimeSlots,
    fetchBlockedDates,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    addBlockedDate,
    deleteBlockedDate,
    getDayName,
    getAvailableSlotsForDate: getAvailableSlotsForDateWithDuration,
    isDateAvailable,
    getOpeningHours,
    getFormattedOpeningHours,
  };
}
