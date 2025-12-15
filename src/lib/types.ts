import type { LucideIcon } from 'lucide-react';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  sold: number;
  category: string;
  subcategory?: string;
  imageUrl: string;
  store: {
    name: string;
  };
  published: boolean;
};

export type Category = {
  name: string;
  icon: LucideIcon;
};

export type SubCategory = {
  name: string;
  imageUrl: string;
};
