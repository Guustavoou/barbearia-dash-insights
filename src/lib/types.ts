
// Core business types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  status: 'ativo' | 'inativo';
  birthday?: string;
  totalSpent?: number;
  visits?: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  joinDate?: string; // For compatibility
  // Legacy field mappings for backward compatibility
  total_spent?: number;
  last_visit?: string;
  join_date?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  commissionRate: number;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'faltou';
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  costPrice: number;
  price: number;
  currentStock: number;
  minStock: number;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  amount: number;
  paymentMethod?: string;
  appointmentId?: string;
  description?: string;
  date: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
}

// UI and application types
export type PageType = 
  | 'dashboard' 
  | 'appointments' 
  | 'clients' 
  | 'professionals' 
  | 'services' 
  | 'stock' 
  | 'financial' 
  | 'reports' 
  | 'settings'
  | 'calendar'
  | 'marketing'
  | 'payments'
  | 'documents'
  | 'help';

export interface DashboardStats {
  totalClients: number;
  totalAppointments: number;
  totalServices: number;
  totalProfessionals: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form and validation types
export interface FormErrors {
  [key: string]: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  status?: string;
  category?: string;
}
