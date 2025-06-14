import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  OnboardingData,
  OnboardingContextType,
  BusinessInfo,
  OnboardingService,
  OnboardingProfessional,
  WorkingHours,
  defaultWorkingHours,
} from "@/lib/onboardingTypes";

const initialData: OnboardingData = {
  businessInfo: {
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
  services: [],
  professionals: [],
  workingHours: defaultWorkingHours,
  currentStep: 0,
  isCompleted: false,
};

type OnboardingAction =
  | { type: "UPDATE_BUSINESS_INFO"; payload: Partial<BusinessInfo> }
  | { type: "ADD_SERVICE"; payload: OnboardingService }
  | {
      type: "UPDATE_SERVICE";
      payload: { id: string; service: Partial<OnboardingService> };
    }
  | { type: "REMOVE_SERVICE"; payload: string }
  | { type: "ADD_PROFESSIONAL"; payload: OnboardingProfessional }
  | {
      type: "UPDATE_PROFESSIONAL";
      payload: { id: string; professional: Partial<OnboardingProfessional> };
    }
  | { type: "REMOVE_PROFESSIONAL"; payload: string }
  | { type: "UPDATE_WORKING_HOURS"; payload: WorkingHours[] }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET_ONBOARDING" }
  | { type: "LOAD_DATA"; payload: OnboardingData };

function onboardingReducer(
  state: OnboardingData,
  action: OnboardingAction,
): OnboardingData {
  switch (action.type) {
    case "UPDATE_BUSINESS_INFO":
      return {
        ...state,
        businessInfo: { ...state.businessInfo, ...action.payload },
      };

    case "ADD_SERVICE":
      const newService = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
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
        currentStep: Math.max(0, Math.min(4, action.payload)),
      };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(4, state.currentStep + 1),
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

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, dispatch] = useReducer(onboardingReducer, initialData);

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever data changes
  useEffect(() => {
    if (data.currentStep > 0 || data.businessInfo.name) {
      saveProgress();
    }
  }, [data]);

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    dispatch({ type: "UPDATE_BUSINESS_INFO", payload: info });
  };

  const addService = (service: OnboardingService) => {
    dispatch({ type: "ADD_SERVICE", payload: service });
  };

  const updateService = (id: string, service: Partial<OnboardingService>) => {
    dispatch({ type: "UPDATE_SERVICE", payload: { id, service } });
  };

  const removeService = (id: string) => {
    dispatch({ type: "REMOVE_SERVICE", payload: id });
  };

  const addProfessional = (professional: OnboardingProfessional) => {
    dispatch({ type: "ADD_PROFESSIONAL", payload: professional });
  };

  const updateProfessional = (
    id: string,
    professional: Partial<OnboardingProfessional>,
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
      // Here you would typically send the data to your API
      console.log("Completing onboarding with data:", data);

      // For now, just mark as completed
      dispatch({ type: "COMPLETE_ONBOARDING" });

      // Clear localStorage after successful completion
      localStorage.removeItem("unclic-onboarding-progress");

      return Promise.resolve();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  const resetOnboarding = () => {
    dispatch({ type: "RESET_ONBOARDING" });
    localStorage.removeItem("unclic-onboarding-progress");
  };

  const saveProgress = () => {
    try {
      localStorage.setItem("unclic-onboarding-progress", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
    }
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem("unclic-onboarding-progress");
      if (saved) {
        const savedData = JSON.parse(saved);
        dispatch({ type: "LOAD_DATA", payload: savedData });
      }
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
    }
  };

  const contextValue: OnboardingContextType = {
    data,
    updateBusinessInfo,
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
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
