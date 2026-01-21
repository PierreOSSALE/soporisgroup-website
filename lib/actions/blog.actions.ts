"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  blogPostCreateSchema,
  blogPostUpdateSchema,
  authorSchema,
  type BlogPostCreateInput,
  type BlogPostUpdateInput,
  type AuthorInput,
  type AuthorCreateInput,
  type TableOfContentsItem,
} from "@/lib/schema/blog.schema";
import { generateTableOfContents } from "@/lib/utils/markdown";

// === AUTHORS ===
export const getAuthors = async () => {
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
    console.error("Erreur récupération auteurs:", error);
    throw new Error("Erreur lors de la récupération des auteurs");
  }
};

export const searchAuthors = async (query: string) => {
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
    console.error("Erreur recherche auteurs:", error);
    throw new Error("Erreur lors de la recherche des auteurs");
  }
};

export async function createAuthor(data: AuthorInput) {
  const validated = authorSchema.safeParse(data);
  if (!validated.success) {
    console.error("Validation author error:", validated.error);
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const author = await prisma.author.create({
      data: {
        ...validated.data,
        bio: validated.data.bio || null,
      },
    });

    revalidatePath("/admin-blog");
    return author;
  } catch (error: any) {
    console.error("Create author error:", error);
    if (error.code === "P2002") {
      throw new Error("Un auteur avec ce nom existe déjà");
    }
    throw new Error("Erreur lors de la création de l'auteur");
  }
}

export async function getOrCreateAuthor(data: AuthorCreateInput) {
  try {
    const existingAuthor = await prisma.author.findFirst({
      where: { name: data.name },
    });

    if (existingAuthor) {
      return existingAuthor;
    }

    const author = await prisma.author.create({
      data: {
        name: data.name,
        avatar:
          data.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3b82f6&color=fff`,
        bio: data.bio || null,
      },
    });

    revalidatePath("/admin-blog");
    return author;
  } catch (error: any) {
    console.error("Get or create author error:", error);
    if (error.code === "P2002") {
      const existingAuthor = await prisma.author.findFirst({
        where: { name: data.name },
      });
      if (existingAuthor) return existingAuthor;
    }
    throw new Error("Erreur lors de la création de l'auteur");
  }
}

// === BLOG POSTS ===
export const getBlogPosts = async () => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.error("Erreur récupération articles:", error);
    throw new Error("Erreur lors de la récupération des articles");
  }
};

export const getPublishedBlogPosts = async () => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    // Convertir les dates
    return posts.map((post) => ({
      ...post,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error("Erreur récupération articles publiés:", error);
    throw new Error("Erreur lors de la récupération des articles publiés");
  }
};

export const getFeaturedBlogPosts = async (limit: number = 3) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });
    return posts;
  } catch (error) {
    console.error("Erreur récupération articles populaires:", error);
    throw new Error("Erreur lors de la récupération des articles populaires");
  }
};

export const getBlogPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return null;
    }

    // Convertir les dates en objets Date
    return {
      ...post,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    };
  } catch (error) {
    console.error(`Erreur pour le slug ${slug}:`, error);
    return null;
  }
};

export const getRecommendedPosts = async (
  currentSlug: string,
  limit: number = 3,
) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { not: null },
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
    console.error("Erreur récupération articles recommandés:", error);
    return [];
  }
};

export const getBlogCategories = async () => {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ["category"],
      where: {
        published: true,
        publishedAt: { not: null },
      },
      _count: {
        category: true,
      },
    });
    return categories.map((cat) => cat.category);
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    throw new Error("Erreur lors de la récupération des catégories");
  }
};

export const getBlogPostsByCategory = async (category: string) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        category,
        published: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.error("Erreur récupération articles par catégorie:", error);
    throw new Error(
      "Erreur lors de la récupération des articles par catégorie",
    );
  }
};

/**
 * Fonction principale : crée un article avec génération automatique de la table des matières
 */
export async function createBlogPost(data: BlogPostCreateInput) {
  const validated = blogPostCreateSchema.safeParse(data);
  if (!validated.success) {
    console.error("Validation blog post error:", validated.error.format());
    throw new Error(validated.error.issues[0]?.message || "Données invalides");
  }

  try {
    let authorId = validated.data.authorId;

    // Si un nouvel auteur est fourni
    if (validated.data.authorInput && !validated.data.authorId) {
      const author = await getOrCreateAuthor(validated.data.authorInput);
      authorId = author.id;
    }

    // Si aucun auteur n'est fourni
    if (!authorId) {
      throw new Error("Un auteur est requis");
    }

    // GÉNÉRATION AUTOMATIQUE DE LA TABLE DES MATIÈRES
    const tableOfContents = generateTableOfContents(validated.data.content);

    // Si l'article est publié, on met la date actuelle
    const publishedAt = validated.data.published ? new Date() : null;

    const blogPost = await prisma.blogPost.create({
      data: {
        title: validated.data.title,
        slug: validated.data.slug,
        excerpt: validated.data.excerpt,
        authorId: authorId,
        category: validated.data.category,
        readTime: validated.data.readTime,
        image: validated.data.image,
        content: validated.data.content,
        published: validated.data.published,
        publishedAt: publishedAt,
        // Table des matières générée automatiquement
        tableOfContents: tableOfContents,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin-blog");

    // Convertir les dates
    return {
      ...blogPost,
      publishedAt: blogPost.publishedAt ? new Date(blogPost.publishedAt) : null,
      createdAt: new Date(blogPost.createdAt),
      updatedAt: new Date(blogPost.updatedAt),
    };
  } catch (error: any) {
    console.error("Create blog post error:", error);
    if (error.code === "P2002") {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error(error.message || "Erreur lors de la création de l'article");
  }
}

/**
 * Fonction pour mettre à jour un article avec régénération de la table des matières si nécessaire
 */
export async function updateBlogPost(id: string, data: BlogPostUpdateInput) {
  const validated = blogPostUpdateSchema.safeParse(data);
  if (!validated.success) {
    console.error("Validation update error:", validated.error.format());
    throw new Error(validated.error.issues[0]?.message || "Données invalides");
  }

  try {
    // Récupérer l'article actuel
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!currentPost) {
      throw new Error("Article non trouvé");
    }

    const updateData: any = { ...validated.data };

    // Supprimer authorInput car il n'est pas stocké directement
    delete updateData.authorInput;

    // Gérer authorId
    if (validated.data.authorInput && !validated.data.authorId) {
      const author = await getOrCreateAuthor(validated.data.authorInput);
      updateData.authorId = author.id;
    }

    // GÉNÉRATION AUTOMATIQUE DE LA TABLE DES MATIÈRES
    // Si du contenu est fourni, on regénère la table des matières
    if (updateData.content) {
      const tableOfContents = generateTableOfContents(updateData.content);
      updateData.tableOfContents = tableOfContents;
    } else if (updateData.tableOfContents === undefined) {
      // Si pas de contenu et pas de table des matières fournie, garder l'ancienne
      updateData.tableOfContents = currentPost.tableOfContents;
    }

    // Gestion du statut de publication
    if (validated.data.published !== undefined) {
      // Passage en brouillon
      if (validated.data.published === false) {
        updateData.publishedAt = null;
      }
      // Passage en publié
      else if (validated.data.published === true && !currentPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin-blog");
    revalidatePath(`/blog/${blogPost.slug}`);

    // Convertir les dates
    return {
      ...blogPost,
      publishedAt: blogPost.publishedAt ? new Date(blogPost.publishedAt) : null,
      createdAt: new Date(blogPost.createdAt),
      updatedAt: new Date(blogPost.updatedAt),
    };
  } catch (error: any) {
    console.error("Update blog post error:", error);
    if (error.code === "P2002") {
      throw new Error("Un article avec ce slug existe déjà");
    }
    throw new Error(
      error.message || "Erreur lors de la mise à jour de l'article",
    );
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath("/admin-blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    throw new Error("Erreur lors de la suppression de l'article");
  }
}

export async function incrementBlogPostViews(id: string) {
  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return updated;
  } catch (error) {
    console.error("Erreur incrémentation vues:", error);
    return null;
  }
}

// === Fonctions utilitaires supplémentaires ===
export const getAuthorWithPosts = async (authorId: string) => {
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
    console.error("Erreur récupération auteur avec posts:", error);
    throw new Error("Erreur lors de la récupération de l'auteur");
  }
};

export const getBlogStats = async () => {
  try {
    const [totalPosts, totalViews, totalAuthors, recentPosts] =
      await Promise.all([
        prisma.blogPost.count({
          where: { published: true, publishedAt: { not: null } },
        }),
        prisma.blogPost.aggregate({
          where: { published: true, publishedAt: { not: null } },
          _sum: { views: true },
        }),
        prisma.author.count(),
        prisma.blogPost.findMany({
          where: { published: true, publishedAt: { not: null } },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            views: true,
          },
        }),
      ]);

    return {
      totalPosts,
      totalViews: totalViews._sum.views || 0,
      totalAuthors,
      recentPosts,
    };
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    throw new Error("Erreur lors de la récupération des statistiques");
  }
};

// === Batch operations ===
export async function batchUpdateBlogPosts(
  updates: Array<{ id: string; data: Partial<BlogPostUpdateInput> }>,
) {
  try {
    const results = await prisma.$transaction(
      updates.map(({ id, data }) =>
        prisma.blogPost.update({
          where: { id },
          data,
        }),
      ),
    );

    revalidatePath("/blog");
    revalidatePath("/admin-blog");

    return results;
  } catch (error: any) {
    console.error("Batch update error:", error);
    throw new Error("Erreur lors des mises à jour groupées");
  }
}

// Fonction pour obtenir un article par ID (non mise en cache pour l'admin)
export async function getBlogPostById(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
    return post;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'article");
  }
}
