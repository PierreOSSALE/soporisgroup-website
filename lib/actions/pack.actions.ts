"use server";

import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { packSchema, PackInput } from "@/lib/schema/pack.schema";

// --- LECTURE ---
export const getActivePacks = unstable_cache(
  async () => {
    return await prisma.pack.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { priceEUR: "asc" }],
    });
  },
  ["active-packs"],
  { revalidate: 3600, tags: ["packs"] }
);

export const getPacks = unstable_cache(
  async () => {
    return await prisma.pack.findMany({
      orderBy: [{ order: "asc" }, { priceEUR: "asc" }],
    });
  },
  ["all-packs"],
  { revalidate: 3600, tags: ["packs"] }
);

export const getPackById = unstable_cache(
  async (id: string) => {
    return await prisma.pack.findUnique({ where: { id } });
  },
  ["pack-by-id"],
  { revalidate: 3600, tags: ["packs"] }
);

export const getPopularPacks = unstable_cache(
  async () => {
    return await prisma.pack.findMany({
      where: { isPopular: true, isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    });
  },
  ["popular-packs"],
  { revalidate: 3600, tags: ["packs"] }
);

// --- ECRITURE ---
export async function createPack(data: PackInput) {
  const validated = packSchema.safeParse(data);
  if (!validated.success) throw new Error(validated.error.issues[0].message);
  try {
    const pack = await prisma.pack.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        priceEUR: validated.data.priceEUR,
        originalPriceEUR: validated.data.originalPriceEUR,
        priceTND: validated.data.priceTND,
        originalPriceTND: validated.data.originalPriceTND,
        priceCFA: validated.data.priceCFA,
        originalPriceCFA: validated.data.originalPriceCFA,
        features: validated.data.features,
        isPopular: validated.data.isPopular,
        isPromo: validated.data.isPromo,
        promoLabel: validated.data.promoLabel,
        promoEndDate: validated.data.promoEndDate
          ? new Date(validated.data.promoEndDate)
          : null,
        promoEndDateTND: validated.data.promoEndDateTND
          ? new Date(validated.data.promoEndDateTND)
          : null,
        promoEndDateCFA: validated.data.promoEndDateCFA
          ? new Date(validated.data.promoEndDateCFA)
          : null,
        isActive: validated.data.isActive,
        order: validated.data.order,
      },
    });

    revalidateTag("packs", "max");
    revalidatePath("/", "layout");

    return pack;
  } catch (error) {
    console.error("Erreur création pack:", error);
    throw new Error("Erreur création pack");
  }
}

export async function updatePack(id: string, data: Partial<PackInput>) {
  try {
    const pack = await prisma.pack.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceEUR: data.priceEUR,
        originalPriceEUR: data.originalPriceEUR,
        priceTND: data.priceTND,
        originalPriceTND: data.originalPriceTND,
        priceCFA: data.priceCFA,
        originalPriceCFA: data.originalPriceCFA,
        features: data.features,
        isPopular: data.isPopular,
        isPromo: data.isPromo,
        promoLabel: data.promoLabel,
        promoEndDate: data.promoEndDate ? new Date(data.promoEndDate) : null,
        promoEndDateTND: data.promoEndDateTND
          ? new Date(data.promoEndDateTND)
          : null,
        promoEndDateCFA: data.promoEndDateCFA
          ? new Date(data.promoEndDateCFA)
          : null,
        isActive: data.isActive,
        order: data.order,
      },
    });

    revalidateTag("packs", "max");
    revalidatePath("/", "layout");

    return pack;
  } catch (error) {
    console.error("Erreur mise à jour pack:", error);
    throw new Error("Erreur mise à jour pack");
  }
}

export async function deletePack(id: string) {
  try {
    await prisma.pack.delete({ where: { id } });

    revalidateTag("packs", "max");
    revalidatePath("/", "layout");
  } catch (error) {
    throw new Error("Erreur suppression pack");
  }
}
