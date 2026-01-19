// types/dashboard.ts
export interface DashboardProject {
  id: string;
  title: string;
  client: string | null;
  status: string;
  createdAt: Date;
  description?: string | null;
  category?: string;
  subtitle?: string;
  duration?: string;
  pack?: string;
  year?: string;
  imageUrl?: string | null;
  featured?: boolean;
}

export interface DashboardBlogPost {
  id: string;
  title: string;
  category: string;
  views: number;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  excerpt?: string;
  slug?: string;
  author?: {
    name: string;
    avatar: string;
  };
}

export interface DashboardService {
  id: string;
  title: string;
  isActive: boolean;
  description?: string;
  icon?: string;
  price?: string;
  order?: number;
  features?: string[];
  slug?: string;
  color?: string;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardPack {
  id: string;
  name: string;
  description: string;
  priceEUR: number | null;
  priceTND: number | null;
  priceCFA: number | null;
  originalPriceEUR: number | null;
  isPromo: boolean;
  isActive: boolean;
  isPopular: boolean;
  promoLabel: string | null;
  promoEndDate: Date | null;
  features?: string[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
