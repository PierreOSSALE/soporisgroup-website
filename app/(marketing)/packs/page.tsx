// app/(marketing)/packs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Packs as PacksSection } from "@/components/features/packs/Packs";

export const metadata: Metadata = {
  title: "Nos Packs & Tarifs | Soporis Group",
  description:
    "Découvrez nos offres pour la création de sites web et le design UI/UX.",
};

export default function PacksPage() {
  return (
    <>
      {/* <div className="pt-38 pb-4 bg-soporis-white">
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
            <span className="text-soporis-navy font-medium">
              Packs & Offres
            </span>
          </nav>
        </div>
      </div> */}

      <PacksSection className="bg-background" margin="-mt-18 pt-38" />
    </>
  );
}
