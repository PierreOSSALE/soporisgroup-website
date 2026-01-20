// lib/supabase/server.ts
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Retourne un client Supabase côté serveur (App Router / API routes).
 * Utilise le store de cookies Next pour lire/écrire les cookies gérés par auth-helpers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // adapter pour next/headers CookieStore
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              /* ignore in environments where set fails */
            }
          });
        },
      },
    }
  );
}

/**
 * Admin client (service role) pour taches backend nécessitant privilèges.
 * Ne pas exposer au client.
 */
export function createAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
