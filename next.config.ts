// next.config.ts - OPTION AVEC LOADER DÉFAUT POUR IMAGES LOCALES
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/db8hwgart/**",
      },
    ],

    // ⚡ OPTIMISATIONS PERFORMANCE
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Formats supportés
    formats: ["image/webp"],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/*"],
  },

  typedRoutes: true,
  serverExternalPackages: ["@prisma/client"],

  async rewrites() {
    return [];
  },
};

export default nextConfig;
