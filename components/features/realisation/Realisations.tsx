// components/features/Realisations.tsx
import { getPublishedProjects } from "@/lib/actions/project.actions";
import { RealisationsClient } from "./RealisationsClient";

export async function RealisationsServer() {
  const projects = await getPublishedProjects();

  // Extraire dynamiquement les catégories
  const categories = [
    "Tout",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  return <RealisationsClient projects={projects} categories={categories} />;
}
