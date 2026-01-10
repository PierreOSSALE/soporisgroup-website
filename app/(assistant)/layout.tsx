// app/(assistant)/layout.tsx

"use client";

import { ReactNode, useState } from "react";
import AssistantSidebar from "@/components/assistant/AssistantSidebar";
import AssistantHeader from "@/components/assistant/AssistantHeader";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

interface AssistantLayoutProps {
  children: ReactNode;
}

export default function AssistantLayout({ children }: AssistantLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider defaultTheme="light" storageKey="soporis-ui-theme">
      <div className="min-h-screen bg-muted/30">
        <AssistantSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <AssistantHeader sidebarOpen={sidebarOpen} />
          <div className="p-6">{children}</div>
        </main>
      </div>{" "}
    </ThemeProvider>
  );
}
