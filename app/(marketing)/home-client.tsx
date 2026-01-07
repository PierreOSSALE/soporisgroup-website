"use client";

import { Hero } from "@components/features/Hero";
import { About } from "@components/features/About";
import { Services } from "@components/features/Services";
import { Realisations } from "@components/features/Realisations";
import { Packs } from "@/components/features/Packs";
import { Testimonials } from "@components/features/Testimonials";
import { FAQ } from "@components/features/FAQ";
import { Contact } from "@components/features/Contact";
// Importez vos composants d'animation si vous les utilisez ici
import { AnimatedSection } from "@components/animations/AnimatedSection";

export function HomeClient() {
  return (
    <>
      <Hero />
      <AnimatedSection direction="up">
        <About />
      </AnimatedSection>
      <Services className="bg-soporis-gray" titleColor="text-soporis-navy" />
      <Realisations />
      <Packs className="bg-soporis-gray" titleColor="text-soporis-navy" />
      <Testimonials />
      <FAQ />
      <Contact className="bg-background" />
    </>
  );
}
