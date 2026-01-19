// lib/actions/comment.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { commentSchema, type CommentInput } from "@/lib/schema/blog.schema";
import { revalidatePath } from "next/cache";

export async function createComment(data: CommentInput) {
  const validated = commentSchema.safeParse(data);

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    // Vérifier que l'article existe
    const post = await prisma.blogPost.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new Error("Article non trouvé");
    }

    // Créer le commentaire (non approuvé par défaut)
    const comment = await prisma.comment.create({
      data: {
        ...validated.data,
        approved: false, // Nécessite modération
      },
    });

    // Pas besoin de revalidatePath ici car le commentaire n'est pas encore visible
    // Il ne sera visible qu'après approbation admin

    return {
      success: true,
      message:
        "Commentaire soumis avec succès. Il sera publié après modération.",
      commentId: comment.id,
    };
  } catch (error: any) {
    console.error("Erreur création commentaire:", error);

    if (error.code === "P2003") {
      throw new Error("Article non trouvé");
    }

    throw new Error("Erreur lors de la création du commentaire");
  }
}

export async function getCommentsByPostId(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        approved: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        author: true,
        content: true,
        createdAt: true,
      },
    });

    // Formater les dates
    return comments.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Erreur récupération commentaires:", error);
    return [];
  }
}

// Fonctions pour l'admin
export async function getPendingComments() {
  try {
    const comments = await prisma.comment.findMany({
      where: { approved: false },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  } catch (error) {
    console.error("Erreur récupération commentaires en attente:", error);
    throw new Error(
      "Erreur lors de la récupération des commentaires en attente"
    );
  }
}

export async function approveComment(id: string) {
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { approved: true },
      include: {
        post: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Revalider la page du blog après approbation
    revalidatePath(`/blog/${comment.post.slug}`);
    revalidatePath("/admin/comments");

    return comment;
  } catch (error) {
    console.error("Erreur approbation commentaire:", error);
    throw new Error("Erreur lors de l'approbation du commentaire");
  }
}

export async function deleteComment(id: string) {
  try {
    await prisma.comment.delete({
      where: { id },
    });

    revalidatePath("/admin/comments");
  } catch (error) {
    console.error("Erreur suppression commentaire:", error);
    throw new Error("Erreur lors de la suppression du commentaire");
  }
}
