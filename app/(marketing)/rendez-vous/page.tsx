"use client"; // Indispensable pour useEffect et Script

import {
  Home,
  ChevronRight,
  Calendar,
  Clock,
  Video,
  Phone,
  Users,
} from "lucide-react";
import Link from "next/link"; // Changement ici
import Script from "next/script"; // Ajout pour l'optimisation
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { useEffect } from "react";

const meetingTypes = [
  {
    icon: Video,
    title: "Appel vidéo",
    description: "Rencontre en visioconférence via Google Meet ou Zoom",
    duration: "30 min",
  },
  {
    icon: Phone,
    title: "Appel téléphonique",
    description: "Discussion rapide pour clarifier vos besoins",
    duration: "15 min",
  },
  {
    icon: Users,
    title: "Consultation approfondie",
    description: "Session détaillée pour les projets complexes",
    duration: "60 min",
  },
];

// Replace with your actual Calendly URL
const CALENDLY_URL = "https://calendly.com/soporisgroup/30min";

const RendezVousPage = () => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 pb-8 bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">Rendez-vous</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Prendre rendez-vous
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Réservez un créneau pour discuter de votre projet avec notre
              équipe d'experts.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Meeting Types */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold text-primary">
              Choisissez le type de rendez-vous
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {meetingTypes.map((type) => (
              <StaggerItem key={type.title}>
                <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 text-center cursor-pointer group h-full">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-primary mb-2">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-soporis-gold">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.duration}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Calendly Embed */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-4 border border-border overflow-hidden">
              <div
                className="calendly-inline-widget"
                data-url={CALENDLY_URL}
                style={{ minWidth: "320px", height: "700px" }}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <Calendar className="h-12 w-12 text-soporis-gold mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-primary mb-4">
              Pas disponible sur ces créneaux ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Envoyez-nous un email avec vos disponibilités et nous trouverons
              un moment qui vous convient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@soporisgroup.com">
                <Button variant="default" size="lg">
                  Envoyer un email
                </Button>
              </a>
              <a
                href="https://wa.me/33600000000?text=Bonjour, je souhaite prendre rendez-vous avec Soporis Group."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  💬 WhatsApp
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default RendezVousPage;
