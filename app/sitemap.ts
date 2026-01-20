// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.soporisgroup.com";

  // Pages principales
  const staticPages = [
    "",
    "/services",
    "/realisations",
    "/contact",
    "/paks",
    "/blog",
    "/a-propos",
    "/rendez-vous",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Note : N'ajoute SURTOUT PAS /admin ou /assistant ici.

  return [...staticPages];
}
