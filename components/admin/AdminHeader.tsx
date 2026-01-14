//components/admin/AdminHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
export interface AdminHeaderProps {
  currentUser?: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  } | null;
  setMobileOpen?: (open: boolean) => void;
}

const menuItems = [
  { label: "Dashboard", href: "/dashbord" },
  { label: "Projets", href: "/admin-projects" },
  { label: "Services", href: "/admin-services" },
  { label: "Blog", href: "/admin-blog" },
  { label: "FAQ", href: "/admin-faq" },
  { label: "Packs & Offres", href: "/admin-packs" },
  { label: "Témoignages", href: "/admin-testimonials" },
];

export default function AdminHeader({
  currentUser,
  setMobileOpen = () => {},
}: AdminHeaderProps) {
  const pathname = usePathname();

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => {
      if (item.href === "/dashbord") {
        return pathname === "/dashbord";
      }
      return pathname.startsWith(item.href);
    });

    return currentItem?.label || "Admin";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getCurrentPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser.name || "Assistant"}
              className="h-8 w-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
            </div>
          )}

          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium leading-none">
              {currentUser?.name || "Assistant"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase mt-1">
              Soporis Staff
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
