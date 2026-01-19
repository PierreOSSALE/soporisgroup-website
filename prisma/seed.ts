// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔨 Début du seeding...");

  // Nettoyer les tables (optionnel - commenter si vous voulez garder les données existantes)
  console.log("🧹 Nettoyage des tables...");

  await prisma.service.deleteMany({});

  // Ajouter cette partie dans le fichier prisma/seed.ts

  console.log("🛠️ Création des services...");
  const services = [
    {
      title: "UI/UX Design",
      description:
        "Créez des interfaces modernes et intuitives qui engagent vos utilisateurs et renforcent votre image de marque.",
      icon: "Palette",
      price: "À partir de 1200€",
      slug: "ui-ux-design",
      color: "#F59E0B", // Amber-500
      order: 1,
      isActive: true,
      features: [
        "Interfaces modernes et élégantes",
        "Parcours utilisateurs optimisés",
        "Design centré utilisateur",
        "Prototypes interactifs",
        "Design system complet",
      ],
    },
    {
      title: "Développement Web",
      description:
        "Développement de sites et applications web performants, adaptés à vos besoins avec les technologies modernes.",
      icon: "Code2",
      price: "À partir de 1800€",
      slug: "developpement-web",
      color: "#3B82F6", // Blue-500
      order: 2,
      isActive: true,
      features: [
        "Sites vitrines professionnels",
        "Applications web sur mesure",
        "Landing pages performantes",
        "Intégration CMS",
        "Responsive design parfait",
      ],
    },
    {
      title: "Performance & Conversion",
      description:
        "Optimisez vos performances web pour améliorer votre référencement et maximiser vos conversions.",
      icon: "Gauge",
      price: "À partir de 800€/mois",
      slug: "performance-conversion",
      color: "#10B981", // Emerald-500
      order: 3,
      isActive: true,
      features: [
        "Audit de performance complet",
        "Optimisation SEO avancée",
        "Analytics & reporting",
        "Tests A/B & conversion",
        "Maintenance technique",
      ],
    },
    {
      title: "E-commerce",
      description:
        "Développez votre boutique en ligne avec des solutions e-commerce complètes et sécurisées.",
      icon: "ShoppingCart",
      price: "À partir de 2500€",
      slug: "e-commerce",
      color: "#8B5CF6", // Violet-500
      order: 4,
      isActive: true,
      features: [
        "Catalogue produits illimité",
        "Paiements sécurisés",
        "Gestion des stocks",
        "Suivi des commandes",
        "Marketing automatisé",
      ],
    },
    {
      title: "SEO & Marketing Digital",
      description:
        "Augmentez votre visibilité en ligne et attirez plus de clients grâce à nos stratégies marketing.",
      icon: "TrendingUp",
      price: "À partir de 500€/mois",
      slug: "seo-marketing",
      color: "#EC4899", // Pink-500
      order: 5,
      isActive: false,
      features: [
        "Audit SEO complet",
        "Optimisation on-page",
        "Stratégie de contenu",
        "Marketing social média",
        "Analytics avancés",
      ],
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
    console.log(`✅ Service créé: ${service.title}`);
  }

  console.log("🎉 Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
