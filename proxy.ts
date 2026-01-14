// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;
  const isProd = process.env.NODE_ENV === "production";

  // --- LOGS DE DEBUG ---
  console.log("------------------------------------------");
  console.log(`[PROXY] 🌍 Env: ${isProd ? "PROD" : "DEV"}`);
  console.log(`[PROXY] 📍 Host: ${hostname} | Path: ${pathname}`);

  const role = user?.user_metadata?.role || "AUCUN";
  if (user) {
    console.log(`[PROXY] 👤 User: ${user.email} | 🔑 Role: ${role}`);
  }

  // --- DÉTECTION DES ZONES ---
  // On considère "ADMIN" si on est sur le sous-domaine OU sur le path /admin
  const isAdminZone =
    hostname.startsWith("admin.") || pathname.startsWith("/admin");
  const isAssistantZone =
    hostname.startsWith("assistance.") || pathname.startsWith("/assistant");

  // 1. Protection ADMIN
  if (isAdminZone) {
    if (!user) {
      console.log("[PROXY] 🚩 Bloqué: Non connecté -> Signin");
      return redirectToSignin(request, pathname);
    }

    if (role !== "admin") {
      console.log(`[PROXY] ❌ Refusé: Rôle "${role}" insuffisant pour ADMIN`);
      // En prod, on renvoie vers le domaine principal, en dev vers /
      const redirectBase = isProd ? "https://soporisgroup.com" : request.url;
      return NextResponse.redirect(new URL("/", redirectBase));
    }
    console.log("[PROXY] ✅ Accès ADMIN autorisé");
  }

  // 2. Protection ASSISTANT
  if (isAssistantZone) {
    if (!user) return redirectToSignin(request, pathname);

    if (role !== "assistant" && role !== "admin") {
      console.log(
        `[PROXY] ❌ Refusé: Rôle "${role}" insuffisant pour ASSISTANT`
      );
      const redirectBase = isProd ? "https://soporisgroup.com" : request.url;
      return NextResponse.redirect(new URL("/", redirectBase));
    }
    console.log("[PROXY] ✅ Accès ASSISTANT autorisé");
  }

  // 3. Redirection si déjà connecté vers la bonne zone
  if (pathname === "/signin" && user) {
    console.log("[PROXY] 🔄 Déjà connecté, redirection selon rôle");
    if (role === "admin")
      return NextResponse.redirect(
        new URL(
          isProd ? "https://admin.soporisgroup.com" : "/admin",
          request.url
        )
      );
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

function redirectToSignin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/signin", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
