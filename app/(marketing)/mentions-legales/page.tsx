import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
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
      <div className="pt-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Mentions Légales
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
        </div>
      </div>

      {/* Content */}
      <section className="pb-16 pt-4 bg-background">
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
                    <strong>Forme juridique :</strong> Entreprise Individuelle
                  </li>
                  <li>
                    <strong>Capital social :</strong> Non applicable (Entreprise
                    Individuelle)
                  </li>
                  {/* <li>
                    <strong>Siège social :</strong> Adresse à compléter
                  </li>
                  <li>
                    <strong>SIRET :</strong> À compléter
                  </li> */}
                  <li>
                    <strong>RCS :</strong> Non applicable pour cette forme
                    juridique
                  </li>
                  {/* <li>
                    <strong>N° TVA Intracommunautaire :</strong> FRXXXXXXXXXX (À
                    compléter)
                  </li> */}
                  <li>
                    <strong>Directeur de publication :</strong> Simon Ossale
                  </li>
                  <li>
                    <strong>Contact :</strong> contact@soporisgroup.com
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
                    <strong>Hébergeur :</strong> LWS (Ligne Web Services)
                  </li>
                  <li>
                    <strong>Adresse :</strong> Adresse de LWS - France
                  </li>
                  <li>
                    <strong>Site web :</strong>{" "}
                    <a
                      href="https://www.lws.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-soporis-gold underline underline-offset-4"
                    >
                      lws.fr
                    </a>
                  </li>
                  <li>
                    <strong>Registrar :</strong> LWS (acrédité par l'AFNIC,
                    ICANN, Verisign, etc.)
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

              {/* 4. Protection des données personnelles */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  4. Protection des données personnelles
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Conformément au Règlement Général sur la Protection des
                  Données (RGPD) et à la loi Informatique et Libertés, vous
                  disposez d&apos;un droit d&apos;accès, de rectification, de
                  suppression et d&apos;opposition aux données vous concernant.
                  Pour exercer ces droits, veuillez nous contacter à
                  l&apos;adresse email suivante :
                  <Link
                    href="mailto:contact@soporisgroup.com"
                    className="ml-1 hover:text-soporis-gold transition-colors"
                  >
                    contact@soporisgroup.com
                  </Link>
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Les données collectées via notre site sont exclusivement
                  destinées à Soporis Group et ne seront en aucun cas vendues ou
                  cédées à des tiers sans votre consentement explicite.
                </p>
              </section>

              {/* 5. Cookies */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  5. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Notre site utilise des cookies pour améliorer
                  l&apos;expérience utilisateur. Les cookies sont de petits
                  fichiers texte stockés sur votre appareil qui nous aident à
                  analyser l&apos;utilisation du site et à personnaliser le
                  contenu.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Vous pouvez contrôler et/ou supprimer les cookies comme vous
                  le souhaitez. Pour plus d&apos;informations, consultez notre{" "}
                  <Link
                    href={"/politique-cookies" as Route}
                    className="hover:text-soporis-gold underline underline-offset-4"
                  >
                    Politique de Cookies
                  </Link>
                  .
                </p>
              </section>

              {/* 6. Limitation de responsabilité */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  6. Limitation de responsabilité
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Soporis Group s&apos;efforce de fournir sur son site des
                  informations aussi précises que possible. Toutefois, il ne
                  pourra être tenu responsable des omissions, des inexactitudes
                  et des carences dans la mise à jour, qu&apos;elles soient de
                  son fait ou du fait des tiers partenaires qui lui fournissent
                  ces informations.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  L&apos;utilisateur du site reconnaît utiliser les informations
                  sous sa responsabilité exclusive.
                </p>
              </section>

              {/* 7. Liens hypertextes */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  7. Liens hypertextes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Le site peut contenir des liens hypertextes vers d&apos;autres
                  sites. Soporis Group ne dispose d&apos;aucun moyen pour
                  contrôler le contenu de ces sites tiers et n&apos;assume
                  aucune responsabilité quant à leur contenu.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  La création de liens vers notre site est autorisée sans
                  autorisation préalable, sous réserve de ne pas utiliser de
                  technique de &quot;framing&quot; ou de &quot;deep
                  linking&quot; qui pourrait créer une confusion sur la
                  provenance du contenu.
                </p>
              </section>

              {/* 8. Droit applicable */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  8. Droit applicable
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Les présentes mentions légales sont régies par le droit
                  français. En cas de litige, et à défaut d&apos;accord amiable,
                  les tribunaux français seront seuls compétents.
                </p>
              </section>

              {/* 9. Contact */}
              <section>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  9. Contact
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
                  <li>
                    <strong>Téléphone :</strong>{" "}
                    <Link
                      href="tel:+21626315088"
                      className="hover:text-soporis-gold transition-colors"
                    >
                      +216 26 315 088
                    </Link>
                  </li>
                </ul>
              </section>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : Janvier 2026
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <em>
                    Note : Ces mentions légales sont fournies à titre indicatif.
                    Pour une conformité juridique complète, il est recommandé de
                    consulter un professionnel du droit.
                  </em>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
