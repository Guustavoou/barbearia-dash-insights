
import {
  Client,
  Service,
  Professional,
  Appointment,
  Birthday,
  RevenueData,
  DashboardStats as DashboardData
} from './types';

// Mock Clients Data
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1985-03-15',
    totalSpent: 450.00,
    visits: 8,
    lastVisit: '2024-01-15',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    notes: 'Cliente preferencial, gosta de cortes modernos'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 88888-8888',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1990-07-22',
    totalSpent: 320.00,
    visits: 5,
    lastVisit: '2024-01-10',
    createdAt: '2023-06-10T09:00:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    notes: 'Alérgico a alguns produtos'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 77777-7777',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1982-12-08',
    totalSpent: 680.00,
    visits: 12,
    lastVisit: '2024-01-18',
    createdAt: '2022-11-20T11:30:00Z',
    updatedAt: '2024-01-18T15:45:00Z',
    notes: 'Cliente VIP, sempre agenda com antecedência'
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 66666-6666',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1995-05-30',
    totalSpent: 180.00,
    visits: 3,
    lastVisit: '2024-01-05',
    createdAt: '2023-10-05T13:15:00Z',
    updatedAt: '2024-01-05T10:30:00Z',
    notes: 'Novo cliente, gosta de estilos clássicos'
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '(11) 55555-5555',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1988-09-12',
    totalSpent: 520.00,
    visits: 9,
    lastVisit: '2024-01-12',
    createdAt: '2023-03-12T08:45:00Z',
    updatedAt: '2024-01-12T17:00:00Z',
    notes: 'Prefere atendimento pela manhã'
  },
  {
    id: '6',
    name: 'Roberto Ferreira',
    email: 'roberto.ferreira@email.com',
    phone: '(11) 44444-4444',
    city: 'São Paulo',
    status: 'ativo',
    birthday: '1975-11-25',
    totalSpent: 290.00,
    visits: 6,
    lastVisit: '2024-01-08',
    createdAt: '2023-07-25T14:20:00Z',
    updatedAt: '2024-01-08T12:15:00Z',
    notes: 'Cliente pontual, nunca falta'
  }
];

// Mock Appointments Data
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    professionalId: '1',
    serviceId: '1',
    date: '2024-01-25',
    time: '09:00',
    status: 'agendado',
    price: 60.00,
    notes: 'Corte e escova',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    clientId: '2',
    professionalId: '2',
    serviceId: '2',
    date: '2024-01-25',
    time: '10:30',
    status: 'agendado',
    price: 120.00,
    notes: 'Coloração especial',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  },
  {
    id: '3',
    clientId: '3',
    professionalId: '1',
    serviceId: '3',
    date: '2024-01-25',
    time: '14:00',
    status: 'agendado',
    price: 40.00,
    notes: 'Só escova',
    createdAt: '2024-01-23T09:15:00Z',
    updatedAt: '2024-01-23T09:15:00Z'
  }
];

// Mock Services Data
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Feminino',
    description: 'Corte de cabelo feminino com modelagem',
    price: 60.00,
    duration: 60,
    category: 'Corte',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Coloração',
    description: 'Coloração completa do cabelo',
    price: 120.00,
    duration: 120,
    category: 'Coloração',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Escova',
    description: 'Escova e finalização',
    price: 40.00,
    duration: 45,
    category: 'Finalização',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

// Mock Professionals Data
export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carla Mendes',
    email: 'carla.mendes@salon.com',
    phone: '(11) 99999-1111',
    specialty: 'Cortes e Escova',
    commissionRate: 0.40,
    status: 'ativo',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Beatriz Costa',
    email: 'beatriz.costa@salon.com',
    phone: '(11) 99999-2222',
    specialty: 'Coloração e Química',
    commissionRate: 0.45,
    status: 'ativo',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

// Mock Birthday Data
export const mockBirthdays: Birthday[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Maria Silva',
    date: '2024-03-15',
    age: 39
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Ana Costa',
    date: '2024-12-08',
    age: 42
  }
];

// Mock Revenue Data
export const mockRevenueData: RevenueData[] = [
  { date: '2024-01-01', revenue: 450, appointments: 8 },
  { date: '2024-01-02', revenue: 380, appointments: 6 },
  { date: '2024-01-03', revenue: 520, appointments: 9 },
  { date: '2024-01-04', revenue: 290, appointments: 5 },
  { date: '2024-01-05', revenue: 640, appointments: 11 }
];

// Mock Dashboard Data
export const mockDashboardData: DashboardData = {
  totalClients: 150,
  totalAppointments: 45,
  totalServices: 12,
  totalProfessionals: 5,
  todayAppointments: 8,
  monthlyRevenue: 15420.00,
  pendingAppointments: 12,
  completedAppointments: 33
};

// Add missing export for birthdays and dashboardData
export const birthdays = mockBirthdays;
export const dashboardData = mockDashboardData;
