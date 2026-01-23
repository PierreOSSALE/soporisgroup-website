// app/(marketing)/layout.tsx
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";
import ResourceLoader from "@/components/ResourceLoader"; // Nouveau composant client
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
        url: "/og-image.jpg",
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
    images: ["/twitter-image.jpg"],
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
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
};

// Schema.org JSON-LD pour SEO local et business
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
  // C'EST ICI QU'ON DIT QU'ON TRAVAILLE AVEC PARIS
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
    {
      "@type": "Country",
      name: "France",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Création de site web",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Design UI/UX",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Développement Next.js",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "SEO & Marketing Digital",
      },
    },
  ],
};

const criticalCSS = `
:root {
  --background: 210 20% 98%;
  --foreground: 220 40% 13%;
  --primary: 220 45% 18%;
  --primary-foreground: 210 40% 98%;
  --border: 220 20% 90%;
  --radius: 0.625rem;
  --soporis-gold: 38 80% 55%;
}

.dark {
  --background: 220 40% 8%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 220 45% 18%;
  --border: 220 35% 20%;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  min-height: 100vh;
  overflow-x: hidden;
  font-family: system-ui, sans-serif;
}

.bg-background { background-color: hsl(var(--background)); }
.text-foreground { color: hsl(var(--foreground)); }
.bg-primary { background-color: hsl(var(--primary)); }
.text-primary { color: hsl(var(--primary)); }
.border-border { border-color: hsl(var(--border)); }

.lcp-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.lcp-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-critical {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 80rem;
  z-index: 100;
  background: hsl(var(--card) / 0.9);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-gradient-gold {
  background: linear-gradient(135deg, hsl(38 80% 55%) 0%, hsl(42 85% 60%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

      {/* Préchargement des ressources critiques */}
      <link
        rel="preload"
        href="/_next/static/media/hero-bg.627e2ab7.webp"
        as="image"
        type="image/webp"
        imageSrcSet="
          /_next/static/media/hero-bg.627e2ab7.webp?w=640 640w,
          /_next/static/media/hero-bg.627e2ab7.webp?w=750 750w,
          /_next/static/media/hero-bg.627e2ab7.webp?w=828 828w,
          /_next/static/media/hero-bg.627e2ab7.webp?w=1080 1080w,
          /_next/static/media/hero-bg.627e2ab7.webp?w=1200 1200w,
          /_next/static/media/hero-bg.627e2ab7.webp?w=1920 1920w
        "
        imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
      />

      {/* Préconnexion aux CDNs critiques */}
      <link
        rel="preconnect"
        href="https://res.cloudinary.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://images.unsplash.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Préchargement des polices */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        as="style"
      />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href="https://soporisgroup.com" />
      <meta name="geo.region" content="FR-75" />
      <meta name="geo.placename" content="Paris" />
      <meta name="geo.position" content="48.8566;2.3522" />
      <meta name="ICBM" content="48.8566, 2.3522" />

      {/* Composant client pour le chargement asynchrone des ressources */}
      <ResourceLoader />

      <TooltipProvider>
        <div>
          <Header />
          <main>{children}</main>
          {/* <WhatsAppButton /> */}
          <Chatbot />
          <Footer />
          <Toaster />
          <Sonner />
        </div>
      </TooltipProvider>
    </>
  );
}
