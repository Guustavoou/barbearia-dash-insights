// Multi-tenant types for multiple establishments

export interface Establishment {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj?: string;
  address: string;
  cep: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  logo_url?: string;
  banner_url?: string;
  subscription_plan?: "free" | "basic" | "premium";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "owner" | "admin" | "manager" | "employee";
  establishment_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user: User;
  establishment: Establishment;
  token: string;
  permissions: string[];
}

export interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  switchEstablishment: (establishmentId: string) => Promise<void>;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  establishmentName: string;
  establishmentPhone: string;
  establishmentAddress: string;
}

// Multi-tenant service types
export interface EstablishmentService {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentProfessional {
  id: string;
  establishment_id: string;
  user_id?: string; // If professional is also a user
  name: string;
  email: string;
  phone: string;
  role: string;
  type: "employee" | "freelancer";
  photo_url?: string;
  calendar_color: string;
  work_days: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentClient {
  id: string;
  establishment_id: string;
  name: string;
  email?: string;
  phone: string;
  birth_date?: string;
  address?: string;
  notes?: string;
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentAppointment {
  id: string;
  establishment_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Onboarding types updated for multi-tenant
export interface MultiTenantOnboardingData {
  establishment: {
    name: string;
    email: string;
    phone: string;
    cnpj?: string;
    address: string;
    cep: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    logo?: File | string;
    banner?: File | string;
  };
  owner: {
    name: string;
    email: string;
    phone?: string;
    password?: string; // Only for new signups
  };
  services: EstablishmentService[];
  professionals: EstablishmentProfessional[];
  workingHours: WorkingHours[];
  currentStep: number;
  isCompleted: boolean;
}

export interface WorkingHours {
  id?: string;
  establishment_id?: string;
  day_of_week: string;
  is_open: boolean;
  open_time?: string;
  close_time?: string;
  lunch_break_start?: string;
  lunch_break_end?: string;
}

// Permission system
export const PERMISSIONS = {
  // Establishment management
  MANAGE_ESTABLISHMENT: "manage_establishment",
  VIEW_ESTABLISHMENT: "view_establishment",

  // User management
  MANAGE_USERS: "manage_users",
  VIEW_USERS: "view_users",

  // Services
  MANAGE_SERVICES: "manage_services",
  VIEW_SERVICES: "view_services",

  // Professionals
  MANAGE_PROFESSIONALS: "manage_professionals",
  VIEW_PROFESSIONALS: "view_professionals",

  // Clients
  MANAGE_CLIENTS: "manage_clients",
  VIEW_CLIENTS: "view_clients",

  // Appointments
  MANAGE_APPOINTMENTS: "manage_appointments",
  VIEW_APPOINTMENTS: "view_appointments",

  // Financial
  MANAGE_FINANCIAL: "manage_financial",
  VIEW_FINANCIAL: "view_financial",

  // Reports
  VIEW_REPORTS: "view_reports",
  EXPORT_REPORTS: "export_reports",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<User["role"], Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.VIEW_ESTABLISHMENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_SERVICES,
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.MANAGE_PROFESSIONALS,
    PERMISSIONS.VIEW_PROFESSIONALS,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.MANAGE_FINANCIAL,
    PERMISSIONS.VIEW_FINANCIAL,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  manager: [
    PERMISSIONS.VIEW_ESTABLISHMENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_SERVICES,
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.MANAGE_PROFESSIONALS,
    PERMISSIONS.VIEW_PROFESSIONALS,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.VIEW_FINANCIAL,
    PERMISSIONS.VIEW_REPORTS,
  ],
  employee: [
    PERMISSIONS.VIEW_ESTABLISHMENT,
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_PROFESSIONALS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.VIEW_FINANCIAL,
  ],
};
