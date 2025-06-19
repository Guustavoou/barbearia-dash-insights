
export interface AppointmentItem {
  id: number;
  client: string;
  clientId: number;
  service: string;
  date: Date;
  time: string;
  duration: number;
  status: "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou" | "pendente" | "finalizado" | "no_show";
  price: number;
  notes?: string;
  professional?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: AppointmentItem[];
}

export interface AppointmentStats {
  total: number;
  concluidos: number;
  agendados: number;
  cancelados: number;
  faltou: number;
  confirmados: number;
}

export type CalendarViewType = "mensal" | "semanal" | "calendario" | "lista";
export type AppointmentViewMode = "calendario" | "lista";

// Additional exports for compatibility
export interface AppointmentWithDetails extends AppointmentItem {
  clientName: string;
  serviceName: string;
  professionalName: string;
}

export type AppointmentStatus = "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou" | "pendente" | "finalizado" | "no_show" | "scheduled";

export type AppointmentSortField = "date" | "client" | "service" | "professional" | "status" | "price";

export type AppointmentSortOrder = "asc" | "desc";
