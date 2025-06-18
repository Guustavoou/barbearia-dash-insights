
export interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  net_income: number;
  profit_margin: number;
  overview: any;
  data: any[];
  totalClients?: number;
  totalAppointments?: number; // Adding this missing property
}

export type PageType = 
  | "dashboard" 
  | "appointments" 
  | "clients" 
  | "professionals" 
  | "services" 
  | "payments" 
  | "reports" 
  | "settings"
  | "stock"
  | "financial"
  | "marketing" 
  | "documents"
  | "database-emergency";

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
  birthday?: string;
  notes?: string;
  status: 'active' | 'inactive';
  business_id: string;
  created_at: string;
  updated_at: string;
  total_spent?: number;
  last_visit?: string;
  visits?: number;
  joinDate?: string;
  join_date?: string;
  createdAt?: string;
  updatedAt?: string;
  totalSpent?: number;
  lastVisit?: string;
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
  status: 'active' | 'inactive'; // Fixed to use English values
  notes?: string;
  createdAt?: string;
  totalSpent?: number;
  visitCount?: number;
  avgInterval?: number;
  visits?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  is_active: boolean;
  business_id: string;
  created_at: string;
  updated_at: string;
}

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
  commission?: number;
}

export interface Appointment {
  id: string;
  client_id: string; // Using snake_case consistently
  professional_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  price: number;
  business_id: string;
  created_at: string;
  updated_at: string;
  time?: string; // Adding for compatibility
}

export interface Birthday {
  id: string;
  name: string;
  date: string;
  age?: number;
  // Removing clientId, clientName as they're not in the interface
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses?: number;
  profit?: number;
  // Note: using month instead of date for RevenueData
}
