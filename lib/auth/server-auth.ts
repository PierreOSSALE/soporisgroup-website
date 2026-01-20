// lib/auth/server-auth.ts
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // On cherche l'utilisateur en base
  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId: authUser.id }, { email: authUser.email! }],
    },
  });

  // Cas 1: L'utilisateur n'existe pas encore (Fallback création)
  if (!dbUser && authUser.email) {
    try {
      const newUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email.split("@")[0],
          role: "user",
          supabaseId: authUser.id,
          isActive: true,
          joinedDate: new Date(),
          emailVerified: authUser.email_confirmed_at
            ? new Date(authUser.email_confirmed_at)
            : null,
        },
      });
      await supabase.auth.updateUser({ data: { role: newUser.role } });
      return newUser;
    } catch (error) {
      console.error("Erreur création fallback:", error);
      return null;
    }
  }

  // Cas 2: SYNCHRONISATION CRUCIALE
  // Si le rôle en base (Prisma) est différent du rôle dans le jeton (Supabase)
  if (dbUser && dbUser.role !== authUser.user_metadata?.role) {
    console.log(
      `[AUTH_SYNC] 🔄 Mise à jour du rôle Supabase vers: ${dbUser.role}`
    );
    await supabase.auth.updateUser({
      data: { role: dbUser.role },
    });
    // On met à jour l'objet en mémoire pour la requête actuelle
    authUser.user_metadata.role = dbUser.role;
  }

  return dbUser;
}

export async function requireRole(role: "admin" | "assistant" | "user") {
  const user = await getServerUser();
  if (!user || !user.isActive) redirect("/signin");

  if (role === "admin" && user.role !== "admin") redirect("/signin");
  if (
    role === "assistant" &&
    user.role !== "assistant" &&
    user.role !== "admin"
  )
    redirect("/signin");

  return user;
}
