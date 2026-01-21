// app/(marketing)/realisations/[slug]/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Home,
  ChevronRight,
  Clock,
  Calendar,
  Package,
  CheckCircle2,
  ArrowLeft,
  Quote,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import type { Project, Screenshot, Testimonial } from "@/types/project";

// FIX: Définition précise des props pour éviter l'erreur IntrinsicAttributes
interface RealisationDetailViewProps {
  project: Project;
}

export default function RealisationDetailView({
  project,
}: RealisationDetailViewProps) {
  // Fonctions utilitaires de parsing (déplacées ici car utilisées côté client)
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseObjectField = (field: any): any => {
    if (!field) return null;
    if (typeof field === "object" && !Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return null;
      }
    }
    return null;
  };

  const technologies = parseJsonField(project.technologies);
  const challenges = parseJsonField(project.challenges);
  const solutions = parseJsonField(project.solutions);
  const results = parseJsonField(project.results);
  const screenshots = parseJsonField(project.screenshots) as Screenshot[];
  const testimonial = parseObjectField(
    project.testimonial,
  ) as Testimonial | null;
  const projectImage = project.imageUrl || "/placeholder-project.jpg";

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Breadcrumb Visuel */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="md:container mx-auto px-4 text-sm flex items-center justify-center gap-2 text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" /> Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/realisations"
            className="hover:text-primary transition-colors"
          >
            Réalisations
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-soporis-navy font-medium">{project.title}</span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="py-12 w-full lg:px-30">
        <div className="md:container mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Retour
              </Link>
              <Badge className="bg-soporis-gold/20 text-soporis-gold border-soporis-gold/30">
                {project.category}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              {project.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-soporis-gold" />{" "}
                {project.duration}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-soporis-gold" />{" "}
                {project.year}
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-soporis-gold" /> Pack{" "}
                {project.pack}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video mb-12 border shadow-xl">
              <Image
                src={projectImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. Content & Sidebar */}
      <section className="py-12 bg-soporis-gray w-full lg:px-30">
        <div className="md:container mx-auto px-4 grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-soporis-navy mb-4">
                À propos du projet
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.description}
              </p>
            </AnimatedSection>

            {challenges.length > 0 && (
              <AnimatedSection delay={0.1}>
                <h2 className="text-2xl font-bold text-soporis-navy mb-6">
                  Les défis
                </h2>
                <ul className="space-y-3">
                  {challenges.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            )}

            {/* Galerie Screenshots */}
            {screenshots.length > 0 && (
              <AnimatedSection delay={0.3}>
                <h2 className="text-2xl font-bold text-soporis-navy mb-6">
                  Captures d'écran
                </h2>
                <div className="grid gap-8">
                  {screenshots.map((s, i) => (
                    <div key={i} className="group">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative aspect-video rounded-xl overflow-hidden border cursor-zoom-in">
                            <Image
                              src={s.url}
                              alt={s.caption}
                              fill
                              className="object-contain bg-background"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <Maximize2 className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl h-[80vh] p-0 bg-transparent border-none">
                          <Image
                            src={s.url}
                            alt={s.caption}
                            fill
                            className="object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                      <p className="text-sm text-center italic mt-2 text-muted-foreground">
                        {s.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Informations</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pack choisi</p>
                  <Badge
                    variant="outline"
                    className="text-soporis-gold border-soporis-gold mt-1"
                  >
                    {project.pack}
                  </Badge>
                </div>
              </div>
            </div>

            {technologies.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-soporis-navy/5 text-soporis-navy border-none"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-soporis-navy rounded-2xl p-6 text-white text-center">
              <h3 className="text-lg font-semibold mb-2">
                Un projet similaire ?
              </h3>
              <p className="text-sm opacity-80 mb-4">
                Discutons ensemble de vos besoins numériques.
              </p>
              <Link href="/contact" className="w-full">
                <Button className="w-full bg-soporis-gold hover:bg-soporis-gold/90 text-soporis-navy font-bold">
                  Demander un devis
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. Testimonial & Footer Nav */}
      {testimonial && (
        <section className="py-20 bg-background text-center">
          <div className="md:container mx-auto px-4 max-w-3xl">
            <Quote className="h-12 w-12 text-soporis-gold mx-auto mb-6 opacity-50" />
            <p className="text-2xl font-medium italic text-primary mb-6">
              "{testimonial.quote}"
            </p>
            <p className="font-bold">{testimonial.author}</p>
            <p className="text-muted-foreground">{testimonial.role}</p>
          </div>
        </section>
      )}

      <footer className="py-8 border-t bg-soporis-gray lg:px-30">
        <div className="md:container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/realisations">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Toutes les réalisations
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-soporis-gold text-soporis-navy hover:bg-soporis-gold/90">
              Démarrer un projet <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
