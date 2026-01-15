// app/(marketing)/blog/BlogClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Calendar, Clock } from "lucide-react";
import { StaggerContainer } from "@/components/animations/AnimatedSection";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Route } from "next";
import type { BlogArticle } from "@prisma/client";
import Image from "next/image"; // Ajoute cet import

type Props = {
  articles: BlogArticle[];
};

export default function BlogClient({ articles }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalItems = articles?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems =
    articles?.slice(startIndex, startIndex + itemsPerPage) ?? [];

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
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Nos articles
          </h1>
          <div className="w-16 h-1 bg-soporis-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Retrouvez nos conseils et astuces sur les dernières tendances du web
            et du design.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="pt-8 pb-28 bg-secondary/30 w-full lg:px-28">
        <div className="container mx-auto px-4">
          {currentItems.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}` as Route}
                  className="block h-full"
                >
                  <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-16/10 overflow-hidden shrink-0">
                      {article.imageUrl && (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                        />
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(article.createdAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-primary mb-3 group-hover:text-soporis-gold transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Aucun article disponible pour le moment.
            </div>
          )}

          {/* Pagination simple */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded border transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
