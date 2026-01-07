//app/(marketing)/blog/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home, ChevronRight, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import type { BlogArticle } from "@prisma/client";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return prisma.blogArticle.findMany({
    where: { published: true },
    select: { slug: true },
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article: BlogArticle | null = await prisma.blogArticle.findFirst({
    where: { slug: params.slug, published: true },
  });

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" /> Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary font-medium truncate max-w-37.5 md:max-w-none">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection direction="up">
            {/* Header Content */}
            <div className="max-w-4xl mb-8">
              <span className="inline-block px-3 py-1 rounded-sm bg-[#0F172A] text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                {article.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2b4b] leading-[1.15] mb-6">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />{" "}
                  {format(new Date(article.created_at), "d MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {article.read_time}
                </span>
              </div>
            </div>

            {/* Featured Image - Matching Rounded Corners */}
            {article.image_url && (
              <div className="relative aspect-21/9 w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-12 shadow-sm border border-slate-100">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Dynamic Content Parsing */}
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a2b4b] mb-6">
                {article.title}
              </h2>
              <div className="space-y-6">
                {article.content.split("\n").map((line: string, i: number) => {
                  const p = line.trim();
                  if (!p) return <div key={i} className="h-2" />;

                  // Detection des titres de sections (ex: "1. Design...")
                  if (
                    /^\d+\.|\b(Conclusion|Comprendre|Techniques|Les éléments|Les erreurs)\b/.test(
                      p
                    )
                  ) {
                    return (
                      <h3
                        key={i}
                        className="text-xl md:text-2xl font-bold text-[#1a2b4b] mt-10 mb-4"
                      >
                        {p}
                      </h3>
                    );
                  }

                  // Detection des listes
                  if (p.startsWith("- ")) {
                    return (
                      <li
                        key={i}
                        className="ml-6 list-disc text-slate-600 text-lg leading-relaxed"
                      >
                        {p.slice(2)}
                      </li>
                    );
                  }

                  // Paragraphes normaux
                  return (
                    <p
                      key={i}
                      className="text-lg text-slate-600 leading-relaxed"
                    >
                      {p}
                    </p>
                  );
                })}
              </div>

              {/* Back Button */}
              <div className="mt-16 pt-8 border-t border-slate-100">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-6 text-slate-600 border-slate-200 hover:bg-slate-50 gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Retour au blog
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </article>
    </div>
  );
}
