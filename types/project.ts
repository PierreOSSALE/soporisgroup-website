// Définir les types pour les données de Prisma
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  imageUrl: string | null;
  featured: boolean;
  description: string | null;
  technologies: any;
  challenges: any;
  solutions: any;
  results: any;
  screenshots: any;
  testimonial: any;
  createdAt: Date;
  updatedAt: Date;
};

// Type pour les captures d'écran
export type Screenshot = {
  url: string;
  caption: string;
};

// Type pour le témoignage
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

// Admin Project Form Data

export type AdminProject = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  imageUrl: string | null;
  featured: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Type pour les données du formulaire
export type ProjectFormData = {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  client: string;
  duration: string;
  pack: string;
  year: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  imageUrl: string;
  description: string;
  technologies: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  screenshots: Screenshot[];
  testimonial?: Testimonial;
};
