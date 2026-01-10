// lib/actions/service.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serviceSchema, ServiceInput } from "@/lib/schema/service.schema";

export async function createService(data: ServiceInput) {
  const validated = serviceSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const service = await prisma.service.create({
      data: validated.data,
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return service;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Un service avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la création du service");
  }
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  const validated = serviceSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const service = await prisma.service.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    return service;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("Un service avec ce slug existe déjà");
    }
    throw new Error("Erreur lors de la mise à jour du service");
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
  } catch (error) {
    throw new Error("Erreur lors de la suppression du service");
  }
}

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return services;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des services");
  }
}

export async function getActiveServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return services;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des services actifs");
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    return service;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du service");
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du service");
  }
}
