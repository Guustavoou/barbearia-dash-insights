
export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  bio?: string;
  status: "active" | "inactive";
  working_hours?: Record<string, any>;
  rating?: number;
  total_reviews?: number;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export type ProfessionalSortField = "name" | "email" | "phone" | "status" | "rating" | "total_reviews";

export type ProfessionalSortOrder = "asc" | "desc";

export interface ProfessionalFilters {
  search?: string;
  status?: string;
  sortField?: ProfessionalSortField;
  sortOrder?: ProfessionalSortOrder;
}

export interface CreateProfessionalData {
  name: string;
  email: string;
  phone: string;
  bio?: string;
  working_hours?: Record<string, any>;
}

export interface UpdateProfessionalData extends Partial<CreateProfessionalData> {
  status?: "active" | "inactive";
  avatar_url?: string;
}
