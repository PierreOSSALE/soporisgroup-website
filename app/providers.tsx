// app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="soporis-theme">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
