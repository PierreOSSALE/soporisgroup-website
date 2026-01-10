// lib/actions/message.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { messageSchema, MessageInput } from "@/lib/schema/message.schema";

export async function createMessage(data: MessageInput) {
  const validated = messageSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const message = await prisma.message.create({
      data: validated.data,
    });

    // Revalider les pages concernées
    revalidatePath("/assistant/messages");
    revalidatePath("/assistant/dashboard");

    return message;
  } catch (error) {
    console.error("Erreur création message:", error);
    throw new Error("Erreur lors de la création du message");
  }
}

export async function updateMessage(id: string, data: Partial<MessageInput>) {
  const validated = messageSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  try {
    const message = await prisma.message.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/assistant/messages");
    revalidatePath("/assistant/dashboard");

    return message;
  } catch (error) {
    console.error("Erreur mise à jour message:", error);
    throw new Error("Erreur lors de la mise à jour du message");
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.message.delete({
      where: { id },
    });

    revalidatePath("/assistant/messages");
    revalidatePath("/assistant/dashboard");
  } catch (error) {
    console.error("Erreur suppression message:", error);
    throw new Error("Erreur lors de la suppression du message");
  }
}

export async function getMessages() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return messages;
  } catch (error) {
    console.error("Erreur récupération messages:", error);
    throw new Error("Erreur lors de la récupération des messages");
  }
}

export async function getMessageById(id: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });
    return message;
  } catch (error) {
    console.error("Erreur récupération message:", error);
    throw new Error("Erreur lors de la récupération du message");
  }
}

export async function getUnreadMessages() {
  try {
    const messages = await prisma.message.findMany({
      where: { isRead: false, isArchived: false },
      orderBy: { createdAt: "desc" },
    });
    return messages;
  } catch (error) {
    console.error("Erreur récupération messages non lus:", error);
    throw new Error("Erreur lors de la récupération des messages non lus");
  }
}

export async function getRecentMessages(limit: number = 5) {
  try {
    const messages = await prisma.message.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return messages;
  } catch (error) {
    console.error("Erreur récupération messages récents:", error);
    throw new Error("Erreur lors de la récupération des messages récents");
  }
}

export async function markAsRead(id: string) {
  try {
    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/assistant/messages");
    revalidatePath("/assistant/dashboard");

    return message;
  } catch (error) {
    console.error("Erreur marquage comme lu:", error);
    throw new Error("Erreur lors du marquage du message comme lu");
  }
}

export async function toggleArchive(id: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new Error("Message non trouvé");
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isArchived: !message.isArchived },
    });

    revalidatePath("/assistant/messages");
    revalidatePath("/assistant/dashboard");

    return updatedMessage;
  } catch (error) {
    console.error("Erreur archivage message:", error);
    throw new Error("Erreur lors de l'archivage du message");
  }
}
