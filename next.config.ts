// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      {
        protocol: "https",
        hostname: "ttlab-academy-website.s3.ap-southeast-1.amazonaws.com",
      },
      { protocol: "https", hostname: "store.webkul.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },

  typedRoutes: true,

  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // 🔥 AJOUTE CES REWRITES POUR LES SOUS-DOMAINES
  async rewrites() {
    return [
      // Pour admin.soporisgroup.com → /admin/*
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.soporisgroup.com",
          },
        ],
        destination: "/admin/:path*",
      },
      // Pour assistance.soporisgroup.com → /assistant/*
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "assistance.soporisgroup.com",
          },
        ],
        destination: "/assistant/:path*",
      },
      // Pour soporisgroup.com → /marketing/* (site public)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "soporisgroup.com",
          },
        ],
        destination: "/marketing/:path*",
      },
      // Pour www.soporisgroup.com → /marketing/*
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.soporisgroup.com",
          },
        ],
        destination: "/marketing/:path*",
      },
    ];
  },

  // 🔥 CONFIGURATION DU PROXY POUR LA PROTECTION DES ROUTES
  async redirects() {
    return [
      // Redirection depuis les anciennes URLs vers les nouvelles
      {
        source: "/login",
        destination: "/auth/signin",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth/signup",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
