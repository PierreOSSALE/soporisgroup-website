// prisma/seed-projects.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed des projets...");

  // Supprimer les projets existants pour éviter les doublons
  await prisma.project.deleteMany({});

  // Créer les projets
  const projects = await prisma.project.createMany({
    data: [
      {
        slug: "ecommerce-mode-luxe",
        title: "E-commerce Mode",
        subtitle:
          "Plateforme e-commerce haut de gamme pour une marque de prêt-à-porter",
        category: "Sites Web",
        description:
          "Création d'une plateforme e-commerce complète pour une marque de mode française souhaitant développer sa présence en ligne avec une expérience d'achat premium.",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        client: "Maison Élégance",
        duration: "8 semaines",
        pack: "Premium",
        year: "2024",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "React",
          "Next.js",
          "Stripe",
          "Supabase",
          "Tailwind CSS",
        ]),
        challenges: JSON.stringify([
          "Intégration d'un système de paiement sécurisé multi-devises",
          "Gestion d'un catalogue de plus de 500 produits avec variantes",
          "Optimisation des performances pour un temps de chargement < 2s",
          "Interface responsive parfaite sur tous les appareils",
        ]),
        solutions: JSON.stringify([
          "Mise en place de Stripe Connect pour les paiements internationaux",
          "Architecture headless avec CMS pour la gestion produits",
          "Optimisation des images avec lazy loading et formats modernes",
          "Design mobile-first avec tests sur 15+ appareils",
        ]),
        results: JSON.stringify([
          "Augmentation de 150% du taux de conversion",
          "Réduction de 40% du taux d'abandon de panier",
          "Note Google PageSpeed de 95/100",
          "Plus de 10 000 commandes le premier mois",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1523199455310-87b16c0eed11?w=1200&h=800&fit=crop",
            caption: "Page d'accueil avec slider produits phares",
          },
          {
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
            caption: "Page produit avec zoom et sélection de tailles",
          },
          {
            url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
            caption: "Tunnel de paiement optimisé",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Soporis a transformé notre vision en réalité. Notre boutique en ligne dépasse toutes nos attentes en termes de design et de performance.",
          author: "Marie Dupont",
          role: "Directrice, Maison Élégance",
        }),
      },
      {
        slug: "dashboard-analytics-saas",
        title: "Dashboard Analytics",
        subtitle:
          "Interface de gestion et visualisation de données pour startup SaaS",
        category: "UI/UX",
        description:
          "Conception et développement d'un tableau de bord analytique complet permettant aux utilisateurs de visualiser et analyser leurs données en temps réel.",
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        client: "DataFlow Analytics",
        duration: "6 semaines",
        pack: "Pro",
        year: "2024",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "React",
          "TypeScript",
          "Recharts",
          "Supabase",
          "Framer Motion",
        ]),
        challenges: JSON.stringify([
          "Affichage de données volumineuses sans impact sur les performances",
          "Création d'une interface intuitive pour des utilisateurs non-techniques",
          "Mise à jour en temps réel des graphiques",
          "Export de rapports personnalisés",
        ]),
        solutions: JSON.stringify([
          "Virtualisation des listes et pagination intelligente",
          "Tests utilisateurs itératifs pour optimiser l'UX",
          "WebSockets pour les mises à jour temps réel",
          "Génération PDF côté serveur avec templates personnalisables",
        ]),
        results: JSON.stringify([
          "Temps moyen de session augmenté de 200%",
          "Réduction de 60% des tickets support liés à l'interface",
          "95% de satisfaction utilisateur",
          "Adoption par 500+ entreprises en 3 mois",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
            caption: "Vue d'ensemble du dashboard principal",
          },
          {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
            caption: "Module de création de rapports",
          },
          {
            url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop",
            caption: "Graphiques interactifs et filtres avancés",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "L'interface conçue par Soporis a révolutionné la façon dont nos clients interagissent avec leurs données. Un travail remarquable !",
          author: "Thomas Martin",
          role: "CEO, DataFlow Analytics",
        }),
      },
      {
        slug: "landing-page-saas-productivite",
        title: "Landing SaaS",
        subtitle:
          "Page d'atterrissage haute conversion pour outil de productivité",
        category: "Landing Pages",
        description:
          "Création d'une landing page stratégique conçue pour maximiser les conversions et présenter efficacement les fonctionnalités d'un outil SaaS innovant.",
        imageUrl:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
        client: "TaskMaster Pro",
        duration: "3 semaines",
        pack: "Starter",
        year: "2024",
        status: "published",
        featured: false,
        technologies: JSON.stringify([
          "React",
          "Tailwind CSS",
          "Framer Motion",
          "Vercel",
        ]),
        challenges: JSON.stringify([
          "Communiquer clairement la proposition de valeur en < 5 secondes",
          "Optimiser le taux de conversion tout en gardant un design élégant",
          "Créer des animations performantes sans impacter le SEO",
          "A/B testing pour optimiser chaque élément",
        ]),
        solutions: JSON.stringify([
          "Copywriting stratégique avec tests utilisateurs",
          "Design épuré avec CTAs stratégiquement placés",
          "Animations CSS optimisées et lazy-loaded",
          "Intégration Google Optimize pour les tests",
        ]),
        results: JSON.stringify([
          "Taux de conversion de 12% (vs 3% moyenne secteur)",
          "Score SEO de 98/100",
          "Temps de chargement < 1.5s",
          "5000+ inscriptions le premier mois",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop",
            caption: "Section hero avec proposition de valeur claire",
          },
          {
            url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
            caption: "Présentation des fonctionnalités clés",
          },
          {
            url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop",
            caption: "Section témoignages et social proof",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Notre taux de conversion a été multiplié par 4 grâce à cette landing page. L'investissement a été rentabilisé en 2 semaines.",
          author: "Sophie Bernard",
          role: "CMO, TaskMaster Pro",
        }),
      },
      {
        slug: "application-immobiliere-luxe",
        title: "Application Immobilière",
        subtitle:
          "Plateforme de recherche immobilière premium avec carte interactive",
        category: "Applications Web",
        description:
          "Développement d'une application web complète pour une agence immobilière haut de gamme, avec recherche avancée, carte interactive et visites virtuelles.",
        imageUrl:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
        client: "Prestige Immobilier",
        duration: "10 semaines",
        pack: "Premium",
        year: "2023",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "React",
          "Mapbox",
          "Supabase",
          "Three.js",
          "Tailwind CSS",
        ]),
        challenges: JSON.stringify([
          "Intégration de visites virtuelles 360° fluides",
          "Carte interactive avec clustering pour 5000+ biens",
          "Système de matching intelligent acheteur/bien",
          "Espace agent avec CRM intégré",
        ]),
        solutions: JSON.stringify([
          "Viewer 360° optimisé avec Three.js",
          "Mapbox GL avec clustering dynamique",
          "Algorithme de recommandation basé sur les préférences",
          "Dashboard agent avec gestion leads et rendez-vous",
        ]),
        results: JSON.stringify([
          "80% des visites qualifiées générées en ligne",
          "Réduction de 50% du temps de recherche client",
          "Taux de satisfaction agent de 98%",
          "ROI de 300% la première année",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop",
            caption: "Page d'accueil avec recherche intelligente",
          },
          {
            url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=800&fit=crop",
            caption: "Carte interactive avec filtres avancés",
          },
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
            caption: "Fiche bien avec visite virtuelle intégrée",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Cette plateforme a transformé notre façon de travailler. Nos agents sont plus efficaces et nos clients trouvent leur bien idéal plus rapidement.",
          author: "Jean-Pierre Moreau",
          role: "Directeur, Prestige Immobilier",
        }),
      },
      {
        slug: "portfolio-photographe-artiste",
        title: "Portfolio Créatif",
        subtitle: "Site portfolio immersif pour photographe professionnel",
        category: "Sites Web",
        description:
          "Création d'un portfolio en ligne élégant et immersif mettant en valeur le travail d'un photographe reconnu avec des animations fluides et une galerie optimisée.",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        client: "Studio Lumière",
        duration: "4 semaines",
        pack: "Pro",
        year: "2024",
        status: "published",
        featured: false,
        technologies: JSON.stringify([
          "React",
          "GSAP",
          "Framer Motion",
          "Cloudinary",
        ]),
        challenges: JSON.stringify([
          "Affichage haute qualité sans compromettre les performances",
          "Animations immersives respectant l'identité artistique",
          "Navigation intuitive entre les projets",
          "Optimisation SEO pour images",
        ]),
        solutions: JSON.stringify([
          "CDN Cloudinary avec transformations automatiques",
          "Animations GSAP synchronisées au scroll",
          "Navigation gestuelle et clavier",
          "Schema.org pour images et structured data",
        ]),
        results: JSON.stringify([
          "Temps de chargement moyen de 1.2s malgré les images HD",
          "Augmentation de 200% des demandes de contact",
          "Featured sur Awwwards et CSS Design Awards",
          "Top 10 Google pour 'photographe portrait Paris'",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
            caption: "Page d'accueil avec effet parallaxe",
          },
          {
            url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop",
            caption: "Galerie plein écran avec navigation fluide",
          },
          {
            url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1200&h=800&fit=crop",
            caption: "Vue détail d'un projet photo",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Mon nouveau site reflète parfaitement mon univers artistique. Les retours de mes clients sont unanimes : c'est une œuvre d'art en soi.",
          author: "Alexandre Petit",
          role: "Photographe, Studio Lumière",
        }),
      },
      {
        slug: "app-fitness-mobile-first",
        title: "App Fitness",
        subtitle: "Application mobile-first de suivi fitness et nutrition",
        category: "UI/UX",
        description:
          "Design et prototypage complet d'une application de fitness avec suivi d'entraînement, plans nutritionnels personnalisés et gamification pour motiver les utilisateurs.",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        client: "FitLife App",
        duration: "5 semaines",
        pack: "Pro",
        year: "2024",
        status: "published",
        featured: true,
        technologies: JSON.stringify([
          "Figma",
          "Protopie",
          "React Native",
          "Lottie",
        ]),
        challenges: JSON.stringify([
          "Interface utilisable pendant l'entraînement (gros boutons, contrastes)",
          "Système de gamification engageant mais pas intrusif",
          "Synchronisation avec montres connectées",
          "Personnalisation des plans selon les objectifs",
        ]),
        solutions: JSON.stringify([
          "Design adaptatif selon le contexte d'utilisation",
          "Système de badges et défis progressifs",
          "API HealthKit et Google Fit intégrées",
          "Algorithme de recommandation basé sur l'IA",
        ]),
        results: JSON.stringify([
          "Rétention utilisateur de 65% après 30 jours",
          "4.8/5 sur les stores après lancement",
          "100K+ téléchargements le premier mois",
          "Temps d'engagement moyen de 25 min/jour",
        ]),
        screenshots: JSON.stringify([
          {
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
            caption: "Écran d'accueil avec progression quotidienne",
          },
          {
            url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop",
            caption: "Interface d'entraînement en cours",
          },
          {
            url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop",
            caption: "Suivi nutritionnel et repas",
          },
        ]),
        testimonial: JSON.stringify({
          quote:
            "Le design de Soporis a été la clé de notre succès. L'expérience utilisateur est si fluide que nos utilisateurs adorent revenir chaque jour.",
          author: "Laura Chen",
          role: "Fondatrice, FitLife App",
        }),
      },
    ],
  });

  console.log(`✅ ${projects.count} projets créés avec succès !`);

  // Vérifier que tous les slugs sont correctement créés
  const createdProjects = await prisma.project.findMany({
    select: { slug: true, title: true },
  });

  console.log("📋 Projets créés :");
  createdProjects.forEach((project) => {
    console.log(`  - ${project.title} (${project.slug})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed des projets:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
