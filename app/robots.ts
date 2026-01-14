// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.soporisgroup.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin", // Bloque l'accès au dossier admin
        "/admin/",
        "/assistant", // Bloque l'accès au dossier assistant
        "/assistant/",
        "/api/", // Sécurité supplémentaire pour tes routes API
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
