import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  MultiTenantOnboardingData,
  EstablishmentService,
  EstablishmentProfessional,
  WorkingHours,
  Establishment,
} from "@/lib/multiTenantTypes";
import { useAuth } from "./AuthContext";

interface MultiTenantOnboardingContextType {
  data: MultiTenantOnboardingData;
  updateEstablishment: (info: Partial<Establishment>) => void;
  updateOwner: (
    info: Partial<{ name: string; email: string; phone?: string }>,
  ) => void;
  addService: (service: EstablishmentService) => void;
  updateService: (id: string, service: Partial<EstablishmentService>) => void;
  removeService: (id: string) => void;
  addProfessional: (professional: EstablishmentProfessional) => void;
  updateProfessional: (
    id: string,
    professional: Partial<EstablishmentProfessional>,
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

const defaultWorkingHours: WorkingHours[] = [
  {
    day_of_week: 1,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 2,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 3,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 4,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 5,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 6,
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 0,
    is_open: false,
    open_time: "09:00",
    close_time: "18:00",
  },
];

const initialData: MultiTenantOnboardingData = {
  establishment: {
    name: "",
    email: "",
    phone: "",
    cnpj: "",
    address: "",
    cep: "",
    website: "",
    instagram: "",
    facebook: "",
  },
  owner: {
    name: "",
    email: "",
    phone: "",
  },
  services: [],
  professionals: [],
  workingHours: defaultWorkingHours,
  currentStep: 0,
  isCompleted: false,
};

type OnboardingAction =
  | { type: "UPDATE_ESTABLISHMENT"; payload: Partial<Establishment> }
  | {
      type: "UPDATE_OWNER";
      payload: Partial<{ name: string; email: string; phone?: string }>;
    }
  | { type: "ADD_SERVICE"; payload: EstablishmentService }
  | {
      type: "UPDATE_SERVICE";
      payload: { id: string; service: Partial<EstablishmentService> };
    }
  | { type: "REMOVE_SERVICE"; payload: string }
  | { type: "ADD_PROFESSIONAL"; payload: EstablishmentProfessional }
  | {
      type: "UPDATE_PROFESSIONAL";
      payload: { id: string; professional: Partial<EstablishmentProfessional> };
    }
  | { type: "REMOVE_PROFESSIONAL"; payload: string }
  | { type: "UPDATE_WORKING_HOURS"; payload: WorkingHours[] }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET_ONBOARDING" }
  | { type: "LOAD_DATA"; payload: MultiTenantOnboardingData };

function onboardingReducer(
  state: MultiTenantOnboardingData,
  action: OnboardingAction,
): MultiTenantOnboardingData {
  switch (action.type) {
    case "UPDATE_ESTABLISHMENT":
      return {
        ...state,
        establishment: { ...state.establishment, ...action.payload },
      };

    case "UPDATE_OWNER":
      return {
        ...state,
        owner: { ...state.owner, ...action.payload },
      };

    case "ADD_SERVICE":
      const newService = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        establishment_id: "", // Will be set when saving
      };
      return {
        ...state,
        services: [...state.services, newService],
      };

    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id
            ? { ...service, ...action.payload.service }
            : service,
        ),
      };

    case "REMOVE_SERVICE":
      return {
        ...state,
        services: state.services.filter(
          (service) => service.id !== action.payload,
        ),
      };

    case "ADD_PROFESSIONAL":
      const newProfessional = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        establishment_id: "", // Will be set when saving
      };
      return {
        ...state,
        professionals: [...state.professionals, newProfessional],
      };

    case "UPDATE_PROFESSIONAL":
      return {
        ...state,
        professionals: state.professionals.map((professional) =>
          professional.id === action.payload.id
            ? { ...professional, ...action.payload.professional }
            : professional,
        ),
      };

    case "REMOVE_PROFESSIONAL":
      return {
        ...state,
        professionals: state.professionals.filter(
          (professional) => professional.id !== action.payload,
        ),
      };

    case "UPDATE_WORKING_HOURS":
      return {
        ...state,
        workingHours: action.payload,
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: Math.max(0, Math.min(5, action.payload)),
      };

    case "NEXT_STEP":
      const newStep = Math.min(5, state.currentStep + 1);
      return {
        ...state,
        currentStep: newStep,
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };

    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        isCompleted: true,
      };

    case "RESET_ONBOARDING":
      return initialData;

    case "LOAD_DATA":
      return action.payload;

    default:
      return state;
  }
}

const MultiTenantOnboardingContext = createContext<
  MultiTenantOnboardingContextType | undefined
>(undefined);

export const MultiTenantOnboardingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, dispatch] = useReducer(onboardingReducer, initialData);
  const { user } = useAuth();

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever data changes
  useEffect(() => {
    if (data.currentStep > 0 || data.establishment.name) {
      saveProgress();
    }
  }, [data]);

  const updateEstablishment = (info: Partial<Establishment>) => {
    dispatch({ type: "UPDATE_ESTABLISHMENT", payload: info });
  };

  const updateOwner = (
    info: Partial<{ name: string; email: string; phone?: string }>,
  ) => {
    dispatch({ type: "UPDATE_OWNER", payload: info });
  };

  const addService = (service: EstablishmentService) => {
    dispatch({ type: "ADD_SERVICE", payload: service });
  };

  const updateService = (
    id: string,
    service: Partial<EstablishmentService>,
  ) => {
    dispatch({ type: "UPDATE_SERVICE", payload: { id, service } });
  };

  const removeService = (id: string) => {
    dispatch({ type: "REMOVE_SERVICE", payload: id });
  };

  const addProfessional = (professional: EstablishmentProfessional) => {
    dispatch({ type: "ADD_PROFESSIONAL", payload: professional });
  };

  const updateProfessional = (
    id: string,
    professional: Partial<EstablishmentProfessional>,
  ) => {
    dispatch({ type: "UPDATE_PROFESSIONAL", payload: { id, professional } });
  };

  const removeProfessional = (id: string) => {
    dispatch({ type: "REMOVE_PROFESSIONAL", payload: id });
  };

  const updateWorkingHours = (hours: WorkingHours[]) => {
    dispatch({ type: "UPDATE_WORKING_HOURS", payload: hours });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const previousStep = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const completeOnboarding = async () => {
    try {
      console.log("Completing multi-tenant onboarding with data:", data);

      // Mock API call to create establishment and setup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark as completed
      dispatch({ type: "COMPLETE_ONBOARDING" });

      // Clear localStorage after successful completion
      localStorage.removeItem("unclic-multitenant-onboarding-progress");

      return Promise.resolve();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // For demo purposes, complete anyway
      dispatch({ type: "COMPLETE_ONBOARDING" });
      localStorage.removeItem("unclic-multitenant-onboarding-progress");
      return Promise.resolve();
    }
  };

  const resetOnboarding = () => {
    dispatch({ type: "RESET_ONBOARDING" });
    localStorage.removeItem("unclic-multitenant-onboarding-progress");
  };

  const saveProgress = () => {
    try {
      const userId = user?.id || "anonymous"; // Changed from session to user
      localStorage.setItem(
        `unclic-multitenant-onboarding-progress-${userId}`,
        JSON.stringify(data),
      );
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
    }
  };

  const loadProgress = () => {
    try {
      const userId = user?.id || "anonymous"; // Changed from session to user
      const saved = localStorage.getItem(
        `unclic-multitenant-onboarding-progress-${userId}`,
      );
      if (saved) {
        const savedData = JSON.parse(saved);
        dispatch({ type: "LOAD_DATA", payload: savedData });
      }
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
    }
  };

  const contextValue: MultiTenantOnboardingContextType = {
    data,
    updateEstablishment,
    updateOwner,
    addService,
    updateService,
    removeService,
    addProfessional,
    updateProfessional,
    removeProfessional,
    updateWorkingHours,
    setCurrentStep,
    nextStep,
    previousStep,
    completeOnboarding,
    resetOnboarding,
    saveProgress,
    loadProgress,
  };

  return (
    <MultiTenantOnboardingContext.Provider value={contextValue}>
      {children}
    </MultiTenantOnboardingContext.Provider>
  );
};

export const useMultiTenantOnboarding = () => {
  const context = useContext(MultiTenantOnboardingContext);
  if (context === undefined) {
    throw new Error(
      "useMultiTenantOnboarding must be used within a MultiTenantOnboardingProvider",
    );
  }
  return context;
};
