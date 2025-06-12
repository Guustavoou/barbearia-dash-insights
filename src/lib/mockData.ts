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
    id: 1,
    name: "Ana Silva Santos",
    email: "ana.silva@email.com",
    phone: "(11) 99999-1111",
    city: "São Paulo",
    lastVisit: new Date(2025, 4, 15),
    totalSpent: 850.0,
    status: "ativo",
    joinDate: new Date(2024, 2, 10),
    visits: 8,
    notes: "Prefere horários pela manhã. Cliente muito pontual e educada.",
    cpf: "123.456.789-00",
    profession: "Designer Gráfica",
  },
  {
    id: 2,
    name: "Carlos Roberto Lima",
    email: "carlos.lima@email.com",
    phone: "(11) 88888-2222",
    city: "São Paulo",
    lastVisit: new Date(2025, 5, 2),
    totalSpent: 420.0,
    status: "ativo",
    joinDate: new Date(2024, 0, 15),
    visits: 6,
    notes: "Cliente pontual, prefere agendamentos no final de semana.",
    cpf: "987.654.321-00",
    profession: "Advogado",
  },
  {
    id: 3,
    name: "Mariana Costa Oliveira",
    email: "mariana.costa@email.com",
    phone: "(11) 77777-3333",
    city: "Santo André",
    lastVisit: new Date(2025, 3, 28),
    totalSpent: 1200.0,
    status: "ativo",
    joinDate: new Date(2023, 8, 5),
    visits: 12,
    notes: "Cliente VIP. Sempre agenda serviços premium.",
    cpf: "456.789.123-00",
    profession: "Empresária",
  },
  {
    id: 4,
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 66666-4444",
    city: "Osasco",
    lastVisit: new Date(2025, 2, 10),
    totalSpent: 320.0,
    status: "inativo",
    joinDate: new Date(2024, 6, 20),
    visits: 4,
    notes: "Cliente esporádico, só agenda em ocasiões especiais.",
    cpf: "321.654.987-00",
    profession: "Engenheiro",
  },
  {
    id: 5,
    name: "Julia Fernandes",
    email: "julia.fernandes@email.com",
    phone: "(11) 55555-5555",
    city: "São Paulo",
    lastVisit: new Date(2025, 5, 8),
    totalSpent: 680.0,
    status: "ativo",
    joinDate: new Date(2024, 4, 12),
    visits: 9,
    notes: "Sempre traz amigas como indicação.",
    cpf: "789.123.456-00",
    profession: "Professora",
  },
  {
    id: 6,
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(11) 44444-6666",
    city: "São Paulo",
    lastVisit: new Date(2025, 5, 5),
    totalSpent: 560.0,
    status: "ativo",
    joinDate: new Date(2024, 3, 8),
    visits: 7,
    notes: "Cliente fiel, sempre pontual.",
    cpf: "654.321.987-00",
    profession: "Contador",
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
    id: 1,
    client: "Ana Silva",
    service: "Corte + Escova",
    time: "09:00",
    status: "confirmado",
  },
  {
    id: 2,
    client: "Carlos Lima",
    service: "Barba",
    time: "10:30",
    status: "agendado",
  },
  {
    id: 3,
    client: "Maria Costa",
    service: "Manicure",
    time: "14:00",
    status: "confirmado",
  },
  {
    id: 4,
    client: "João Santos",
    service: "Corte",
    time: "15:30",
    status: "pendente",
  },
];

export const birthdays: Birthday[] = [
  { name: "Ana Silva", date: "Hoje" },
  { name: "Pedro Santos", date: "Amanhã" },
  { name: "Julia Fernandes", date: "12/06" },
];

export const topServices: Service[] = [
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
