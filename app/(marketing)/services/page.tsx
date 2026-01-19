// app/(marketing)/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Services } from "@/components/features/Services";
import { getActiveServices } from "@/lib/actions/service.actions";

export const metadata: Metadata = {
  title: "Nos Services Web & Design | Soporis Group",
  description:
    "UI/UX Design, Développement Web, SEO et Refonte de site. Découvrez nos solutions sur mesure pour votre transformation digitale.",
  alternates: { canonical: "https://votre-domaine.com/services" },
};

export default async function ServicesPage() {
  // Récupération des données côté serveur pour le SEO
  const initialServices = await getActiveServices();

  // Génération du JSON-LD pour "Service"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Solutions Digitales",
    provider: {
      "@type": "Organization",
      name: "Soporis Group",
      url: "https://votre-domaine.com",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services de transformation digitale",
      itemListElement: initialServices.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* <nav aria-label="Fil d'ariane" className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground list-none p-0">
            <li className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" /> Accueil
              </Link>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="text-soporis-navy font-medium" aria-current="page">
              Nos services
            </li>
          </ol>
        </div>
      </nav> */}

      {/* On passe les services récupérés en prop */}
      <Services
        initialServices={initialServices}
        className="bg-background"
        margin="-mt-18 pt-38"
      />
    </>
  );
}
