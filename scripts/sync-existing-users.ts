// scripts/sync-existing-users.ts
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncExistingUsers() {
  try {
    console.log("🔄 Synchronisation des utilisateurs existants...");

    // Récupérer tous les utilisateurs Supabase Auth
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    console.log(`📊 ${users.length} utilisateurs trouvés dans Supabase Auth`);

    for (const authUser of users) {
      try {
        // Vérifier que l'email est défini
        if (!authUser.email) {
          console.log(`⚠️ Utilisateur sans email, ID: ${authUser.id}`);
          continue;
        }

        console.log(`\n🔍 Traitement de: ${authUser.email}`);

        // Vérifier si l'utilisateur existe déjà dans Prisma
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ supabaseId: authUser.id }, { email: authUser.email }],
          },
        });

        if (!existingUser) {
          console.log(`📝 Création dans Prisma...`);

          // Générer un UUID avec crypto natif
          const uuid = crypto.randomUUID
            ? crypto.randomUUID()
            : `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;

          const newUser = await prisma.user.create({
            data: {
              id: uuid,
              email: authUser.email,
              name:
                authUser.user_metadata?.name || authUser.email.split("@")[0],
              image:
                authUser.user_metadata?.avatar_url ||
                authUser.user_metadata?.picture,
              role: "user", // Rôle par défaut
              isActive: true,
              supabaseId: authUser.id,
              lastLoginAt: new Date(),
              joinedDate: new Date(authUser.created_at),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          console.log(`✅ ${authUser.email} créé avec ID: ${newUser.id}`);
        } else {
          console.log(
            `⚠️ ${authUser.email} existe déjà (ID: ${existingUser.id})`
          );
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

// Exécuter
syncExistingUsers();
