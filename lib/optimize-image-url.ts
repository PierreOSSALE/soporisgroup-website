// lib/optimize-image-url.ts
export function optimizeImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    isAvatar?: boolean;
  },
): string {
  try {
    const { width, height, quality = 85, isAvatar = false } = options || {};
    const urlObj = new URL(url);

    // OPTIMISATION CLOUDINARY
    if (urlObj.hostname.includes("cloudinary.com")) {
      const pathname = urlObj.pathname;
      const parts = pathname.split("/upload/");

      if (parts.length === 2) {
        const transformations = [];

        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);
        if (isAvatar) {
          transformations.push("c_fill,g_face", "q_auto:best", "f_auto");
        } else {
          transformations.push("c_limit", "q_auto:good", "f_auto");
        }

        return `https://res.cloudinary.com/db8hwgart/image/upload/${transformations.join(",")}/${parts[1]}`;
      }
    }

    // OPTIMISATION UNSPLASH
    if (urlObj.hostname.includes("unsplash.com")) {
      if (width) urlObj.searchParams.set("w", width.toString());
      if (height) urlObj.searchParams.set("h", height.toString());
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", isAvatar ? "facearea" : "crop");
      urlObj.searchParams.set("q", quality.toString());
      return urlObj.toString();
    }

    // Pour les autres URLs, retourner l'original
    return url;
  } catch (error) {
    console.warn("Erreur d'optimisation URL:", url, error);
    return url;
  }
}
