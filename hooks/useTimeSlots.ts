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

  const getAvailableSlotsForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    // Check if date is blocked
    if (blockedDates.some((bd) => bd.date === dateStr)) {
      return [];
    }

    // Get slots for this day of week
    const daySlots = timeSlots.filter(
      (slot) => slot.day_of_week === dayOfWeek && slot.is_active
    );

    // Generate time slots
    const availableSlots: string[] = [];
    daySlots.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      for (
        let m = startMinutes;
        m + slot.duration_minutes <= endMinutes;
        m += slot.duration_minutes
      ) {
        const hour = Math.floor(m / 60);
        const min = m % 60;
        availableSlots.push(
          `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}`
        );
      }
    });

    return availableSlots.sort();
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];

    // Check if in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    // Check if blocked
    if (blockedDates.some((bd) => bd.date === dateStr)) {
      return false;
    }

    // Check if there are slots for this day
    const dayOfWeek = date.getDay();
    return timeSlots.some(
      (slot) => slot.day_of_week === dayOfWeek && slot.is_active
    );
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
    getAvailableSlotsForDate,
    isDateAvailable,
  };
}
