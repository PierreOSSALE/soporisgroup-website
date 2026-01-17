// prisma/seed-ecommerce-sante-bienetre.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed du projet E-commerce Santé & Bien-être...");

  // Vérifier si le projet existe déjà
  const existingProject = await prisma.project.findUnique({
    where: { slug: "ecommerce-sante-bienetre" },
  });

  const projectData = {
    slug: "ecommerce-sante-bienetre",
    title: "Boutique Santé & Bien-être",
    subtitle:
      "Plateforme e-commerce complète pour produits médicaux et de bien-être",
    category: "E-commerce",
    description:
      "Développement d'une plateforme e-commerce avancée spécialisée dans les produits de santé, de bien-être et médicaux. Le site inclut un catalogue de plus de 100 produits avec gestion des stocks, un système de commande avec suivi en temps réel, un blog éducatif, et un tableau de bord client complet. Optimisé pour le marché africain avec paiements locaux et livraison au Sénégal.",
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    client: "Boutique Santé+ (Confidentiel)",
    duration: "4 semaines",
    pack: "Enterprise",
    year: "2025",
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
      "Stripe / PayDunya",
      "LWS (Nom de domaine)",
      "Framer Motion",
      "React Query",
    ]),
    challenges: JSON.stringify([
      "Gérer un catalogue complexe de produits médicaux avec variantes (tailles, couleurs)",
      "Implémenter un système de paiement adapté au marché africain",
      "Créer un système de suivi de commande en temps réel",
      "Développer un blog éducatif intégré avec gestion de contenu",
      "Assurer la sécurité des données clients et des informations médicales",
      "Optimiser les performances pour une base de données de plus de 500 produits",
      "Adapter l'interface pour une utilisation mobile-first en Afrique",
    ]),
    solutions: JSON.stringify([
      "Architecture modulaire avec Prisma ORM pour une gestion efficace des produits et stocks",
      "Intégration de solutions de paiement locales (PayDunya) en plus de Stripe",
      "Système de notifications par email et SMS pour le suivi des commandes",
      "CMS intégré pour le blog avec éditeur WYSIWYG",
      "Chiffrement des données sensibles et conformité RGPD",
      "Pagination avancée et recherche full-text avec Supabase",
      "Design responsive optimisé pour les connexions mobiles",
    ]),
    results: JSON.stringify([
      "Site livré en 4 semaines avec toutes les fonctionnalités complexes demandées",
      "Catalogue de 100+ produits parfaitement organisé avec gestion des stocks",
      "Taux de conversion de 3.5% grâce à l'UX optimisée",
      "Réduction de 60% du temps de gestion des commandes",
      "Satisfaction client de 98% pour l'expérience d'achat",
      "Support de 3 méthodes de paiement locales adaptées au marché",
      "Base de clients active de 500+ utilisateurs en 2 mois",
    ]),
    screenshots: JSON.stringify([
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485977/vitalis_home_axnsf8.png",
        caption: "Page hero avec bannière promotionnelle",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485975/vitalis_home_2_evrzei.png",
        caption: "Page hero avec produits populaires",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485980/vitalis_about_kgxs5q.png",
        caption: "Page 'À propos' présentant la mission",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485979/vitalis_about_2_oogwti.png",
        caption: "Page 'À propos' présentant la mission suite",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485973/vitalis_contact_dcz3yv.png",
        caption: "Formulaire de contact avancé avec tickets de support",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768486402/vitalis_produits_qmrnty.png",
        caption: "Page 'Tous les produits' avec filtres avancés et pagination",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768486403/vitalis_produits_detail_q38yk1.png",
        caption:
          "Page détail produit avec galerie, descriptions et recommandations",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485977/vitalis_blog_rhis1j.png",
        caption: "Blog éducatif avec articles sur la santé et le bien-être",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485975/vitalis_blog2_rreoyr.png",
        caption:
          "Suite Blog éducatif avec articles sur la santé et le bien-être",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485973/vitalis_suivi_dmvjhl.png",
        caption:
          "Page suivi de commande avec étapes de livraison en temps réel",
      },
      {
        url: "https://res.cloudinary.com/db8hwgart/image/upload/v1768485978/vitalis_category_m6iyrk.png",
        caption: "Sidebar des catégories avec filtres hiérarchiques",
      },
    ]),
    testimonial: JSON.stringify({
      quote:
        "Soporis Group a réalisé un travail exceptionnel en un temps record. Leur plateforme e-commerce a transformé notre activité en ligne. Le système de gestion des stocks, le suivi des commandes et l'intégration des paiements locaux sont parfaitement adaptés à notre marché. Leur expertise technique et leur compréhension des besoins spécifiques du secteur de la santé ont fait toute la différence.",
      author: "Directeur Commercial",
      role: "Boutique Santé+",
    }),
  };

  if (existingProject) {
    console.log(
      "⚠️ Projet E-commerce Santé & Bien-être déjà existant, mise à jour..."
    );
    await prisma.project.update({
      where: { slug: "ecommerce-sante-bienetre" },
      data: projectData,
    });
  } else {
    // Créer le nouveau projet
    await prisma.project.create({
      data: projectData,
    });
  }

  console.log(
    "✅ Projet E-commerce Santé & Bien-être ajouté/mis à jour avec succès !"
  );
}

main()
  .catch((e) => {
    console.error(
      "❌ Erreur lors du seed du projet E-commerce Santé & Bien-être:",
      e
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
