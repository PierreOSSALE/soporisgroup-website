// prisma/seed-testimonials.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed des témoignages...");

  // Supprimer les témoignages existants pour éviter les doublons
  await prisma.testimonial.deleteMany({});

  // Créer les témoignages basés sur les projets
  const testimonials = await prisma.testimonial.createMany({
    data: [
      // Témoignage pour ÉLÉGANCE Mode
      {
        author: "Directrice ÉLÉGANCE",
        role: "Fondatrice",
        company: "ÉLÉGANCE Paris",
        content:
          "Soporis Group a parfaitement capturé l'essence de notre marque. La plateforme qu'ils ont développée est non seulement magnifique mais aussi incroyablement fonctionnelle. Le guide des tailles a révolutionné l'expérience de nos clientes et réduit considérablement les retours. Un travail exceptionnel réalisé en un temps record !",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        isActive: true,
      },

      // Témoignage pour Sérénité Spa
      {
        author: "Simon Ossale",
        role: "Gérant",
        company: "Sérénité Spa",
        content:
          "Soporis Group a transformé notre vision en une plateforme digitale exceptionnelle. Le site capture parfaitement l'essence de notre spa tout en offrant une expérience utilisateur fluide. L'interface d'administration nous permet de tout gérer facilement, des réservations aux produits.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        isActive: true,
      },

      // Témoignage pour Athrolis Fitness
      {
        author: "Coach Athrolis",
        role: "Fondateur",
        company: "Athrolis Coaching",
        content:
          "Soporis a livré un site parfait en seulement 2 jours ! L'interface capture exactement l'esprit Athrolis : professionnel, motivant et tourné vers les résultats. Les demandes de consultation ont explosé dès la mise en ligne.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
        isActive: true,
      },

      // Témoignage pour E-commerce Mode
      {
        author: "Marie Dupont",
        role: "Directrice",
        company: "Maison Élégance",
        content:
          "Soporis a transformé notre vision en réalité. Notre boutique en ligne dépasse toutes nos attentes en termes de design et de performance. L'expérience utilisateur est exceptionnelle et les résultats commerciaux parlent d'eux-mêmes.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        isActive: true,
      },

      // Témoignage pour Dashboard Analytics
      {
        author: "Thomas Martin",
        role: "CEO",
        company: "DataFlow Analytics",
        content:
          "L'interface conçue par Soporis a révolutionné la façon dont nos clients interagissent avec leurs données. Un travail remarquable ! La plateforme est à la fois puissante et intuitive, ce qui est rare dans notre secteur.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        isActive: true,
      },

      // Témoignage pour Boutique Santé & Bien-être
      {
        author: "Directeur Commercial",
        role: "Directeur",
        company: "Boutique Santé+",
        content:
          "Soporis Group a réalisé un travail exceptionnel en un temps record. Leur plateforme e-commerce a transformé notre activité en ligne. Le système de gestion des stocks, le suivi des commandes et l'intégration des paiements locaux sont parfaitement adaptés à notre marché.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
        isActive: true,
      },
    ],
  });

  console.log(`✅ ${testimonials.count} témoignages créés avec succès !`);

  // Vérifier que tous les témoignages sont correctement créés
  const createdTestimonials = await prisma.testimonial.findMany({
    select: { author: true, company: true, rating: true },
  });

  console.log("📋 Témoignages créés :");
  createdTestimonials.forEach((testimonial) => {
    console.log(
      `  - ${testimonial.author} (${testimonial.company}) - ${testimonial.rating}/5`
    );
  });
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed des témoignages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
