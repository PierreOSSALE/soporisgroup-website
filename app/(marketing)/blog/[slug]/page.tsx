// app/(marketing)/blog/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home, ChevronRight, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ViewIncrementer } from "@/components/features/blog/ViewIncrementer";
import Image from "next/image";
import { Metadata } from "next";

import type { BlogArticle } from "@prisma/client";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = await prisma.blogArticle.findMany({
    where: { published: true },
    select: { slug: true },
  });

  console.log(
    "Generating static params for blog articles:",
    articles.map((a) => a.slug)
  );

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Désemballer le params
  const article = await prisma.blogArticle.findUnique({
    where: { slug, published: true },
  });

  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: `${article.title} | Soporis Group`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Désemballer le params
  console.log("Fetching article for slug:", slug);

  const article: BlogArticle | null = await prisma.blogArticle.findUnique({
    where: {
      slug,
      published: true,
    },
  });

  console.log("Article found:", article?.title);

  if (!article) {
    console.log("Article not found for slug:", slug);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ViewIncrementer articleId={article.id} />

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
                  {format(new Date(article.createdAt), "d MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {article.readTime}
                </span>{" "}
                <span className="flex items-center gap-2 text-slate-500">
                  👁️ {article.views} vues
                </span>
              </div>
            </div>

            {/* Featured Image - Utilise Image de Next.js */}
            {article.imageUrl && (
              <div className="relative aspect-21/9 w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-12 shadow-sm border border-slate-100">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  priority
                  quality={90}
                />
              </div>
            )}

            {/* Dynamic Content Parsing */}
            <div className="max-w-3xl">
              <div className="prose prose-lg max-w-none">
                {/* Si le content est en markdown, tu pourrais utiliser un parser ici */}
                <div
                  className="text-lg text-slate-600 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
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
