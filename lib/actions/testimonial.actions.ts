// lib/actions/testimonial.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  testimonialSchema,
  TestimonialInput,
} from "@/lib/schema/testimonial.schema";

export async function createTestimonial(data: TestimonialInput) {
  const validated = testimonialSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: validated.data,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return testimonial;
  } catch (error) {
    throw new Error("Erreur lors de la création du témoignage");
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>
) {
  const validated = testimonialSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return testimonial;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du témoignage");
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Erreur lors de la suppression du témoignage");
  }
}

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return testimonials;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des témoignages");
  }
}

export async function getActiveTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return testimonials;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des témoignages actifs");
  }
}
