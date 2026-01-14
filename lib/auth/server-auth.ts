// lib/auth/server-auth.ts
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Récupère l'utilisateur Prisma actuel (très rapide via session)
 */
export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId: authUser.id }, { email: authUser.email! }],
    },
  });

  return user;
}

/**
 * Protection de route simple pour Server Components
 */
export async function requireRole(role: "admin" | "assistant" | "user") {
  const user = await getServerUser();

  if (!user || !user.isActive) redirect("/signin");

  if (role === "admin" && user.role !== "admin") {
    redirect("/");
  }

  if (
    role === "assistant" &&
    user.role !== "assistant" &&
    user.role !== "admin"
  ) {
    redirect("/");
  }

  return user;
}
