
// Professional-related types and interfaces
export type ProfessionalSortField = 'name' | 'email' | 'rating' | 'created_at' | 'commission';
export type ProfessionalSortOrder = 'asc' | 'desc';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  rating?: number;
  total_reviews?: number;
  status: 'active' | 'inactive';
  working_hours?: any;
  business_id: string;
  created_at: string;
  updated_at: string;
  commission?: number; // Adding missing commission field
}
