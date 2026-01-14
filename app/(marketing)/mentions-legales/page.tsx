import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, ShieldCheck } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Route } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Soporis Group",
  description:
    "Informations légales, hébergement et conditions d'utilisation du site de Soporis Group.",
  robots: "noindex, follow",
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" /> Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">
              Mentions Légales
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="pt-8 pb-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 mb-4 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Mentions Légales
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
        </div>
      </div>

      {/* Content */}
      <section className="pb-24 pt-4 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border shadow-sm space-y-10">
              {/* 1. Informations légales */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5 flex items-center gap-2">
                  1. Informations légales
                </h2>
                <p className="text-muted-foreground mb-4">
                  Le site <strong>soporisgroup.com</strong> est édité par :
                </p>
                <div className="grid sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-xl border border-border/50 text-sm">
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong className="text-primary">Raison sociale :</strong>{" "}
                      Soporis Group
                    </p>
                    <p>
                      <strong className="text-primary">
                        Forme juridique :
                      </strong>{" "}
                      Entreprise Individuelle
                    </p>
                    <p>
                      <strong className="text-primary">Siège social :</strong>{" "}
                      Lafayette, Centre Ville, 1002 Tunis
                    </p>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong className="text-primary">Dirigeant :</strong>{" "}
                      Simon Ossale
                    </p>
                    <p>
                      <strong className="text-primary">Email :</strong>{" "}
                      contact@soporisgroup.com
                    </p>
                    <p>
                      <strong className="text-primary">Téléphone :</strong> +216
                      26 315 088
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Hébergement */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  2. Hébergement
                </h2>
                <div className="prose prose-sm text-muted-foreground max-w-none leading-relaxed">
                  <p>
                    Le site est hébergé par la société{" "}
                    <strong>LWS (Ligne Web Services)</strong>.
                  </p>
                  <ul className="mt-4 space-y-2 list-none p-0">
                    <li>
                      <strong>Adresse :</strong> 10 rue du Havre, 75009 Paris,
                      France
                    </li>
                    <li>
                      <strong>Site web :</strong>{" "}
                      <a
                        href="https://www.lws.fr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-soporis-gold hover:underline font-medium"
                      >
                        www.lws.fr
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 3. Propriété intellectuelle */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-muted-foreground leading-relaxed italic border-l-4 border-soporis-gold pl-4 py-2">
                  L&apos;ensemble du contenu de ce site (textes, images,
                  graphismes, logo, icônes, logiciels) est la propriété
                  exclusive de Soporis Group ou de ses partenaires.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Toute reproduction ou modification de tout ou partie des
                  éléments du site, sans autorisation écrite préalable, est
                  strictement interdite et peut donner lieu à des poursuites.
                </p>
              </section>

              {/* 4. Protection des données (RGPD) */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  4. Protection des données
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Conformément au RGPD, vous disposez d&apos;un droit
                  d&apos;accès, de rectification et de suppression de vos
                  données. Pour exercer ce droit, écrivez à :
                  <a
                    href="mailto:contact@soporisgroup.com"
                    className="ml-1 text-soporis-gold font-medium hover:underline"
                  >
                    contact@soporisgroup.com
                  </a>
                  .
                </p>
              </section>

              {/* 5. Cookies */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  5. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ce site utilise des cookies essentiels au bon fonctionnement
                  et à l&apos;analyse d&apos;audience (Google Analytics). Vous
                  pouvez paramétrer vos préférences dans votre navigateur ou
                  consulter notre
                  <Link
                    href={"/politique-cookies" as Route}
                    className="ml-1 text-soporis-gold hover:underline font-medium"
                  >
                    Politique de Cookies
                  </Link>
                  .
                </p>
              </section>

              {/* Footer de la carte */}
              <div className="pt-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Dernière mise à jour : <strong>Janvier 2026</strong>
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Soporis Group s&apos;efforce d&apos;assurer l&apos;exactitude
                  des informations diffusées sur ce site.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
