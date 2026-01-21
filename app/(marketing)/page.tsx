// app/(marketing)/page.tsx
import type { Metadata } from "next";
import HomeClient from "./home-client";

// Métadonnées spécifiques à la page d'accueil
export const metadata: Metadata = {
  title: "Agence Web & UI/UX à Paris | Soporis Group",
  description:
    "Soporis Group : solutions web et UI/UX pour transformer vos idées en expériences digitales performantes. Conception de sites web modernes et interfaces utilisateur intuitives.",
  keywords: [
    "agence web Paris",
    "création site web",
    "UI/UX design",
    "développement web",
    "refonte site internet",
  ],
  openGraph: {
    title: "Agence Web & UI/UX à Paris | Soporis Group",
    description: "Transformez vos idées en expériences digitales performantes",
  },
};

// Schema.org pour la page d'accueil
const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Page d'accueil Soporis Group",
  description:
    "Agence spécialisée en développement web et UI/UX design à Paris",
  publisher: {
    "@type": "ProfessionalService",
    name: "Soporis Group",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService", // Plus précis pour une agence
  name: "Soporis Group",
  alternateName: "Soporis Agence Web",
  description:
    "Agence web spécialisée en développement sur mesure et UI/UX design à Paris.",
  url: "https://soporisgroup.com",
  logo: "https://res.cloudinary.com/db8hwgart/image/upload/v1768963578/favicon_i6bx5v.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "48.8566", // Optionnel : Coordonnées précises
    longitude: "2.3522",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.linkedin.com/company/votre-page",
    "https://www.instagram.com/votre-page",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient />
    </>
  );
}
