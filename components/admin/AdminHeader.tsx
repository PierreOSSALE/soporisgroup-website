//components/admin/AdminHeader.tsx
"use client";

import { usePathname } from "next/navigation";

export interface AdminHeaderProps {
  sidebarOpen: boolean;
  currentUser?: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  } | null;
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
  sidebarOpen,
  currentUser,
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
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getCurrentPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Avatar Dynamique */}
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser.name || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              {/* Initiale dynamique (A de Admin ou première lettre du nom) */}
              {currentUser?.name?.[0].toUpperCase() || "U"}
            </div>
          )}

          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {currentUser?.name || "Utilisateur"}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {currentUser?.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
