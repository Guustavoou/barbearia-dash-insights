
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
  professionals: OnboardingProfessional[];
  services: OnboardingService[];
  schedule: Partial<OnboardingSchedule>;
  completed: boolean;
}

export interface OnboardingContextType {
  data: OnboardingData;
  updateBusiness: (business: Partial<OnboardingBusiness>) => void;
  addProfessional: (professional: OnboardingProfessional) => void;
  updateProfessional: (index: number, professional: Partial<OnboardingProfessional>) => void;
  removeProfessional: (index: number) => void;
  addService: (service: OnboardingService) => void;
  updateService: (index: number, service: Partial<OnboardingService>) => void;
  removeService: (index: number) => void;
  updateSchedule: (schedule: Partial<OnboardingSchedule>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitOnboarding: () => Promise<void>;
  reset: () => void;
}
