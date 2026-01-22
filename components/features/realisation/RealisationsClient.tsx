// components/features/RealisationsClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
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
  categories: string[];
};

export function RealisationsClient({ projects, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filteredProjects =
    activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 bg-background w-full px-4 xl:px-30">
      <div className="container mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Nos réalisations
          </h2>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">
            Découvrez nos projets qui illustrent notre expertise en Web et
            UI/UX.
          </p>
        </AnimatedSection>

        {/* Filtres */}
        {/* <AnimatedSection className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-primary"
                }`}
            >
              {category}
            </button>
          ))}
        </AnimatedSection> */}

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 "
        >
          <AnimatePresence>
            {filteredProjects.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Link
                  href={`/realisations/${project.slug}` as Route}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition"
                >
                  <div className="relative group aspect-4/3 ">
                    <Image
                      src={project.imageUrl || "/placeholder.jpg"}
                      alt={project.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute h-full inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                      <ExternalLink className="h-10 w-10 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-xs text-soporis-gold uppercase ">
                      {project.category}
                    </span>
                    <h3 className="font-display font-semibold text-primary mt-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/realisations">
            <Button size="lg" className="rounded-full">
              Voir tous les projets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
