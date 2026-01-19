// components/blog/FeaturedPostItem.tsx
import Link from "next/link";

interface FeaturedPostItemProps {
  post: {
    slug: string;
    image: string;
    title: string;
  };
}

const FeaturedPostItem = ({ post }: FeaturedPostItemProps) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex gap-3 group py-3 border-b border-border last:border-b-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
    >
      <img
        src={post.image}
        alt={post.title}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />
      <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary/80 transition-colors line-clamp-3">
        {post.title}
      </p>
    </Link>
  );
};

export default FeaturedPostItem;
