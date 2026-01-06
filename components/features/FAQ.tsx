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

const faqs = [
  {
    question: "Combien coûte la création d'un site web ?",
    answer:
      "Le coût dépend de la complexité de votre projet. Nos packs démarrent à partir de 499€ pour un site vitrine, jusqu'à des solutions sur mesure pour les projets plus ambitieux. Chaque projet fait l'objet d'un devis personnalisé gratuit.",
  },
  {
    question: "Quel est le délai de réalisation d'un projet ?",
    answer:
      "Le délai varie selon la complexité : 2-3 semaines pour un site vitrine standard, 4-6 semaines pour un site plus élaboré, et 2-3 mois pour une application web complexe. Nous définissons ensemble un planning précis dès le démarrage du projet.",
  },
  {
    question: "Proposez-vous l'hébergement et la maintenance ?",
    answer:
      "Oui ! Tous nos packs incluent l'hébergement pour la première année. Nous proposons également des contrats de maintenance pour assurer les mises à jour, la sécurité et le support technique de votre site.",
  },
  {
    question: "Mon site sera-t-il optimisé pour le référencement (SEO) ?",
    answer:
      "Absolument. Tous nos sites sont développés avec les meilleures pratiques SEO : structure optimisée, vitesse de chargement, balises méta, données structurées, et contenu optimisé pour les moteurs de recherche.",
  },
  {
    question: "Puis-je modifier mon site moi-même après la livraison ?",
    answer:
      "Oui, nous intégrons des systèmes de gestion de contenu (CMS) intuitifs qui vous permettent de modifier textes, images et contenus facilement. Une formation est incluse pour vous rendre autonome.",
  },
  {
    question: "Comment se déroule la collaboration ?",
    answer:
      "Nous suivons un processus clair : 1) Analyse de vos besoins, 2) Proposition et devis, 3) Design et validation, 4) Développement, 5) Tests et corrections, 6) Mise en ligne et formation. Vous êtes impliqué à chaque étape.",
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer:
      "Nous utilisons les technologies web modernes : React, Next.js, Tailwind CSS pour le frontend, et diverses solutions backend selon les besoins (Node.js, Supabase, etc.). Nous privilégions la performance et la maintenabilité.",
  },
  {
    question: "Proposez-vous des solutions e-commerce ?",
    answer:
      "Oui, nous développons des boutiques en ligne performantes avec des solutions adaptées à votre volume de ventes : de simples catalogues avec paiement intégré aux plateformes e-commerce complètes.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-soporis-gray w-full lg:px-30">
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
            {faqs.map((faq, index) => (
              <StaggerItem key={index}>
                <AccordionItem
                  value={`item-${index}`}
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
      </div>
    </section>
  );
}
