// components/blog/AuthorInfo.tsx
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface AuthorInfoProps {
  author: {
    name: string;
    avatar: string;
  };
  readTime: number;
  showAvatar?: boolean;
}

const AuthorInfo = ({
  author,
  readTime,
  showAvatar = true,
}: AuthorInfoProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {showAvatar && (
        <OptimizedImage
          src={author.avatar}
          alt={author.name}
          width={24}
          height={24}
          isAvatar
          className="w-6 h-6 rounded-full"
        />
      )}
      <span className="font-medium text-foreground">{author.name}</span>
      <span>•</span>
      <span>{readTime} min read</span>
    </div>
  );
};

export default AuthorInfo;
