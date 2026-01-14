// app/(marketing)/blog/page.tsx
import { Metadata } from "next";
import { getPublishedBlogArticles } from "@/lib/actions/blog.actions";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog & Actualités Digitales | Soporis Group",
  description:
    "Découvrez nos articles sur le développement web, le design UI/UX et les stratégies digitales pour booster votre entreprise.",
  openGraph: {
    title: "Blog Soporis Group - Expertise Web & Design",
    description: "Conseils d'experts pour vos projets digitaux.",
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await getPublishedBlogArticles();

  return <BlogClient articles={articles ?? []} />;
}
