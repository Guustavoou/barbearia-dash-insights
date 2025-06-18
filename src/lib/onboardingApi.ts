import { Establishment, EstablishmentProfessional, EstablishmentService, WorkingHours } from "@/lib/multiTenantTypes";
import { ApiResponse } from "./types";

export const onboardingAPI = {
  async getEstablishment(businessId: string): Promise<ApiResponse<Establishment>> {
    try {
      console.log('🔍 [Onboarding API] Fetching establishment...', businessId);

      // Mock success response
      const establishment: Establishment = {
        name: 'Example Salon',
        email: 'contact@examplesalon.com',
        phone: '+15551234567',
        cnpj: '12.345.678/0001-90',
        address: '123 Main St',
        cep: '90210',
        website: 'www.examplesalon.com',
        instagram: '@examplesalon',
        facebook: 'facebook.com/examplesalon',
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Establishment fetched successfully');
      return {
        success: true,
        data: establishment
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error fetching establishment:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch establishment'
      };
    }
  },

  async updateEstablishment(businessId: string, info: Partial<Establishment>): Promise<ApiResponse<Establishment>> {
    try {
      console.log('🔍 [Onboarding API] Updating establishment...', { businessId, info });

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Establishment updated successfully');
      return {
        success: true,
        data: info as Establishment
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error updating establishment:', error);
      return {
        success: false,
        error: error.message || 'Failed to update establishment'
      };
    }
  },

  async getOwner(businessId: string): Promise<ApiResponse<{ name: string; email: string; phone?: string }>> {
    try {
      console.log('🔍 [Onboarding API] Fetching owner...', businessId);

      // Mock success response
      const owner = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+15557778888'
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Owner fetched successfully');
      return {
        success: true,
        data: owner
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error fetching owner:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch owner'
      };
    }
  },

  async updateOwner(businessId: string, info: Partial<{ name: string; email: string; phone?: string }>): Promise<ApiResponse<{ name: string; email: string; phone?: string }>> {
    try {
      console.log('🔍 [Onboarding API] Updating owner...', { businessId, info });

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Owner updated successfully');
      return {
        success: true,
        data: info as { name: string; email: string; phone?: string }
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error updating owner:', error);
      return {
        success: false,
        error: error.message || 'Failed to update owner'
      };
    }
  },

  async getServices(businessId: string): Promise<ApiResponse<EstablishmentService[]>> {
    try {
      console.log('🔍 [Onboarding API] Fetching services...', businessId);

      // Mock success response
      const services: EstablishmentService[] = [
        {
          id: '1',
          name: 'Haircut',
          description: 'A professional haircut',
          price: 25.00,
          duration: 30,
          establishment_id: businessId
        },
        {
          id: '2',
          name: 'Manicure',
          description: 'A relaxing manicure',
          price: 20.00,
          duration: 45,
          establishment_id: businessId
        }
      ];
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Services fetched successfully');
      return {
        success: true,
        data: services
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error fetching services:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch services'
      };
    }
  },

  async addService(businessId: string, service: EstablishmentService): Promise<ApiResponse<EstablishmentService>> {
    try {
      console.log('🔍 [Onboarding API] Adding service...', { businessId, service });

      // Mock success response
      const newService: EstablishmentService = {
        ...service,
        id: Date.now().toString(),
        establishment_id: businessId
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Service added successfully');
      return {
        success: true,
        data: newService
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error adding service:', error);
      return {
        success: false,
        error: error.message || 'Failed to add service'
      };
    }
  },

  async updateService(businessId: string, id: string, service: Partial<EstablishmentService>): Promise<ApiResponse<EstablishmentService>> {
    try {
      console.log('🔍 [Onboarding API] Updating service...', { businessId, id, service });

      // Mock success response
      const updatedService: EstablishmentService = {
        id,
        name: service.name || 'Updated Service',
        description: service.description || 'Updated description',
        price: service.price || 30.00,
        duration: service.duration || 60,
        establishment_id: businessId
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Service updated successfully');
      return {
        success: true,
        data: updatedService
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error updating service:', error);
      return {
        success: false,
        error: error.message || 'Failed to update service'
      };
    }
  },

  async removeService(businessId: string, id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔍 [Onboarding API] Removing service...', { businessId, id });

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Service removed successfully');
      return {
        success: true,
        data: true
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error removing service:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove service'
      };
    }
  },

  async getProfessionals(businessId: string): Promise<ApiResponse<EstablishmentProfessional[]>> {
    try {
      console.log('🔍 [Onboarding API] Fetching professionals...', businessId);

      // Mock success response
      const professionals: EstablishmentProfessional[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          specialty: 'Hair stylist',
          establishment_id: businessId
        },
        {
          id: '2',
          name: 'Bob Smith',
          specialty: 'Nail technician',
          establishment_id: businessId
        }
      ];
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Professionals fetched successfully');
      return {
        success: true,
        data: professionals
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error fetching professionals:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch professionals'
      };
    }
  },

  async addProfessional(businessId: string, professional: EstablishmentProfessional): Promise<ApiResponse<EstablishmentProfessional>> {
    try {
      console.log('🔍 [Onboarding API] Adding professional...', { businessId, professional });

      // Mock success response
      const newProfessional: EstablishmentProfessional = {
        ...professional,
        id: Date.now().toString(),
        establishment_id: businessId
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Professional added successfully');
      return {
        success: true,
        data: newProfessional
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error adding professional:', error);
      return {
        success: false,
        error: error.message || 'Failed to add professional'
      };
    }
  },

  async updateProfessional(businessId: string, id: string, professional: Partial<EstablishmentProfessional>): Promise<ApiResponse<EstablishmentProfessional>> {
    try {
      console.log('🔍 [Onboarding API] Updating professional...', { businessId, id, professional });

      // Mock success response
      const updatedProfessional: EstablishmentProfessional = {
        id,
        name: professional.name || 'Updated Professional',
        specialty: professional.specialty || 'Updated specialty',
        establishment_id: businessId
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Professional updated successfully');
      return {
        success: true,
        data: updatedProfessional
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error updating professional:', error);
      return {
        success: false,
        error: error.message || 'Failed to update professional'
      };
    }
  },

  async removeProfessional(businessId: string, id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔍 [Onboarding API] Removing professional...', { businessId, id });

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Professional removed successfully');
      return {
        success: true,
        data: true
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error removing professional:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove professional'
      };
    }
  },

  async updateWorkingHours(businessId: string, workingHours: WorkingHours[]): Promise<ApiResponse<WorkingHours[]>> {
    try {
      console.log('🔍 [Onboarding API] Updating working hours...', { businessId, workingHours });

      // Simple implementation without circular reference
      const processedHours = workingHours.map(dayHours => {
        if (typeof dayHours === 'object' && dayHours !== null) {
          return {
            dayOfWeek: dayHours.day_of_week || dayHours.dayOfWeek,
            isOpen: dayHours.is_open !== undefined ? dayHours.is_open : dayHours.isOpen,
            startTime: dayHours.open_time || dayHours.startTime || '09:00',
            endTime: dayHours.close_time || dayHours.endTime || '18:00',
            breaks: dayHours.breaks || []
          };
        }
        return dayHours;
      });

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ [Onboarding API] Working hours updated successfully');
      return {
        success: true,
        data: processedHours as WorkingHours[]
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error updating working hours:', error);
      return {
        success: false,
        error: error.message || 'Failed to update working hours'
      };
    }
  },

  async completeOnboarding(businessId: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔍 [Onboarding API] Completing onboarding...', businessId);

      // Mock success response
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ [Onboarding API] Onboarding completed successfully');
      return {
        success: true,
        data: true
      };

    } catch (error: any) {
      console.error('❌ [Onboarding API] Error completing onboarding:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete onboarding'
      };
    }
  }
};
