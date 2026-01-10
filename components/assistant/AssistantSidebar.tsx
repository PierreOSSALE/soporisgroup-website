"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Calendar,
  HelpCircle,
  MessageSquare,
  Menu,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Route } from "next";

export interface AssistantSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/assistant-dashboard" },
  { icon: Calendar, label: "Rendez-vous", href: "/assistant-appointments" },
  { icon: HelpCircle, label: "FAQ", href: "/assistant-faq" },
  { icon: MessageSquare, label: "Messages", href: "/assistant-messages" },
];

export default function AssistantSidebar({
  sidebarOpen,
  setSidebarOpen,
}: AssistantSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/assistant-assistant") {
      return pathname === "/assistant-assistant";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {sidebarOpen && (
          <Link
            href={"/assistant-dashboard" as Route}
            className="flex items-center gap-2"
          >
            <span className="font-display text-xl font-bold text-primary">
              Soporis
            </span>
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
              Assistant
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="shrink-0"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center gap-2">
          {sidebarOpen && (
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-4 w-4" />
              Retour au site
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
