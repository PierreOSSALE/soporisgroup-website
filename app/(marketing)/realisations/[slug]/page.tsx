// app/(marketing)/realisations/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/actions/project.actions";
import RealisationDetailView from "./realisation-detail-view";
import { Project } from "@/types/project";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Projet non trouvé | Soporis Group" };

  return {
    title: `${project.title} | Réalisations Soporis Group`,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      url: `https://soporisgroup.com/realisations/${slug}`,
      // FIX: On s'assure que l'image n'est jamais null pour éviter l'erreur TS
      images: project.imageUrl
        ? [{ url: project.imageUrl }]
        : [{ url: "/og-default.jpg" }],
      type: "article",
    },
  };
}

export default async function RealisationDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // Vérification de sécurité
  if (!project || project.status !== "published") notFound();

  const typedProject = project as unknown as Project;

  // 2. Schémas JSON-LD pour Google
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://soporisgroup.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Réalisations",
        item: "https://soporisgroup.com/realisations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://soporisgroup.com/realisations/${slug}`,
      },
    ],
  };

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.subtitle,
    image: project.imageUrl,
    author: { "@type": "Organization", name: "Soporis Group" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* On passe le projet au composant client */}
      <RealisationDetailView project={typedProject} />
    </>
  );
}
