import { Palette, Code2, Gauge, ArrowRight, Check } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import Link from "next/link";
import { Route } from "next";

type ServicesProps = {
  className?: string;
};

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Créez des interfaces modernes et intuitives qui engagent vos utilisateurs et renforcent votre image de marque.",
    features: [
      "Interfaces modernes et élégantes",
      "Parcours utilisateurs optimisés",
      "Design centré utilisateur",
    ],
    color: "bg-soporis-gold/10",
    iconColor: "text-soporis-gold",
  },
  {
    icon: Code2,
    title: "Développement Web",
    description:
      "Développement de sites et applications web performants, adaptés à vos besoins avec les technologies modernes.",
    features: [
      "Sites vitrines professionnels",
      "Applications web sur mesure",
      "Landing pages performantes",
    ],
    color: "bg-soporis-blue-accent/10",
    iconColor: "text-soporis-blue-accent",
  },
  {
    icon: Gauge,
    title: "Performance & Conversion",
    description:
      "Optimisez vos performances web pour améliorer votre référencement et maximiser vos conversions.",
    features: [
      "Responsive design parfait",
      "Optimisation UX avancée",
      "Performance et SEO",
    ],
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export function Services({ className = "" }: ServicesProps) {
  return (
    <section className={`py-24  w-full lg:px-30 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
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
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <div className="group relative bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 h-full">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`h-5 w-5 ${service.iconColor} shrink-0 mt-0.5`}
                      />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

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
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
