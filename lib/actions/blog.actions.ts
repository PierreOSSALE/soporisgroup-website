import { prisma } from "@/lib/prisma";
import type { BlogArticle } from "@prisma/client";

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  return prisma.blogArticle.findMany({
    where: { published: true },
    orderBy: { created_at: "desc" },
  });
}
