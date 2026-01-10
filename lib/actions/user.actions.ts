// lib/actions/user.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userSchema, UserInput } from "@/lib/schema/user.schema";

export async function createUser(data: UserInput) {
  const validated = userSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  const hashedPassword = await hash(validated.data.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        ...validated.data,
        password: hashedPassword,
      },
    });
    revalidatePath("/admin/users");
    return user;
  } catch (error) {
    throw new Error("Erreur lors de la création de l'utilisateur");
  }
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const validated = userSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/users");
    return user;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
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
