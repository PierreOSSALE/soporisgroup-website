// app/(marketing)/contact/page.tsx
import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contactez Soporis Group | Devis Gratuit sous 24h",
  description:
    "Un projet web à Tunis, Paris ou en Afrique ? Contactez nos experts Next.js et UI/UX pour un devis gratuit et personnalisé.",
  openGraph: {
    title: "Contactez Soporis Group - Expertise Digitale",
    description: "Réponse rapide pour vos projets de développement et design.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
