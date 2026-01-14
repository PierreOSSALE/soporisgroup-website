//components/assistant/AssistantHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import { AssistantNotifications } from "./AssistantNotifications";

export interface AssistantHeaderProps {
  sidebarOpen: boolean;
  currentUser?: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  } | null;
}

// URLs corrigées pour correspondre à ton arborescence réelle
const menuItems = [
  { label: "Dashboard", href: "/assistant-dashboard" },
  { label: "Rendez-vous", href: "/assistant-appointments" },
  { label: "FAQ", href: "/assistant-faq" },
  { label: "Messages", href: "/assistant-messages" },
];

export default function AssistantHeader({
  sidebarOpen,
  currentUser,
}: AssistantHeaderProps) {
  const pathname = usePathname();

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => {
      // Vérification exacte pour le dashboard, sinon vérification par préfixe
      if (item.href === "/assistant-dashboard") {
        return pathname === "/assistant-dashboard";
      }
      return pathname.startsWith(item.href);
    });

    return currentItem?.label || "Assistant";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getCurrentPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <AssistantNotifications />

          <div className="flex items-center gap-3 pl-2 border-l border-border">
            {/* Avatar Dynamique */}
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name || "Assistant"}
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {/* Initial du nom ou 'A' par défaut */}
                {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
              </div>
            )}

            {/* Informations textuelles visibles si la sidebar est ouverte */}
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {currentUser?.name || "Assistant"}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase mt-1">
                  Soporis Staff
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
