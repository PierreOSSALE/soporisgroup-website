// Types pour l'assistant(e)
// components/data/mockAssistantData.ts
export interface AssistantAppointment {
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

export interface AssistantMessage {
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

export const mockMessages: AssistantMessage[] = [
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

export const mockAppointments: AssistantAppointment[] = [
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
