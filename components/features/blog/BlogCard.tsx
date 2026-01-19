// components/blog/BlogCard.tsx
import Link from "next/link";
import { BlogPost } from "@prisma/client";
import AuthorInfo from "./AuthorInfo";

interface BlogCardProps {
  post: BlogPost & {
    author: {
      name: string;
      avatar: string;
    };
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="blog-card">
        <div className="aspect-4/3 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-1 pt-4">
          <h3 className="text-lg font-semibold text-foreground leading-snug mb-2 group-hover:text-primary/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <AuthorInfo author={post.author} readTime={post.readTime} />
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
