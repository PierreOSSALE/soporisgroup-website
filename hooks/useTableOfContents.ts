// hooks/useTableOfContents.ts
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const useTableOfContents = (content: string) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Extraction des titres depuis le contenu Markdown
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = content.matchAll(headingRegex);
    const extractedHeadings: Heading[] = [];

    for (const match of matches) {
      const level = match[1].length; // Nombre de # (1, 2, ou 3)
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-");

      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  return headings;
};
