
import { ApiResponse } from './types';

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
      return {
        success: true,
        data: { ...clientData, id: Date.now().toString() }
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
      return {
        success: true,
        data: { ...updates, id }
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
