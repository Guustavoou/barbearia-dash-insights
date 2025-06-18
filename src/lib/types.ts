
export interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  net_income: number;
  profit_margin: number;
  overview: any;
  data: any[];
}

export type PageType = 
  | "dashboard" 
  | "appointments" 
  | "clients" 
  | "professionals" 
  | "services" 
  | "payments" 
  | "reports" 
  | "settings";

// Client types
export type ClientSortField = 'name' | 'email' | 'created_at' | 'total_spent' | 'last_visit';
export type ClientSortOrder = 'asc' | 'desc';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  birth_date?: string;
  notes?: string;
  status: 'active' | 'inactive';
  business_id: string;
  created_at: string;
  updated_at: string;
  total_spent?: number;
  last_visit?: string;
}

// NeonClient interface for compatibility
export interface NeonClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  business_id: string;
  created_at: string;
  total_spent: number;
  status: 'ativo' | 'inativo';
  notes?: string;
  createdAt?: string;
  totalSpent?: number;
  visitCount?: number;
  avgInterval?: number;
  visits?: any[];
}
