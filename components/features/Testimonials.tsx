// components/features/Testimonials.tsx
import { Star, Quote } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { getActiveTestimonials } from "@/lib/actions/testimonial.actions";

export async function Testimonials() {
  // Récupération des données depuis la DB
  const testimonials = await getActiveTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-background w-full xl:px-30">
      <div className="container mx-auto px-4">
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

        <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 h-full flex flex-col">
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
                <div className="relative mb-6 grow">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-soporis-gold/20" />
                  <p className="text-foreground pl-6 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-lg font-semibold text-primary">
                        {testimonial.author.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
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
