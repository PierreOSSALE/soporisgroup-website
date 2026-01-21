/**
 * Extrait les titres d'un contenu markdown
 */
export function extractHeadingsFromMarkdown(
  content: string,
): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];

  // Regex pour détecter les titres markdown (#, ##, ###, etc.)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Nombre de # (1-6)
    const text = match[2].trim();
    const id = generateId(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

/**
 * Génère une table des matières à partir du contenu markdown
 */
export function generateTableOfContents(
  content: string,
): Array<{ id: string; text: string; level: number }> {
  return extractHeadingsFromMarkdown(content);
}
