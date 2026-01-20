// components/auth/SessionManager.tsx
"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const SESSION_CHECK_INTERVAL = 60000; // 1 minute

export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (
        session &&
        (pathname.startsWith("/admin") || pathname.startsWith("/assistant"))
      ) {
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeLeft = expiresAt.getTime() - now.getTime();

        // Avertir 5 minutes avant expiration
        if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
          toast({
            title: "Session sur le point d'expirer",
            description:
              "Votre session expire dans 5 minutes. Veuillez sauvegarder votre travail.",
            variant: "destructive",
            duration: 10000,
          });
        }

        // Si expirée, déconnecter et rediriger
        if (timeLeft <= 0) {
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive",
          });

          await supabase.auth.signOut();
          router.push(
            `/signin?expired=true&next=${encodeURIComponent(pathname)}`
          );
        }
      }
    };

    // Vérifier immédiatement
    checkSession();

    // Puis vérifier périodiquement
    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [supabase, toast, router, pathname]);

  return null;
}
