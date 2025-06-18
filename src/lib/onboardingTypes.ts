
export interface OnboardingBusiness {
  name: string;
  slug: string;
  adminEmail: string;
  phone: string;
  ein: string;
  legalName: string;
  tradeName: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  language: string;
  currency: string;
  timezone: string;
  // Additional properties used in components
  email?: string;
  cnpj?: string;
  cep?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  logo?: string;
  banner?: string;
}

export interface OnboardingProfessional {
  id?: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
  isActive: boolean;
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      start: string;
      end: string;
      breaks: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  // Additional properties used in components
  role?: string;
  type?: string;
  photo?: string;
  calendarColor?: string;
  services?: string[];
  workDays?: string[];
}

export interface OnboardingService {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

export interface OnboardingSchedule {
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      start: string;
      end: string;
      breaks: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  appointmentDuration: number;
  advanceBookingDays: number;
  minimumNoticeHours: number;
  allowOnlineBooking: boolean;
  requireAdvancePayment: boolean;
}

export interface OnboardingData {
  currentStep: number;
  business: Partial<OnboardingBusiness>;
  businessInfo?: Partial<OnboardingBusiness>; // For backward compatibility
  professionals: OnboardingProfessional[];
  services: OnboardingService[];
  schedule: Partial<OnboardingSchedule>;
  completed: boolean;
}

export interface OnboardingContextType {
  data: OnboardingData;
  updateBusiness: (business: Partial<OnboardingBusiness>) => void;
  updateBusinessInfo?: (business: Partial<OnboardingBusiness>) => void; // For backward compatibility
  addProfessional: (professional: OnboardingProfessional) => void;
  updateProfessional: (index: number, professional: Partial<OnboardingProfessional>) => void;
  removeProfessional: (index: number) => void;
  addService: (service: OnboardingService) => void;
  updateService: (index: number, service: Partial<OnboardingService>) => void;
  removeService: (index: number) => void;
  updateSchedule: (schedule: Partial<OnboardingSchedule>) => void;
  nextStep: () => void;
  prevStep: () => void;
  previousStep?: () => void; // For backward compatibility
  goToStep: (step: number) => void;
  setCurrentStep?: (step: number) => void; // For backward compatibility
  submitOnboarding: () => Promise<void>;
  reset: () => void;
}
