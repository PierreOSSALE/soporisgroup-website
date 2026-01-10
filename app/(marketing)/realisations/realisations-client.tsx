"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ChevronRight, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Route } from "next";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  imageUrl: string | null;
};

type Props = {
  projects: Project[];
};

export default function RealisationsClient({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Simuler un chargement (API)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Catégories
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  // Filtrage par catégorie
  const filteredProjects = useMemo(() => {
    return activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  // Pagination
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredProjects.slice(startIndex, endIndex);

  // Reset page quand catégorie change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  function changeCategory(category: string) {
    setActiveCategory(category);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">
              Nos réalisations
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="pb-12 pt-4 bg-background text-center">
        <AnimatedSection>
          <h1 className="font-display text-4xl font-bold text-primary mb-4">
            Nos réalisations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos projets innovants.
          </p>
        </AnimatedSection>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => changeCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-12 px-8 lg:px-30">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <ProjectSkeleton key={i} />
          ))
        ) : currentItems.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            Aucun projet trouvé pour cette catégorie.
          </div>
        ) : (
          currentItems.map((project) => (
            <Link
              key={project.id}
              href={`/realisations/${project.slug}` as Route}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all duration-300"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={project.imageUrl || "/placeholder.jpg"}
                  alt={project.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                  <ExternalLink className="h-10 w-10 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-soporis-gold uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="font-display text-xl font-semibold text-primary mt-2 mb-3">
                  {project.title}
                </h3>
                <p className="text-muted-foreground">{project.subtitle}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-24">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded border border-border bg-card disabled:opacity-50"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded border border-border ${
                currentPage === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded border border-border bg-card disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </>
  );
}

/* -------------------------------- Skeleton -------------------------------- */

function ProjectSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
