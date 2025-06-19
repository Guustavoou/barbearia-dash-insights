export interface BusinessInfo {
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
}

export interface ServiceTemplate {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category: string;
}

export interface OnboardingService {
  id?: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category: string;
  active: boolean;
}

export interface OnboardingProfessional {
  id?: string;
  name: string;
  role: string;
  type: "employee" | "freelancer";
  email: string;
  phone: string;
  photo?: File | string;
  calendarColor: string;
  services: string[];
  workDays: string[];
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lunchBreak?: {
    start: string;
    end: string;
  };
}

export interface OnboardingData {
  businessInfo: BusinessInfo;
  services: OnboardingService[];
  professionals: OnboardingProfessional[];
  workingHours: WorkingHours[];
  currentStep: number;
  isCompleted: boolean;
}

export interface OnboardingContextType {
  data: OnboardingData;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  addService: (service: OnboardingService) => void;
  updateService: (id: string, service: Partial<OnboardingService>) => void;
  removeService: (id: string) => void;
  addProfessional: (professional: OnboardingProfessional) => void;
  updateProfessional: (
    id: string,
    professional: Partial<OnboardingProfessional>,
  ) => void;
  removeProfessional: (id: string) => void;
  updateWorkingHours: (hours: WorkingHours[]) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
  saveProgress: () => void;
  loadProgress: () => void;
}

export const serviceTemplates: ServiceTemplate[] = [
  {
    id: "1",
    name: "Corte Masculino",
    duration: 30,
    price: 25,
    description: "Corte de cabelo masculino tradicional",
    category: "Cabelo",
  },
  {
    id: "2",
    name: "Corte Feminino",
    duration: 45,
    price: 40,
    description: "Corte de cabelo feminino",
    category: "Cabelo",
  },
  {
    id: "3",
    name: "Barba",
    duration: 20,
    price: 15,
    description: "Corte e aparação de barba",
    category: "Barba",
  },
  {
    id: "4",
    name: "Sobrancelha",
    duration: 15,
    price: 12,
    description: "Design de sobrancelha",
    category: "Sobrancelha",
  },
  {
    id: "5",
    name: "Escova",
    duration: 40,
    price: 30,
    description: "Escova modeladora",
    category: "Cabelo",
  },
  {
    id: "6",
    name: "Hidratação",
    duration: 60,
    price: 50,
    description: "Tratamento de hidratação capilar",
    category: "Tratamento",
  },
  {
    id: "7",
    name: "Manicure",
    duration: 45,
    price: 20,
    description: "Cuidados com as unhas das mãos",
    category: "Unhas",
  },
  {
    id: "8",
    name: "Pedicure",
    duration: 60,
    price: 25,
    description: "Cuidados com as unhas dos pés",
    category: "Unhas",
  },
];

export const defaultWorkingHours: WorkingHours[] = [
  { day: "Segunda", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Terça", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Quarta", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Quinta", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Sexta", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Sábado", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Domingo", isOpen: false, openTime: "09:00", closeTime: "18:00" },
];
