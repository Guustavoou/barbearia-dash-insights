
export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  last_visit: string | null; // Changed from lastVisit to match DB
  total_spent: number; // Changed from totalSpent to match DB
  status: "ativo" | "inativo";
  join_date: string | null; // Changed from joinDate to match DB
  visits: number;
  notes: string | null;
  cpf: string | null;
  profession: string | null;
  barbershop_id: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  service_id: string;
  professional_id: string | null;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  price: number;
  status: "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou";
  notes: string | null;
  barbershop_id: string;
  created_at: string;
  updated_at: string;
  // Optional joined data
  clients?: {
    name: string;
  };
  services?: {
    name: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration: number;
  commission: number;
  is_active: boolean;
  popularity: number;
  average_rating: number;
  professionals: string[] | null;
  barbershop_id: string;
  created_at: string;
  updated_at: string;
}

export interface Birthday {
  name: string;
  date: string;
}

export interface RevenueData {
  month: string;
  value: number;
}

export interface DashboardData {
  revenue: {
    current: number;
    growth: number;
    accumulated: number;
    best: number;
  };
  appointments: {
    total: number;
    variation: number;
  };
  clients: {
    active: number;
    new: number;
    retention: number;
  };
  satisfaction: number;
  services: {
    completed: number;
    completion: number;
  };
  insights: {
    peakHour: string;
    cancellations: number;
    revenueStatus: string;
  };
}

export type PageType =
  | "dashboard"
  | "clients"
  | "appointments"
  | "calendar"
  | "services"
  | "reports"
  | "settings"
  | "help"
  | "professionals"
  | "stock"
  | "financial"
  | "payments"
  | "marketing"
  | "documents";

export type SortField = "name" | "last_visit" | "total_spent" | "join_date";
export type SortOrder = "asc" | "desc";
export type ViewMode = "cards" | "list";
export type StatusFilter = "todos" | "ativos" | "inativos";
