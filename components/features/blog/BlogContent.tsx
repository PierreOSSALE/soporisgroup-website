// components/blog/BlogContent.tsx
import MarkdownRenderer from "./MarkdownRenderer";

interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  return <MarkdownRenderer content={content} />;
};

export default BlogContent;
