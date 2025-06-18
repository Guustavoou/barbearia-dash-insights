
import {
  Client,
  Service,
  Professional,
  Appointment,
  Birthday,
  RevenueData,
  DashboardStats as DashboardData
} from './types';

// Mock Clients Data - Fixed to use English status values
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1985-03-15',
    birth_date: '1985-03-15',
    totalSpent: 450.00,
    total_spent: 450.00,
    visits: 8,
    lastVisit: '2024-01-15',
    last_visit: '2024-01-15',
    createdAt: '2023-01-15T10:00:00Z',
    created_at: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    joinDate: '2023-01-15T10:00:00Z',
    join_date: '2023-01-15T10:00:00Z',
    notes: 'Cliente preferencial, gosta de cortes modernos',
    business_id: 'business-1'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 88888-8888',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1990-07-22',
    birth_date: '1990-07-22',
    totalSpent: 320.00,
    total_spent: 320.00,
    visits: 5,
    lastVisit: '2024-01-10',
    last_visit: '2024-01-10',
    createdAt: '2023-06-10T09:00:00Z',
    created_at: '2023-06-10T09:00:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    updated_at: '2024-01-10T16:20:00Z',
    joinDate: '2023-06-10T09:00:00Z',
    join_date: '2023-06-10T09:00:00Z',
    notes: 'Alérgico a alguns produtos',
    business_id: 'business-1'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 77777-7777',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1982-12-08',
    birth_date: '1982-12-08',
    totalSpent: 680.00,
    total_spent: 680.00,
    visits: 12,
    lastVisit: '2024-01-18',
    last_visit: '2024-01-18',
    createdAt: '2022-11-20T11:30:00Z',
    created_at: '2022-11-20T11:30:00Z',
    updatedAt: '2024-01-18T15:45:00Z',
    updated_at: '2024-01-18T15:45:00Z',
    joinDate: '2022-11-20T11:30:00Z',
    join_date: '2022-11-20T11:30:00Z',
    notes: 'Cliente VIP, sempre agenda com antecedência',
    business_id: 'business-1'
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 66666-6666',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1995-05-30',
    birth_date: '1995-05-30',
    totalSpent: 180.00,
    total_spent: 180.00,
    visits: 3,
    lastVisit: '2024-01-05',
    last_visit: '2024-01-05',
    createdAt: '2023-10-05T13:15:00Z',
    created_at: '2023-10-05T13:15:00Z',
    updatedAt: '2024-01-05T10:30:00Z',
    updated_at: '2024-01-05T10:30:00Z',
    joinDate: '2023-10-05T13:15:00Z',
    join_date: '2023-10-05T13:15:00Z',
    notes: 'Novo cliente, gosta de estilos clássicos',
    business_id: 'business-1'
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '(11) 55555-5555',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1988-09-12',
    birth_date: '1988-09-12',
    totalSpent: 520.00,
    total_spent: 520.00,
    visits: 9,
    lastVisit: '2024-01-12',
    last_visit: '2024-01-12',
    createdAt: '2023-03-12T08:45:00Z',
    created_at: '2023-03-12T08:45:00Z',
    updatedAt: '2024-01-12T17:00:00Z',
    updated_at: '2024-01-12T17:00:00Z',
    joinDate: '2023-03-12T08:45:00Z',
    join_date: '2023-03-12T08:45:00Z',
    notes: 'Prefere atendimento pela manhã',
    business_id: 'business-1'
  },
  {
    id: '6',
    name: 'Roberto Ferreira',
    email: 'roberto.ferreira@email.com',
    phone: '(11) 44444-4444',
    city: 'São Paulo',
    status: 'active', // Fixed: using English value
    birthday: '1975-11-25',
    birth_date: '1975-11-25',
    totalSpent: 290.00,
    total_spent: 290.00,
    visits: 6,
    lastVisit: '2024-01-08',
    last_visit: '2024-01-08',
    createdAt: '2023-07-25T14:20:00Z',
    created_at: '2023-07-25T14:20:00Z',
    updatedAt: '2024-01-08T12:15:00Z',
    updated_at: '2024-01-08T12:15:00Z',
    joinDate: '2023-07-25T14:20:00Z',
    join_date: '2023-07-25T14:20:00Z',
    notes: 'Cliente pontual, nunca falta',
    business_id: 'business-1'
  }
];

// Export as clients for backward compatibility
export const clients = mockClients;

// Mock Appointments Data - Fixed property names
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    client_id: '1', // Fixed: using snake_case
    professional_id: '1',
    service_id: '1',
    date: '2024-01-25',
    start_time: '09:00',
    end_time: '10:00',
    time: '09:00', // Adding for compatibility
    status: 'agendado',
    price: 60.00,
    notes: 'Corte e escova',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    business_id: 'business-1'
  },
  {
    id: '2',
    client_id: '2', // Fixed: using snake_case
    professional_id: '2',
    service_id: '2',
    date: '2024-01-25',
    start_time: '10:30',
    end_time: '12:30',
    time: '10:30', // Adding for compatibility
    status: 'agendado',
    price: 120.00,
    notes: 'Coloração especial',
    created_at: '2024-01-22T14:30:00Z',
    updated_at: '2024-01-22T14:30:00Z',
    business_id: 'business-1'
  },
  {
    id: '3',
    client_id: '3', // Fixed: using snake_case
    professional_id: '1',
    service_id: '3',
    date: '2024-01-25',
    start_time: '14:00',
    end_time: '14:45',
    time: '14:00', // Adding for compatibility
    status: 'agendado',
    price: 40.00,
    notes: 'Só escova',
    created_at: '2024-01-23T09:15:00Z',
    updated_at: '2024-01-23T09:15:00Z',
    business_id: 'business-1'
  }
];

// Add missing upcomingAppointments export to fix runtime error
export const upcomingAppointments = mockAppointments.filter(apt => 
  new Date(apt.date) >= new Date() && apt.status === 'agendado'
);

// Mock Services Data - Fixed property names
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Feminino',
    description: 'Corte de cabelo feminino com modelagem',
    price: 60.00,
    duration: 60,
    category: 'Corte',
    is_active: true, // Fixed: using snake_case
    business_id: 'business-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Coloração',
    description: 'Coloração completa do cabelo',
    price: 120.00,
    duration: 120,
    category: 'Coloração',
    is_active: true, // Fixed: using snake_case
    business_id: 'business-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Escova',
    description: 'Escova e finalização',
    price: 40.00,
    duration: 45,
    category: 'Finalização',
    is_active: true, // Fixed: using snake_case
    business_id: 'business-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Mock Professionals Data - Fixed status values
export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carla Mendes',
    email: 'carla.mendes@salon.com',
    phone: '(11) 99999-1111',
    bio: 'Especialista em Cortes e Escova',
    commission: 0.40,
    status: 'active', // Fixed: using English value
    business_id: 'business-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Beatriz Costa',
    email: 'beatriz.costa@salon.com',
    phone: '(11) 99999-2222',
    bio: 'Especialista em Coloração e Química',
    commission: 0.45,
    status: 'active', // Fixed: using English value
    business_id: 'business-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Mock Birthday Data - Fixed to match interface
export const mockBirthdays: Birthday[] = [
  {
    id: '1',
    name: 'Maria Silva',
    date: '2024-03-15',
    age: 39
  },
  {
    id: '2',
    name: 'Ana Costa',
    date: '2024-12-08',
    age: 42
  }
];

// Mock Revenue Data - Fixed to use month instead of date
export const mockRevenueData: RevenueData[] = [
  { month: '2024-01', revenue: 450, expenses: 200, profit: 250 },
  { month: '2024-02', revenue: 380, expenses: 180, profit: 200 },
  { month: '2024-03', revenue: 520, expenses: 220, profit: 300 },
  { month: '2024-04', revenue: 290, expenses: 150, profit: 140 },
  { month: '2024-05', revenue: 640, expenses: 280, profit: 360 }
];

// Mock Dashboard Data - Fixed to match interface
export const mockDashboardData: DashboardData = {
  total_revenue: 15420.00,
  total_expenses: 8500.00,
  net_income: 6920.00,
  profit_margin: 44.9,
  overview: {
    totalClients: 150,
    monthlyRevenue: 15420.00,
    pendingAppointments: 12,
    completedAppointments: 33
  },
  data: mockRevenueData,
  totalClients: 150,
  totalAppointments: 45 // Fixed: added missing property
};

// Add missing export for revenueData
export const revenueData = mockRevenueData;

// Add missing export for birthdays and dashboardData
export const birthdays = mockBirthdays;
export const dashboardData = mockDashboardData;

// Add missing export for topServices
export const topServices = [
  {
    id: '1',
    name: 'Corte Feminino',
    count: 45,
    revenue: 2700.00,
    percentage: 35
  },
  {
    id: '2',
    name: 'Coloração',
    count: 30,
    revenue: 3600.00,
    percentage: 25
  },
  {
    id: '3',
    name: 'Escova',
    count: 25,
    revenue: 1000.00,
    percentage: 20
  },
  {
    id: '4',
    name: 'Corte Masculino',
    count: 20,
    revenue: 800.00,
    percentage: 15
  },
  {
    id: '5',
    name: 'Manicure',
    count: 15,
    revenue: 450.00,
    percentage: 12
  }
];
