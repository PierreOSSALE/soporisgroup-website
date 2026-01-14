// app/(marketing)/realisations/page.tsx
// app/(marketing)/realisations/page.tsx
import { prisma } from "@/lib/prisma";
import RealisationsClient from "./realisations-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Réalisations | Soporis Group",
  description:
    "Découvrez les projets innovants de Soporis Group : solutions digitales, développement web et transformation numérique pour nos clients.",
  openGraph: {
    title: "Nos Réalisations | Soporis Group",
    description: "Découvrez notre portfolio de projets digitaux.",
    url: "https://votre-domaine.com/realisations",
    type: "website",
    images: [{ url: "/og-realisations.jpg", width: 1200, height: 630 }],
  },
};

export default async function RealisationsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      subtitle: true,
      slug: true,
      category: true,
      imageUrl: true,
    },
  });

  // Création du schéma JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Portfolio Soporis Group",
    description: "Liste des projets et réalisations de Soporis Group",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.subtitle,
        image: project.imageUrl,
        url: `https://soporisgroup.com/realisations/${project.slug}`,
      },
    })),
  };

  return (
    <>
      {/* Insertion du script JSON-LD pour Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RealisationsClient projects={projects} />
    </>
  );
}
