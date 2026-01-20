// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // ... garde tes autres hostnames ici
    ],
  },

  typedRoutes: true,
  // Indispensable pour éviter les erreurs de compilation avec Prisma en Server Components
  serverExternalPackages: ["@prisma/client"],

  // Supprimez les rewrites de sous-domaines
  async rewrites() {
    return [];
  },
};

export default nextConfig;
