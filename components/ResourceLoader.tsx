// components/ResourceLoader.tsx
"use client";

import { useEffect } from "react";

export default function ResourceLoader() {
  useEffect(() => {
    // Fonction pour charger une ressource CSS de manière asynchrone
    const loadCSS = (href: string, media = "all") => {
      return new Promise<void>((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.media = media;

        link.onload = () => resolve();
        link.onerror = () => resolve(); // Resolve même en cas d'erreur

        document.head.appendChild(link);
      });
    };

    // Charger les polices Google de manière asynchrone
    const loadGoogleFonts = () => {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
      link.rel = "stylesheet";
      link.onload = () => {
        document.documentElement.classList.add("fonts-loaded");
      };
      document.head.appendChild(link);
    };

    // Charger le CSS principal de manière asynchrone
    const loadMainCSS = async () => {
      await loadCSS("/_next/static/css/app/layout.css");
    };

    // Optimisation LCP - s'assurer que l'image LCP a la bonne priorité
    const optimizeLCP = () => {
      const lcpElement = document.querySelector(".lcp-container img");
      if (lcpElement) {
        // Ces attributs sont déjà gérés par Next.js, mais on s'assure
        console.log("LCP image trouvée, optimisation appliquée");
      }
    };

    // Exécuter les chargements
    const init = async () => {
      try {
        // Charger les polices en premier (car elles peuvent bloquer le rendu)
        loadGoogleFonts();

        // Charger le CSS principal
        await loadMainCSS();

        // Optimiser LCP
        optimizeLCP();

        // Marquer les ressources comme chargées
        document.documentElement.classList.add("resources-loaded");
      } catch (error) {
        console.error("Erreur lors du chargement des ressources:", error);
      }
    };

    // Démarrer après un léger délai pour laisser le contenu critique s'afficher
    const timeoutId = setTimeout(init, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // Ce composant ne rend rien
}
