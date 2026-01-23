"use client";

import dynamic from "next/dynamic";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Chatbot uniquement côté client
const Chatbot = dynamic(
  () => import("@/components/Chatbot").then((m) => m.Chatbot),
  { ssr: false },
);

// Styles non critiques (lazy)
const LoadNonCriticalStyles = dynamic(
  () => import("@/components/client/LoadNonCriticalStyles"),
  { ssr: false },
);

export default function MarketingClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <LoadNonCriticalStyles />
      {children}
      <Chatbot />
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
}
