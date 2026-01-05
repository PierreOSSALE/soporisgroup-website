import { Star, Quote } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Fondatrice, Startup Tech",
    content:
      "Soporis Group a transformé notre vision en une plateforme web exceptionnelle. Leur expertise en UI/UX a vraiment fait la différence.",
    rating: 5,
  },
  {
    name: "Thomas Martin",
    role: "Directeur Marketing",
    content:
      "Un travail remarquable sur notre site e-commerce. Les conversions ont augmenté de 40% depuis la refonte. Je recommande vivement !",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    role: "CEO, Agence Immobilière",
    content:
      "Professionnalisme et créativité au rendez-vous. Notre nouveau site reflète parfaitement notre image de marque premium.",
    rating: 5,
  },
  {
    name: "Antoine Bercot",
    role: "Entrepreneur",
    content:
      "Excellent accompagnement du début à la fin. L'équipe a su comprendre nos besoins et proposer des solutions innovantes.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background w-full lg:px-30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Ils nous font confiance
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Découvrez ce que nos clients disent de leur expérience avec Soporis
            Group.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 h-full">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-soporis-gold text-soporis-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-soporis-gold/20" />
                  <p className="text-foreground pl-6">{testimonial.content}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-lg font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
