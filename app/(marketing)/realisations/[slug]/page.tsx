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
} from "lucide-react";
import { getProjectBySlug, type Project } from "@/components/data/projects";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function RealisationDetail() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      const foundProject = getProjectBySlug(slug);
      setProject(foundProject || null);

      if (!foundProject) {
        router.push("/realisations");
      }
    }
  }, [slug, router]);

  if (!project) {
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-40 pb-4 bg-background">
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
            <span className="text-primary font-medium">{project.title}</span>
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
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="w-full h-full object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
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
              <AnimatedSection>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  À propos du projet
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.description}
                </p>
              </AnimatedSection>

              {/* Challenges */}
              <AnimatedSection delay={0.1}>
                <h2 className="font-display text-2xl font-bold text-primary mb-6">
                  Les défis
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              {/* Solutions */}
              <AnimatedSection delay={0.2}>
                <h2 className="font-display text-2xl font-bold text-primary mb-6">
                  Nos solutions
                </h2>
                <ul className="space-y-3">
                  {project.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-soporis-gold shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{solution}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              {/* Screenshots */}
              <AnimatedSection delay={0.3}>
                <h2 className="font-display text-2xl font-bold text-primary mb-6">
                  Captures d'écran
                </h2>
                <div className="space-y-6">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={index} className="group">
                      <div className="relative rounded-xl overflow-hidden border border-border aspect-video">
                        <Image
                          src={screenshot.url}
                          alt={screenshot.caption}
                          fill
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 text-center italic">
                        {screenshot.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
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
              <AnimatedSection delay={0.3}>
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-display text-lg font-semibold text-primary mb-4">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Results */}
              <AnimatedSection delay={0.4}>
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                  <h3 className="font-display text-lg font-semibold mb-4">
                    Résultats
                  </h3>
                  <ul className="space-y-3">
                    {project.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-soporis-gold shrink-0 mt-0.5" />
                        <span className="text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection delay={0.5}>
                <div className="bg-card rounded-2xl p-6 border border-border text-center">
                  <h3 className="font-display text-lg font-semibold text-primary mb-2">
                    Un projet similaire ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discutons de vos besoins et créons ensemble votre projet.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full cursor-pointer">
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
      {project.testimonial && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <Quote className="h-12 w-12 text-soporis-gold mx-auto mb-6" />
                <blockquote className="text-xl sm:text-2xl text-primary font-medium italic mb-6">
                  "{project.testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-primary">
                    {project.testimonial.author}
                  </p>
                  <p className="text-muted-foreground">
                    {project.testimonial.role}
                  </p>
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
              <Button className="gap-2 cursor-pointer">
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
