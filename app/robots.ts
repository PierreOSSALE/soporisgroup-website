// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://soporisgroup.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin", // Dossier admin
          "/admin-blog", // Routes spécifiques admin
          "/admin-projects",
          "/assistant", // Dossier assistant
          "/api", // Toutes les routes API
          "/auth", // Routes d'authentification (callback, etc.)
          "/signin", // Page de connexion
          "/_next", // Fichiers internes Next.js
          "/annuler-rdv", // Page utilitaire sans valeur SEO
        ],
      },
      {
        // On bloque spécifiquement les robots d'IA pour tes outils internes
        userAgent: ["GPTBot", "CCBot"],
        disallow: ["/admin", "/assistant", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
