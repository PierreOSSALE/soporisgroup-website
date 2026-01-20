// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

/**
 * Wrapper kept for compatibility with the rest of the codebase.
 * createBrowserClient expects (url, key) in your installed version.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
