// components/features/Services.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Code2,
  Gauge,
  ArrowRight,
  Check,
  LucideIcon,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";
import { getActiveServices } from "@/lib/actions/service.actions";
import type { Service } from "@prisma/client";
import * as Icons from "lucide-react";

type ServicesProps = {
  className?: string;
  titleColor?: string;
  margin?: string;
};

export function Services({
  className = "",
  titleColor = "",
  margin = "",
}: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getActiveServices();
        setServices(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Fonction pour obtenir une icône Lucide dynamiquement
  const getIconComponent = (iconName: string): LucideIcon => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Palette; // Fallback à Palette si l'icône n'existe pas
  };

  if (isLoading) {
    return (
      <section className={`py-24 w-full lg:px-30 ${className}`}>
        <div className={`container mx-auto px-4 ${margin || ""}`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="w-16 h-1 bg-gray-200 mx-auto mb-6" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border animate-pulse"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-200 mb-6" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="space-y-3 mb-6">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className={`py-24 w-full lg:px-30 ${className}`}>
        <div className={`container mx-auto px-4 ${margin || ""}`}>
          <div className="text-center max-w-2xl mx-auto">
            <h2
              className={`font-display text-3xl sm:text-4xl font-bold mb-4 ${
                titleColor || "text-foreground"
              }`}
            >
              Nos services
            </h2>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground">
              Aucun service disponible pour le moment.
            </p>
          </div>
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
            Nos services
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Des solutions digitales sur mesure pour créer des expériences web
            exceptionnelles.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            const color = service.color || "#3B82F6";

            return (
              <StaggerItem key={service.id}>
                <div className="group relative bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 h-full">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <IconComponent className={`h-8 w-8`} style={{ color }} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  {service.features.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check
                            className="h-5 w-5 shrink-0 mt-0.5"
                            style={{ color }}
                          />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Link */}
                  <Link
                    href={"/contact" as Route}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-soporis-gold transition-colors group/link"
                  >
                    Demandez un devis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
