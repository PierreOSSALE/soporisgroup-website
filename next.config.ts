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

  async rewrites() {
    return [
      // 1. ADMIN: admin.soporisgroup.com -> dossier /(admin)
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.soporisgroup.com" }],
        destination: "/admin/:path*",
      },
      // 2. ASSISTANT: assistance.soporisgroup.com -> dossier /(assistant)
      {
        source: "/:path*",
        has: [{ type: "host", value: "assistance.soporisgroup.com" }],
        destination: "/assistant/:path*",
      },
      // 3. MARKETING (Défaut): soporisgroup.com -> dossier /(marketing)
      {
        source: "/:path*",
        has: [{ type: "host", value: "soporisgroup.com" }],
        destination: "/marketing/:path*",
      },
    ];
  },
};

export default nextConfig;
