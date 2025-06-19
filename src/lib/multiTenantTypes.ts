
export interface Establishment {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  address: string;
  cep: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  establishment_id: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstablishmentProfessional {
  id: string;
  name: string;
  establishment_id: string;
  email?: string;
  phone?: string;
  role?: string;
  type?: string;
  specialties?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  bio?: string;
}

export interface WorkingHours {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start?: string;
  break_end?: string;
}

export const defaultWorkingHours: WorkingHours[] = [
  { day_of_week: 0, is_open: false, open_time: '09:00', close_time: '18:00' }, // Sunday
  { day_of_week: 1, is_open: true, open_time: '09:00', close_time: '18:00' },  // Monday
  { day_of_week: 2, is_open: true, open_time: '09:00', close_time: '18:00' },  // Tuesday
  { day_of_week: 3, is_open: true, open_time: '09:00', close_time: '18:00' },  // Wednesday
  { day_of_week: 4, is_open: true, open_time: '09:00', close_time: '18:00' },  // Thursday
  { day_of_week: 5, is_open: true, open_time: '09:00', close_time: '18:00' },  // Friday
  { day_of_week: 6, is_open: false, open_time: '09:00', close_time: '18:00' }, // Saturday
];

// Add missing UserSession interface
export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  establishment: {
    id: string;
    name: string;
  };
}

// Add missing MultiTenantOnboardingData interface
export interface MultiTenantOnboardingData {
  establishment: Partial<Establishment>;
  owner: {
    name: string;
    email: string;
    phone?: string;
  };
  services: EstablishmentService[];
  professionals: EstablishmentProfessional[];
  workingHours: WorkingHours[];
  currentStep: number;
  isCompleted: boolean;
}
