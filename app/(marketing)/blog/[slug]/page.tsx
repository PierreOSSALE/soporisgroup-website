// app/(marketing)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
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
import Image from "next/image";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  // Déballer la promesse params
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  await incrementBlogPostViews(post.id);
  const recommendedPosts = await getRecommendedPosts(slug);

  // Récupérer les commentaires approuvés
  const comments = await getCommentsByPostId(post.id);

  return (
    <div className="min-h-screen bg-background pt-34">
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
          <span>
            {post.publishedAt?.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>•</span>
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
        <Image
          src={post.image}
          alt={post.title}
          className="w-full aspect-2/1 object-cover rounded-2xl"
        />
      </div>

      {/* Content Layout - EXACTEMENT comme React version */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
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

          {/* Article Content */}
          <article className="lg:col-span-9 order-1 lg:order-2">
            <BlogContent content={post.content} />

            {/* Comments Section */}
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
    </div>
  );
};

export default BlogDetailPage;
