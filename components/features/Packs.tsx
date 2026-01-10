// components/features/Packs.tsx
"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";
import { FaWhatsapp } from "react-icons/fa";
import { getActivePacks } from "@/lib/actions/pack.actions";
import type { Pack } from "@prisma/client";

type PacksProps = {
  className?: string;
  titleColor?: string;
  margin?: string;
};

export function Packs({
  className = "",
  titleColor = "",
  margin = "",
}: PacksProps) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const whatsappNumber = "+21626315088";

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const data = await getActivePacks();
        setPacks(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des packs:", error);
        setPacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPacks();
  }, []);

  if (isLoading) {
    return (
      <section className={`py-24 w-full lg:px-30 ${className}`}>
        <div className={`container mx-auto px-4 ${margin || ""}`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="w-16 h-1 bg-gray-200 mx-auto mb-6" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border animate-pulse"
              >
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-6" />
                <div className="space-y-3 mb-8">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-lg w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (packs.length === 0) {
    return (
      <section className={`py-24 w-full lg:px-30 ${className}`}>
        <div className={`container mx-auto px-4 ${margin || ""}`}>
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2
              className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
                titleColor || "text-foreground"
              }`}
            >
              Nos packs & offres
            </h2>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground">
              Aucun pack disponible pour le moment.
            </p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 w-full lg:px-30 ${className}`}>
      <div className={`container mx-auto px-4 ${margin || ""}`}>
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
              titleColor || "text-foreground"
            }`}
          >
            Nos packs & offres
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Des formules adaptées à chaque besoin et budget. Choisissez le pack
            qui correspond à vos ambitions.
          </p>
        </AnimatedSection>

        {/* Packs Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto overflow-x-hidden md:overflow-x-visible">
          {packs.map((pack) => (
            <StaggerItem key={pack.id}>
              <div
                className={`relative p-8 transition-all rounded-2xl duration-300 h-full flex flex-col ${
                  pack.isPopular
                    ? "bg-primary text-primary-foreground shadow-card md:scale-105"
                    : "bg-card border border-border hover:shadow-card"
                }`}
              >
                {/* Featured Badge */}
                {pack.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-soporis-gold text-primary text-sm font-semibold">
                      <Star className="h-3.5 w-3.5" />
                      Populaire
                    </div>
                  </div>
                )}

                {/* Promotion Badge */}
                {pack.isPromo && pack.promoLabel && (
                  <div className="absolute -top-4 left-4">
                    <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
                      {pack.promoLabel}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3
                    className={`font-display text-2xl font-bold mb-2 ${
                      pack.isPopular
                        ? "text-primary-foreground"
                        : "text-primary"
                    }`}
                  >
                    {pack.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      {pack.originalPrice && (
                        <span
                          className={`text-sm line-through mr-2 ${
                            pack.isPopular
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {pack.originalPrice.toFixed(0)}€
                        </span>
                      )}
                      <span
                        className={`font-display text-4xl font-bold ${
                          pack.isPopular
                            ? "text-soporis-gold"
                            : "text-soporis-gold"
                        }`}
                      >
                        {pack.price.toFixed(0)}
                      </span>
                      <span
                        className={`text-lg ${
                          pack.isPopular
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
                      pack.isPopular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {pack.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 grow">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          pack.isPopular
                            ? "text-soporis-gold"
                            : "text-soporis-gold"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          pack.isPopular
                            ? "text-primary-foreground/90"
                            : "text-foreground"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Promo End Date */}
                {pack.isPromo && pack.promoEndDate && (
                  <div className="mb-4 p-3 bg-soporis-gold/10 rounded-lg">
                    <p className="text-xs text-center text-soporis-gold font-medium">
                      ⏰ Offre valable jusqu'au{" "}
                      {new Date(pack.promoEndDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* CTAs */}
                <div className="space-y-3 mt-auto">
                  <Link href={"/contact" as Route} className="block">
                    <Button
                      variant={pack.isPopular ? "gold" : "default"}
                      size="lg"
                      className="w-full rounded-full cursor-pointer"
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
                      className={`w-full rounded-full cursor-pointer ${
                        pack.isPopular
                          ? "border-soporis-gold text-soporis-gold hover:bg-soporis-gold/10"
                          : "text-primary border-primary hover:bg-primary/10"
                      }`}
                    >
                      <FaWhatsapp className="mr-2" />
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
