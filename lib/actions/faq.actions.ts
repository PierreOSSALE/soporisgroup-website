// lib/actions/faq.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { faqSchema, FaqInput } from "@/lib/schema/faq.schema";

export async function createFaq(data: FaqInput) {
  const validated = faqSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const faq = await prisma.fAQ.create({
      data: validated.data,
    });
    revalidatePath("/assistant/faq");
    revalidatePath("/");
    return faq;
  } catch (error) {
    throw new Error("Erreur lors de la création de la FAQ");
  }
}

export async function updateFaq(id: string, data: Partial<FaqInput>) {
  const validated = faqSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/assistant/faq");
    revalidatePath("/");
    return faq;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour de la FAQ");
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.fAQ.delete({
      where: { id },
    });
    revalidatePath("/assistant/faq");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Erreur lors de la suppression de la FAQ");
  }
}

export async function getFaqs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });
    return faqs;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des FAQs");
  }
}

export async function getActiveFaqs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 8,
    });
    return faqs;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des FAQs actives");
  }
}

export async function getFaqById(id: string) {
  try {
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });
    return faq;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la FAQ");
  }
}
