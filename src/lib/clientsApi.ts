// Clients API with Neon Database Integration
import { api } from "./api";

export interface NeonClient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  createdAt?: string;
  lastVisit?: string;
  status: "ativo" | "inativo";
  totalSpent?: number;
  visitCount?: number;
  avgInterval?: number;
  notes?: string;
  visits?: Visit[];
}

export interface Visit {
  id: string;
  date: string;
  service: string;
  amount: number;
  professional: string;
  rating?: number;
}

export interface ClientsApiResponse {
  success: boolean;
  data?: NeonClient | NeonClient[];
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ClientsApi {
  // Get all clients with filters and pagination
  async getClients(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
  }): Promise<ClientsApiResponse> {
    try {
      console.log("🔍 Fetching clients from Neon database...");
      const response = await api.get("/clients", params);

      if (response.success && response.data) {
        console.log(
          `✅ Loaded ${Array.isArray(response.data) ? response.data.length : 1} clients from Neon`,
        );
        return {
          success: true,
          data: response.data,
          pagination: response.pagination,
        };
      }

      return response;
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      return {
        success: false,
        error: "Failed to fetch clients from database",
      };
    }
  }

  // Get client by ID
  async getClientById(id: string): Promise<ClientsApiResponse> {
    try {
      console.log(`🔍 Fetching client ${id} from Neon database...`);
      const response = await api.get(`/clients/${id}`);

      if (response.success) {
        console.log(`✅ Loaded client ${id} from Neon`);
      }

      return response;
    } catch (error) {
      console.error(`❌ Error fetching client ${id}:`, error);
      return {
        success: false,
        error: "Failed to fetch client from database",
      };
    }
  }

  // Create new client
  async createClient(
    clientData: Omit<
      NeonClient,
      | "id"
      | "createdAt"
      | "totalSpent"
      | "visitCount"
      | "avgInterval"
      | "visits"
    >,
  ): Promise<ClientsApiResponse> {
    try {
      console.log("➕ Creating client in Neon database...", clientData.name);

      // Transform frontend data to backend format
      const backendData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        city: clientData.address, // Backend uses 'city' field
        birthday: clientData.birthDate,
        notes: clientData.notes,
        status: clientData.status,
      };

      const response = await api.post("/clients", backendData);

      if (response.success && response.data) {
        console.log(`✅ Client ${clientData.name} created in Neon database`);

        // Transform backend response to frontend format
        const frontendClient: NeonClient = {
          id: response.data.id?.toString(),
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.city,
          birthDate: response.data.birthday,
          createdAt: response.data.created_at,
          lastVisit: response.data.last_visit,
          status: response.data.status,
          totalSpent: response.data.total_spent || 0,
          visitCount: response.data.visits || 0,
          avgInterval: 0, // Calculate based on visits
          notes: response.data.notes,
          visits: [], // Will be populated separately if needed
        };

        return {
          success: true,
          data: frontendClient,
        };
      }

      return response;
    } catch (error) {
      console.error("❌ Error creating client:", error);
      return {
        success: false,
        error: "Failed to create client in database",
      };
    }
  }

  // Update client
  async updateClient(
    id: string,
    clientData: Partial<NeonClient>,
  ): Promise<ClientsApiResponse> {
    try {
      console.log(`✏️ Updating client ${id} in Neon database...`);

      // Transform frontend data to backend format
      const backendData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        city: clientData.address,
        birthday: clientData.birthDate,
        notes: clientData.notes,
        status: clientData.status,
      };

      const response = await api.put(`/clients/${id}`, backendData);

      if (response.success && response.data) {
        console.log(`✅ Client ${id} updated in Neon database`);

        // Transform backend response to frontend format
        const frontendClient: NeonClient = {
          id: response.data.id?.toString(),
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.city,
          birthDate: response.data.birthday,
          createdAt: response.data.created_at,
          lastVisit: response.data.last_visit,
          status: response.data.status,
          totalSpent: response.data.total_spent || 0,
          visitCount: response.data.visits || 0,
          avgInterval: 0,
          notes: response.data.notes,
          visits: [],
        };

        return {
          success: true,
          data: frontendClient,
        };
      }

      return response;
    } catch (error) {
      console.error(`❌ Error updating client ${id}:`, error);
      return {
        success: false,
        error: "Failed to update client in database",
      };
    }
  }

  // Delete client
  async deleteClient(id: string): Promise<ClientsApiResponse> {
    try {
      console.log(`🗑️ Deleting client ${id} from Neon database...`);
      const response = await api.delete(`/clients/${id}`);

      if (response.success) {
        console.log(`✅ Client ${id} deleted from Neon database`);
      }

      return response;
    } catch (error) {
      console.error(`❌ Error deleting client ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete client from database",
      };
    }
  }

  // Get client statistics
  async getClientStats(): Promise<ClientsApiResponse> {
    try {
      console.log("📊 Fetching client statistics from Neon database...");
      const response = await api.get("/clients/stats");

      if (response.success) {
        console.log("✅ Client statistics loaded from Neon");
      }

      return response;
    } catch (error) {
      console.error("❌ Error fetching client stats:", error);
      return {
        success: false,
        error: "Failed to fetch client statistics",
      };
    }
  }

  // Get clients with birthdays this month
  async getClientBirthdays(): Promise<ClientsApiResponse> {
    try {
      console.log("🎂 Fetching client birthdays from Neon database...");
      const response = await api.get("/clients/birthdays");

      if (response.success) {
        console.log("✅ Client birthdays loaded from Neon");
      }

      return response;
    } catch (error) {
      console.error("❌ Error fetching client birthdays:", error);
      return {
        success: false,
        error: "Failed to fetch client birthdays",
      };
    }
  }

  // Transform backend client data to frontend format
  private transformBackendToFrontend(backendClient: any): NeonClient {
    return {
      id: backendClient.id?.toString(),
      name: backendClient.name,
      email: backendClient.email,
      phone: backendClient.phone,
      address: backendClient.city,
      birthDate: backendClient.birthday,
      createdAt: backendClient.created_at,
      lastVisit: backendClient.last_visit,
      status: backendClient.status,
      totalSpent: backendClient.total_spent || 0,
      visitCount: backendClient.visits || 0,
      avgInterval: 0, // Can be calculated based on visit history
      notes: backendClient.notes,
      visits: [], // Will be populated separately if needed
    };
  }

  // Sync localStorage data with Neon database
  async syncLocalStorageToNeon(localClients: NeonClient[]): Promise<void> {
    try {
      console.log("🔄 Syncing localStorage clients to Neon database...");

      // Get existing clients from Neon
      const response = await this.getClients({ limit: 1000 });

      if (!response.success || !response.data) {
        throw new Error("Failed to get existing clients");
      }

      const existingClients = Array.isArray(response.data)
        ? response.data
        : [response.data];
      const existingEmails = new Set(existingClients.map((c) => c.email));

      // Create clients that don't exist in Neon
      for (const localClient of localClients) {
        if (!existingEmails.has(localClient.email)) {
          await this.createClient({
            name: localClient.name,
            email: localClient.email,
            phone: localClient.phone,
            address: localClient.address,
            birthDate: localClient.birthDate,
            status: localClient.status,
            notes: localClient.notes,
          });
        }
      }

      console.log("✅ LocalStorage data synced to Neon database");
    } catch (error) {
      console.error("❌ Error syncing localStorage to Neon:", error);
    }
  }
}

// Create and export API instance
export const clientsApi = new ClientsApi();

// Export utility functions
export const transformClientData = {
  toBackend: (frontendClient: NeonClient) => ({
    name: frontendClient.name,
    email: frontendClient.email,
    phone: frontendClient.phone,
    city: frontendClient.address,
    birthday: frontendClient.birthDate,
    notes: frontendClient.notes,
    status: frontendClient.status,
  }),

  toFrontend: (backendClient: any): NeonClient => ({
    id: backendClient.id?.toString(),
    name: backendClient.name,
    email: backendClient.email,
    phone: backendClient.phone,
    address: backendClient.city,
    birthDate: backendClient.birthday,
    createdAt: backendClient.created_at,
    lastVisit: backendClient.last_visit,
    status: backendClient.status,
    totalSpent: backendClient.total_spent || 0,
    visitCount: backendClient.visits || 0,
    avgInterval: 0,
    notes: backendClient.notes,
    visits: [],
  }),
};
