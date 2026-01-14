// app/(marketing)/layout.tsx
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
    "Soporis",
    "agence web Tunis",
    "agence web Paris",
    "agence digitale Tunis",
    "agence digitale Paris",
    "création site internet Tunis",
    "création site internet Paris",
    "développement web Tunis",
    "développement web Paris",
    "Meilleur agence web Tunis",
    "site web professionnel Tunis",
    "UI/UX design Tunis",
    "UI/UX design Paris",
    "webdesign Tunis",
    "maquettage site web Tunis",
    "design d'interface Tunis",
    "expérience utilisateur Tunis",
    "Figma Tunis",
    "développeur React Tunis",
    "expert Next.js Tunis",
    "site web performant Tunis",
    "développement front-end Tunis",
    "application web Tunis",
    "PWA Tunis",
    "site vitrine Tunis",
    "landing page Tunis",
    "refonte site web Tunis",
    "site e-commerce Tunis",
    "audit SEO Tunis",
    "Tunisie",
    "Afrique",
    "Congo Brazzaville",
    "Brazzaville",
    "Meilleur agence web Brazzaville",
    "Meilleur site web Brazzaville",
    "Top agence web Congo",
    "top site web Congo",
    "Top agence web Tunisie",
    "top site web Tunisie",
    "Top agence web Paris",
    "top site web Paris",
    "agence web Congo",
    "agence digitale Congo",
    "création site internet Congo",
    "développement web Congo",
    "site web professionnel Congo",
    "UI/UX design Congo",
    "webdesign Congo",
    "maquettage site web Congo",
    "design d'interface Congo",
    "expérience utilisateur Congo",
    "Figma Congo",
    "développeur React Congo",
    "expert Next.js Congo",
    "site web performant Congo",
    "développement front-end Congo",
    "application web Congo",
    "PWA Congo",
    "site vitrine Congo",
    "landing page Congo",
    "refonte site web Congo",
    "site e-commerce Congo",
    "audit SEO Congo",
    "Cameroun",
    "Kinshasa",
    "Nigeria",
    "Côte d'Ivoire",
    "Maroc",
    "Sénégal",
    "Belgique",
    "Luxembourg",
    "Développement web Afrique",
    "Agence digitale Afrique",
    "Création site internet Afrique",
    "UI/UX design Afrique",
    "Webdesign Afrique",
    "Soporis Group Afrique",
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.soporisgroup.com",
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
    </div>
  );
}
