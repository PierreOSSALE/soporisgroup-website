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
    icon: "/img/favicon.png",
    apple: "/img/favicon.png",
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
