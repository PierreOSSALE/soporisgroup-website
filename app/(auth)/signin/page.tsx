//(auth)/signin/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server-auth"; // Nom corrigé
import SignInForm from "./signinForm";

export default async function SignInPage() {
  const user = await getServerUser();

  if (user) {
    // Redirection automatique si déjà connecté
    if (user.role === "admin") redirect("/dashboard");
    if (user.role === "assistant") redirect("/assistant-dashboard");
    redirect("/"); // Vers le marketing par défaut
  }

  return <SignInForm />;
}
