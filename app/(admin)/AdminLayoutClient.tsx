"use client";

import { ReactNode, useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";

interface AdminLayoutClientProps {
  children: ReactNode;
  currentUser: any;
}

export default function AdminLayoutClient({
  children,
  currentUser,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay
  const pathname = usePathname();

  // Ferme la sidebar mobile lors d'un changement de page
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="soporis-ui-theme">
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "md:ml-64" : "md:ml-20"
          )}
        >
          <AdminHeader
            currentUser={currentUser}
            setMobileOpen={setMobileOpen}
          />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
