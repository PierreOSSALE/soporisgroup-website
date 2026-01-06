// Types pour l'admin
export interface AdminProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "published" | "draft";
  createdAt: string;
}

export interface AdminService {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  isActive: boolean;
  order: number;
}

export interface AdminBlog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  status: "published" | "draft";
  views: number;
}

export interface AdminAppointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  message: string;
}

export interface AdminFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface AdminPack {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  isPopular: boolean;
  isPromo: boolean;
  promoLabel?: string;
  promoEndDate?: string;
  isActive: boolean;
}

export interface AdminTestimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  isActive: boolean;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  receivedAt: string;
  isRead: boolean;
  isArchived: boolean;
}

// Données fictives
export const mockProjects: AdminProject[] = [
  {
    id: "1",
    title: "E-commerce Mode Luxe",
    subtitle: "Boutique en ligne haut de gamme",
    category: "E-commerce",
    client: "Maison Élégance",
    duration: "8 semaines",
    pack: "Pack Premium",
    year: "2024",
    status: "published",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Dashboard Analytics",
    subtitle: "Plateforme de données en temps réel",
    category: "Application Web",
    client: "DataViz Pro",
    duration: "12 semaines",
    pack: "Pack Business",
    year: "2024",
    status: "published",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    title: "Portfolio Architecte",
    subtitle: "Vitrine professionnelle minimaliste",
    category: "Site Vitrine",
    client: "Studio Archi",
    duration: "4 semaines",
    pack: "Pack Starter",
    year: "2024",
    status: "draft",
    createdAt: "2024-03-10",
  },
];

export const mockServices: AdminService[] = [
  {
    id: "1",
    title: "Création de site web",
    description: "Développement de sites web modernes et responsive",
    icon: "Globe",
    price: "À partir de 1500€",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    title: "Application web",
    description: "Développement d'applications web sur mesure",
    icon: "Code",
    price: "À partir de 3000€",
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    title: "E-commerce",
    description: "Création de boutiques en ligne performantes",
    icon: "ShoppingCart",
    price: "À partir de 2500€",
    isActive: true,
    order: 3,
  },
  {
    id: "4",
    title: "SEO & Marketing",
    description: "Optimisation et stratégie de visibilité",
    icon: "TrendingUp",
    price: "À partir de 500€/mois",
    isActive: false,
    order: 4,
  },
];

export const mockBlogs: AdminBlog[] = [
  {
    id: "1",
    title: "Les tendances web design 2024",
    excerpt:
      "Découvrez les dernières tendances en matière de design web pour cette année.",
    category: "Design",
    author: "Sophie Martin",
    publishedAt: "2024-01-20",
    status: "published",
    views: 1250,
  },
  {
    id: "2",
    title: "Optimiser les performances de votre site",
    excerpt:
      "Guide complet pour améliorer la vitesse de chargement de votre site web.",
    category: "Technique",
    author: "Thomas Dubois",
    publishedAt: "2024-02-15",
    status: "published",
    views: 890,
  },
  {
    id: "3",
    title: "L'importance du responsive design",
    excerpt: "Pourquoi votre site doit être optimisé pour tous les appareils.",
    category: "Design",
    author: "Sophie Martin",
    publishedAt: "2024-03-01",
    status: "draft",
    views: 0,
  },
];

export const mockAppointments: AdminAppointment[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78",
    company: "Dupont SARL",
    service: "Création de site web",
    date: "2024-03-25",
    time: "10:00",
    status: "confirmed",
    message:
      "Je souhaite créer un site vitrine pour mon entreprise de plomberie.",
  },
  {
    id: "2",
    name: "Marie Lambert",
    email: "marie.lambert@email.com",
    phone: "07 98 76 54 32",
    company: "Boutique Marie",
    service: "E-commerce",
    date: "2024-03-26",
    time: "14:30",
    status: "pending",
    message:
      "J'ai besoin d'une boutique en ligne pour vendre mes créations artisanales.",
  },
  {
    id: "3",
    name: "Pierre Martin",
    email: "pierre.martin@email.com",
    phone: "06 55 44 33 22",
    company: "Martin Consulting",
    service: "Application web",
    date: "2024-03-20",
    time: "09:00",
    status: "completed",
    message: "Développement d'un outil de gestion interne.",
  },
  {
    id: "4",
    name: "Claire Rousseau",
    email: "claire.r@email.com",
    phone: "07 11 22 33 44",
    company: "Agence Rousseau",
    service: "SEO & Marketing",
    date: "2024-03-27",
    time: "11:00",
    status: "cancelled",
    message: "Améliorer notre visibilité en ligne.",
  },
];

export const mockFAQs: AdminFAQ[] = [
  {
    id: "1",
    question: "Quel est le délai de réalisation d'un site web ?",
    answer:
      "Le délai varie selon la complexité du projet. Un site vitrine prend généralement 2 à 4 semaines, tandis qu'un e-commerce peut nécessiter 6 à 12 semaines.",
    category: "Général",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    question: "Proposez-vous la maintenance après livraison ?",
    answer:
      "Oui, nous proposons des contrats de maintenance mensuelle qui incluent les mises à jour, la sécurité et le support technique.",
    category: "Services",
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    question: "Comment se déroule un projet avec vous ?",
    answer:
      "Nous suivons une méthodologie agile : découverte, conception, développement, tests et livraison. Vous êtes impliqué à chaque étape.",
    category: "Processus",
    order: 3,
    isActive: true,
  },
  {
    id: "4",
    question: "Quels sont vos modes de paiement ?",
    answer:
      "Nous acceptons les virements bancaires et proposons un échéancier : 30% à la commande, 40% en cours de projet, 30% à la livraison.",
    category: "Paiement",
    order: 4,
    isActive: false,
  },
];

export const mockPacks: AdminPack[] = [
  {
    id: "1",
    name: "Pack Starter",
    description: "Idéal pour démarrer votre présence en ligne",
    price: 1500,
    features: [
      "Site vitrine jusqu'à 5 pages",
      "Design responsive",
      "Formulaire de contact",
      "Optimisation SEO de base",
      "Hébergement 1 an inclus",
    ],
    isPopular: false,
    isPromo: false,
    isActive: true,
  },
  {
    id: "2",
    name: "Pack Business",
    description: "Pour les entreprises qui veulent se démarquer",
    price: 2990,
    originalPrice: 3500,
    features: [
      "Site jusqu'à 10 pages",
      "Design sur mesure",
      "Blog intégré",
      "SEO avancé",
      "Analytics & reporting",
      "Support prioritaire 6 mois",
    ],
    isPopular: true,
    isPromo: true,
    promoLabel: "-15%",
    promoEndDate: "2024-04-30",
    isActive: true,
  },
  {
    id: "3",
    name: "Pack Premium",
    description: "Solution complète pour les projets ambitieux",
    price: 5990,
    features: [
      "Site illimité en pages",
      "Design premium personnalisé",
      "E-commerce ou application web",
      "Intégrations sur mesure",
      "Formation équipe",
      "Support premium 1 an",
      "Maintenance incluse",
    ],
    isPopular: false,
    isPromo: false,
    isActive: true,
  },
  {
    id: "4",
    name: "Pack E-commerce",
    description: "Lancez votre boutique en ligne",
    price: 3990,
    originalPrice: 4500,
    features: [
      "Boutique complète",
      "Jusqu'à 100 produits",
      "Paiement sécurisé",
      "Gestion des stocks",
      "Livraison automatisée",
    ],
    isPopular: false,
    isPromo: true,
    promoLabel: "Offre limitée",
    promoEndDate: "2024-03-31",
    isActive: true,
  },
];

export const mockTestimonials: AdminTestimonial[] = [
  {
    id: "1",
    author: "Jean-Pierre Moreau",
    role: "Directeur Général",
    company: "Moreau Industries",
    content:
      "Excellent travail ! L'équipe a su comprendre nos besoins et livrer un site qui dépasse nos attentes. Je recommande vivement.",
    rating: 5,
    isActive: true,
  },
  {
    id: "2",
    author: "Sophie Leblanc",
    role: "Fondatrice",
    company: "Atelier Sophie",
    content:
      "Professionnalisme et créativité au rendez-vous. Mon e-commerce génère maintenant 40% de mon chiffre d'affaires.",
    rating: 5,
    isActive: true,
  },
  {
    id: "3",
    author: "Marc Dubois",
    role: "Responsable Marketing",
    company: "Tech Solutions",
    content:
      "Une collaboration fluide et un résultat à la hauteur. L'équipe est réactive et à l'écoute.",
    rating: 4,
    isActive: true,
  },
  {
    id: "4",
    author: "Claire Martin",
    role: "CEO",
    company: "Martin & Co",
    content:
      "Très satisfaite du redesign de notre site. Les performances ont nettement augmenté.",
    rating: 5,
    isActive: false,
  },
];

export const mockMessages: AdminMessage[] = [
  {
    id: "1",
    name: "Lucas Bernard",
    email: "lucas.b@email.com",
    phone: "06 12 34 56 78",
    subject: "Demande de devis",
    message:
      "Bonjour, je souhaite avoir un devis pour la création d'un site e-commerce. Nous vendons des produits bio et avons environ 200 références.",
    receivedAt: "2024-03-20T10:30:00",
    isRead: true,
    isArchived: false,
  },
  {
    id: "2",
    name: "Emma Petit",
    email: "emma.petit@email.com",
    subject: "Question sur les délais",
    message:
      "Bonjour, combien de temps faut-il pour créer un site vitrine simple ? J'ai un budget limité mais j'aimerais quelque chose de professionnel.",
    receivedAt: "2024-03-21T14:15:00",
    isRead: false,
    isArchived: false,
  },
  {
    id: "3",
    name: "Antoine Leroy",
    email: "a.leroy@entreprise.com",
    phone: "07 98 76 54 32",
    subject: "Partenariat",
    message:
      "Nous recherchons une agence pour un partenariat long terme. Seriez-vous intéressés par une collaboration sur plusieurs projets ?",
    receivedAt: "2024-03-19T09:00:00",
    isRead: true,
    isArchived: true,
  },
  {
    id: "4",
    name: "Julie Mercier",
    email: "julie.m@startup.io",
    subject: "Urgence - Refonte site",
    message:
      "Notre site actuel ne fonctionne plus correctement. Nous avons besoin d'une refonte urgente. Pouvez-vous nous aider rapidement ?",
    receivedAt: "2024-03-21T16:45:00",
    isRead: false,
    isArchived: false,
  },
];
