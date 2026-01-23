// proxy.ts
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const role = user?.user_metadata?.role || "user";

  const isAuthPath = pathname === "/signin";
  const isAdminPath = pathname.startsWith("/dashboard");
  const isAssistantPath = pathname.startsWith("/assistant-dashboard");

  // 1. PROTECTION : Rediriger vers signin si accès refusé
  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  if (isAssistantPath && role !== "assistant" && role !== "admin") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. ANTI-BOUCLE SUR SIGNIN
  if (isAuthPath && user) {
    // Si le cookie contient déjà le bon rôle, on redirige
    if (role === "admin")
      return NextResponse.redirect(new URL("/dashboard", request.url));
    if (role === "assistant")
      return NextResponse.redirect(
        new URL("/assistant-dashboard", request.url),
      );

    // Si role === "user", on retourne response (PAS de redirect)
    // Cela permet à la page serveur de s'exécuter et de lancer getServerUser()
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
