// components/features/Packs.tsx
"use client";

import { useState, useEffect } from "react";
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
import { getActivePacks } from "@/lib/actions/pack.actions";
import type { Pack } from "@prisma/client";

type Currency = "EUR" | "TND" | "FCFA";

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
  const [currency, setCurrency] = useState<Currency>("EUR");
  const whatsappNumber = "+21626315088";

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const data = await getActivePacks();
        setPacks(data || []);
      } catch (error) {
        console.error("Erreur chargement packs:", error);
        setPacks([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPacks();
  }, []);

  // Helper pour extraire le bon prix selon la devise choisie
  const getPriceDisplay = (pack: Pack) => {
    switch (currency) {
      case "TND":
        return {
          current: pack.priceTND,
          original: pack.originalPriceTND,
          symbol: "DT",
        };
      case "FCFA":
        return {
          current: pack.priceCFA,
          original: pack.originalPriceCFA,
          symbol: "FCFA",
        };
      default:
        return {
          current: pack.priceEUR,
          original: pack.originalPriceEUR,
          symbol: "€",
        };
    }
  };

  if (isLoading) {
    return (
      <section className={`py-24 w-full lg:px-30 ${className}`}>
        <div className={`container mx-auto px-4 ${margin || ""}`}>
          <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-16 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 w-full lg:px-30 ${className}`}>
      <div className={`container mx-auto px-4 ${margin || ""}`}>
        {/* Header & Currency Switcher */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
              titleColor || "text-foreground"
            }`}
          >
            Nos packs & offres
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-8" />

          <div className="inline-flex p-1 bg-muted rounded-full mb-8 border border-border">
            {(
              [
                { label: "ZONE EURO", value: "EUR" as Currency },
                { label: "ZONE TND", value: "TND" as Currency },
                { label: "ZONE FCFA", value: "FCFA" as Currency },
              ] as const
            ).map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setCurrency(value)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  currency === value
                    ? "bg-soporis-navy text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value === "EUR" ? "€" : label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto">
          {packs.map((pack) => {
            const priceData = getPriceDisplay(pack);

            return (
              <StaggerItem key={pack.id}>
                <div
                  className={`relative p-8 transition-all rounded-2xl h-full flex flex-col ${
                    pack.isPopular
                      ? "bg-primary text-primary-foreground shadow-xl md:scale-105"
                      : "bg-card border border-border"
                  }`}
                >
                  {pack.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-soporis-gold text-primary text-sm font-semibold">
                        <Star className="h-3.5 w-3.5" /> Populaire
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`font-display text-2xl font-bold mb-4 ${
                        pack.isPopular
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    >
                      {pack.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-1 mb-2">
                      {priceData.original && (
                        <span
                          className={`text-sm line-through mr-2 opacity-60`}
                        >
                          {priceData.original.toLocaleString()}{" "}
                          {priceData.symbol}
                        </span>
                      )}
                      <span className="font-display text-4xl font-bold text-soporis-gold">
                        {priceData.current?.toLocaleString() || "Sur devis"}
                      </span>
                      {priceData.current && (
                        <span className="text-lg opacity-80">
                          {priceData.symbol}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm opacity-80 line-clamp-2`}>
                      {pack.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 grow">
                    {pack.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 mt-0.5 text-soporis-gold" />
                        <span className="text-sm opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="space-y-3 mt-auto">
                    <Link href={"/contact" as Route} className="block">
                      <Button
                        variant={pack.isPopular ? "gold" : "default"}
                        size="lg"
                        className="w-full rounded-full"
                      >
                        Demander un devis{" "}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Bonjour, je suis intéressé par le pack ${pack.name} (${priceData.current} ${priceData.symbol}).`
                      )}`}
                      target="_blank"
                      className="block"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className={`w-full rounded-full ${
                          pack.isPopular
                            ? "border-soporis-gold text-soporis-gold"
                            : ""
                        }`}
                      >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
