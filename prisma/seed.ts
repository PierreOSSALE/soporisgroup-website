import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔨 Début du seeding...");
  console.log("🧹 Nettoyage des tables...");

  await prisma.testimonial.deleteMany({});

  console.log("📦 Création des témoignages...");
  const testimonials = [
    {
      author: "Marie Dubois",
      role: "Fondatrice",
      company: "Startup Tech",
      content:
        "Soporis Group a transformé notre vision en une plateforme web exceptionnelle. Leur expertise en UI/UX a vraiment fait la différence.",
      rating: 5,
      isActive: true,
    },
    {
      author: "Thomas Martin",
      role: "Directeur Marketing",
      company: "E-com Solutions",
      content:
        "Un travail remarquable sur notre site e-commerce. Les conversions ont augmenté de 40% depuis la refonte. Je recommande vivement !",
      rating: 5,
      isActive: true,
    },
    {
      author: "Sophie Laurent",
      role: "CEO",
      company: "Agence Immobilière Lux",
      content:
        "Professionnalisme et créativité au rendez-vous. Notre nouveau site reflète parfaitement notre image de marque premium.",
      rating: 5,
      isActive: true,
    },
    {
      author: "Antoine Bercot",
      role: "Entrepreneur",
      company: "Innov'Action",
      content:
        "Excellent accompagnement du début à la fin. L'équipe a su comprendre nos besoins et proposer des solutions innovantes.",
      rating: 5,
      isActive: true,
    },
  ];

  console.log("Seed started...");

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  console.log("Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
