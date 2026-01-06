import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // --- 1. SEED DES ARTICLES DE BLOG ---
  const articles = [
    {
      title: "Les tendances UI/UX à suivre en 2026",
      slug: "tendances-ui-ux-2026",
      excerpt:
        "Découvrez les nouvelles tendances en matière de design d'interface qui transformeront l'expérience utilisateur cette année.",
      category: "UI/UX Design",
      read_time: "5 min",
      published: true,
      image_url:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop",
      content: `L'année 2026 marque un tournant décisif dans le domaine du design d'interface utilisateur. Voici les principales tendances à surveiller :

1. Design immersif et 3D
Les interfaces 3D deviennent plus accessibles grâce aux avancées technologiques. Les utilisateurs s'attendent désormais à des expériences visuellement riches et engageantes.

2. Mode sombre intelligent
Au-delà du simple toggle, les interfaces s'adaptent automatiquement à l'environnement et aux préférences de l'utilisateur.

3. Micro-interactions sophistiquées
Les animations subtiles et les feedbacks visuels renforcent l'engagement utilisateur sans nuire à la performance.

4. Design inclusif
L'accessibilité n'est plus une option mais une norme. Les designers intègrent dès le départ des pratiques inclusives.

Conclusion
Ces tendances reflètent une évolution vers des interfaces plus humaines, intuitives et respectueuses de tous les utilisateurs.`,
    },
    {
      title: "Comment optimiser les performances de votre site web",
      slug: "optimiser-performances-site-web",
      excerpt:
        "Guide complet pour améliorer la vitesse de chargement et les Core Web Vitals de votre site.",
      category: "Performance",
      read_time: "8 min",
      published: true,
      image_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
      content: `La performance d'un site web est cruciale pour l'expérience utilisateur et le référencement. Voici un guide complet pour améliorer vos Core Web Vitals.

Comprendre les Core Web Vitals

LCP (Largest Contentful Paint)
Mesure le temps de chargement du plus grand élément visible. Objectif : moins de 2.5 secondes.

FID (First Input Delay)
Mesure la réactivité aux interactions. Objectif : moins de 100ms.

CLS (Cumulative Layout Shift)
Mesure la stabilité visuelle. Objectif : score inférieur à 0.1.

Techniques d'optimisation

1. Optimisation des images
- Utilisez des formats modernes (WebP, AVIF)
- Implémentez le lazy loading
- Définissez les dimensions explicitement

2. Minification du code
- Compressez CSS, JavaScript et HTML
- Éliminez le code inutilisé

3. Mise en cache
- Configurez les headers de cache
- Utilisez un CDN

Conclusion
Une optimisation continue est essentielle pour maintenir d'excellentes performances.`,
    },
    {
      title: "L'importance du design centré utilisateur",
      slug: "design-centre-utilisateur",
      excerpt:
        "Pourquoi placer l'utilisateur au cœur de votre stratégie digitale est essentiel pour réussir.",
      category: "UX Strategy",
      read_time: "6 min",
      published: true,
      image_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
      content: `Le design centré utilisateur (UCD) place les besoins, les attentes et les limitations des utilisateurs finaux au cœur du processus de conception.

Qu'est-ce que le UCD ?
Le User-Centered Design est une méthodologie qui implique les utilisateurs à chaque étape du développement d'un produit digital.

Les 4 principes fondamentaux

1. Comprendre le contexte d'utilisation
Analysez qui sont vos utilisateurs, leurs objectifs et leur environnement d'utilisation.

2. Impliquer les utilisateurs
Faites participer vos utilisateurs cibles aux tests et validations.

3. Itérer en continu
Le design est un processus cyclique d'amélioration continue.

4. Mesurer et améliorer
Utilisez des métriques pour évaluer l'expérience et identifier les améliorations.

Bénéfices du UCD
- Réduction des coûts de développement
- Augmentation de la satisfaction utilisateur
- Meilleur taux de conversion
- Fidélisation accrue

Conclusion
Investir dans le UCD, c'est investir dans le succès de votre produit digital.`,
    },
    {
      title: "Créer une landing page qui convertit",
      slug: "landing-page-qui-convertit",
      excerpt:
        "Les secrets d'une landing page efficace pour maximiser vos conversions et atteindre vos objectifs business.",
      category: "Développement Web",
      read_time: "7 min",
      published: true,
      image_url:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=675&fit=crop",
      content: `Une landing page efficace peut faire la différence entre un visiteur perdu et un client acquis. Voici les éléments clés pour maximiser vos conversions.

Les éléments essentiels

1. Un titre accrocheur
Votre titre doit immédiatement communiquer la valeur de votre offre. Il doit être clair, concis et orienté bénéfice.

2. Un sous-titre explicatif
Développez votre proposition de valeur en quelques phrases.

3. Une image ou vidéo percutante
Le visuel doit renforcer votre message et créer une connexion émotionnelle.

4. Des témoignages
La preuve sociale rassure les visiteurs et renforce la crédibilité.

5. Un CTA clair
Votre bouton d'action doit être visible et incitatif.

Les erreurs à éviter
- Trop de distractions
- Un formulaire trop long
- Un temps de chargement lent
- L'absence de mobile-first

Conclusion
Testez, mesurez et optimisez continuellement votre landing page.`,
    },
    {
      title: "Guide complet du responsive design",
      slug: "guide-responsive-design",
      excerpt:
        "Maîtrisez les techniques du responsive design pour offrir une expérience optimale sur tous les appareils.",
      category: "Développement Web",
      read_time: "10 min",
      published: true,
      image_url:
        "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=675&fit=crop",
      content: `Le responsive design n'est plus une option, c'est une nécessité. Découvrez comment créer des interfaces qui s'adaptent parfaitement à tous les écrans.

Les fondamentaux

Mobile-First
Commencez toujours par concevoir pour mobile, puis enrichissez pour les écrans plus grands.

Breakpoints stratégiques
Définissez vos points de rupture en fonction du contenu, pas des appareils spécifiques.

Images flexibles
Utilisez srcset et sizes pour servir des images adaptées.

Techniques avancées

CSS Grid et Flexbox
Maîtrisez ces layouts modernes pour des interfaces fluides.

Container queries
Adaptez les composants à leur conteneur, pas seulement au viewport.

Typography fluide
Utilisez clamp() pour des tailles de texte qui s'adaptent naturellement.

Conclusion
Le responsive design est un investissement qui améliore l'expérience utilisateur et le SEO.`,
    },
  ];

  console.log("📝 Insertion des articles...");
  for (const article of articles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  // --- 2. SEED DES RENDEZ-VOUS (APPOINTMENTS) ---
  console.log("📅 Insertion des rendez-vous...");

  const appointments = [
    {
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      service: "Développement Web",
      date: new Date("2026-03-10"), // Date future
      time_slot: "10:00",
      message: "Besoin d'un devis pour un site e-commerce.",
      status: "pending",
    },
    {
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      service: "UI/UX Design",
      date: new Date("2026-03-12"),
      time_slot: "14:00",
      message: "Refonte de notre application mobile.",
      status: "confirmed",
    },
  ];

  // On utilise createMany si possible, sinon une boucle simple pour la compatibilité
  for (const appt of appointments) {
    await prisma.appointments.create({
      data: appt,
    });
  }

  console.log("✨ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
