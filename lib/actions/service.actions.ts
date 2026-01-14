"use server";

import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serviceSchema, ServiceInput } from "@/lib/schema/service.schema";

// --- LECTURE (Cachée) ---
export const getServices = unstable_cache(
  async () => {
    return await prisma.service.findMany({ orderBy: { order: "asc" } });
  },
  ["all-services"],
  { revalidate: 3600, tags: ["services"] }
);

export const getActiveServices = unstable_cache(
  async () => {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },
  ["active-services"],
  { revalidate: 3600, tags: ["services"] }
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.service.findUnique({ where: { slug } });
  },
  ["service-by-slug"],
  { revalidate: 3600, tags: ["services"] }
);

export const getServiceById = unstable_cache(
  async (id: string) => {
    return await prisma.service.findUnique({ where: { id } });
  },
  ["service-by-id"],
  { revalidate: 3600, tags: ["services"] }
);

// --- ECRITURE ---
export async function createService(data: ServiceInput) {
  const validated = serviceSchema.safeParse(data);
  if (!validated.success) throw new Error(validated.error.issues[0].message);
  try {
    const service = await prisma.service.create({ data: validated.data });
    revalidateTag("services", "max");
    revalidatePath("/admin/services", "layout");
    return service;
  } catch (error) {
    throw new Error("Erreur création service");
  }
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  const validated = serviceSchema.partial().safeParse(data);
  if (!validated.success) throw new Error(validated.error.issues[0].message);
  try {
    const service = await prisma.service.update({
      where: { id },
      data: validated.data,
    });
    revalidateTag("services", "max");
    revalidatePath("/admin/services", "layout");
    revalidatePath(`/services/${service.slug}`, "layout");
    return service;
  } catch (error) {
    throw new Error("Erreur mise à jour service");
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidateTag("services", "max");
    revalidatePath("/admin/services", "layout");
  } catch (error) {
    throw new Error("Erreur suppression service");
  }
}
