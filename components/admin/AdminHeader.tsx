"use client";

import { usePathname } from "next/navigation";

export interface AdminHeaderProps {
  sidebarOpen: boolean;
}

const menuItems = [
  { label: "Dashboard", href: "/dashbord" },
  { label: "Projets", href: "/admin-projects" },
  { label: "Services", href: "/admin-services" },
  { label: "Blog", href: "/admin-blog" },
  { label: "Rendez-vous", href: "/admin-appointments" },
  { label: "FAQ", href: "/admin-faq" },
  { label: "Packs & Offres", href: "/admin-packs" },
  { label: "Témoignages", href: "/admin-testimonials" },
  { label: "Messages", href: "/admin-messages" },
];

export default function AdminHeader({ sidebarOpen }: AdminHeaderProps) {
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
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            A
          </div>
          {sidebarOpen && <span className="text-sm font-medium">Admin</span>}
        </div>
      </div>
    </header>
  );
}
