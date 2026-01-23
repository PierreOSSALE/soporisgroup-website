// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/db8hwgart/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/webp"],
    dangerouslyAllowSVG: false,
  },

  // Compression activée
  compress: true,

  // Optimisation des imports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/*",
      "@supabase/*",
    ],
  },

  typedRoutes: true,
  serverExternalPackages: ["@prisma/client"],

  async rewrites() {
    return [];
  },
};

export default nextConfig;
