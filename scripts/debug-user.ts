// scripts/debug-user.ts
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const prisma = new PrismaClient();

async function debugUser(email: string) {
  console.log(`🔍 Debug de l'utilisateur: ${email}`);

  // 1. Vérifier dans Supabase Auth
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("❌ Erreur Supabase:", error);
    return;
  }

  const authUser = users.find((u) => u.email === email);

  if (authUser) {
    console.log("✅ Trouvé dans Supabase Auth:");
    console.log(`   ID: ${authUser.id}`);
    console.log(`   Email confirmé: ${authUser.email_confirmed_at}`);
    console.log(`   Créé: ${authUser.created_at}`);
    console.log(`   Métadonnées:`, authUser.user_metadata);
  } else {
    console.log("❌ NON trouvé dans Supabase Auth");
  }

  // 2. Vérifier dans Prisma
  const prismaUser = await prisma.user.findUnique({
    where: { email },
  });

  if (prismaUser) {
    console.log("✅ Trouvé dans Prisma:");
    console.log(`   ID: ${prismaUser.id}`);
    console.log(`   Supabase ID: ${prismaUser.supabaseId}`);
    console.log(`   Rôle: ${prismaUser.role}`);
    console.log(`   Email vérifié: ${prismaUser.emailVerified}`);
  } else {
    console.log("❌ NON trouvé dans Prisma");
  }

  await prisma.$disconnect();
}

// Exécutez avec votre email
debugUser("lcrweb62@gmail.com");
