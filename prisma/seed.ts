// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // Nettoyage (optionnel)
  console.log(
    "🧹 Suppression des commentaires, articles et auteurs existants..."
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

  console.log("📝 Création d'articles (un publié + un brouillon)...");

  // Article publié
  const publishedPost = await prisma.blogPost.create({
    data: {
      slug: "tendances-ui-ux-2026",
      title: "Les tendances UI/UX à suivre en 2026",
      excerpt:
        "Découvrez les nouvelles tendances en matière de design d'interface qui transformeront l'expérience utilisateur cette année.",
      content: `# Les tendances UI/UX à suivre en 2026

L'année 2026 marque un tournant décisif dans le domaine du design d'interface utilisateur. Voici les principales tendances à surveiller :

## 1. Design immersif et 3D
Les interfaces 3D deviennent plus accessibles grâce aux avancées technologiques. Les utilisateurs s'attendent désormais à des expériences visuellement riches et engageantes.

## 2. Mode sombre intelligent
Au-delà du simple toggle, les interfaces s'adaptent automatiquement à l'environnement et aux préférences de l'utilisateur.

### Micro-interactions sophistiquées
- Animations subtiles
- Feedbacks visuels

> L'accessibilité n'est plus une option mais une norme.

[En savoir plus](https://example.com)

\`\`\`js
// Exemple de code
const example = "Hello World";
\`\`\`

![Illustration](https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop)
`,
      category: "UI/UX Design",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop",
      readTime: 5,
      views: 120,
      published: true,
      // Schema exige publishedAt non-null, on met la date actuelle pour un post publié
      publishedAt: new Date(),
      // Table of contents : tableau simple de sections (JSON)
      tableOfContents: [
        "Les tendances UI/UX à suivre en 2026",
        "Design immersif et 3D",
        "Mode sombre intelligent",
        "Micro-interactions sophistiquées",
      ],
      author: { connect: { id: author.id } },
    },
  });

  // Brouillon (published = false) -> publishedAt fixé à epoch (1970-01-01) pour respecter le schema non-null
  const draftPost = await prisma.blogPost.create({
    data: {
      slug: "meilleures-pratiques-design-2024",
      title: "Meilleures pratiques de design en 2024 (Brouillon)",
      excerpt:
        "Court résumé de l'article. Ex : Les meilleures pratiques de design en 2024 — accessible et performant.",
      content: `# Meilleures pratiques de design en 2024

Contenu en markdown:
- Prioriser l'accessibilité
- Garder des performances optimales
- Prototype rapide et tests utilisateurs

**Texte en gras** et *texte en italique*.

> Exemple de citation.

![Alt text](https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&h=600&fit=crop)
`,
      category: "Design",
      image:
        "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&h=600&fit=crop",
      readTime: 6,
      views: 0,
      published: false,
      // Pour respecter le schema (non-null publishedAt), on met epoch pour indiquer "non publié"
      publishedAt: new Date(0),
      tableOfContents: [
        "Introduction",
        "Accessibilité",
        "Performance",
        "Conclusion",
      ],
      author: { connect: { id: author.id } },
    },
  });

  console.log("💬 Ajout de commentaires de démonstration au post publié...");
  await prisma.comment.createMany({
    data: [
      {
        postId: publishedPost.id,
        author: "Amina",
        email: "amina@example.com",
        content: "Super article — merci pour ces insights !",
        approved: true,
      },
      {
        postId: publishedPost.id,
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
