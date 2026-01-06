// app/blog/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
import { getPublishedArticles } from "@/lib/actions/blog.actions";

export default async function BlogPage() {
  const articles: BlogArticle[] = await getPublishedArticles();

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
            <span className="text-primary font-medium">Blog</span>
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
      <section className="pt-8 pb-28  bg-secondary/30 w-full lg:px-28">
        <div className="container mx-auto px-4">
          {articles.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: BlogArticle) => {
                const formattedDate = format(
                  new Date(article.created_at),
                  "d MMM yyyy",
                  { locale: fr }
                );

                return (
                  <StaggerItem key={article.id}>
                    <Link href={`/blog/${article.slug}` as Route}>
                      <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all duration-300 h-full">
                        <div className="relative aspect-16/10 overflow-hidden">
                          {article.image_url && (
                            <img
                              src={article.image_url}
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
                              {article.read_time}
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
                  </StaggerItem>
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
        </div>
      </section>
    </>
  );
}
