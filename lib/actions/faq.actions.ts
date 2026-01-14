"use server";

import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { faqSchema, FaqInput } from "@/lib/schema/faq.schema";

// --- LECTURE ---
export const getFaqs = unstable_cache(
  async () => {
    return await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  },
  ["all-faqs"],
  { revalidate: 1800, tags: ["faqs"] }
);

export const getActiveFaqs = unstable_cache(
  async () => {
    return await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 8,
    });
  },
  ["active-faqs"],
  { revalidate: 1800, tags: ["faqs"] }
);

export const getFaqById = unstable_cache(
  async (id: string) => {
    return await prisma.fAQ.findUnique({ where: { id } });
  },
  ["faq-by-id"],
  { revalidate: 1800, tags: ["faqs"] }
);

// --- ECRITURE ---
export async function createFaq(data: FaqInput) {
  const validated = faqSchema.safeParse(data);
  if (!validated.success) throw new Error(validated.error.issues[0].message);
  const faq = await prisma.fAQ.create({ data: validated.data });
  revalidateTag("faqs", "max");
  revalidatePath("/", "layout");
  return faq;
}

export async function updateFaq(id: string, data: Partial<FaqInput>) {
  const faq = await prisma.fAQ.update({ where: { id }, data });
  revalidateTag("faqs", "max");
  revalidatePath("/", "layout");
  return faq;
}

export async function deleteFaq(id: string) {
  await prisma.fAQ.delete({ where: { id } });
  revalidateTag("faqs", "max");
  revalidatePath("/", "layout");
}
