//lib/proxy/proxy-config.ts
export const proxyConfig = {
  routes: [
    {
      source: "/admin/:path*",
      destination: "/admin/:path*",
      requiredPermissions: ["admin"],
      redirectTo: "/auth/signin",
    },
    {
      source: "/assistant/:path*",
      destination: "/assistant/:path*",
      requiredPermissions: ["assistant"],
      redirectTo: "/auth/signin",
    },
  ],
};
