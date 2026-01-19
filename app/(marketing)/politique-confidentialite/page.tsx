import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Lock } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Soporis Group",
  description:
    "Consultez notre politique de protection des données personnelles en conformité avec le RGPD.",
  robots: "noindex, follow",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      {/* Breadcrumb */}
      {/* <div className="pt-38 pb-4 bg-soporis-white">
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
              Politique de Confidentialité
            </span>
          </nav>
        </div>
      </div> */}

      {/* Header */}
      <div className="pt-38 pb-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 mb-4 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Politique de Confidentialité
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Engagement de Soporis Group pour la protection de vos données
            personnelles (RGPD).
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="pb-24 pt-4 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border shadow-sm space-y-12">
              {/* 1. Collecte */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  1. Collecte des données
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Nous collectons uniquement les informations nécessaires pour
                  vous accompagner dans vos projets digitaux :
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "Identité (Nom, Prénom)",
                    "Coordonnées (Email, Téléphone)",
                    "Informations projet (Sujet, Message)",
                    "Données techniques (IP, Cookies)",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-soporis-gold" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Finalités & Base Légale */}
              <section className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-display text-xl font-bold text-soporis-navy mb-4">
                    2. Finalités
                  </h2>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Réponse aux devis</li>
                    <li>Gestion des RDV</li>
                    <li>Suivi de projet technique</li>
                    <li>Analyses d&apos;audience</li>
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-soporis-navy mb-4">
                    3. Base légale
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Le traitement repose sur votre <strong>consentement</strong>{" "}
                    (formulaire de contact) et sur{" "}
                    <strong>l&apos;exécution d&apos;un contrat</strong>{" "}
                    (prestations de service).
                  </p>
                </div>
              </section>

              {/* Nouveau : 4. Transfert Hors UE */}
              <section className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                <h2 className="font-display text-xl font-bold text-primary mb-3">
                  4. Transfert de données hors UE
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nos équipes de production étant basées à{" "}
                  <strong>Tunis (Tunisie)</strong>, vos données peuvent être
                  consultées par nos experts locaux pour la réalisation de vos
                  projets. La Tunisie dispose d&apos;une loi de protection des
                  données (Loi n°2004-63) et nous appliquons les clauses
                  contractuelles types de l&apos;UE pour garantir un niveau de
                  sécurité maximal.
                </p>
              </section>

              {/* 5. Vos Droits */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-5">
                  5. Vos droits (RGPD)
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Vous disposez d&apos;un droit d&apos;accès, de
                    rectification, de suppression et d&apos;opposition. Pour
                    toute demande :
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="mailto:contact@soporisgroup.com"
                      className="inline-flex items-center px-4 py-2 bg-card border border-soporis-gold text-soporis-navy rounded-lg hover:bg-soporis-gold hover:text-white transition-all text-sm font-semibold"
                    >
                      contact@soporisgroup.com
                    </Link>
                  </div>
                </div>
              </section>

              {/* 6. Sécurité */}
              <section>
                <h2 className="font-display text-2xl font-bold text-soporis-navy mb-4">
                  6. Sécurité
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Toutes les données échangées sur{" "}
                  <strong>soporisgroup.com</strong> sont sécurisées par le
                  protocole SSL (HTTPS). Nos bases de données sont hébergées sur
                  des serveurs sécurisés avec des sauvegardes régulières.
                </p>
              </section>

              <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground italic">
                <span>Dernière mise à jour : Janvier 2026</span>
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  className="hover:text-soporis-gold underline"
                >
                  Contrôlé par la CNIL
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
