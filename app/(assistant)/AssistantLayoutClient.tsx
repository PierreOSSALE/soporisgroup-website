"use client";

import { ReactNode, useState, useEffect } from "react";
import AssistantSidebar from "@/components/assistant/AssistantSidebar";
import AssistantHeader from "@/components/assistant/AssistantHeader";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";

interface AssistantLayoutClientProps {
  children: ReactNode;
  currentUser: any;
}

export default function AssistantLayoutClient({
  children,
  currentUser,
}: AssistantLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop collapsed/expanded
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay
  const pathname = usePathname();

  // close mobile overlay when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="soporis-ui-theme">
      <div className="min-h-screen bg-muted/30">
        <AssistantSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main
          className={cn(
            "min-h-screen transition-all duration-300 overflow-x-hidden",
            // desktop spacing; on mobile the main stays full width (overlay covers it)
            sidebarOpen ? "md:ml-64" : "md:ml-20"
          )}
        >
          <AssistantHeader
            currentUser={currentUser}
            setMobileOpen={setMobileOpen}
          />
          <div className="py-6 px-4">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
