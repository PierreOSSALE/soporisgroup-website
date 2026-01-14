// app/(auth)/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!authError) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser?.email) {
        try {
          console.log(`[CALLBACK] 🔍 Sync DB pour: ${authUser.email}`);

          // 1. Recherche ou Création Prisma
          let dbUser = await prisma.user.findFirst({
            where: {
              OR: [{ supabaseId: authUser.id }, { email: authUser.email }],
            },
            select: { id: true, role: true },
          });

          if (!dbUser) {
            console.log("[CALLBACK] 📝 Création nouvel utilisateur Prisma");
            dbUser = await prisma.user.create({
              data: {
                id: crypto.randomUUID(),
                email: authUser.email,
                name:
                  authUser.user_metadata?.name || authUser.email.split("@")[0],
                role: "user",
                supabaseId: authUser.id,
                joinedDate: new Date(),
              },
              select: { id: true, role: true },
            });
          }

          // 2. INJECTION DU RÔLE DANS LES METADATA (Pour le Proxy)
          console.log(
            `[CALLBACK] 🚀 Injection du rôle "${dbUser.role}" dans Supabase...`
          );
          await supabase.auth.updateUser({
            data: { role: dbUser.role },
          });

          // 3. REDIRECTION HYBRIDE (PROD vs DEV)
          const role = dbUser.role;
          const isProd = process.env.NODE_ENV === "production";

          console.log(
            `[CALLBACK] 🎯 Redirection finale vers zone: ${role} (${
              isProd ? "PROD" : "DEV"
            })`
          );

          if (isProd) {
            if (role === "admin")
              return NextResponse.redirect(
                `https://admin.soporisgroup.com/dashboard`
              );
            if (role === "assistant")
              return NextResponse.redirect(
                `https://assistance.soporisgroup.com/assistant-dashboard`
              );
            return NextResponse.redirect(`https://soporisgroup.com/`);
          } else {
            // Localhost : On utilise le path
            if (role === "admin")
              return NextResponse.redirect(`${origin}/dashboard`);
            if (role === "assistant")
              return NextResponse.redirect(`${origin}/assistant-dashboard`);
            return NextResponse.redirect(`${origin}/`);
          }
        } catch (error) {
          console.error("[CALLBACK] 💥 Erreur Sync:", error);
          return NextResponse.redirect(`${origin}/signin?error=sync_failed`);
        }
      }
    }
  }
  return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}
