// lib/actions/user.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  editUserSchema,
  signupSchema,
  SignupInput,
} from "@/lib/schema/user.schema";

export async function signUp(data: SignupInput) {
  const supabase = await createClient();

  // 1. Validation Zod
  const validated = signupSchema.safeParse(data);
  if (!validated.success) return { error: "Données invalides" };

  // 2. Inscription Supabase
  // Supabase enverra automatiquement l'email via Resend si configuré
  const { data: res, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.name,
        role: "user", // Rôle par défaut
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  return {
    success: "Vérifiez votre boîte mail pour confirmer l'inscription !",
  };
}

// NOTE: On ne crée pas l'utilisateur manuellement ici pour l'auth.
// On utilise cette fonction uniquement pour l'administration.
export async function updateUser(id: string, data: any) {
  try {
    // Préparer les données avec des valeurs par défaut pour les champs optionnels
    const preparedData = {
      ...data,
      id, // S'assurer que l'ID est inclus
      phone: data.phone || null,
      image: data.image || null,
    };

    const validated = editUserSchema.safeParse(preparedData);
    if (!validated.success) {
      console.error("Erreur de validation:", validated.error.issues);
      throw new Error(validated.error.issues[0].message);
    }

    // Préparer les données pour Prisma (exclure l'ID)
    const { id: _, ...updateData } = validated.data;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: updateData.name,
        email: updateData.email,
        role: updateData.role,
        isActive: updateData.isActive,
        image: updateData.image,
      },
    });

    revalidatePath("/admin-users");
    revalidatePath("/admin/users");
    return user;
  } catch (error: any) {
    console.error("Erreur détaillée updateUser:", error);

    if (error.code === "P2002") {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }
    if (error.code === "P2025") {
      throw new Error("Utilisateur non trouvé");
    }

    throw new Error(
      error.message || "Erreur lors de la mise à jour de l'utilisateur",
    );
  }
}

export async function deleteUser(id: string) {
  try {
    // Note: Pour supprimer vraiment un utilisateur, il faudrait aussi
    // le supprimer de Supabase Auth via adminApi si nécessaire.
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
  } catch (error) {
    throw new Error("Erreur lors de la suppression");
  }
}

// ... getUsers et getUserById sont corrects dans ton code

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
}
