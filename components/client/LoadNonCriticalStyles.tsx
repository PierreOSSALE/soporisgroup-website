// components/client/LoadNonCriticalStyles.tsx
"use client";
import { useEffect } from "react";
export default function LoadNonCriticalStyles() {
  useEffect(() => {
    import("@/styles/no-critical.css");
  }, []);

  return null;
}
