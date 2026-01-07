"use client";

import { useState } from "react";
import { Home, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { projects, categories } from "@/components/data/projects";
import Image from "next/image";
import { Route } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export default function RealisationsPage() {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filteredProjects =
    activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
            <span className="text-soporis-navy font-medium">
              Nos réalisations
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="pb-12 pt-4 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Nos réalisations
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez nos projets innovants qui illustrent notre expertise en
              Web et UI/UX.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Content */}
      <section className="pb-16 bg-background w-full lg:px-30">
        <div className="container mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/realisations/${project.slug}` as Route}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all duration-300"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={project.image}
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
