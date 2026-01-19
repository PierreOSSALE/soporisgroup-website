// components/blog/BlogBadge.tsx
interface BlogBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "overlay";
}

const BlogBadge = ({ children, variant = "default" }: BlogBadgeProps) => {
  if (variant === "overlay") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-900 backdrop-blur-sm">
        {children}
      </span>
    );
  }

  // Style par défaut
  return (
    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
      {children}
    </span>
  );
};

export default BlogBadge;
