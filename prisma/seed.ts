// prisma/seed-serenite-spa.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed du projet Sérénité Spa...");

  // Vérifier si le projet existe déjà
  const existingProject = await prisma.project.findUnique({
    where: { slug: "serenite-spa" },
  });

  if (existingProject) {
    console.log("⚠️ Projet Sérénité Spa déjà existant, mise à jour...");
    await prisma.project.update({
      where: { slug: "serenite-spa" },
      data: {
        title: "Sérénité Spa",
        subtitle:
          "Plateforme complète pour un spa de luxe avec réservations en ligne",
        category: "Sites Web",
        description:
          "Développement d'une plateforme web complète pour un spa haut de gamme, intégrant un système de réservation, une boutique e-commerce, et un back-office administrateur. Le site offre une expérience immersive avec des animations parallax et une interface élégante alignée sur l'univers du bien-être.",
        imageUrl:
          "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
        client: "Sérénité Spa Bien-Être",
        duration: "10 semaines",
        pack: "Premium",
        year: "2025",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "Next.js 14",
          "TypeScript",
          "Prisma",
          "Supabase",
          "PostgreSQL",
          "shadcn/ui",
          "Tailwind CSS",
          "Resend",
          "React Hook Form",
          "Framer Motion",
        ]),
        challenges: JSON.stringify([
          "Créer une expérience utilisateur immersive qui reflète l'atmosphère apaisante d'un spa",
          "Intégrer un système de réservation complexe avec gestion des créneaux horaires",
          "Développer une boutique e-commerce pour les produits de bien-être",
          "Mettre en place un back-office sécurisé pour la gestion du contenu et des réservations",
          "Optimiser les performances pour une expérience fluide sur mobile et desktop",
        ]),
        solutions: JSON.stringify([
          "Utilisation d'animations parallax subtiles et de transitions douces pour créer une atmosphère immersive",
          "Architecture modulaire avec Prisma pour la gestion des données de réservation",
          "Intégration de Stripe pour les paiements en ligne de la boutique",
          "Dashboard admin avec rôles utilisateurs (admin/assistant) pour la gestion du contenu",
          "Optimisation des images avec Next.js Image et mise en cache avancée",
        ]),
        results: JSON.stringify([
          "Lancement réussi avec 100% de satisfaction client",
          "Augmentation de 75% des réservations en ligne dans les 3 premiers mois",
          "Réduction de 60% du temps de gestion administrative",
          "Conversion de 35% sur la boutique e-commerce",
          "Score Core Web Vitals de 95+ sur toutes les pages",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h-800&fit=crop",
            caption: "Page d'accueil avec présentation immersive des services",
          },
          {
            url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h-800&fit=crop",
            caption:
              "Interface des soins avec filtres et descriptions détaillées",
          },
          {
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h-800&fit=crop",
            caption: "Boutique en ligne des produits Sérénité",
          },
          {
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h-800&fit=crop",
            caption: "Formulaire de contact avec validation en temps réel",
          },
          {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h-800&fit=crop",
            caption: "Dashboard admin pour la gestion des réservations",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Soporis Group a transformé notre vision en une plateforme digitale exceptionnelle. Le site capture parfaitement l'essence de notre spa tout en offrant une expérience utilisateur fluide. L'interface d'administration nous permet de tout gérer facilement, des réservations aux produits.",
          author: "Simon Ossale",
          role: "Gérant, Sérénité Spa",
        }),
      },
    });
  } else {
    // Créer le nouveau projet
    await prisma.project.create({
      data: {
        slug: "serenite-spa",
        title: "Sérénité Spa",
        subtitle:
          "Plateforme complète pour un spa de luxe avec réservations en ligne",
        category: "Sites Web",
        description:
          "Développement d'une plateforme web complète pour un spa haut de gamme, intégrant un système de réservation, une boutique e-commerce, et un back-office administrateur. Le site offre une expérience immersive avec des animations parallax et une interface élégante alignée sur l'univers du bien-être.",
        imageUrl:
          "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
        client: "Sérénité Spa Bien-Être",
        duration: "10 semaines",
        pack: "Premium",
        year: "2025",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "Next.js 14",
          "TypeScript",
          "Prisma",
          "Supabase",
          "PostgreSQL",
          "shadcn/ui",
          "Tailwind CSS",
          "Resend",
          "React Hook Form",
          "Framer Motion",
        ]),
        challenges: JSON.stringify([
          "Créer une expérience utilisateur immersive qui reflète l'atmosphère apaisante d'un spa",
          "Intégrer un système de réservation complexe avec gestion des créneaux horaires",
          "Développer une boutique e-commerce pour les produits de bien-être",
          "Mettre en place un back-office sécurisé pour la gestion du contenu et des réservations",
          "Optimiser les performances pour une expérience fluide sur mobile et desktop",
        ]),
        solutions: JSON.stringify([
          "Utilisation d'animations parallax subtiles et de transitions douces pour créer une atmosphère immersive",
          "Architecture modulaire avec Prisma pour la gestion des données de réservation",
          "Intégration de Stripe pour les paiements en ligne de la boutique",
          "Dashboard admin avec rôles utilisateurs (admin/assistant) pour la gestion du contenu",
          "Optimisation des images avec Next.js Image et mise en cache avancée",
        ]),
        results: JSON.stringify([
          "Lancement réussi avec 100% de satisfaction client",
          "Augmentation de 75% des réservations en ligne dans les 3 premiers mois",
          "Réduction de 60% du temps de gestion administrative",
          "Conversion de 35% sur la boutique e-commerce",
          "Score Core Web Vitals de 95+ sur toutes les pages",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h-800&fit=crop",
            caption: "Page d'accueil avec présentation immersive des services",
          },
          {
            url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h-800&fit=crop",
            caption:
              "Interface des soins avec filtres et descriptions détaillées",
          },
          {
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h-800&fit=crop",
            caption: "Boutique en ligne des produits Sérénité",
          },
          {
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h-800&fit=crop",
            caption: "Formulaire de contact avec validation en temps réel",
          },
          {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h-800&fit=crop",
            caption: "Dashboard admin pour la gestion des réservations",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Soporis Group a transformé notre vision en une plateforme digitale exceptionnelle. Le site capture parfaitement l'essence de notre spa tout en offrant une expérience utilisateur fluide. L'interface d'administration nous permet de tout gérer facilement, des réservations aux produits.",
          author: "Simon Ossale",
          role: "Gérant, Sérénité Spa",
        }),
      },
    });
  }

  console.log("✅ Projet Sérénité Spa ajouté/mis à jour avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed du projet Sérénité Spa:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
