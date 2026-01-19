// components/admin/blog/BlogCategoryBadge.tsx
interface BlogCategoryBadgeProps {
  category: string;
}

const BlogCategoryBadge = ({ category }: BlogCategoryBadgeProps) => {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "design":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "technique":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "business":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "seo":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "marketing":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
      case "développement":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
        category
      )}`}
    >
      {category}
    </span>
  );
};

export default BlogCategoryBadge;
