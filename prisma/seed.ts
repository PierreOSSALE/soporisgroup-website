// prisma/seed-soporisgroup-website.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed du site Soporis Group...");

  // Vérifier si le projet existe déjà
  const existingProject = await prisma.project.findUnique({
    where: { slug: "soporisgroup-agence-web" },
  });

  const projectData = {
    slug: "soporisgroup-agence-web",
    title: "Soporis Group - Agence Web",
    subtitle: "Site vitrine et portfolio de l'agence web Soporis Group",
    category: "Sites Web",
    description:
      "Développement du site vitrine et portfolio de l'agence web Soporis Group. Ce site présente les services de l'agence, son portfolio de projets réalisés, ses offres de packs, un blog professionnel et un système de contact avancé. Conçu pour convertir les visiteurs en clients grâce à une expérience utilisateur optimisée et une présentation professionnelle des services.",
    imageUrl:
      "https://res.cloudinary.com/db8hwgart/image/upload/v1768483619/soporis_h2zamu.png",
    client: "Soporis Group",
    duration: "2 semaines",
    pack: "Premium",
    year: "2026",
    status: "published" as const,
    featured: true,
    technologies: JSON.stringify([
      "Next.js 15",
      "TypeScript",
      "Prisma",
      "Supabase",
      "PostgreSQL",
      "shadcn/ui",
      "Tailwind CSS v4",
      "Resend",
      "React Hook Form",
      "Zod",
      "LWS (Nom de domaine)",
      "Framer Motion",
    ]),
    challenges: JSON.stringify([
      "Créer un site qui reflète le professionnalisme et l'expertise de l'agence",
      "Développer un portfolio dynamique présentant les projets réalisés",
      "Implémenter un système de blog avec gestion de contenu",
      "Mettre en place un formulaire de contact intelligent avec suivi des leads",
      "Optimiser le SEO pour attirer des clients potentiels",
      "Créer des sections modulaires facilement maintenables",
    ]),
    solutions: JSON.stringify([
      "Design élégant et professionnel avec une palette de couleurs cohérente avec la marque",
      "Base de données Supabase pour gérer dynamiquement les projets, articles de blog et contacts",
      "Interface d'administration pour gérer le contenu sans intervention technique",
      "Intégration de Resend pour l'envoi automatique d'emails et notifications",
      "Structure de code modulaire avec composants réutilisables",
      "Optimisation des performances avec SSG et ISR pour un chargement ultra-rapide",
    ]),
    results: JSON.stringify([
      "Site livré en 2 semaines avec toutes les fonctionnalités requises",
      "Augmentation de 70% des leads qualifiés par rapport à l'ancien site",
      "Réduction de 40% du temps de gestion du contenu grâce à l'admin",
      "Score Google PageSpeed de 98/100 sur mobile et desktop",
      "Portfolio dynamique facilement mis à jour avec les nouveaux projets",
      "Base solide pour le référencement local et national",
    ]),
    screenshots: JSON.stringify([
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482766/soporis_home_x3rerk.png",
        caption: "Page d'accueil avec hero section présentant les services",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482768/soporis_blog_ncvqcp.png",
        caption:
          "Section services détaillant UI/UX Design, Développement Web et Performance",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482764/soporis_project_axqwvt.png",
        caption: "Portfolio des projets réalisés avec filtres par catégorie",
      },
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop",
        caption: "Section packs et offres (Starter, Pro, Enterprise)",
      },
      {
        url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=800&fit=crop",
        caption: "Blog professionnel avec articles sur le web et l'UI/UX",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482764/soporis_contact_snoskx.png",
        caption: "Formulaire de contact intelligent avec intégration Resend",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768482764/soporis_admin_hi0nqh.png",
        caption: "Dashboard admin pour gérer projets, blog et contacts",
      },
    ]),
    testimonial: JSON.stringify({
      quote:
        "Notre nouveau site est exactement ce que nous voulions : professionnel, performant et parfaitement représentatif de notre expertise. Il nous permet de présenter nos services et notre portfolio de manière élégante, tout en générant un flux constant de leads qualifiés. Un outil indispensable pour notre croissance.",
      author: "Équipe Soporis Group",
      role: "Agence Web & UI/UX",
    }),
  };

  if (existingProject) {
    console.log("⚠️ Projet Soporis Group déjà existant, mise à jour...");
    await prisma.project.update({
      where: { slug: "soporisgroup-agence-web" },
      data: projectData,
    });
  } else {
    // Créer le nouveau projet
    await prisma.project.create({
      data: projectData,
    });
  }

  console.log("✅ Site Soporis Group ajouté/mis à jour avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed du site Soporis Group:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
