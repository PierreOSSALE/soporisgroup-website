import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";
import { FaWhatsapp } from "react-icons/fa";

type PacksProps = {
  className?: string;
  titleColor?: string;
  margin?: string;
};

const packs = [
  {
    name: "Starter",
    price: "499",
    priceNote: "à partir de",
    description: "Idéal pour les petites entreprises et les indépendants",
    features: [
      "Design UI/UX personnalisé",
      "Site vitrine responsive (5 pages)",
      "Formulaire de contact",
      "Optimisation SEO de base",
      "Hébergement 1 an inclus",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: "999",
    priceNote: "à partir de",
    description: "Pour les entreprises en croissance qui veulent se démarquer",
    features: [
      "Tout le pack Starter",
      "Jusqu'à 10 pages",
      "Animations et interactions avancées",
      "Intégration CMS (blog)",
      "Optimisation SEO avancée",
      "Analytics et reporting",
      "Support prioritaire 6 mois",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "1999",
    priceNote: "à partir de",
    description: "Solution complète pour les projets ambitieux",
    features: [
      "Tout le pack Pro",
      "Pages illimitées",
      "Application web sur mesure",
      "Intégrations API personnalisées",
      "E-commerce / Fonctionnalités avancées",
      "Formation équipe incluse",
      "Maintenance 12 mois",
      "Support dédié 24/7",
    ],
    featured: false,
  },
];

export function Packs({
  className = "",
  titleColor = "",
  margin = "",
}: PacksProps) {
  const whatsappNumber = "+21626315088";

  return (
    <section className={`py-24 w-full lg:px-30 ${className}`}>
      <div className={`container mx-auto px-4 ${margin || ""}`}>
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16 ">
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
              titleColor || "text-foreground"
            }`}
          >
            {" "}
            Nos packs & offres
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Des formules adaptées à chaque besoin et budget. Choisissez le pack
            qui correspond à vos ambitions.
          </p>
        </AnimatedSection>

        {/* Packs Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto overflow-x-hidden">
          {packs.map((pack) => (
            <StaggerItem key={pack.name}>
              <div
                className={`relative p-8 transition-all  rounded-2xl duration-300 h-full flex flex-col ${
                  pack.featured
                    ? "bg-primary text-primary-foreground shadow-card md:scale-105"
                    : "bg-card border border-border hover:shadow-card"
                }`}
              >
                {/* Featured Badge */}
                {pack.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-soporis-gold text-primary text-sm font-semibold">
                      <Star className="h-3.5 w-3.5" />
                      Populaire
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3
                    className={`font-display text-2xl font-bold mb-2 ${
                      pack.featured ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    {pack.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <span
                      className={`text-xs ${
                        pack.featured
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pack.priceNote}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-display text-4xl font-bold ${
                          pack.featured
                            ? "text-soporis-gold"
                            : "text-soporis-gold"
                        }`}
                      >
                        {pack.price}
                      </span>
                      <span
                        className={`text-lg ${
                          pack.featured
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        €
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm ${
                      pack.featured
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {pack.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 grow">
                  {pack.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          pack.featured
                            ? "text-soporis-gold"
                            : "text-soporis-gold"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          pack.featured
                            ? "text-primary-foreground/90"
                            : "text-foreground"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-3 mt-auto">
                  <Link href={"/contact" as Route} className="block">
                    <Button
                      variant={pack.featured ? "gold" : "default"}
                      size="lg"
                      className="w-full  rounded-full cursor-pointer"
                    >
                      Demander un devis
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Bonjour, je suis intéressé par le pack ${pack.name} à ${pack.price}€. Pouvez-vous me donner plus d'informations ?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-soporis-navy"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className={`w-full rounded-full cursor-pointerte text-primary bg-soporis-gold${
                        pack.featured ? "hover:text-soporis-gold" : ""
                      }`}
                    >
                      <FaWhatsapp />
                      Discuter sur WhatsApp
                    </Button>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Note */}
        <AnimatedSection delay={0.4} className="text-center mt-12">
          <p className="text-muted-foreground">
            Besoin d'une solution personnalisée ?{" "}
            <Link
              href={"/contact" as Route}
              className="text-soporis-gold hover:underline font-medium"
            >
              Contactez-nous
            </Link>{" "}
            pour un devis sur mesure.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
