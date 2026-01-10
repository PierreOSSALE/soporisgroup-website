// app/(admin)/layout.tsx

"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider defaultTheme="light" storageKey="soporis-ui-theme">
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <AdminHeader sidebarOpen={sidebarOpen} />
          <div className="p-6">{children}</div>
        </main>
      </div>{" "}
    </ThemeProvider>
  );
}
