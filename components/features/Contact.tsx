"use client";

import { Mail, Calendar, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";

type ContactProps = {
  className?: string;
};

// 1. Mise à jour de la configuration des méthodes
const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Envoyez-nous un message",
    action: "contact@soporisgroup.com",
    href: "mailto: contact@soporisgroup.com ",
    type: "email", // Identifiant unique pour le comportement
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    description: "Discutons en direct",
    action: "Démarrer la conversation",
    href: "https://wa.me/+21626315088", // Numéro corrigé selon ton bouton précédent
    type: "external",
  },
  {
    icon: Calendar,
    title: "Rendez-vous",
    description: "Planifiez un appel",
    action: "Réserver un créneau",
    href: "/rendez-vous",
    type: "internal",
  },
];

const steps = [
  {
    icon: FaWhatsapp,
    title: "Échangez vos informations",
    description: "Partagez-nous vos besoins et objectifs.",
  },
  {
    icon: Mail,
    title: "Recevez une proposition",
    description: "Nous analysons votre projet et vous envoyons un devis.",
  },
  {
    icon: Calendar,
    title: "Validation",
    description: "Validez le projet et nous commençons.",
  },
  {
    icon: ArrowRight,
    title: "Livraison",
    description: "Recevez votre projet finalisé.",
  },
];

export function Contact({ className = "" }: ContactProps) {
  return (
    <section className={`py-24 w-full xl:px-30 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 ">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-16 items-start">
          {/* Left Side - Contact Info */}
          <AnimatedSection direction="left" className="w-full">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Contactez-nous
            </h2>
            <div className="w-16 h-1 bg-soporis-gold mb-6" />
            <p className="text-muted-foreground text-lg mb-10 max-w-prose">
              Vous avez un projet en tête ? Discutons-en ! Nous sommes là pour
              transformer vos idées en réalité digitale.
            </p>

            {/* Contact Methods */}
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {contactMethods.map((method) => {
                // LOGIQUE DE LIEN :
                const isExternal = method.type === "external";
                const target = isExternal ? "_blank" : undefined;
                const rel = isExternal ? "noopener noreferrer" : undefined;

                return (
                  <StaggerItem key={method.title}>
                    <Link
                      href={method.href as any}
                      target={target}
                      rel={rel}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 shrink-0 transition-colors">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary truncate">
                          {method.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {method.description}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-soporis-gold group-hover:underline break-all sm:break-normal">
                        {method.action}
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </AnimatedSection>

          {/* Right Side - Process Steps */}
          <AnimatedSection direction="right" delay={0.2} className="w-full">
            <div className="bg-muted/30 rounded-2xl p-6 sm:p-8 lg:p-10 border border-border">
              <h3 className="font-display text-2xl font-bold text-primary mb-8">
                Notre processus
              </h3>
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10 relative">
                        <step.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-[calc(100%+1rem)] bg-border" />
                      )}
                    </div>
                    <div className="pt-1 flex-1">
                      <h4 className="font-semibold text-primary mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
