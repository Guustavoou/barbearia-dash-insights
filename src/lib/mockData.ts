
import {
  Client,
  Appointment,
  Service,
  Birthday,
  RevenueData,
  DashboardData,
} from "./types";

export const clients: Client[] = [
  {
    id: "1",
    name: "Ana Silva Santos",
    email: "ana.silva@email.com",
    phone: "(11) 99999-1111",
    city: "São Paulo",
    last_visit: "2025-05-15",
    total_spent: 850.0,
    status: "ativo",
    join_date: "2024-03-10",
    visits: 8,
    notes: "Prefere horários pela manhã. Cliente muito pontual e educada.",
    cpf: "123.456.789-00",
    profession: "Designer Gráfica",
    barbershop_id: "barbershop-1",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2025-05-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Carlos Roberto Lima",
    email: "carlos.lima@email.com",
    phone: "(11) 88888-2222",
    city: "São Paulo",
    last_visit: "2025-06-02",
    total_spent: 420.0,
    status: "ativo",
    join_date: "2024-01-15",
    visits: 6,
    notes: "Cliente pontual, prefere agendamentos no final de semana.",
    cpf: "987.654.321-00",
    profession: "Advogado",
    barbershop_id: "barbershop-1",
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2025-06-02T16:00:00Z",
  },
  {
    id: "3",
    name: "Mariana Costa Oliveira",
    email: "mariana.costa@email.com",
    phone: "(11) 77777-3333",
    city: "Santo André",
    last_visit: "2025-04-28",
    total_spent: 1200.0,
    status: "ativo",
    join_date: "2023-09-05",
    visits: 12,
    notes: "Cliente VIP. Sempre agenda serviços premium.",
    cpf: "456.789.123-00",
    profession: "Empresária",
    barbershop_id: "barbershop-1",
    created_at: "2023-09-05T11:00:00Z",
    updated_at: "2025-04-28T15:30:00Z",
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 66666-4444",
    city: "Osasco",
    last_visit: "2025-03-10",
    total_spent: 320.0,
    status: "inativo",
    join_date: "2024-07-20",
    visits: 4,
    notes: "Cliente esporádico, só agenda em ocasiões especiais.",
    cpf: "321.654.987-00",
    profession: "Engenheiro",
    barbershop_id: "barbershop-1",
    created_at: "2024-07-20T08:30:00Z",
    updated_at: "2025-03-10T12:00:00Z",
  },
  {
    id: "5",
    name: "Julia Fernandes",
    email: "julia.fernandes@email.com",
    phone: "(11) 55555-5555",
    city: "São Paulo",
    last_visit: "2025-06-08",
    total_spent: 680.0,
    status: "ativo",
    join_date: "2024-05-12",
    visits: 9,
    notes: "Sempre traz amigas como indicação.",
    cpf: "789.123.456-00",
    profession: "Professora",
    barbershop_id: "barbershop-1",
    created_at: "2024-05-12T13:00:00Z",
    updated_at: "2025-06-08T17:00:00Z",
  },
  {
    id: "6",
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(11) 44444-6666",
    city: "São Paulo",
    last_visit: "2025-06-05",
    total_spent: 560.0,
    status: "ativo",
    join_date: "2024-04-08",
    visits: 7,
    notes: "Cliente fiel, sempre pontual.",
    cpf: "654.321.987-00",
    profession: "Contador",
    barbershop_id: "barbershop-1",
    created_at: "2024-04-08T10:30:00Z",
    updated_at: "2025-06-05T14:00:00Z",
  },
];

export const revenueData: RevenueData[] = [
  { month: "Jan", value: 12000 },
  { month: "Fev", value: 14500 },
  { month: "Mar", value: 16800 },
  { month: "Abr", value: 15200 },
  { month: "Mai", value: 18200 },
  { month: "Jun", value: 18750 },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    client_id: "1",
    service_id: "service-1",
    professional_id: "prof-1",
    appointment_date: "2025-06-13",
    appointment_time: "09:00",
    duration: 60,
    price: 45.0,
    status: "confirmado",
    notes: null,
    barbershop_id: "barbershop-1",
    created_at: "2025-06-12T10:00:00Z",
    updated_at: "2025-06-12T10:00:00Z",
    clients: {
      name: "Ana Silva"
    },
    services: {
      name: "Corte + Escova"
    }
  },
  {
    id: "2",
    client_id: "2",
    service_id: "service-2",
    professional_id: "prof-1",
    appointment_date: "2025-06-13",
    appointment_time: "10:30",
    duration: 30,
    price: 25.0,
    status: "agendado",
    notes: null,
    barbershop_id: "barbershop-1",
    created_at: "2025-06-12T11:00:00Z",
    updated_at: "2025-06-12T11:00:00Z",
    clients: {
      name: "Carlos Lima"
    },
    services: {
      name: "Barba"
    }
  },
  {
    id: "3",
    client_id: "3",
    service_id: "service-3",
    professional_id: "prof-2",
    appointment_date: "2025-06-13",
    appointment_time: "14:00",
    duration: 45,
    price: 35.0,
    status: "confirmado",
    notes: null,
    barbershop_id: "barbershop-1",
    created_at: "2025-06-12T12:00:00Z",
    updated_at: "2025-06-12T12:00:00Z",
    clients: {
      name: "Maria Costa"
    },
    services: {
      name: "Manicure"
    }
  },
  {
    id: "4",
    client_id: "4",
    service_id: "service-1",
    professional_id: "prof-1",
    appointment_date: "2025-06-13",
    appointment_time: "15:30",
    duration: 45,
    price: 40.0,
    status: "agendado",
    notes: null,
    barbershop_id: "barbershop-1",
    created_at: "2025-06-12T13:00:00Z",
    updated_at: "2025-06-12T13:00:00Z",
    clients: {
      name: "João Santos"
    },
    services: {
      name: "Corte"
    }
  },
];

export const birthdays: Birthday[] = [
  { name: "Ana Silva", date: "Hoje" },
  { name: "Pedro Santos", date: "Amanhã" },
  { name: "Julia Fernandes", date: "12/06" },
];

// Define a separate interface for top services with additional properties
interface TopService {
  name: string;
  count: number;
  revenue: number;
}

export const topServices: TopService[] = [
  { name: "Corte + Escova", count: 45, revenue: 4500 },
  { name: "Manicure", count: 32, revenue: 1280 },
  { name: "Barba", count: 28, revenue: 1120 },
  { name: "Hidratação", count: 22, revenue: 1760 },
];

export const cities = ["São Paulo", "Santo André", "Osasco"];

export const dashboardData: DashboardData = {
  revenue: {
    current: 18750,
    growth: 15.8,
    accumulated: 95200,
    best: 21400,
  },
  appointments: {
    total: 245,
    variation: 12,
  },
  clients: {
    active: clients.filter((c) => c.status === "ativo").length,
    new: 12,
    retention: 92,
  },
  satisfaction: 4.8,
  services: {
    completed: 198,
    completion: 89,
  },
  insights: {
    peakHour: "14:00 - 16:00",
    cancellations: 8,
    revenueStatus: "acima",
  },
};
