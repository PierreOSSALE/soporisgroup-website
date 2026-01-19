// components/blog/TableOfContents.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: string[] | any[];
  className?: string;
}

const TableOfContents = ({ items, className }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  // Convertir items en tableau de strings si ce n'est pas déjà le cas
  useEffect(() => {
    if (Array.isArray(items)) {
      const processedItems = items.map((item) =>
        typeof item === "string" ? item : String(item)
      );
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
        const element = document.getElementById(
          item.toLowerCase().replace(/\s+/g, "-")
        );
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = item;
          }
        }
      }

      if (current) {
        setActiveId(current);
      }
    };

    handleScroll(); // Vérifier immédiatement
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleItems]);

  const scrollToSection = (title: string) => {
    const element = document.getElementById(
      title.toLowerCase().replace(/\s+/g, "-")
    );
    if (element) {
      const offset = 100; // Compensation pour le header fixe
      const elementTop =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-1", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Table des matières
      </h3>
      <div className="space-y-0.5">
        {visibleItems.map((item, index) => {
          const isActive = activeId === item;
          return (
            <button
              key={index}
              onClick={() => scrollToSection(item)}
              className={cn(
                "flex items-center gap-1.5 w-full text-left py-1.5 px-2 rounded-md text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-current={isActive ? "true" : "false"}
            >
              {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
              <span className={cn("truncate", isActive ? "ml-0" : "ml-4")}>
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TableOfContents;
