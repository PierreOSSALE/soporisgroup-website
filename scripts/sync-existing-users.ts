// scripts/final-sync-users.ts
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function finalSyncUsers() {
  console.log("🔄 Synchronisation finale des utilisateurs...");

  try {
    // Récupérer tous les utilisateurs Supabase
    const {
      data: { users: authUsers },
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    console.log(`📊 ${authUsers.length} utilisateurs dans Supabase Auth`);

    for (const authUser of authUsers) {
      try {
        if (!authUser.email) continue;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ supabaseId: authUser.id }, { email: authUser.email }],
          },
        });

        if (!existingUser) {
          // Créer l'utilisateur
          const newUser = await prisma.user.create({
            data: {
              id: crypto.randomUUID(),
              email: authUser.email,
              name:
                authUser.user_metadata?.name || authUser.email.split("@")[0],
              role: "user",
              supabaseId: authUser.id,
              isActive: true,
              joinedDate: new Date(authUser.created_at),
              emailVerified: authUser.email_confirmed_at
                ? new Date(authUser.email_confirmed_at)
                : null,
            },
          });

          console.log(`✅ ${authUser.email} créé (ID: ${newUser.id})`);
        } else {
          // Mettre à jour les infos si nécessaire
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              supabaseId: authUser.id,
              emailVerified: authUser.email_confirmed_at
                ? new Date(authUser.email_confirmed_at)
                : existingUser.emailVerified,
            },
          });

          console.log(`🔁 ${authUser.email} mis à jour`);
        }
      } catch (userError) {
        console.error(`❌ Erreur pour ${authUser.email}:`, userError);
      }
    }

    console.log("\n🎉 Synchronisation terminée!");
  } catch (error) {
    console.error("💥 Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

finalSyncUsers();
