// scripts/create-user-now.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUserNow() {
  console.log("🔄 Création de l'utilisateur dans Prisma...");

  try {
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email: "lcrweb62@gmail.com",
        name: "PETER SIMON",
        role: "user",
        supabaseId: "bdf287e3-9d45-4c8c-b7bf-6ea29eb02913",
        isActive: true,
        joinedDate: new Date(),
        emailVerified: new Date("2026-01-20T15:22:44.34252Z"),
      },
    });

    console.log("✅ UTILISATEUR CRÉÉ !");
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Rôle: ${user.role}`);
    console.log(`SupabaseId: ${user.supabaseId}`);
  } catch (error: any) {
    console.error("❌ Erreur:", error.message);

    // Si l'utilisateur existe déjà
    if (error.code === "P2002") {
      console.log("⚠️ L'utilisateur existe déjà, mise à jour...");

      const existingUser = await prisma.user.update({
        where: { email: "lcrweb62@gmail.com" },
        data: {
          supabaseId: "bdf287e3-9d45-4c8c-b7bf-6ea29eb02913",
          emailVerified: new Date("2026-01-20T15:22:44.34252Z"),
        },
      });

      console.log("✅ Utilisateur mis à jour:", existingUser.id);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createUserNow();
