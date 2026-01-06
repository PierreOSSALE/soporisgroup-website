import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
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
            <span className="text-primary font-medium">
              Politique de Confidentialité
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="pt-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Politique de Confidentialité
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD)
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="pb-16 pt-4 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border space-y-12">
              {/* 1. Collecte */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  1. Collecte des données personnelles
                </h2>
                <p className="text-muted-foreground mb-4">
                  Dans le cadre de notre activité, nous sommes amenés à
                  collecter les données personnelles suivantes :
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Nom de l&apos;entreprise (optionnel)</li>
                  <li>Données de navigation (cookies)</li>
                </ul>
              </section>

              {/* 2. Finalités */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  2. Finalités du traitement
                </h2>
                <p className="text-muted-foreground mb-4">
                  Les données personnelles collectées sont utilisées pour :
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Gérer les rendez-vous et la relation client</li>
                  <li>
                    Améliorer nos services et l&apos;expérience utilisateur
                  </li>
                  <li>
                    Envoyer des communications commerciales (avec votre
                    consentement)
                  </li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              {/* 3. Base légale */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  3. Base légale du traitement
                </h2>
                <p className="text-muted-foreground mb-4">
                  Le traitement de vos données personnelles est fondé sur :
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4">
                  <li>Votre consentement explicite</li>
                  <li>L&apos;exécution d&apos;un contrat</li>
                  <li>Notre intérêt légitime à développer notre activité</li>
                  <li>Le respect de nos obligations légales</li>
                </ul>
              </section>

              {/* 4. Durée de conservation */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  4. Durée de conservation
                </h2>
                <p className="text-muted-foreground mb-4">
                  Vos données personnelles sont conservées pendant :
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4">
                  <li>Données de contact : 3 ans après le dernier contact</li>
                  <li>
                    Données clients : durée de la relation commerciale + 5 ans
                  </li>
                  <li>Cookies : maximum 13 mois</li>
                </ul>
              </section>

              {/* 5. Vos droits */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  5. Vos droits
                </h2>
                <p className="text-muted-foreground mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4 mb-4">
                  <li>
                    <strong>Droit d&apos;accès :</strong> obtenir la
                    confirmation que vos données sont traitées
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> corriger vos
                    données inexactes
                  </li>
                  <li>
                    <strong>Droit à l&apos;effacement :</strong> demander la
                    suppression de vos données
                  </li>
                  <li>
                    <strong>Droit à la limitation :</strong> limiter le
                    traitement de vos données
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> recevoir vos
                    données dans un format structuré
                  </li>
                  <li>
                    <strong>Droit d&apos;opposition :</strong> vous opposer au
                    traitement de vos données
                  </li>
                </ul>
                <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg">
                  Pour exercer ces droits, contactez-nous à :{" "}
                  <Link
                    href="mailto:contact@soporisgroup.com"
                    className="font-semibold text-primary hover:text-soporis-gold underline"
                  >
                    contact@soporisgroup.com
                  </Link>
                </p>
              </section>

              {/* 6. Cookies */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  6. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Notre site utilise des cookies pour améliorer votre expérience
                  de navigation.
                </p>
              </section>

              {/* 7. Sécurité */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  7. Sécurité des données
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nous mettons en œuvre des mesures techniques appropriées pour
                  protéger vos données contre tout accès non autorisé. Notre
                  site utilise le protocole HTTPS pour sécuriser les échanges.
                </p>
              </section>

              {/* 8. Réclamation */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  8. Contact et réclamation
                </h2>
                <p className="text-muted-foreground">
                  Vous avez également le droit d&apos;introduire une réclamation
                  auprès de la CNIL :
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-soporis-gold hover:underline font-medium ml-1"
                  >
                    www.cnil.fr
                  </a>
                </p>
              </section>

              <p className="text-sm text-muted-foreground pt-6 border-t border-border">
                Dernière mise à jour : Janvier 2026
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
