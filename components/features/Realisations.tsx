"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { projects, categories } from "@/components/data/projects";
import Image from "next/image";
import { Route } from "next";

type RealisationsProps = {
  className?: string;
};

export function Realisations({ className = "" }: RealisationsProps) {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filteredProjects =
    activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className={`py-24 bg-background w-full lg:px-30 ${className}`}>
      {" "}
      <div className="container mx-auto px-4">
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

        {/* Filter Tabs */}
        <AnimatedSection
          delay={0.1}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
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
        </AnimatedSection>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 4).map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/realisations/${project.slug}` as Route}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-card transition-all duration-300"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-5 border">
                    <span className="text-xs font-medium text-soporis-gold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-primary mt-1 mb-2">
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
        <AnimatedSection delay={0.3} className="text-center">
          <Link href="/realisations">
            <Button variant="default" size="lg" className="group rounded-full">
              Voir tous les projets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
