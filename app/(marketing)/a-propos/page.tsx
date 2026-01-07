import { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Users, Target, Award, Heart } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

// 1. Définition des métadonnées pour le SEO (spécifique à cette page)
export const metadata: Metadata = {
  title: "À propos de nous | Soporis Group",
  description:
    "Découvrez l'histoire, les valeurs et la mission de Soporis Group, votre agence web et UI/UX design.",
};

const values = [
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Nous travaillons main dans la main avec nos clients pour créer des solutions qui répondent parfaitement à leurs besoins.",
  },
  {
    icon: Target,
    title: "Excellence",
    description:
      "Chaque projet est une opportunité de repousser les limites et de livrer un travail de qualité exceptionnelle.",
  },
  {
    icon: Award,
    title: "Innovation",
    description:
      "Nous utilisons les dernières technologies et tendances pour créer des expériences digitales modernes.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Notre passion pour le design et le développement se reflète dans chaque pixel et chaque ligne de code.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">À propos</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              À propos de Soporis Group
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-md max-w-2xl mx-auto">
              Une agence web passionnée par la création d'expériences digitales
              exceptionnelles.
            </p>{" "}
          </AnimatedSection>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-soporis-navy mb-6">
              Notre histoire
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Soporis Group est née de la conviction que chaque entreprise
              mérite une présence digitale à la hauteur de ses ambitions. Notre
              équipe d'experts en UI/UX design et développement web s'engage à
              transformer vos idées en expériences digitales mémorables.
            </p>
            <p className="text-muted-foreground text-lg">
              Nous combinons créativité, expertise technique et compréhension
              approfondie des besoins utilisateurs pour créer des solutions web
              qui performent et convertissent.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">
              Nos valeurs
            </h2>
            <div className="w-16 h-1 bg-soporis-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-card transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
