// lib/actions/blog.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { blogSchema, BlogInput } from "@/lib/schema/blog.schema";

export async function createBlogArticle(data: BlogInput) {
  const validated = blogSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const blogArticle = await prisma.blogArticle.create({
      data: validated.data,
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return blogArticle;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la création de l'article");
  }
}

export async function updateBlogArticle(id: string, data: Partial<BlogInput>) {
  const validated = blogSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const blogArticle = await prisma.blogArticle.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogArticle.slug}`);
    return blogArticle;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la mise à jour de l'article");
  }
}

export async function deleteBlogArticle(id: string) {
  try {
    await prisma.blogArticle.delete({
      where: { id },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'article");
  }
}

export async function getBlogArticles() {
  try {
    const articles = await prisma.blogArticle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return articles;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des articles");
  }
}

export async function getPublishedBlogArticles() {
  try {
    const articles = await prisma.blogArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return articles;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des articles publiés");
  }
}

export async function getBlogArticleBySlug(slug: string) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { slug, published: true },
    });

    if (!article) {
      throw new Error("Article non trouvé");
    }

    return article;
  } catch (error) {
    console.error(`Erreur pour le slug ${slug}:`, error);
    throw new Error("Erreur lors de la récupération de l'article");
  }
}
export async function incrementBlogViews(id: string) {
  try {
    const article = await prisma.blogArticle.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return article;
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
  }
}
