// app/(marketing)/blog/page.tsx
import { Suspense } from "react";
import BlogClient from "./BlogClient";
import {
  getPublishedBlogPosts,
  getBlogCategories,
} from "@/lib/actions/blog.actions";

const BlogPage = async () => {
  const posts = await getPublishedBlogPosts();
  const categories = await getBlogCategories();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BlogClient initialPosts={posts} categories={categories} />
    </Suspense>
  );
};

export default BlogPage;
