// hooks/useTimeSlots.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getTimeSlots as getTimeSlotsAction,
  getBlockedDates as getBlockedDatesAction,
  addTimeSlot as addTimeSlotAction,
  updateTimeSlot as updateTimeSlotAction,
  deleteTimeSlot as deleteTimeSlotAction,
  addBlockedDate as addBlockedDateAction,
  deleteBlockedDate as deleteBlockedDateAction,
  isTimeSlotAvailable,
  getBookedSlotsForDate,
  getAvailableSlots as getAvailableSlotsAction,
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

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface DaySlots {
  [dayOfWeek: number]: {
    open: string;
    close: string;
  }[];
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

const DAY_NAMES_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedAvailableSlots, setCachedAvailableSlots] = useState<
    Map<string, string[]>
  >(new Map());

  // Charger les créneaux horaires
  const fetchTimeSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTimeSlotsAction();
      setTimeSlots(data);
      setError(null);
    } catch (error: any) {
      console.error("Erreur récupération créneaux:", error);
      setError(error.message || "Erreur lors du chargement des créneaux");
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les dates bloquées
  const fetchBlockedDates = useCallback(async () => {
    try {
      const data = await getBlockedDatesAction();
      setBlockedDates(data);
    } catch (error: any) {
      console.error("Erreur récupération dates bloquées:", error);
      setError(error.message || "Erreur lors du chargement des dates bloquées");
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTimeSlots(), fetchBlockedDates()]);
    };
    loadData();
  }, [fetchTimeSlots, fetchBlockedDates]);

  // Gestion des créneaux horaires
  const addTimeSlot = async (
    slot: Omit<TimeSlot, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const data = await addTimeSlotAction(slot);
      setTimeSlots((prev) => [...prev, data]);
      clearCache();
      return data;
    } catch (error: any) {
      console.error("Erreur ajout créneau:", error);
      throw error;
    }
  };

  const updateTimeSlot = async (id: string, updates: Partial<TimeSlot>) => {
    try {
      const data = await updateTimeSlotAction(id, updates);
      setTimeSlots((prev) => prev.map((s) => (s.id === id ? data : s)));
      clearCache();
      return data;
    } catch (error: any) {
      console.error("Erreur mise à jour créneau:", error);
      throw error;
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      await deleteTimeSlotAction(id);
      setTimeSlots((prev) => prev.filter((s) => s.id !== id));
      clearCache();
    } catch (error: any) {
      console.error("Erreur suppression créneau:", error);
      throw error;
    }
  };

  // Gestion des dates bloquées
  const addBlockedDate = async (date: string, reason?: string) => {
    try {
      const data = await addBlockedDateAction(date, reason);
      setBlockedDates((prev) => [...prev, data]);
      clearCache();
      return data;
    } catch (error: any) {
      console.error("Erreur ajout date bloquée:", error);
      throw error;
    }
  };

  const deleteBlockedDate = async (id: string) => {
    try {
      await deleteBlockedDateAction(id);
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
      clearCache();
    } catch (error: any) {
      console.error("Erreur suppression date bloquée:", error);
      throw error;
    }
  };

  // Utilitaires
  const getDayName = (dayOfWeek: number) => DAY_NAMES[dayOfWeek];
  const getDayShortName = (dayOfWeek: number) => DAY_NAMES_SHORT[dayOfWeek];

  // Vérifier si une date est disponible
  const isDateAvailable = useCallback(
    (date: Date): boolean => {
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
    },
    [timeSlots, blockedDates]
  );

  // Obtenir les horaires d'ouverture par jour
  const getOpeningHours = useCallback((): DaySlots => {
    const hoursByDay: DaySlots = {};

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
  }, [timeSlots]);

  // Formater les horaires d'ouverture pour l'affichage
  const getFormattedOpeningHours = useCallback((): OpeningHour[] => {
    const hoursByDay = getOpeningHours();
    const formatted: OpeningHour[] = [];

    DAY_NAMES.forEach((dayName, index) => {
      if (hoursByDay[index]) {
        const hours = hoursByDay[index]
          .map((h) => `${h.open} - ${h.close}`)
          .join(" et ");
        formatted.push({ day: dayName, hours });
      } else {
        formatted.push({
          day: dayName,
          hours: index === 0 ? "Dimanche - Fermé" : "Fermé",
        });
      }
    });

    return formatted;
  }, [getOpeningHours]);

  // Nettoyer le cache
  const clearCache = () => {
    setCachedAvailableSlots(new Map());
  };

  // Obtenir les créneaux disponibles pour une date (avec cache)
  const getAvailableSlotsForDate = useCallback(
    async (date: Date, meetingDuration: number = 30): Promise<string[]> => {
      const dateStr = date.toISOString().split("T")[0];
      const cacheKey = `${dateStr}-${meetingDuration}`;

      // Vérifier le cache
      if (cachedAvailableSlots.has(cacheKey)) {
        return cachedAvailableSlots.get(cacheKey)!;
      }

      const dayOfWeek = date.getDay();

      // Vérifier si la date est bloquée
      if (blockedDates.some((bd) => bd.date === dateStr)) {
        const result: string[] = [];
        cachedAvailableSlots.set(cacheKey, result);
        return result;
      }

      // Obtenir les créneaux pour ce jour de la semaine
      const daySlots = timeSlots.filter(
        (slot) => slot.day_of_week === dayOfWeek && slot.is_active
      );

      if (daySlots.length === 0) {
        const result: string[] = [];
        cachedAvailableSlots.set(cacheKey, result);
        return result;
      }

      // Récupérer les créneaux déjà réservés (PENDING + CONFIRMED)
      let bookedSlots: string[] = [];
      try {
        bookedSlots = await getBookedSlotsForDate(dateStr);
      } catch (error) {
        console.error("Erreur récupération créneaux réservés:", error);
        return [];
      }

      // Générer les créneaux disponibles
      const availableSlots: string[] = [];

      daySlots.forEach((slot) => {
        const [startHour, startMin] = slot.start_time.split(":").map(Number);
        const [endHour, endMin] = slot.end_time.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        // Utiliser meetingDuration pour l'incrément
        const increment = meetingDuration;

        for (
          let current = startMinutes;
          current + meetingDuration <= endMinutes;
          current += increment
        ) {
          const hour = Math.floor(current / 60);
          const min = current % 60;
          const timeString = `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}`;

          // Vérifier si le créneau n'est pas déjà réservé (PENDING ou CONFIRMED)
          if (!bookedSlots.includes(timeString)) {
            const isToday = date.toDateString() === new Date().toDateString();
            if (isToday) {
              const now = new Date();
              const currentTimeInMinutes =
                now.getHours() * 60 + now.getMinutes();
              // Buffer de 30 minutes pour aujourd'hui
              if (current > currentTimeInMinutes + 30) {
                availableSlots.push(timeString);
              }
            } else {
              availableSlots.push(timeString);
            }
          }
        }
      });

      const sortedSlots = availableSlots.sort();

      // Mettre en cache
      cachedAvailableSlots.set(cacheKey, sortedSlots);

      return sortedSlots;
    },
    [timeSlots, blockedDates, cachedAvailableSlots]
  );

  // Vérifier la disponibilité d'un créneau spécifique
  const checkTimeSlotAvailability = async (
    date: Date,
    timeSlot: string
  ): Promise<boolean> => {
    const dateStr = date.toISOString().split("T")[0];
    try {
      return await isTimeSlotAvailable(dateStr, timeSlot);
    } catch (error) {
      console.error("Erreur vérification disponibilité:", error);
      return false;
    }
  };

  // Obtenir les créneaux disponibles depuis le serveur (alternative)
  const getAvailableSlotsFromServer = async (
    dateStr: string
  ): Promise<string[]> => {
    try {
      return await getAvailableSlotsAction(dateStr);
    } catch (error) {
      console.error("Erreur récupération créneaux serveur:", error);
      return [];
    }
  };

  // Rafraîchir toutes les données
  const refreshSlots = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTimeSlots(), fetchBlockedDates()]);
      clearCache();
    } finally {
      setLoading(false);
    }
  };

  // Statistiques des créneaux
  const getTimeSlotsStats = useMemo(() => {
    const activeSlots = timeSlots.filter((slot) => slot.is_active);
    const inactiveSlots = timeSlots.filter((slot) => !slot.is_active);

    // Compter les jours ouverts
    const daysWithSlots = new Set(activeSlots.map((slot) => slot.day_of_week))
      .size;

    // Durée moyenne
    const totalDuration = activeSlots.reduce(
      (sum, slot) => sum + slot.duration_minutes,
      0
    );
    const averageDuration =
      activeSlots.length > 0
        ? Math.round(totalDuration / activeSlots.length)
        : 0;

    return {
      total: timeSlots.length,
      active: activeSlots.length,
      inactive: inactiveSlots.length,
      daysOpen: daysWithSlots,
      blockedDates: blockedDates.length,
      averageDuration,
    };
  }, [timeSlots, blockedDates]);

  return {
    // Données
    timeSlots,
    blockedDates,

    // États
    loading,
    error,

    // Actions sur les créneaux
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,

    // Actions sur les dates bloquées
    addBlockedDate,
    deleteBlockedDate,

    // Fonctions utilitaires
    getDayName,
    getDayShortName,
    getAvailableSlotsForDate,
    getAvailableSlotsFromServer,
    checkTimeSlotAvailability,
    isDateAvailable,
    getOpeningHours,
    getFormattedOpeningHours,

    // Gestion du cache et rafraîchissement
    refreshSlots,
    clearCache,
    fetchTimeSlots,
    fetchBlockedDates,

    // Statistiques
    stats: getTimeSlotsStats,

    // Informations dérivées
    hasTimeSlots: timeSlots.length > 0,
    hasActiveSlots: timeSlots.some((slot) => slot.is_active),
  };
}
