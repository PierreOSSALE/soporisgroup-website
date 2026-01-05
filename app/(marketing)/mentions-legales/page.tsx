import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
  title: "Mentions Légales | Soporis Group",
  description:
    "Informations légales, hébergement et conditions d'utilisation du site de Soporis Group.",
  robots: "noindex, follow", // Souvent recommandé pour les pages juridiques
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-40 pb-4 bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">Mentions Légales</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Mentions Légales
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border space-y-8">
              {/* 1. Informations légales */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  1. Informations légales
                </h2>
                <p className="text-muted-foreground">
                  Le site <strong>soporisgroup.com</strong> est édité par :
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2 list-none">
                  <li>
                    <strong>Raison sociale :</strong> Soporis Group
                  </li>
                  <li>
                    <strong>Forme juridique :</strong> [À compléter]
                  </li>
                  <li>
                    <strong>Capital social :</strong> [À compléter]
                  </li>
                  <li>
                    <strong>Siège social :</strong> [Adresse à compléter]
                  </li>
                  <li>
                    <strong>SIRET :</strong> [À compléter]
                  </li>
                  <li>
                    <strong>RCS :</strong> [À compléter]
                  </li>
                  <li>
                    <strong>N° TVA Intracommunautaire :</strong> [À compléter]
                  </li>
                  <li>
                    <strong>Directeur de publication :</strong> [Nom à
                    compléter]
                  </li>
                </ul>
              </section>

              {/* 2. Hébergement */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  2. Hébergement
                </h2>
                <p className="text-muted-foreground">
                  Le site est hébergé par :
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2 list-none">
                  <li>
                    <strong>Hébergeur :</strong> Vercel Inc.
                  </li>
                  <li>
                    <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                    91789, USA
                  </li>
                  <li>
                    <strong>Site web :</strong>{" "}
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-soporis-gold underline underline-offset-4"
                    >
                      vercel.com
                    </a>
                  </li>
                </ul>
              </section>

              {/* 3. Propriété intellectuelle */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L&apos;ensemble du contenu de ce site (textes, images,
                  graphismes, logo, icônes, sons, logiciels, etc.) est la
                  propriété exclusive de Soporis Group ou de ses partenaires et
                  est protégé par les lois françaises et internationales
                  relatives à la propriété intellectuelle.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Toute reproduction, représentation, modification, publication,
                  adaptation de tout ou partie des éléments du site, quel que
                  soit le moyen ou le procédé utilisé, est interdite, sauf
                  autorisation écrite préalable de Soporis Group.
                </p>
              </section>

              {/* 4. Limitation de responsabilité */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  4. Limitation de responsabilité
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Soporis Group s&apos;efforce de fournir sur son site des
                  informations aussi précises que possible. Toutefois, il ne
                  pourra être tenu responsable des omissions, des inexactitudes
                  et des carences dans la mise à jour, qu&apos;elles soient de
                  son fait ou du fait des tiers partenaires qui lui fournissent
                  ces informations.
                </p>
              </section>

              {/* 5. Liens hypertextes */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  5. Liens hypertextes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Le site peut contenir des liens hypertextes vers d&apos;autres
                  sites. Soporis Group ne dispose d&apos;aucun moyen pour
                  contrôler le contenu de ces sites tiers et n&apos;assume
                  aucune responsabilité quant à leur contenu.
                </p>
              </section>

              {/* 6. Contact */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  6. Contact
                </h2>
                <p className="text-muted-foreground">
                  Pour toute question relative aux présentes mentions légales,
                  vous pouvez nous contacter :
                </p>
                <ul className="text-muted-foreground mt-4 space-y-2 list-none">
                  <li>
                    <strong>Email :</strong>{" "}
                    <Link
                      href="mailto:contact@soporisgroup.com"
                      className="hover:text-soporis-gold transition-colors"
                    >
                      contact@soporisgroup.com
                    </Link>
                  </li>
                  <li>
                    <strong>Support :</strong>{" "}
                    <Link
                      href="mailto:support@soporisgroup.com"
                      className="hover:text-soporis-gold transition-colors"
                    >
                      support@soporisgroup.com
                    </Link>
                  </li>
                </ul>
              </section>

              <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                Dernière mise à jour : Janvier 2026
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
