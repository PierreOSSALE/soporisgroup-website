// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // Nettoyage (optionnel)
  console.log(
    "🧹 Suppression des commentaires, articles et auteurs existants...",
  );
  await prisma.comment.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.author.deleteMany();

  console.log("👤 Création d'un auteur de démonstration...");
  const author = await prisma.author.create({
    data: {
      name: "Sopris Group",
      // avatar est requis dans le schema Author (non-nullable)
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    },
  });

  console.log("📝 Création d'articles (6 articles pour le blog)...");

  // 1 - Les 5 erreurs qui tuent votre site web et comment les éviter (Guide 2025)
  const post1 = await prisma.blogPost.create({
    data: {
      slug: "les-5-erreurs-qui-tuent-votre-site-web-et-comment-les-eviter-guide-2025",
      title:
        "Les 5 erreurs qui tuent votre site web et comment les éviter (Guide 2025)",
      excerpt:
        "Identifiez et corrigez les 5 erreurs les plus courantes qui nuisent à la performance, à la conversion et à la sécurité de votre site web.",
      content: `# Les 5 erreurs qui tuent votre site web et comment les éviter (Guide 2025)

Un site web peut être un atout stratégique — ou un gouffre à visiteurs. Dans ce guide 2025, nous passons en revue **les 5 erreurs critiques** qui font fuir vos visiteurs et comment les corriger, étape par étape.

## Erreur 1 : Vitesse de chargement lente
La lenteur est l'ennemi numéro 1. Les visiteurs s'attendent à des pages qui s'affichent rapidement, surtout sur mobile.

### Solutions techniques
- **Mise en cache** (CDN, cache navigateur, cache serveur)
- **Optimisation des images** (WebP, compression, lazy-loading)
- **Minification et bundle** (CSS/JS)
- **Hébergement performant** (serveurs proches, scalabilité)

> « La vitesse n'est pas une option — c'est une exigence utilisateur. »

\`\`\`js
// Exemple : lazy-loading simple en vanilla JS
document.addEventListener('DOMContentLoaded', function () {
  const imgs = document.querySelectorAll('img[data-src]');
  imgs.forEach(img => {
    img.src = img.dataset.src;
  });
});
\`\`\`

![Image optimisation - 1](https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&h=600&fit=crop)
![Image optimisation - 2](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop)
![Image optimisation - 3](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=600&fit=crop)

## Erreur 2 : Expérience mobile défaillante
Un site non responsive perdra une grande part de son audience. Pensez "mobile-first".

## Erreur 3 : Mauvaise structure SEO
Balises sémantiques, meta descriptions, sitemap.xml, et maillage interne sont indispensables.

## Erreur 4 : Design obsolète
Un design daté nuit à la confiance. Modernisez typographies, couleurs et hiérarchie visuelle.

## Erreur 5 : Sécurité vulnérable
HTTPS, mises à jour, sauvegardes et authentification forte sont non négociables.

### Check-list rapide (à télécharger)
1. Audit de performance
2. Test mobile complet
3. Vérification SEO technique
4. Refonte UI/UX si nécessaire
5. Audit de sécurité

> Besoin d'aide pour corriger ces erreurs ? [Soporis Group](https://soporisgroup.com) propose un **audit gratuit** pour les entreprises en Afrique et en Europe.

![Audit gratuit](https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=600&fit=crop)
![Audit gratuit 2](https://images.unsplash.com/photo-1526378720598-2d3ee0d1b6ab?w=1200&h=600&fit=crop)
![Audit gratuit 3](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop)
`,
      category: "Performance",
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&h=600&fit=crop",
      readTime: 7,
      views: 240,
      published: true,
      publishedAt: new Date(),
      tableOfContents: [
        "Vitesse de chargement lente",
        "Expérience mobile",
        "SEO",
        "Design",
        "Sécurité",
      ],
      author: { connect: { id: author.id } },
    },
  });

  // 2 - Pourquoi notre agence facture-t-elle plus cher que les sites en ligne à 500€ ?
  const post2 = await prisma.blogPost.create({
    data: {
      slug: "pourquoi-notre-agence-facture-t-elle-plus-cher-que-les-sites-en-ligne-a-500-euros",
      title:
        "Pourquoi notre agence facture-t-elle plus cher que les sites en ligne à 500€ ?",
      excerpt:
        "Explication claire et pédagogique sur la différence entre un site low-cost et un site réalisé par une agence premium.",
      content: `# Pourquoi notre agence facture-t-elle plus cher que les sites en ligne à 500€ ?

C'est une question courante. Dans cet article, nous expliquons simplement **ce que vous payez réellement** lorsque vous choisissez une agence comme Soporis Group.

## Développement sur-mesure vs templates
- Templates : déploiement rapide, fonctionnalités limitées.
- Sur-mesure : solution adaptée à vos processus métiers, évolutive.

## Accompagnement stratégique
Nous ne vendons pas seulement des pages : nous proposons une stratégie (SEO, acquisition, conversion).

### Optimisation pour la conversion
- Analyse des parcours
- A/B testing
- Optimisation des formulaires

## Maintenance et sécurité professionnelles
- Mises à jour régulières
- Monitoring et sauvegardes
- SLA et support

> Investir dans la qualité, c'est anticiper les coûts futurs.

![Agence premium - 1](https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=600&fit=crop)
![Agence premium - 2](https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=600&fit=crop)
![Agence premium - 3](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop)

## ROI à long terme
Un site bien conçu réduit les coûts (support, migrations) et augmente les revenus (taux de conversion, valeur client). Pour en savoir plus, demandez notre **devis détaillé**.

\`\`\`js
// Exemple simple : calculer le ROI (illustration)
function roi(gainAnnuel, coutInitial) {
  return ((gainAnnuel - coutInitial) / coutInitial) * 100;
}
\`\`\`

Contactez-nous : [Soporis Group](https://soporisgroup.com) — audit gratuit disponible.
`,
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=600&fit=crop",
      readTime: 6,
      views: 180,
      published: true,
      publishedAt: new Date(),
      tableOfContents: [
        "Développement sur-mesure",
        "Accompagnement stratégique",
        "Optimisation conversion",
        "Maintenance et sécurité",
        "ROI",
      ],
      author: { connect: { id: author.id } },
    },
  });

  // 3 - Case Study : Comment nous avons augmenté les ventes de 300% pour un client e-commerce
  const post3 = await prisma.blogPost.create({
    data: {
      slug: "case-study-comment-nous-avons-augmenter-les-ventes-de-300-pour-un-client-ecommerce",
      title:
        "Case Study : Comment nous avons augmenté les ventes de 300% pour un client e-commerce",
      excerpt:
        "Étude de cas détaillée montrant la méthodologie, les optimisations et les résultats concrets d'une refonte e-commerce.",
      content: `# Case Study : Comment nous avons augmenté les ventes de 300% pour un client e-commerce

Dans cette étude de cas, découvrez la démarche complète : audit, hypothèses, implémentations et résultats.

## Problème initial
- Taux d'abandon de panier > 70%
- Site lent (>5s)
- Tunnel de commande trop long

## Méthodologie d'analyse
1. Audit analytique (Google Analytics, heatmaps)
2. Tests utilisateurs
3. Priorisation des correctifs

## Solutions mises en place
- Refonte UX mobile-first
- Optimisation des performances (CDN, images, lazy-loading)
- Simplification du checkout (achat invité, un seul écran)
- Relances automatisées par email

> « Les petits changements dans le tunnel de vente peuvent avoir un grand impact sur le chiffre d’affaires. »

![Case study 1](https://images.unsplash.com/photo-1512446733611-9099a758e0d0?w=1200&h=600&fit=crop)
![Case study 2](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop)
![Case study 3](https://images.unsplash.com/photo-1508685096485-1c98b0b42b47?w=1200&h=600&fit=crop)

## Résultats obtenus
- Taux de conversion x3
- Ventes +300% en 6 mois
- Temps de chargement réduit à <2s

## Témoignage client
> « Nous avons vu nos ventes exploser après la refonte. Le rapport qualité-prix de Soporis Group est exceptionnel. »

Envie d'un case study personnalisé ? [Réservez un appel](https://soporisgroup.com).
`,
      category: "E-commerce",
      image:
        "https://images.unsplash.com/photo-1512446733611-9099a758e0d0?w=1200&h=600&fit=crop",
      readTime: 8,
      views: 320,
      published: true,
      publishedAt: new Date(),
      tableOfContents: [
        "Problème initial",
        "Méthodologie",
        "Solutions",
        "Résultats",
        "Témoignage",
      ],
      author: { connect: { id: author.id } },
    },
  });

  // 4 - Notre processus de développement web en 7 étapes : de l'idée au lancement
  const post4 = await prisma.blogPost.create({
    data: {
      slug: "notre-processus-de-developpement-web-en-7-etapes-de-lidee-au-lancement",
      title:
        "Notre processus de développement web en 7 étapes : de l'idée au lancement",
      excerpt:
        "Découvrez pas à pas notre méthodologie en 7 étapes pour mener un projet web de l'idée jusqu'au lancement réussi.",
      content: `# Notre processus de développement web en 7 étapes : de l'idée au lancement

Transparence et rigueur : voici comment nous gérons vos projets pour garantir la qualité et le respect des délais.

## 1. Brief et analyse des besoins
- Interviews, objectifs, cibles
- Cahier des charges

## 2. Conception UX/UI
- Wireframes, maquettes, validation

## 3. Développement sur mesure
- Stack adapté, développement modulaire

## 4. Tests qualité
- Unitaires, fonctionnels, utilisateurs

## 5. Formation client
- Guides, vidéos, sessions live

## 6. Lancement
- Déploiement sécurisé, monitoring

## 7. Suivi et maintenance
- Améliorations continues, sauvegardes

### Exemple de checklist (extrait)
1. Valider le sitemap
2. Finaliser le design mobile
3. Tester le checkout

![Process 1](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop)
![Process 2](https://images.unsplash.com/photo-1521790365903-3d9c6b1f8b24?w=1200&h=600&fit=crop)
![Process 3](https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop)

> La transparence du processus est la première garantie d'un partenariat réussi.

Pour recevoir notre modèle de cahier des charges, [téléchargez-le ici](https://soporisgroup.com).
`,
      category: "Process",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop",
      readTime: 6,
      views: 150,
      published: true,
      publishedAt: new Date(),
      tableOfContents: [
        "Brief",
        "Conception",
        "Développement",
        "Tests",
        "Formation",
        "Lancement",
        "Suivi",
      ],
      author: { connect: { id: author.id } },
    },
  });

  // 5 - Packs tarifaires : comment choisir celui qui correspond à vos besoins réels ?
  const post5 = await prisma.blogPost.create({
    data: {
      slug: "packs-tarifaires-comment-choisir-celui-qui-correspond-a-vos-besoins-reels",
      title:
        "Packs tarifaires : comment choisir celui qui correspond à vos besoins réels ?",
      excerpt:
        "Guide pour choisir entre Start-up, Pro et Entreprise — évaluez le ROI et choisissez le pack le plus adapté.",
      content: `# Packs tarifaires : comment choisir celui qui correspond à vos besoins réels ?

Choisir un pack n'est pas une question de prix seulement, mais d'adéquation entre vos objectifs et les fonctionnalités proposées.

## Packs typiques
- **Start-up** : site vitrine, pages simples, formation de base.
- **Pro** : e-commerce, espace membre, fonctionnalités avancées.
- **Entreprise** : multi-sites, intégration ERP/CRM, SLAs renforcés.

### Comparaison (exemple)
1. Start-up — Rapidité de mise en ligne, coût réduit.
2. Pro — Conversion et outils marketing.
3. Entreprise — Automatisation et haute disponibilité.

![Packs 1](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop)
![Packs 2](https://images.unsplash.com/photo-1508385082359-f0b60b78f4f6?w=1200&h=600&fit=crop)
![Packs 3](https://images.unsplash.com/photo-1526318472351-c75fcf070d8a?w=1200&h=600&fit=crop)

> « Le meilleur pack est celui qui vous évite des dépenses inutiles tout en soutenant votre croissance. »

Pour un diagnostic personnalisé, demandez notre **consultation gratuite** sur [Soporis Group](https://soporisgroup.com).
`,
      category: "Pricing",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      readTime: 6,
      views: 110,
      published: true,
      publishedAt: new Date(),
      tableOfContents: ["Start-up", "Pro", "Entreprise", "Comparaison", "ROI"],
      author: { connect: { id: author.id } },
    },
  });

  // 6 - Les 3 tendances web qui dominent 2026 et comment en profiter
  const post6 = await prisma.blogPost.create({
    data: {
      slug: "les-3-tendances-web-qui-dominent-2026-et-comment-en-profiter",
      title: "Les 3 tendances web qui dominent 2026 et comment en profiter",
      excerpt:
        "IA, expériences immersives et écoconception : trois tendances majeures à adopter pour rester compétitif en 2026.",
      content: `# Les 3 tendances web qui dominent 2026 et comment en profiter

Le web en 2026 se concentre sur l'intelligence, l'immersion et la durabilité. Voici comment en tirer parti.

## 1. IA et personnalisation
- Recommandations produit
- Chatbots avancés
- Personnalisation dynamique des pages

## 2. Expérience utilisateur immersive
- 3D Web, AR, configurateurs interactifs
- Storytelling visuel

## 3. Performance et écoconception
- Hébergement vert
- Optimisation des assets
- Minimalisme performant

![Tendance 1](https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=600&fit=crop)
![Tendance 2](https://images.unsplash.com/photo-1531497865141-046f3a5a1f58?w=1200&h=600&fit=crop)
![Tendance 3](https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=1200&h=600&fit=crop)

> Adopter ces tendances maintenant vous donne un avantage compétitif durable.

Contactez [Soporis Group](https://soporisgroup.com) pour un **audit de maturité digitale** et une feuille de route 2026.
`,
      category: "Tendances",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=600&fit=crop",
      readTime: 7,
      views: 200,
      published: true,
      publishedAt: new Date(),
      tableOfContents: ["IA", "Immersion", "Écoconception", "Implémentation"],
      author: { connect: { id: author.id } },
    },
  });

  console.log(
    "💬 Ajout de commentaires de démonstration au premier post publié...",
  );
  await prisma.comment.createMany({
    data: [
      {
        postId: post1.id,
        author: "Amina",
        email: "amina@example.com",
        content: "Super article — merci pour ces insights !",
        approved: true,
      },
      {
        postId: post1.id,
        author: "Karim",
        email: "karim@example.com",
        content: "Très utile, j'aimerais en savoir plus sur le design 3D.",
        approved: false,
      },
    ],
  });

  console.log("✨ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
