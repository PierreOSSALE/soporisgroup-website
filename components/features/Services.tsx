// components/features/Services.tsx
"use client";

import { useState } from "react";
import { ArrowRight, Check, LucideIcon, Palette } from "lucide-react";
import * as Icons from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";
import type { Service } from "@prisma/client";

type ServicesProps = {
  initialServices: Service[]; // Nouvelle prop pour le contenu serveur
  className?: string;
  titleColor?: string;
  margin?: string;
};

export function Services({
  initialServices,
  className = "",
  titleColor = "",
  margin = "",
}: ServicesProps) {
  // Plus besoin de useEffect pour le chargement initial !
  const [services] = useState<Service[]>(initialServices);

  const getIconComponent = (iconName: string): LucideIcon => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Palette;
  };

  return (
    <section className={`py-24 w-full xl:px-30 ${className}`}>
      <div className={`container mx-auto px-4 ${margin || ""}`}>
        <header className="text-center max-w-2xl mx-auto mb-16">
          <AnimatedSection>
            <h1
              className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
                titleColor || "text-foreground"
              }`}
            >
              Nos services digitaux
            </h1>
            <div
              className="w-16 h-1 bg-soporis-gold mx-auto mb-6"
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-lg">
              Des solutions digitales sur mesure pour créer des expériences web
              exceptionnelles et booster votre présence en ligne.
            </p>
          </AnimatedSection>
        </header>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            const color = service.color || "#3B82F6";

            return (
              <StaggerItem key={service.id}>
                {/* Chaque service est un <article> pour le SEO */}
                <article className="group relative bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300"
                    style={{ backgroundColor: `${color}10` }}
                    aria-hidden="true"
                  >
                    <IconComponent className="h-8 w-8" style={{ color }} />
                  </div>

                  <h2 className="font-display text-xl font-semibold text-primary mb-3">
                    {service.title}
                  </h2>

                  <p className="text-muted-foreground mb-6 grow">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul
                      className="space-y-3 mb-8 list-none p-0"
                      aria-label={`Avantages ${service.title}`}
                    >
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check
                            className="h-5 w-5 shrink-0 mt-0.5"
                            style={{ color }}
                            aria-hidden="true"
                          />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={"/contact" as Route}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-soporis-gold transition-colors group/link mt-auto"
                    title={`Obtenir un devis pour ${service.title}`}
                  >
                    Demandez un devis gratuit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
