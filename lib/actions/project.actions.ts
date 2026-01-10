// lib/actions/project.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectSchema, ProjectInput } from "@/lib/schema/project.schema";
import { Prisma } from "@prisma/client";

export async function createProject(data: ProjectInput) {
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || "Données invalides");
  }

  try {
    // Vérifier si le slug existe déjà
    const existingProject = await prisma.project.findUnique({
      where: { slug: validated.data.slug },
    });

    if (existingProject) {
      throw new Error("Un projet avec ce slug existe déjà");
    }

    const project = await prisma.project.create({
      data: {
        title: validated.data.title,
        subtitle: validated.data.subtitle,
        slug: validated.data.slug,
        category: validated.data.category,
        client: validated.data.client,
        duration: validated.data.duration,
        pack: validated.data.pack,
        year: validated.data.year,
        status: validated.data.status,
        imageUrl: validated.data.imageUrl,
        featured: validated.data.featured,
        description: validated.data.description,
        technologies: validated.data.technologies as Prisma.JsonArray,
        challenges: validated.data.challenges as Prisma.JsonArray,
        solutions: validated.data.solutions as Prisma.JsonArray,
        results: validated.data.results as Prisma.JsonArray,
        screenshots: validated.data.screenshots as Prisma.JsonArray,
        testimonial: validated.data.testimonial as Prisma.JsonObject,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/realisations");
    return project;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du projet");
  }
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  const validated = projectSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || "Données invalides");
  }

  try {
    // Si le slug est modifié, vérifier qu'il n'existe pas déjà
    if (validated.data.slug) {
      const existingProject = await prisma.project.findFirst({
        where: {
          slug: validated.data.slug,
          NOT: { id },
        },
      });

      if (existingProject) {
        throw new Error("Un projet avec ce slug existe déjà");
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...validated.data,
        technologies: validated.data.technologies as Prisma.JsonArray,
        challenges: validated.data.challenges as Prisma.JsonArray,
        solutions: validated.data.solutions as Prisma.JsonArray,
        results: validated.data.results as Prisma.JsonArray,
        screenshots: validated.data.screenshots as Prisma.JsonArray,
        testimonial: validated.data.testimonial as Prisma.JsonObject,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/realisations");
    revalidatePath(`/realisations/${project.slug}`);
    return project;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la mise à jour du projet");
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/realisations");
    return { success: true };
  } catch (error) {
    throw new Error("Erreur lors de la suppression du projet");
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        category: true,
        client: true,
        duration: true,
        pack: true,
        year: true,
        status: true,
        imageUrl: true,
        featured: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return projects;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des projets");
  }
}

export async function getPublishedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "published" },
      orderBy: { featured: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        category: true,
        client: true,
        duration: true,
        pack: true,
        year: true,
        imageUrl: true,
        featured: true,
        description: true,
        technologies: true,
        results: true,
      },
    });
    return projects;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des projets publiés");
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new Error("Projet non trouvé");
    }

    return project;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du projet");
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("Projet non trouvé");
    }

    return project;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du projet");
  }
}

export async function toggleFeatured(id: string, featured: boolean) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { featured },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/realisations");
    return project;
  } catch (error) {
    throw new Error("Erreur lors de la modification du statut 'featured'");
  }
}

export async function changeStatus(
  id: string,
  status: "draft" | "published" | "archived"
) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/realisations");
    if (status === "published") {
      revalidatePath(`/realisations/${project.slug}`);
    }
    return project;
  } catch (error) {
    throw new Error("Erreur lors du changement de statut");
  }
}
