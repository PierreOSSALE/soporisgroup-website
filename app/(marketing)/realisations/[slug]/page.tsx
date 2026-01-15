// app/(marketing)/realisations/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
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
import { getProjectBySlug } from "@/lib/actions/project.actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Définir les types pour les données de Prisma
type Project = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  imageUrl: string | null;
  featured: boolean;
  description: string | null;
  technologies: any;
  challenges: any;
  solutions: any;
  results: any;
  screenshots: any;
  testimonial: any;
  createdAt: Date;
  updatedAt: Date;
};

// Type pour les captures d'écran
type Screenshot = {
  url: string;
  caption: string;
};

// Type pour le témoignage
type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export default function RealisationDetail() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    const loadProject = async () => {
      if (slug) {
        try {
          setIsLoading(true);
          const data = await getProjectBySlug(slug);

          // Vérifier si le projet est publié
          if (data.status !== "published") {
            router.push("/realisations");
            return;
          }

          setProject(data as Project);
        } catch (error) {
          console.error("Erreur lors du chargement du projet:", error);
          router.push("/realisations");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProject();
  }, [slug, router]);

  if (isLoading) {
    return (
      <>
        <div className="pt-28 pb-8 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="pt-28 pb-8 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Projet non trouvé
            </h1>
            <p className="text-muted-foreground mb-6">
              Le projet que vous recherchez n'existe pas ou a été déplacé.
            </p>
            <Link href="/realisations">
              <Button>Voir toutes les réalisations</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Convertir les champs JSON en types TypeScript
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;

    // Si c'est une chaîne JSON, la parser
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

    // Si c'est une chaîne JSON, la parser
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
    project.testimonial
  ) as Testimonial | null;

  // Utiliser l'image du projet ou une image par défaut
  const projectImage = project.imageUrl || "/placeholder-project.jpg";

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
            <Link
              href="/realisations"
              className="hover:text-primary transition-colors"
            >
              Réalisations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-soporis-navy font-medium">
              {project.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-background w-full lg:px-30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center max-w-sm gap-2 my-4">
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors "
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux réalisations
              </Link>

              <Badge className="bg-soporis-gold/20 text-soporis-gold border-soporis-gold/30 ">
                {project.category}
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-8 bg-soporis-gold-light/10">
              {project.subtitle}
            </p>

            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-soporis-gold" />
                <span>{project.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5 text-soporis-gold" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5 text-soporis-gold" />
                <span>Pack {project.pack}</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Main Image */}
          <AnimatedSection delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden aspect-video mb-12">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-full cursor-zoom-in group">
                    <Image
                      src={projectImage}
                      alt={project.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      quality={90}
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-transparent border-none">
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={projectImage}
                      alt={project.title}
                      fill
                      className="object-contain"
                      quality={100}
                      sizes="100vw"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-soporis-gray w-full lg:px-30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {project.description && (
                <AnimatedSection>
                  <h2 className="font-display text-2xl font-bold text-soporis-navy  mb-4">
                    À propos du projet
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.description}
                  </p>
                </AnimatedSection>
              )}

              {/* Challenges */}
              {challenges.length > 0 && (
                <AnimatedSection delay={0.1}>
                  <h2 className="font-display text-2xl font-bold text-soporis-navy  mb-6">
                    Les défis
                  </h2>
                  <ul className="space-y-3">
                    {challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">
                          {challenge}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              )}

              {/* Solutions */}
              {solutions.length > 0 && (
                <AnimatedSection delay={0.2}>
                  <h2 className="font-display text-2xl font-bold text-soporis-navy  mb-6">
                    Nos solutions
                  </h2>
                  <ul className="space-y-3">
                    {solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-soporis-gold shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          {solution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              )}

              {/* Screenshots */}
              {screenshots.length > 0 && (
                <AnimatedSection delay={0.3}>
                  <h2 className="font-display text-2xl font-bold text-soporis-navy  mb-6">
                    Captures d'écran
                  </h2>
                  <div className="space-y-8">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="group">
                        <div className="relative rounded-xl overflow-hidden border border-border bg-gray-50 dark:bg-gray-900">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="relative aspect-video cursor-zoom-in">
                                <Image
                                  src={screenshot.url}
                                  alt={screenshot.caption}
                                  fill
                                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                  quality={85}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Maximize2 className="h-4 w-4" />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-transparent border-none">
                              <div className="relative w-full h-[80vh]">
                                <Image
                                  src={screenshot.url}
                                  alt={screenshot.caption}
                                  fill
                                  className="object-contain"
                                  quality={100}
                                  sizes="100vw"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 text-center italic">
                          {screenshot.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Client Info */}
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-display text-lg font-semibold text-primary mb-4">
                    Informations
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Client</dt>
                      <dd className="text-primary font-medium">
                        {project.client}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Durée</dt>
                      <dd className="text-primary font-medium">
                        {project.duration}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Année</dt>
                      <dd className="text-primary font-medium">
                        {project.year}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Pack</dt>
                      <dd>
                        <Badge
                          variant="outline"
                          className="text-soporis-gold border-soporis-gold"
                        >
                          {project.pack}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </AnimatedSection>

              {/* Technologies */}
              {technologies.length > 0 && (
                <AnimatedSection delay={0.3}>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-display text-lg font-semibold text-primary mb-4">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-card-foreground text-background hover:bg-soporis-navy/20 border-soporis-navy/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Results */}
              {results.length > 0 && (
                <AnimatedSection delay={0.4}>
                  <div className="bg-linear-to-br from-soporis-navy to-soporis-navy-light rounded-2xl p-6 text-white">
                    <h3 className="font-display text-lg font-semibold mb-4">
                      Résultats
                    </h3>
                    <ul className="space-y-3">
                      {results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-soporis-gold shrink-0 mt-0.5" />
                          <span className="text-sm opacity-90">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              )}

              {/* CTA */}
              <AnimatedSection delay={0.5}>
                <div className="bg-card rounded-2xl p-6 border border-border text-center">
                  <h3 className="font-display text-lg font-semibold text-primary  mb-2">
                    Un projet similaire ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discutons de vos besoins et créons ensemble votre projet.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full cursor-pointer bg-soporis-gold hover:bg-soporis-gold/90 text-soporis-navy">
                      Demander un devis
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {testimonial && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <Quote className="h-12 w-12 text-soporis-gold mx-auto mb-6" />
                <blockquote className="text-xl sm:text-2xl text-primary font-medium italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className=" bg-soporis-gray ">
        <Separator className="mb-8" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4  w-full lg:px-30">
            <Link href="/realisations">
              <Button variant="outline" className="gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Toutes les réalisations
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="gap-2 cursor-pointer bg-soporis-gold hover:bg-soporis-gold/90 text-soporis-navy">
                Démarrer un projet
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>{" "}
        <Separator className="mt-8" />
      </section>
    </>
  );
}
