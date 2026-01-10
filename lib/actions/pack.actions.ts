// lib/actions/pack.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { packSchema, PackInput } from "@/lib/schema/pack.schema";

export async function createPack(data: PackInput) {
  const validated = packSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const pack = await prisma.pack.create({
      data: {
        ...validated.data,
        promoEndDate: validated.data.promoEndDate
          ? new Date(validated.data.promoEndDate)
          : null,
        originalPrice: validated.data.originalPrice || null,
        promoLabel: validated.data.promoLabel || null,
      },
    });
    revalidatePath("/admin/packs");
    revalidatePath("/packs");
    revalidatePath("/");
    return pack;
  } catch (error) {
    console.error("Erreur création pack:", error);
    throw new Error("Erreur lors de la création du pack");
  }
}

export async function updatePack(id: string, data: Partial<PackInput>) {
  const validated = packSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const pack = await prisma.pack.update({
      where: { id },
      data: {
        ...validated.data,
        promoEndDate: validated.data.promoEndDate
          ? new Date(validated.data.promoEndDate)
          : validated.data.promoEndDate === null
          ? null
          : undefined,
        originalPrice:
          validated.data.originalPrice !== undefined
            ? validated.data.originalPrice
            : undefined,
        promoLabel:
          validated.data.promoLabel !== undefined
            ? validated.data.promoLabel
            : undefined,
      },
    });
    revalidatePath("/admin/packs");
    revalidatePath("/packs");
    revalidatePath("/");
    return pack;
  } catch (error) {
    console.error("Erreur mise à jour pack:", error);
    throw new Error("Erreur lors de la mise à jour du pack");
  }
}

export async function deletePack(id: string) {
  try {
    await prisma.pack.delete({
      where: { id },
    });
    revalidatePath("/admin/packs");
    revalidatePath("/packs");
    revalidatePath("/");
  } catch (error) {
    console.error("Erreur suppression pack:", error);
    throw new Error("Erreur lors de la suppression du pack");
  }
}

export async function getPacks() {
  try {
    const packs = await prisma.pack.findMany({
      orderBy: [{ order: "asc" }, { price: "asc" }],
    });
    return packs;
  } catch (error) {
    console.error("Erreur récupération packs:", error);
    throw new Error("Erreur lors de la récupération des packs");
  }
}

export async function getActivePacks() {
  try {
    const packs = await prisma.pack.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { price: "asc" }],
    });
    return packs;
  } catch (error) {
    console.error("Erreur récupération packs actifs:", error);
    throw new Error("Erreur lors de la récupération des packs actifs");
  }
}

export async function getPackById(id: string) {
  try {
    const pack = await prisma.pack.findUnique({
      where: { id },
    });
    return pack;
  } catch (error) {
    console.error("Erreur récupération pack:", error);
    throw new Error("Erreur lors de la récupération du pack");
  }
}

export async function getPopularPacks() {
  try {
    const packs = await prisma.pack.findMany({
      where: { isPopular: true, isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    });
    return packs;
  } catch (error) {
    console.error("Erreur récupération packs populaires:", error);
    throw new Error("Erreur lors de la récupération des packs populaires");
  }
}
