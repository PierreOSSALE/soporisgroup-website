// app/api/auth/sync/route.ts
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser?.email) {
      console.log("⚠️ [SYNC API] Appel sans utilisateur valide");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 1. Get User from DB
    let dbUser = await prisma.user.findFirst({
      where: { OR: [{ supabaseId: authUser.id }, { email: authUser.email }] },
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!dbUser) {
      console.log(
        `[SYNC API] 📝 Création utilisateur manquant: ${authUser.email}`
      );

      dbUser = await prisma.user.create({
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
    }

    // 2. Sync Role to Metadata
    const roleToInject = dbUser.role;
    console.log(
      `[SYNC API] 🔑 Injection rôle: ${roleToInject} pour ${authUser.email}`
    );

    await supabase.auth.updateUser({
      data: { role: roleToInject },
    });

    return NextResponse.json({
      success: true,
      role: roleToInject,
      userId: dbUser.id,
    });
  } catch (error) {
    console.error("[SYNC API] 💥 Erreur:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
