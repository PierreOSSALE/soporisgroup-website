// app/(admin)/layout.tsx

import { ReactNode } from "react";
import { requireRole } from "@/lib/auth/server-auth";
import AdminLayoutClient from "./AdminLayoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Privé | Soporis Group",
  robots: {
    index: false,
    follow: false,
  },
};
interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Vérification côté serveur avant de rendre
  const currentUser = await requireRole("admin");
  return (
    <AdminLayoutClient currentUser={currentUser}>{children}</AdminLayoutClient>
  );
}
