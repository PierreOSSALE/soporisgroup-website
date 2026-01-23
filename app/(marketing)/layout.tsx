// app/(marketing)/layout.tsx
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import MarketingClientLayout from "./MarketingClientLayout";

// Métadonnées SEO optimisées pour un large reach
export const metadata: Metadata = {
  title: {
    default:
      "Soporis Group - Agence Web, Design UI/UX & Développement Sur Mesure",
    template: "%s | Soporis Group",
  },
  description:
    "Agence digitale experte en création de sites web performants, design UI/UX et développement sur mesure (Next.js/React). Transformez votre présence en ligne.",
  keywords: [
    "agence web 3.0",
    "développement Next.js",
    "design système UI/UX",
    "création application web",
    "expert React & Prisma",
    "transformation digitale Afrique",
    "Soporis Group",
    "Soporis",
    "agence digitale Paris Tunis",
    "agence Afrique",
    "développement sur mesure",
    "performance web Core Web Vitals",
    "conception produit digital",
    "SaaS development agency",
  ],
  authors: [
    {
      name: "Simon Ossale",
      url: "https://www.linkedin.com/in/ossale-simon-pierre",
    },
    { name: "Pierre Ossale" },
  ],
  creator: "Soporis Group",
  publisher: "Soporis Group",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://soporisgroup.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://soporisgroup.com",
    title: "Soporis Group - Agence Web & UI/UX à Tunis",
    description:
      "Solutions Web et UI/UX pour transformer vos idées en expériences digitales performantes",
    siteName: "Soporis Group",
    images: [
      {
        // URL ABSOLUE recommandée
        url: "https://soporisgroup.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Soporis Group - Agence Web & UI/UX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soporis Group - Agence Web & UI/UX à Tunis et Paris",
    description:
      "Solutions Web et UI/UX pour transformer vos idées en expériences digitales performantes",
    images: ["https://soporisgroup.com/twitter-image.jpg"],
    creator: "@soporisgroup",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD inchangé (tu peux le laisser)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Soporis Group",
  image: "https://soporisgroup.com/logo.png",
  "@id": "https://soporisgroup.com",
  url: "https://soporisgroup.com",
  telephone: "+21626315088",
  priceRange: "€,FCFA,TND",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tunis",
    streetAddress: "Lafayette, Centre Ville",
    postalCode: "1002",
    addressCountry: "TN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.8065,
    longitude: 10.1815,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/soporisgroup",
    "https://twitter.com/soporisgroup",
    "https://www.instagram.com/soporisgroup",
  ],
  areaServed: [
    {
      "@type": "City",
      name: "Tunis",
      "@id": "https://fr.wikipedia.org/wiki/Tunis",
    },
    {
      "@type": "City",
      name: "Paris",
      "@id": "https://fr.wikipedia.org/wiki/Paris",
    },
    { "@type": "Country", name: "France" },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Création de site web" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Design UI/UX" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Développement Next.js" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "SEO & Marketing Digital" },
    },
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Preconnects utiles — réduit latence Cloudinary / Google Fonts */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin=""
      />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />

      <Header />

      <MarketingClientLayout>
        <main>{children}</main>
      </MarketingClientLayout>

      <Footer />
    </>
  );
}
