// types/pack.ts
export type Currency = "EUR" | "TND" | "FCFA";

export interface Pack {
  id: string;
  name: string;
  description: string;
  priceEUR: number | null;
  priceTND: number | null;
  priceCFA: number | null;
  originalPriceEUR: number | null;
  originalPriceTND: number | null;
  originalPriceCFA: number | null;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  order: number;
  promoLabel?: string | null;
  promoEndDate?: Date | null;
  promoEndDateTND?: Date | null;
  promoEndDateCFA?: Date | null;
  isPromo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackFormData {
  name: string;
  description: string;
  priceEUR: number;
  originalPriceEUR?: number;
  priceTND: number;
  originalPriceTND?: number;
  priceCFA: number;
  originalPriceCFA?: number;
  features: string;
  isPopular: boolean;
  isPromo: boolean;
  isPromoEUR: boolean;
  isPromoTND: boolean;
  isPromoCFA: boolean;
  promoLabelEUR: string;
  promoLabelTND: string;
  promoLabelCFA: string;
  promoEndDateEUR: string;
  promoEndDateTND: string;
  promoEndDateCFA: string;
  isActive: boolean;
  order: number;
}

export interface PacksProps {
  className?: string;
  titleColor?: string;
  margin?: string;
}
