// app/(marketing)/a-propos/page.tsx
// app/(marketing)/a-propos/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Users, Target, Award, Heart } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
  title: "À propos de Soporis Group | Agence Web Tunis, Paris & Afrique",
  description:
    "Découvrez Soporis Group, agence experte en Next.js, Prisma et UI/UX. Basés à Tunis Lafayette, nous accompagnons nos clients en France et dans toute l'Afrique.",
};

const values = [
  {
    icon: Users,
    title: "Collaboration Proche",
    description:
      "Que vous soyez à Tunis, dans d'autres pays d'Afrique ou à Paris, nous travaillons en totale transparence avec vos équipes via des outils collaboratifs modernes.",
  },
  {
    icon: Target,
    title: "Excellence Technique",
    description:
      "Nous utilisons les technologies les plus performantes comme Next.js/React.js, Prisma, Tailwind CSS, Shadcn/UI et Supabase pour des solutions robustes.",
  },
  {
    icon: Award,
    title: "Expertise UI/UX",
    description:
      "Chaque interface est pensée pour maximiser l'expérience utilisateur et vos taux de conversion, alliant esthétique et performance.",
  },
  {
    icon: Heart,
    title: "Engagement",
    description:
      "Votre projet est le nôtre. Nous nous engageons sur la qualité du code, la sécurité des données et le respect strict des délais.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb */}
      {/* <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" /> Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">À propos</span>
          </nav>
        </div>
      </div> */}

      {/* Header Section */}
      <div className="pt-38 pb-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Propulser votre vision digitale
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Soporis Group est une agence créative spécialisée dans la
              conception de produits digitaux haute performance.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Story / Location Section */}
      <section className="py-16 bg-soporis-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-soporis-navy mb-6">
              Notre Rayonnement
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Basés au cœur de Tunis, dans le quartier dynamique de
              **Lafayette**, nous combinons la flexibilité d'une agence agile
              avec les standards de qualité européens.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bien que notre production soit centralisée à Tunis, nous servons
              nos clients à **Paris, dans tous les pays d'Afrique et dans toute
              la France** 100% en ligne, garantissant une réactivité optimale et
              des tarifs compétitifs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">
              Nos Valeurs
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
                <p className="text-muted-foreground text-sm leading-relaxed">
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
