// components/admin/blog/BlogStatusBadge.tsx
interface BlogStatusBadgeProps {
  published: boolean;
  publishedAt: Date | null;
}

const BlogStatusBadge = ({ published, publishedAt }: BlogStatusBadgeProps) => {
  if (!published) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        Brouillon
      </span>
    );
  }

  if (published && publishedAt) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Publié
      </span>
    );
  }

  return null;
};

export default BlogStatusBadge;
