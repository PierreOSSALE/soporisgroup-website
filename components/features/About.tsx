import { ArrowRight, Users, Target, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";

const stats = [
  { icon: Users, value: "50+", label: "Projets livrés" },
  { icon: Target, value: "100%", label: "Satisfaction client" },
  { icon: Award, value: "3+", label: "Années d'expérience" },
  { icon: Zap, value: "24h", label: "Temps de réponse" },
];

export function About() {
  return (
    <section className="py-24 bg-background w-full lg:px-30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <AnimatedSection direction="left">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Digitalisez votre activité avec Soporis Group
            </h2>
            <div className="w-16 h-1 bg-soporis-gold mb-6" />

            <p className="text-muted-foreground text-lg mb-6">
              Nous transformons vos idées en expériences digitales mémorables.
              Notre équipe d'experts en design et développement web vous
              accompagne dans la création d'interfaces modernes et performantes.
            </p>

            <p className="text-muted-foreground mb-8">
              De la conception UI/UX au développement web, nous mettons notre
              expertise au service de votre croissance. Chaque projet est une
              opportunité de créer quelque chose d'exceptionnel.
            </p>

            <Link href={"/a-propos" as Route}>
              <Button
                variant="default"
                size="lg"
                className="group cursor-pointer rounded-full"
              >
                En savoir plus
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>

          {/* Stats Grid */}
          <StaggerContainer className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-display text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
