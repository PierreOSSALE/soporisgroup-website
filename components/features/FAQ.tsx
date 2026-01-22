// components/features/FAQ.tsx
"use client";

import { useState, useEffect } from "react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getActiveFaqs } from "@/lib/actions/faq.actions";
import type { FAQ } from "@prisma/client";

export function FAQ() {
  const [activeFAQs, setActiveFAQs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const faqs = await getActiveFaqs();
        setActiveFAQs(faqs || []);
      } catch (error) {
        console.error("Erreur lors du chargement des FAQs:", error);
        setActiveFAQs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-soporis-gray w-full xl:px-30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="w-16 h-1 bg-gray-200 mx-auto mb-6" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-soporis-gray w-full xl:px-30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-soporis-navy mb-4">
            Questions fréquentes
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Retrouvez les réponses aux questions les plus courantes sur nos
            services.
          </p>
        </AnimatedSection>

        <StaggerContainer className="max-w-3xl mx-auto" staggerDelay={0.05}>
          <Accordion type="single" collapsible className="space-y-4">
            {activeFAQs.map((faq, index) => (
              <StaggerItem key={faq.id}>
                <AccordionItem
                  value={`item-${faq.id}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-card transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-primary hover:text-soporis-gold py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
        </StaggerContainer>

        {activeFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Aucune question disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
