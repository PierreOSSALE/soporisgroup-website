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

    // 2. Sync Role to Metadata
    const roleToInject = dbUser?.role || "user";
    console.log(
      `[SYNC API] 🔑 Injection rôle: ${roleToInject} pour ${authUser.email}`
    );

    await supabase.auth.updateUser({
      data: { role: roleToInject },
    });

    return NextResponse.json({
      success: true,
      role: roleToInject,
      userId: dbUser?.id,
    });
  } catch (error) {
    console.error("[SYNC API] 💥 Erreur:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
