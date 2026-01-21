"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: string[] | TableOfContentsItem[] | any[];
  className?: string;
}

// Fonction pour générer un ID cohérent
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Supprime les caractères spéciaux sauf les tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Supprime les tirets multiples
    .trim();
};

const TableOfContents = ({ items, className }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [visibleItems, setVisibleItems] = useState<TableOfContentsItem[]>([]);

  // Convertir items en format normalisé
  useEffect(() => {
    if (Array.isArray(items)) {
      const processedItems: TableOfContentsItem[] = items
        .map((item, index) => {
          if (typeof item === "string") {
            // Si c'est une string, créer un objet avec id et text
            const id = generateId(item);
            return {
              id,
              text: item,
              level: item.startsWith("###") ? 3 : item.startsWith("##") ? 2 : 1,
            };
          } else if (item && typeof item === "object") {
            // Si c'est déjà un objet avec id/text
            return {
              id:
                item.id ||
                generateId(item.text || item.title || `section-${index}`),
              text: item.text || item.title || String(item),
              level: item.level || 2,
            };
          }
          return {
            id: `section-${index}`,
            text: String(item),
            level: 2,
          };
        })
        .filter(Boolean);

      setVisibleItems(processedItems);
    } else {
      setVisibleItems([]);
    }
  }, [items]);

  useEffect(() => {
    if (visibleItems.length === 0) return;

    const handleScroll = () => {
      let current = "";

      for (const item of visibleItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 100) {
            current = item.id;
            break;
          }
        }
      }

      if (current) {
        setActiveId(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementTop =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  if (visibleItems.length === 0) {
    return (
      <div className={cn("p-4 border rounded-lg bg-card", className)}>
        <h3 className="font-medium text-foreground mb-2">Table des matières</h3>
        <p className="text-sm text-muted-foreground">
          Aucun titre disponible dans cet article
        </p>
      </div>
    );
  }

  return (
    <div className={cn("p-4", className)}>
      <h3 className="font-medium text-foreground mb-3">Table des matières</h3>
      <nav className="space-y-1">
        {visibleItems.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={index}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-start w-full text-left py-2 px-3 rounded-md text-sm transition-all duration-200 cursor-pointer",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
              style={{
                paddingLeft: `${(item.level - 1) * 16}px`,
                marginLeft: item.level > 2 ? "8px" : "0",
              }}
              aria-current={isActive ? "true" : "false"}
            >
              <span className="truncate">
                {item.text.replace(/^#+\s*/, "")}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TableOfContents;
