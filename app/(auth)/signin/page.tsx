// app/(auth)/signin/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server-auth";
import SignInForm from "./signinForm";

export default async function SignInPage() {
  const user = await getServerUser();

  if (user) {
    // 1. Redirection pour les rôles validés
    if (user.role === "admin") redirect("/dashboard");
    if (user.role === "assistant") redirect("/assistant-dashboard");

    // 2. Si l'utilisateur est un simple "user", on ne fait AUCUNE redirection.
    // On laisse le composant SignInForm s'afficher.
    // Le formulaire détectera qu'un utilisateur est connecté et affichera le message d'attente.
  }

  return <SignInForm user={user} />;
}
