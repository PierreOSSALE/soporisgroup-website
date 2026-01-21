// app/(marketing)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, Eye, Clock } from "lucide-react";
import Link from "next/link";
import BlogBadge from "@/components/features/blog/BlogBadge";
import TableOfContents from "@/components/features/blog/TableOfContents";
import ShareButtons from "@/components/features/blog/ShareButtons";
import RecommendedCard from "@/components/features/blog/RecommendedCard";
import BlogContent from "@/components/features/blog/BlogContent";
import CommentSection from "@/components/features/blog/CommentSection";
import {
  getBlogPostBySlug,
  getRecommendedPosts,
  incrementBlogPostViews,
} from "@/lib/actions/blog.actions";
import { getCommentsByPostId } from "@/lib/actions/comment.actions";
import BlogDetailSkeleton from "@/components/skeletons/BlogDetailSkeleton";
import { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article non trouvé | Soporis Group",
    };
  }

  return {
    title: `${post.title} | Blog Soporis Group`,
    description: post.excerpt || `Lisez notre article sur ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://soporisgroup.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Soporis Group"],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

async function BlogDetailContent({ slug }: { slug: string }) {
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  // On lance le reste en parallèle une fois qu'on a le post
  const [recommendedPosts, comments] = await Promise.all([
    getRecommendedPosts(slug),
    getCommentsByPostId(post.id),
  ]);

  if (!post) notFound();

  // Convertir publishedAt en Date si nécessaire
  const publishedAt = post.publishedAt
    ? post.publishedAt instanceof Date
      ? post.publishedAt
      : new Date(post.publishedAt)
    : null;

  // Incrémenter les vues en arrière-plan
  incrementBlogPostViews(post.id).catch(console.error);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Organization", name: "Soporis Group" },
    description: post.excerpt,
  };

  // 2. Schéma Breadcrumb (Fil d'Ariane)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://soporisgroup.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://soporisgroup.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://soporisgroup.com/blog/${slug}`,
      },
    ],
  };
  return (
    <>
      {/* Insertion des scripts JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      {/* Article Header */}
      <header className="text-center max-w-3xl mx-auto px-4 pb-8">
        <BlogBadge>{post.category}</BlogBadge>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {publishedAt && (
            <>
              <span>
                {publishedAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime} min de lecture
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.views.toLocaleString()} vues
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <img
          src={post.image}
          alt={post.title}
          className="w-full aspect-2/1 object-cover rounded-2xl"
          loading="lazy"
        />
      </div>

      {/* Content Layout */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-38 space-y-8">
              <TableOfContents
                items={
                  Array.isArray(post.tableOfContents)
                    ? post.tableOfContents
                    : []
                }
              />
              <ShareButtons />
            </div>
          </aside>

          <article className="lg:col-span-9 order-1 lg:order-2">
            <BlogContent content={post.content} />
            <CommentSection postId={post.id} initialComments={comments} />
          </article>
        </div>
      </div>

      {/* Recommended Articles */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Articles recommandés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedPosts.map((recPost) => (
            <RecommendedCard key={recPost.id} post={recPost} />
          ))}
        </div>
      </section>
    </>
  );
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background pt-34">
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailContent slug={slug} />
      </Suspense>
    </div>
  );
};

export default BlogDetailPage;
