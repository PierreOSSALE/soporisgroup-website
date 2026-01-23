// app/layout.tsx
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

export const metadata: Metadata = {
  title: "Soporis Group",
  description: "Agence digitale experte en création de sites web.",
  metadataBase: new URL("https://soporisgroup.com"),
  icons: {
    icon: [
      { url: "/favicon.ico" }, // Le fichier physique que vous allez ajouter
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768963578/favicon_i6bx5v.png",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/icon-192.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        rel: "icon",
        url: "/icon-512.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
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
