"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Calendar, Clock } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/AnimatedSection";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Route } from "next";
import type { BlogArticle } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  articles: BlogArticle[];
};

export default function BlogClient({ articles }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Pagination
  const totalItems = articles?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = articles?.slice(startIndex, endIndex) ?? [];

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
            <span className="text-soporis-navy font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="py-8 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
              Nos articles
            </h1>
            <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Retrouvez nos conseils, actualités et astuces pour rester à jour
              avec les dernières tendances du web et du design.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="pt-8 pb-28 bg-secondary/30 w-full lg:px-28">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          ) : currentItems.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((article) => {
                const formattedDate = format(
                  new Date(article.createdAt),
                  "d MMM yyyy",
                  { locale: fr }
                );

                return (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}` as Route}
                  >
                    <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all duration-300 h-full">
                      <div className="relative aspect-16/10 overflow-hidden">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-semibold text-primary mb-3 group-hover:text-soporis-gold transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun article disponible pour le moment.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
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
        </div>
      </section>
    </>
  );
}

/* ---------------- Skeleton ---------------- */
function ArticleSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-16/10 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
