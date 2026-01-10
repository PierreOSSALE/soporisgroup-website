// components/features/blog/ViewIncrementer.tsx
"use client";

import { useEffect } from "react";
import { incrementBlogViews } from "@/lib/actions/blog.actions";

export function ViewIncrementer({ articleId }: { articleId: string }) {
  useEffect(() => {
    incrementBlogViews(articleId);
  }, [articleId]);

  return null;
}
