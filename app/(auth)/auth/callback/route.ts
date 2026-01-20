// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    console.error("[CALLBACK] ❌ Aucun code fourni");
    return NextResponse.redirect(`${origin}/signin?error=no_code`);
  }

  try {
    const supabase = await createClient();

    // Échange du code contre une session (PKCE)
    const { error: authError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (authError) {
      console.error("[CALLBACK] ❌ Erreur échange session:", authError.message);
      return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
    }

    // Récupération de l'utilisateur authentifié
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser?.email) {
      return NextResponse.redirect(`${origin}/signin?error=no_user`);
    }

    // Création ou mise à jour dans Prisma
    return await createUserInPrisma(authUser, supabase, origin);
  } catch (error: any) {
    console.error("[CALLBACK] 💥 Erreur fatale:", error);
    return NextResponse.redirect(`${origin}/signin?error=server_error`);
  }
}

async function createUserInPrisma(
  authUser: any,
  supabase: any,
  origin: string
) {
  try {
    console.log(`[CREATE_USER] 🔍 Traitement pour: ${authUser.email}`);

    let dbUser = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!dbUser) {
      console.log(`[CREATE_USER] 📝 Nouvel utilisateur dans Prisma`);
      dbUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: authUser.email,
          name: authUser.user_metadata?.name || "Utilisateur",
          role: "user", // Rôle par défaut en attendant l'admin
          supabaseId: authUser.id,
          isActive: true,
          joinedDate: new Date(),
          emailVerified: authUser.email_confirmed_at
            ? new Date(authUser.email_confirmed_at)
            : null,
        },
      });
    } else if (!dbUser.supabaseId) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { supabaseId: authUser.id },
      });
      console.log(`[CREATE_USER] 🔄 SupabaseId lié à l'existant`);
    }

    // Sync du rôle dans les métadonnées Supabase pour le middleware
    await supabase.auth.updateUser({
      data: { role: dbUser.role, name: dbUser.name },
    });

    // Détermination de la destination
    let redirectPath = "/signin"; // Par défaut vers signin (message d'attente)
    if (dbUser.role === "admin") redirectPath = "/dashboard";
    if (dbUser.role === "assistant") redirectPath = "/assistant-dashboard";

    console.log(`[CREATE_USER] 🚀 Redirection finale: ${redirectPath}`);
    return NextResponse.redirect(`${origin}${redirectPath}`);
  } catch (error: any) {
    console.error("[CREATE_USER] 💥 Erreur Prisma:", error);
    return NextResponse.redirect(`${origin}/signin?error=database_error`);
  }
}
