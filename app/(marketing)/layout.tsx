// app/(marketing)/layout.tsx
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ThemeProvider } from "@/components/ThemeProvider";

// Métadonnées SEO optimisées pour un large reach
export const metadata: Metadata = {
  title: {
    default:
      "Soporis Group - Agence Web, Design UI/UX & Développement Sur Mesure",
    template: "%s | Soporis Group",
  },
  description:
    "Agence digitale experte en création de sites web performants, design UI/UX et développement sur mesure (Next.js/React). Transformez votre présence en ligne.",
  icons: {
    icon: "/img/favicon.png",
    apple: "/img/favicon.png",
  },
  keywords: [
    "agence web",
    "agence digitale",
    "création site internet",
    "développement web",
    "site web professionnel",
    "UI/UX design",
    "webdesign",
    "maquettage site web",
    "design d'interface",
    "expérience utilisateur",
    "Figma",
    "développeur React",
    "expert Next.js",
    "site web performant",
    "développement front-end",
    "application web",
    "PWA",
    "site vitrine",
    "landing page",
    "refonte site web",
    "site e-commerce",
    "audit SEO",
    "Paris",
    "Île-de-France",
    "freelance web",
    "consultant digital",
    "Soporis Group",
  ],
  authors: [{ name: "Soporis Group" }],
  creator: "Soporis Group",
  publisher: "Soporis Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.soporisgroup.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.soporisgroup.com",
    title: "Soporis Group - Agence Web & UI/UX à Paris",
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
    title: "Soporis Group - Agence Web & UI/UX à Paris",
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
    google: "g3ngolJzsl2jxzNEDfitRqxDzYSE2fosmg4540X7W4A",
    yandex: "fce5b5cdb1bf9fe7",
    yahoo: "A5EDE3A18D770726E733C6D65FC92C82",
  },
};

// Schema.org JSON-LD pour SEO local et business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Soporis Group",
  image: "https://www.soporisgroup.com/logo.png",
  "@id": "https://www.soporisgroup.com",
  url: "https://www.soporisgroup.com",
  telephone: "+21626315088",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Adresse à Paris",
    addressLocality: "Paris",
    postalCode: "75000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.linkedin.com/company/soporisgroup",
    "https://twitter.com/soporisgroup",
    "https://www.instagram.com/soporisgroup",
  ],
  areaServed: {
    "@type": "City",
    name: "Paris",
  },
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
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href="https://www.soporisgroup.com" />
      <meta name="geo.region" content="FR-75" />
      <meta name="geo.placename" content="Paris" />
      <meta name="geo.position" content="48.8566;2.3522" />
      <meta name="ICBM" content="48.8566, 2.3522" />
      {/* <Providers> */}
      <ThemeProvider defaultTheme="light" storageKey="soporis-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
            <Header />
            <main className="flex-1">{children}</main>
            {/* <WhatsAppButton /> */}
            <Chatbot />
            <Footer />
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </ThemeProvider>
      {/* </Providers> */}
    </div>
  );
}
