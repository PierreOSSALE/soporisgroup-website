// lib/cloudinary-loader.ts
export default function cloudinaryLoader({
  src,
  width,
  quality = 85, // ⚡ QUALITÉ PAR DÉFAUT ICI
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  try {
    // URL Cloudinary
    if (src.includes("cloudinary.com")) {
      const cloudName = "db8hwgart"; // Votre cloud name

      // Extraire le chemin après upload/
      const uploadIndex = src.indexOf("/upload/") + 8;
      const path = src.substring(uploadIndex);

      // Paramètres d'optimisation
      const params = [
        "f_auto", // Format auto (WebP/AVIF)
        "q_auto", // Qualité auto
        "c_limit", // Ne pas agrandir
      ];

      return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},${params.join(",")}/${path}`;
    }

    // URL Unsplash
    if (src.includes("unsplash.com")) {
      const url = new URL(src);
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      return url.toString();
    }

    // Pour les images locales Next.js
    if (src.startsWith("/") && !src.startsWith("/_next/")) {
      // C'est une image locale, utiliser le loader par défaut
      return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
    }

    // Fallback: loader par défaut de Next.js pour autres URLs
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  } catch (error) {
    console.warn("Erreur dans cloudinaryLoader:", error);
    // Fallback sécurisé
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
  }
}
