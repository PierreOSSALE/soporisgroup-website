// components/blog/HeroPost.tsx
import Link from "next/link";
import BlogBadge from "./BlogBadge";

interface HeroPostProps {
  post: {
    slug: string;
    image: string;
    title: string;
    category: string;
  };
}

const HeroPost = ({ post }: HeroPostProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="relative rounded-2xl overflow-hidden aspect-4/3 group">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <BlogBadge variant="overlay">{post.category}</BlogBadge>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold leading-tight max-w-md">
            {post.title}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default HeroPost;
