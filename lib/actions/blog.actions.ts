// lib/actions/blog.actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  blogPostCreateSchema,
  blogPostUpdateSchema,
  authorSchema,
  authorCreateSchema,
  type BlogPostCreateInput,
  type BlogPostUpdateInput,
  type AuthorInput,
  type AuthorCreateInput,
} from "@/lib/schema/blog.schema";

// === AUTHORS ===
export async function createAuthor(data: AuthorInput) {
  const validated = authorSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const author = await prisma.author.create({
      data: {
        ...validated.data,
        bio: validated.data.bio || null,
      },
    });
    revalidatePath("/admin/authors");
    return author;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Un auteur avec ce nom existe déjà");
    }
    throw new Error("Erreur lors de la création de l'auteur");
  }
}

export async function getAuthors() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    });
    return authors;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des auteurs");
  }
}

export async function searchAuthors(query: string) {
  try {
    const authors = await prisma.author.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            bio: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: { name: "asc" },
      take: 10,
    });
    return authors;
  } catch (error) {
    throw new Error("Erreur lors de la recherche des auteurs");
  }
}

export async function getOrCreateAuthor(data: AuthorCreateInput) {
  try {
    // Vérifier si l'auteur existe déjà par nom avec findFirst
    const existingAuthor = await prisma.author.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingAuthor) {
      return existingAuthor;
    }

    // Créer le nouvel auteur
    const author = await prisma.author.create({
      data: {
        name: data.name,
        avatar:
          data.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.name
          )}&background=3b82f6&color=fff`,
        bio: data.bio || null,
      },
    });

    revalidatePath("/admin/authors");
    revalidatePath("/admin/blog");

    return author;
  } catch (error: any) {
    if (error.code === "P2002") {
      // Si l'auteur a été créé entre-temps, le récupérer avec findFirst
      const existingAuthor = await prisma.author.findFirst({
        where: { name: data.name },
      });
      if (existingAuthor) return existingAuthor;
    }
    throw new Error("Erreur lors de la création de l'auteur");
  }
}

// === BLOG POSTS ===
export async function createBlogPost(data: BlogPostCreateInput) {
  const validated = blogPostCreateSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    let authorId = validated.data.authorId;

    // Si un nouvel auteur est fourni dans authorInput
    if (validated.data.authorInput && !validated.data.authorId) {
      const author = await getOrCreateAuthor(validated.data.authorInput);
      authorId = author.id;
    }

    const createData: any = { ...validated.data };
    delete createData.authorInput; // Supprimer le champ authorInput

    // Si l'article est publié, on met la date actuelle
    if (validated.data.published) {
      createData.publishedAt = new Date();
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        ...createData,
        authorId,
        tableOfContents: createData.tableOfContents || [],
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return blogPost;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la création de l'article");
  }
}

export async function getAuthorWithPosts(authorId: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: {
        blogPosts: {
          orderBy: { publishedAt: "desc" },
        },
      },
    });
    return author;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'auteur");
  }
}

export async function updateBlogPost(id: string, data: BlogPostUpdateInput) {
  const validated = blogPostUpdateSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const updateData: any = { ...validated.data };

    // Si on publie l'article, définir la date de publication
    if (updateData.published === true) {
      updateData.publishedAt = new Date();
    }
    // Si on dépublie, enlever la date de publication
    else if (updateData.published === false) {
      updateData.publishedAt = null;
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogPost.slug}`);
    return blogPost;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la mise à jour de l'article");
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'article");
  }
}

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des articles");
  }
}

export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: undefined },
      },
      include: {
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    return posts;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des articles publiés");
  }
}

export async function getFeaturedBlogPosts(limit: number = 3) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: undefined },
      },
      include: {
        author: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });
    return posts;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des articles populaires");
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
        publishedAt: { not: undefined },
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new Error("Article non trouvé");
    }

    return post;
  } catch (error) {
    console.error(`Erreur pour le slug ${slug}:`, error);
    throw new Error("Erreur lors de la récupération de l'article");
  }
}

export async function getRecommendedPosts(
  currentSlug: string,
  limit: number = 3
) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: undefined },
        slug: { not: currentSlug },
      },
      include: {
        author: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });
    return posts;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles recommandés:",
      error
    );
    return [];
  }
}

export async function incrementBlogPostViews(id: string) {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return post;
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
  }
}

export async function getBlogPostsByCategory(category: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        category,
        published: true,
        publishedAt: { not: undefined },
      },
      include: {
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    return posts;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des articles par catégorie"
    );
  }
}

export async function getBlogCategories() {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ["category"],
      where: {
        published: true,
        publishedAt: { not: undefined },
      },
      _count: {
        category: true,
      },
    });
    return categories.map((cat) => cat.category);
  } catch (error) {
    throw new Error("Erreur lors de la récupération des catégories");
  }
}
