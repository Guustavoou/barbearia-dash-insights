export interface Professional {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  status: "ativo" | "inativo" | "ferias";
  commission: number; // percentage
  workDays: string[]; // ['monday', 'tuesday', etc.]
  workHours: {
    start: string;
    end: string;
  };
  hiredDate: Date;
  rating: number;
  totalServices: number;
  totalRevenue: number;
  completedServices: number;
  cancelledServices: number;
  bio?: string;
  experience: number; // years
  certifications: string[];
  isOwner?: boolean;
}

export interface ProfessionalStats {
  totalProfessionals: number;
  activeProfessionals: number;
  totalRevenue: number;
  averageRating: number;
  totalServices: number;
  averageCommission: number;
}

export interface ProfessionalFormData {
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  commission: number;
  workDays: string[];
  workHours: {
    start: string;
    end: string;
  };
  bio: string;
  experience: number;
  certifications: string[];
}

export interface WorkSchedule {
  professionalId: number;
  date: Date;
  timeSlots: {
    start: string;
    end: string;
    isAvailable: boolean;
    serviceId?: number;
    clientName?: string;
  }[];
}

export type ProfessionalSortField =
  | "name"
  | "rating"
  | "totalServices"
  | "totalRevenue"
  | "hiredDate";
export type ProfessionalSortOrder = "asc" | "desc";
export type ProfessionalStatus = "ativo" | "inativo" | "ferias";
