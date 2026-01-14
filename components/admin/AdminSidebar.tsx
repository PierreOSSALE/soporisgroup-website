//components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  FileText,
  Package,
  Star,
  Menu,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";
import { Route } from "next";
import { useAuth } from "@/lib/auth/provider";
import { useEffect } from "react";

export interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projets", href: "/admin-projects" },
  { icon: Wrench, label: "Services", href: "/admin-services" },
  { icon: FileText, label: "Blog", href: "/admin-blog" },
  { icon: Package, label: "Packs", href: "/admin-packs" },
  { icon: Star, label: "Témoignages", href: "/admin-testimonials" },
];

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileOpen = false,
  setMobileOpen = () => {},
}: AdminSidebarProps) {
  const { signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Verrouiller le scroll du corps quand l'overlay mobile est ouvert
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Fermer avec la touche Echap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, setMobileOpen]);

  // Sidebar Desktop (md+)
  const desktopSidebar = (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 hidden md:block",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {sidebarOpen && (
          <Link
            href={"/dashboard" as Route}
            className="flex items-center gap-2"
          >
            <span className="font-display text-xl font-bold text-primary">
              Soporis
            </span>
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
              Admin
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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center gap-2">
          {sidebarOpen && (
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );

  // Sidebar Mobile Overlay (visible sur small screens seulement)
  const mobileSidebar = (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden flex",
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop sombre */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Panel coulissant */}
      <div
        className={cn(
          "relative z-10 h-full w-64 max-w-full transform bg-card border-r border-border transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link
            href={"/dashboard" as Route}
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-display text-lg font-bold text-primary">
              Soporis
            </span>
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

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
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 text-destructive hover:text-destructive"
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
}
