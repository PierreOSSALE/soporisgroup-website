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
import { Services } from "@/components/features/Services";

export const metadata: Metadata = {
  title: "Nos Services Web & Design | Soporis Group",
  description:
    "UI/UX Design, Développement Web, SEO et Refonte de site. Découvrez nos solutions sur mesure pour votre transformation digitale.",
};

export default function ServicesPage() {
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
            <span className="text-soporis-navy font-medium">Nos services</span>
          </nav>
        </div>
      </div>

      {/* Services Section */}
      <Services className="bg-background" margin="-mt-18" />
    </>
  );
}
