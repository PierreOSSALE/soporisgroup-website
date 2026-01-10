// app/(marketing)/blog/page.tsx
import { getPublishedBlogArticles } from "@/lib/actions/blog.actions";
import BlogClient from "./BlogClient"; // <-- ton composant client

export default async function BlogPage() {
  const articles = await getPublishedBlogArticles();

  return <BlogClient articles={articles ?? []} />;
}
