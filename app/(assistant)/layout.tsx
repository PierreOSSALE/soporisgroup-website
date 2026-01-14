// app/(assistant)/layout.tsx

import { ReactNode } from "react";
import { requireRole } from "@/lib/auth/server-auth";
import AssistantLayoutClient from "./AssistantLayoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Privé | Soporis Group",
  robots: {
    index: false,
    follow: false,
  },
};
interface AssistantLayoutProps {
  children: ReactNode;
}

export default async function AssistantLayout({
  children,
}: AssistantLayoutProps) {
  // Vérification côté serveur avant de rendre
  const currentUser = await requireRole("assistant");

  return (
    <AssistantLayoutClient currentUser={currentUser}>
      {children}
    </AssistantLayoutClient>
  );
}
