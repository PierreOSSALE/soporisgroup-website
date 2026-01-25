import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { Providers } from "./providers";
import SessionManager from "@/components/auth/SessionManager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// app/layout.tsx

export const metadata: Metadata = {
  metadataBase: new URL("https://soporisgroup.com"),
  title: "Soporis Group",
  description: "Agence digitale experte en création de sites web.",
  icons: {
    icon: [
      // 1. URL ABSOLUE + VERSIONNAGE (?v=3)
      // C'est ça qui va forcer Google à oublier le logo LWS
      {
        url: "https://soporisgroup.com/favicon.ico?v=3",
        sizes: "any",
      },
      // 2. Ta version PNG (optionnelle si le .ico marche, mais on garde par sécurité)
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768963578/favicon_i6bx5v.png?v=3",
        type: "image/png",
      },
    ],
    // Même chose pour Apple
    apple: [
      {
        url: "https://soporisgroup.com/apple-touch-icon.png?v=3",
        sizes: "180x180",
      },
    ],
  },
  // On s'assure que les robots suivent bien
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Providers>
            <SessionManager />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
