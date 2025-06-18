
import { ApiResponse } from './types';

// Export the NeonClient interface with all required properties
export interface NeonClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  business_id: string;
  birth_date?: string;
  notes?: string;
  created_at: string;
  status: string;
  total_spent: number;
  visits: number;
  // Add missing properties that are being used in components
  lastVisit?: string;
  visitCount?: number;
  totalSpent?: number;
  createdAt?: string;
  birthDate?: string;
  address?: string;
  avgInterval?: number;
}

// Helper function to create a client object with all required fields
export const createClientData = (clientInput: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  notes?: string;
  status?: "ativo" | "inativo";
}): Omit<NeonClient, "id" | "createdAt" | "totalSpent" | "visitCount" | "avgInterval" | "visits"> => {
  return {
    name: clientInput.name,
    email: clientInput.email,
    phone: clientInput.phone,
    city: "São Paulo", // Default city
    business_id: "default-business", // Default business ID
    birth_date: clientInput.birthDate || null,
    notes: clientInput.notes || null,
    created_at: new Date().toISOString(),
    status: clientInput.status || "ativo",
    total_spent: 0,
    address: clientInput.address || "",
    lastVisit: null,
    birthDate: clientInput.birthDate || null,
  };
};

export interface ClientsApiInterface {
  getClients: (params?: any) => Promise<ApiResponse<any[]>>;
  addClient: (clientData: any) => Promise<ApiResponse<any>>;
  updateClient: (id: string, updates: any) => Promise<ApiResponse<any>>;
  deleteClient: (id: string) => Promise<ApiResponse<boolean>>;
}

export const clientsApi: ClientsApiInterface = {
  async getClients(params?: any) {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      };
    }
  },

  async addClient(clientData: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const fullClientData = createClientData(clientData);
      return {
        success: true,
        data: { ...fullClientData, id: Date.now().toString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add client'
      };
    }
  },

  async updateClient(id: string, updates: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const fullClientData = createClientData(updates);
      return {
        success: true,
        data: { ...fullClientData, id }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update client'
      };
    }
  },

  async deleteClient(id: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      };
    }
  }
};

// Export as ClientsAPI for backward compatibility
export const ClientsAPI = clientsApi;

// Re-export ApiResponse for convenience - using export type to fix TS error
export type { ApiResponse } from './types';
