
// Service-related types and interfaces
export type ServiceCategory = 
  | 'cabelo' 
  | 'barba' 
  | 'manicure' 
  | 'pedicure' 
  | 'estetica' 
  | 'massagem' 
  | 'outros';

export type ServiceSortField = 'name' | 'price' | 'duration' | 'category' | 'created_at';
export type ServiceSortOrder = 'asc' | 'desc';

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  price: number;
  duration: number;
  is_active: boolean;
  commission_percentage?: number;
  image_url?: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}
