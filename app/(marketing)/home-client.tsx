// app/(marketing)/home-client.tsx
import { Hero } from "@components/features/Hero";
import { About } from "@components/features/About";
import { Services } from "@components/features/Services";
import { RealisationsServer } from "@/components/features/realisation/Realisations";
import { Packs } from "@/components/features/packs/Packs";
import { Testimonials } from "@components/features/Testimonials";
import { FAQ } from "@/components/features/FAQ";
import { Contact } from "@/components/features/Contact";
import { AnimatedSection } from "@components/animations/AnimatedSection";
import { getActiveServices } from "@/lib/actions/service.actions";

export default async function Home() {
  const initialServices = await getActiveServices();

  return (
    <>
      <Hero />
      <AnimatedSection direction="up">
        <About />
      </AnimatedSection>
      <Services
        initialServices={initialServices}
        className="bg-soporis-gray"
        titleColor="text-soporis-navy"
      />
      <RealisationsServer />
      <Packs className="bg-soporis-gray" titleColor="text-soporis-navy" />
      <Testimonials />
      <FAQ />
      <Contact className="bg-background" />
    </>
  );
}
