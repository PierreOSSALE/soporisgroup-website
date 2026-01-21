// app/sitemap.ts
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma"; // Import direct ou via une action
import { getPublishedBlogPosts } from "@/lib/actions/blog.actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://soporisgroup.com";

  // 1. Pages statiques
  const staticPages = [
    "",
    "/services",
    "/realisations",
    "/contact",
    "/packs",
    "/blog",
    "/a-propos",
    "/rendez-vous",
    "/mentions-legales",
    "/politique-confidentialite",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("monthly" as const),
    priority: route === "" ? 1.0 : 0.7,
  }));

  // 2. Articles de Blog dynamiques
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedBlogPosts();
    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error(e);
  }

  // 3. RÉALISATIONS dynamiques (Ajout crucial)
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.project.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    projectEntries = projects.map((project) => ({
      url: `${baseUrl}/realisations/${project.slug}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error(e);
  }

  return [...staticPages, ...blogEntries, ...projectEntries];
}
