// hooks/useAvailability.ts
"use client";

import { useState, useCallback } from "react";

export function useAvailability() {
  const [loading, setLoading] = useState(false);

  const checkAvailability = useCallback(
    async (date: Date, timeSlot: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/available-slots?date=${date.toISOString().split("T")[0]}`
        );
        const data = await response.json();

        if (response.ok) {
          return data.slots.includes(timeSlot);
        }
        return false;
      } catch (error) {
        console.error("Error checking availability:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    checkAvailability,
    loading,
  };
}
