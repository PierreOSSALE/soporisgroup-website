"use server";

import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  testimonialSchema,
  TestimonialInput,
} from "@/lib/schema/testimonial.schema";

// --- LECTURE (Cachée) ---

export const getTestimonials = unstable_cache(
  async () => {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  ["all-testimonials"],
  { revalidate: 1800, tags: ["testimonials"] }
);

export const getActiveTestimonials = unstable_cache(
  async () => {
    return await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["active-testimonials"],
  { revalidate: 1800, tags: ["testimonials"] }
);

// --- ECRITURE ---

export async function createTestimonial(data: TestimonialInput) {
  const validated = testimonialSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: validated.data,
    });

    // Correction ici : ajout du 2ème argument "layout"
    revalidateTag("testimonials", "max");
    revalidatePath("/admin/testimonials", "layout");
    revalidatePath("/", "layout");

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

    // Correction ici : ajout du 2ème argument "layout"
    revalidateTag("testimonials", "max");
    revalidatePath("/admin/testimonials", "layout");
    revalidatePath("/", "layout");

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

    // Correction ici : ajout du 2ème argument "layout"
    revalidateTag("testimonials", "max");
    revalidatePath("/admin/testimonials", "layout");
    revalidatePath("/", "layout");
  } catch (error) {
    throw new Error("Erreur lors de la suppression du témoignage");
  }
}
