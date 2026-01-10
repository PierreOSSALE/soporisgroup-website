// hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Vérifier la session actuelle
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Récupérer le rôle si l'utilisateur est connecté
      if (session?.user?.email) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .single();

        setUserRole(userData?.role || "user");
      }

      setLoading(false);
    };

    checkSession();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .single();

        setUserRole(userData?.role || "user");
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading: loading,
    isAdmin: userRole === "admin",
    isAssistant: userRole === "assistant",
    isUser: userRole === "user",
    signOut,
  };
}
