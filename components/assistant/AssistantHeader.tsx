"use client";

import { usePathname } from "next/navigation";
import { AssistantNotifications } from "./AssistantNotifications";

export interface AssistantHeaderProps {
  sidebarOpen: boolean;
}

const menuItems = [
  { label: "Dashboard", href: "/assistant-dashbord" },
  { label: "Rendez-vous", href: "/adminassistant-appointments" },
  { label: "FAQ", href: "/adminassistant-faq" },
  { label: "Messages", href: "/adminassistant-messages" },
];

export default function AssistantHeader({ sidebarOpen }: AssistantHeaderProps) {
  const pathname = usePathname();

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => {
      if (item.href === "/assistant-dashbord") {
        return pathname === "/assistant-dashbord";
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
        <div className="flex items-center gap-2">
          <AssistantNotifications />
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            A
          </div>
          {sidebarOpen && (
            <span className="text-sm font-medium">Assistant</span>
          )}
        </div>
      </div>
    </header>
  );
}
