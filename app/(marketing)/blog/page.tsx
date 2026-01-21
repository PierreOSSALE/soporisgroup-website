// app/(marketing)/blog/page.tsx
import { Suspense } from "react";
import BlogClient from "./BlogClient";
import {
  getPublishedBlogPosts,
  getBlogCategories,
} from "@/lib/actions/blog.actions";
import { Metadata } from "next";
import BlogListSkeleton from "@/components/skeletons/BlogListSkeleton";

export const metadata: Metadata = {
  title: "Blog Digital & Design | Soporis Group",
  description:
    "Découvrez nos derniers articles sur le développement Next.js, l'UI/UX Design et les stratégies digitales pour booster votre présence en France et en Afrique.",
  openGraph: {
    title: "Le Blog de Soporis Group | Expertise Digitale",
    description: "Conseils d'experts, tutoriels tech et actualités du design.",
    url: "https://soporisgroup.com/blog",
    siteName: "Soporis Group",
    images: [
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482768/soporis_blog_ncvqcp.png", // Crée une image générique pour ton blog
        width: 1200,
        height: 630,
        alt: "Soporis Group Blog - Expertise Web & Design",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soporis Group Blog",
    description: "Actualités Tech & Design par Soporis Group.",
  },
};
const BlogPage = async () => {
  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCategories(),
  ]);
  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogClient initialPosts={posts} categories={categories} />
    </Suspense>
  );
};

export default BlogPage;
