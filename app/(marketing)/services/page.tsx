import type { Metadata } from "next";
import Link from "next/link";
import { Route } from "next";
import {
  Home,
  ChevronRight,
  Palette,
  Code2,
  Gauge,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { Services } from "@/components/features/Services";

export const metadata: Metadata = {
  title: "Nos Services Web & Design | Soporis Group",
  description:
    "UI/UX Design, Développement Web, SEO et Refonte de site. Découvrez nos solutions sur mesure pour votre transformation digitale.",
};

// Définition des services
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

export default function ServicesPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-38 pb-4 bg-background">
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
            <span className="text-primary font-medium">Nos services</span>
          </nav>
        </div>
      </div>

      {/* Services Section */}
      <Services className="-mt-18 bg-background" />
    </>
  );
}
