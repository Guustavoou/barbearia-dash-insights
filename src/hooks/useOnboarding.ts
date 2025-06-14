import { useState } from "react";
import {
  OnboardingService,
  OnboardingProfessional,
  serviceTemplates,
} from "@/lib/onboardingTypes";

export const useOnboardingHelpers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validateBusinessInfo = (info: any) => {
    const errors: string[] = [];

    if (!info.name?.trim())
      errors.push("Nome do estabelecimento é obrigatório");
    if (!info.email?.trim()) errors.push("E-mail é obrigatório");
    if (!info.phone?.trim()) errors.push("Telefone é obrigatório");
    if (!info.address?.trim()) errors.push("Endereço é obrigatório");
    if (!info.cep?.trim()) errors.push("CEP é obrigatório");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (info.email && !emailRegex.test(info.email)) {
      errors.push("E-mail inválido");
    }

    // Phone validation (basic Brazilian phone format)
    const phoneRegex = /^[\+]?[1-9][\d]{10,14}$/;
    if (info.phone && !phoneRegex.test(info.phone.replace(/\D/g, ""))) {
      errors.push("Telefone inválido");
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateServices = (services: OnboardingService[]) => {
    const errors: string[] = [];

    if (services.length === 0) {
      errors.push("Pelo menos um serviço deve ser cadastrado");
    }

    services.forEach((service, index) => {
      if (!service.name?.trim()) {
        errors.push(`Serviço ${index + 1}: Nome é obrigatório`);
      }
      if (!service.duration || service.duration <= 0) {
        errors.push(`Serviço ${index + 1}: Duração deve ser maior que 0`);
      }
      if (!service.price || service.price <= 0) {
        errors.push(`Serviço ${index + 1}: Preço deve ser maior que 0`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const validateProfessionals = (professionals: OnboardingProfessional[]) => {
    const errors: string[] = [];

    if (professionals.length === 0) {
      errors.push("Pelo menos um profissional deve ser cadastrado");
    }

    professionals.forEach((professional, index) => {
      if (!professional.name?.trim()) {
        errors.push(`Profissional ${index + 1}: Nome é obrigatório`);
      }
      if (!professional.email?.trim()) {
        errors.push(`Profissional ${index + 1}: E-mail é obrigatório`);
      }
      if (!professional.phone?.trim()) {
        errors.push(`Profissional ${index + 1}: Telefone é obrigatório`);
      }
      if (professional.workDays.length === 0) {
        errors.push(
          `Profissional ${index + 1}: Pelo menos um dia de trabalho deve ser selecionado`,
        );
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const getServiceTemplatesByCategory = () => {
    const categories: { [key: string]: typeof serviceTemplates } = {};

    serviceTemplates.forEach((template) => {
      if (!categories[template.category]) {
        categories[template.category] = [];
      }
      categories[template.category].push(template);
    });

    return categories;
  };

  const generateCalendarColors = () => {
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#F97316", // Orange
      "#06B6D4", // Cyan
      "#84CC16", // Lime
      "#EC4899", // Pink
      "#6B7280", // Gray
    ];
    return colors;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsLoading(true);
    try {
      // Here you would typically upload to your storage service
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return url;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    validateBusinessInfo,
    validateServices,
    validateProfessionals,
    getServiceTemplatesByCategory,
    generateCalendarColors,
    formatCEP,
    formatPhone,
    formatCNPJ,
    uploadImage,
  };
};
