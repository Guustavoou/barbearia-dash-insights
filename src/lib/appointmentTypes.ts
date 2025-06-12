export interface AppointmentItem {
  id: number;
  client: string;
  clientId: number;
  service: string;
  date: Date;
  time: string;
  duration: number;
  status: "agendado" | "confirmado" | "concluido" | "cancelado" | "faltou";
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

export type CalendarViewType = "mensal" | "semanal";
export type AppointmentViewMode = "calendario" | "lista";
