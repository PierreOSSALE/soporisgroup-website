// components/blog/RecommendedCard.tsx
import Link from "next/link";
import BlogBadge from "./BlogBadge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface RecommendedCardProps {
  post: {
    slug: string;
    image: string;
    title: string;
    excerpt: string;
    category: string;
  };
}

const RecommendedCard = ({ post }: RecommendedCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="blog-card">
        <div className="aspect-4/3 overflow-hidden relative">
          <OptimizedImage
            src={post.image}
            alt={post.title}
            fill
            className="transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute top-3 left-3">
            <BlogBadge variant="overlay">{post.category}</BlogBadge>
          </div>
        </div>
        <div className="p-1 pt-4">
          <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default RecommendedCard;
