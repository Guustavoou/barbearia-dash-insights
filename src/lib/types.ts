export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  lastVisit: Date;
  totalSpent: number;
  status: "ativo" | "inativo";
  joinDate: Date;
  visits: number;
  notes: string;
  cpf: string;
  profession: string;
}

export interface Appointment {
  id: number;
  client: string;
  service: string;
  time: string;
  status: "confirmado" | "agendado" | "pendente";
}

export interface Service {
  name: string;
  count: number;
  revenue: number;
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
  | "documents"
  | "testing"
  | "database-emergency";

export type SortField = "name" | "lastVisit" | "totalSpent" | "joinDate";
export type SortOrder = "asc" | "desc";
export type ViewMode = "cards" | "list";
export type StatusFilter = "todos" | "ativos" | "inativos";
