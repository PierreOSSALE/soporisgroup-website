import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// Note: Ce composant est par défaut un Server Component dans Next.js.
// Pour le logging côté serveur, Next.js s'en occupe nativement.
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 bg-background">
      <div className="text-center px-4">
        {/* Titre 404 */}
        <h1 className="font-display text-7xl sm:text-9xl font-bold text-primary mb-4 animate-in fade-in zoom-in duration-500">
          404
        </h1>

        {/* Message d'erreur */}
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary mb-4">
          Page introuvable
        </h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée vers une
          nouvelle adresse.
        </p>

        {/* Action : Retour à l'accueil */}
        {/* Note : On utilise Link de 'next/link' et la prop 'asChild' sur le bouton Shadcn */}
        <Button asChild variant="default" size="lg" className="group">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
