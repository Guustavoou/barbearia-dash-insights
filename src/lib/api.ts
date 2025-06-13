// API Configuration and HTTP Client
const getApiBaseUrl = () => {
  // Check if we're in development or if localhost is accessible
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3001/api";
  }

  // If running on external domain, try to use proxy on same origin
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  search?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      timeout: 10000, // 10 second timeout
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      // Return a failed response instead of throwing
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown API error",
      };
    }
  }

  // Generic CRUD methods
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // Dashboard API
  async getDashboardStats() {
    return this.get("/dashboard/stats");
  }

  async getRevenueData(period?: string) {
    return this.get("/dashboard/revenue", { period });
  }

  async getTopServices(limit?: number) {
    return this.get("/dashboard/top-services", { limit });
  }

  async getUpcomingAppointments(limit?: number) {
    return this.get("/dashboard/upcoming-appointments", { limit });
  }

  async getBirthdaysThisMonth() {
    return this.get("/dashboard/birthdays");
  }

  async getQuickInsights() {
    return this.get("/dashboard/insights");
  }

  // Clients API
  async getClients(params?: PaginationParams & { status?: string }) {
    return this.get("/clients", params);
  }

  async getClientById(id: number) {
    return this.get(`/clients/${id}`);
  }

  async createClient(clientData: any) {
    return this.post("/clients", clientData);
  }

  async updateClient(id: number, clientData: any) {
    return this.put(`/clients/${id}`, clientData);
  }

  async deleteClient(id: number) {
    return this.delete(`/clients/${id}`);
  }

  async getClientStats() {
    return this.get("/clients/stats");
  }

  async getClientBirthdays() {
    return this.get("/clients/birthdays");
  }

  // Appointments API
  async getAppointments(
    params?: PaginationParams & {
      start_date?: string;
      end_date?: string;
      status?: string;
      professional_id?: number;
    },
  ) {
    return this.get("/appointments", params);
  }

  async getAppointmentById(id: number) {
    return this.get(`/appointments/${id}`);
  }

  async createAppointment(appointmentData: any) {
    return this.post("/appointments", appointmentData);
  }

  async updateAppointment(id: number, appointmentData: any) {
    return this.put(`/appointments/${id}`, appointmentData);
  }

  async deleteAppointment(id: number) {
    return this.delete(`/appointments/${id}`);
  }

  async getAppointmentStats(period?: string) {
    return this.get("/appointments/stats", { period });
  }

  async getAvailableSlots(params: {
    date: string;
    service_id: number;
    professional_id?: number;
  }) {
    return this.get("/appointments/available-slots", params);
  }

  // Services API
  async getServices(
    params?: PaginationParams & {
      category?: string;
      is_active?: boolean;
    },
  ) {
    return this.get("/services", params);
  }

  async getServiceById(id: number) {
    return this.get(`/services/${id}`);
  }

  async createService(serviceData: any) {
    return this.post("/services", serviceData);
  }

  async updateService(id: number, serviceData: any) {
    return this.put(`/services/${id}`, serviceData);
  }

  async deleteService(id: number) {
    return this.delete(`/services/${id}`);
  }

  async getServiceCategories() {
    return this.get("/services/categories");
  }

  async getServiceStats() {
    return this.get("/services/stats");
  }

  async assignProfessionalsToService(id: number, professionalIds: number[]) {
    return this.put(`/services/${id}/professionals`, {
      professional_ids: professionalIds,
    });
  }

  async getServicesByProfessional(professionalId: number) {
    return this.get(`/services/professional/${professionalId}`);
  }

  // Professionals API
  async getProfessionals(params?: PaginationParams & { status?: string }) {
    return this.get("/professionals", params);
  }

  async getProfessionalById(id: number) {
    return this.get(`/professionals/${id}`);
  }

  async createProfessional(professionalData: any) {
    return this.post("/professionals", professionalData);
  }

  async updateProfessional(id: number, professionalData: any) {
    return this.put(`/professionals/${id}`, professionalData);
  }

  async deleteProfessional(id: number) {
    return this.delete(`/professionals/${id}`);
  }

  async getProfessionalStats() {
    return this.get("/professionals/stats");
  }

  async getProfessionalSchedule(id: number, date: string) {
    return this.get(`/professionals/${id}/schedule`, { date });
  }

  async getTopProfessionals(params?: { limit?: number; metric?: string }) {
    return this.get("/professionals/top", params);
  }

  // Products API
  async getProducts(
    params?: PaginationParams & {
      category?: string;
      status?: string;
      low_stock?: boolean;
    },
  ) {
    return this.get("/products", params);
  }

  async getProductById(id: number) {
    return this.get(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.post("/products", productData);
  }

  async updateProduct(id: number, productData: any) {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id: number) {
    return this.delete(`/products/${id}`);
  }

  async getProductCategories() {
    return this.get("/products/categories");
  }

  async getStockStats() {
    return this.get("/products/stats");
  }

  async getLowStockAlerts() {
    return this.get("/products/low-stock");
  }

  async updateStock(
    id: number,
    params: {
      type: "entrada" | "saida" | "ajuste";
      quantity: number;
      reason?: string;
    },
  ) {
    return this.put(`/products/${id}/stock`, params);
  }

  async getStockMovements(
    params?: PaginationParams & {
      product_id?: number;
      type?: string;
      start_date?: string;
      end_date?: string;
    },
  ) {
    return this.get("/products/movements", params);
  }

  // Financial API
  async getTransactions(
    params?: PaginationParams & {
      type?: string;
      category?: string;
      payment_method?: string;
      start_date?: string;
      end_date?: string;
    },
  ) {
    return this.get("/financial/transactions", params);
  }

  async getTransactionById(id: number) {
    return this.get(`/financial/transactions/${id}`);
  }

  async createTransaction(transactionData: any) {
    return this.post("/financial/transactions", transactionData);
  }

  async updateTransaction(id: number, transactionData: any) {
    return this.put(`/financial/transactions/${id}`, transactionData);
  }

  async deleteTransaction(id: number) {
    return this.delete(`/financial/transactions/${id}`);
  }

  async getFinancialStats(period?: string) {
    return this.get("/financial/stats", { period });
  }

  async getMonthlyRevenue(months?: number) {
    return this.get("/financial/monthly-revenue", { months });
  }

  // Health check
  async healthCheck() {
    return this.get("/health");
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export types for use in components
export type { ApiResponse, PaginationParams };
