import type { Metadata } from "next";
import { HomeClient } from "./home-client";

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      {/* On appelle le composant client qui contient les animations */}
      <HomeClient />
    </>
  );
}
