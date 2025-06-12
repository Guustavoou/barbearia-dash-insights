export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  commission: number; // percentage
  isActive: boolean;
  popularity: number; // number of bookings
  averageRating: number;
  professionals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: number; // count of services in this category
  color: string;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
  averagePrice: number;
  mostPopularService: string;
  categoriesCount: number;
}

export interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  commission: number;
  professionals: string[];
}

export type ServiceSortField =
  | "name"
  | "price"
  | "duration"
  | "popularity"
  | "category";
export type ServiceSortOrder = "asc" | "desc";
