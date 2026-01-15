// components/features/blog/ViewIncrementer.tsx
"use client";

import { useEffect } from "react";
import { incrementBlogViews } from "@/lib/actions/blog.actions";

interface ViewIncrementerProps {
  articleId: string;
}

export function ViewIncrementer({ articleId }: ViewIncrementerProps) {
  useEffect(() => {
    // Incrémente les vues après un délai pour éviter les doublons
    const timer = setTimeout(() => {
      incrementBlogViews(articleId);
    }, 2000);

    return () => clearTimeout(timer);
  }, [articleId]);

  return null; // Ce composant ne rend rien
}
