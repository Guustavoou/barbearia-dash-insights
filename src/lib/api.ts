// API Configuration and HTTP Client
// Use relative URL to leverage Vite proxy configuration
const API_BASE_URL = "/api";

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

  private getMockResponse<T>(
    endpoint: string,
    options: RequestInit = {},
  ): ApiResponse<T> {
    console.log(`Generating mock response for ${endpoint}`);

    // Dashboard endpoints
    if (endpoint.includes("/dashboard/stats")) {
      return {
        success: true,
        data: {
          activeClients: 1247,
          todayAppointments: 23,
          monthlyRevenue: 45890.5,
          netProfit: 12340.75,
          clientGrowth: 15.3,
          appointmentGrowth: 8.7,
          revenueGrowth: 22.1,
          profitGrowth: 18.9,
        } as T,
      };
    }

    if (endpoint.includes("/dashboard/top-services")) {
      return {
        success: true,
        data: [
          { id: 1, name: "Corte Masculino", count: 145, revenue: 3625 },
          { id: 2, name: "Corte Feminino", count: 98, revenue: 3920 },
          { id: 3, name: "Barba", count: 87, revenue: 1305 },
          { id: 4, name: "Sobrancelha", count: 76, revenue: 912 },
          { id: 5, name: "Escova", count: 54, revenue: 1620 },
        ] as T,
      };
    }

    if (endpoint.includes("/dashboard/revenue")) {
      const mockData = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toISOString().split("T")[0],
          value: Math.floor(Math.random() * 2000) + 500,
        });
      }
      return {
        success: true,
        data: mockData as T,
      };
    }

    if (endpoint.includes("/dashboard/upcoming-appointments")) {
      const mockAppointments = [];
      for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setHours(9 + i, 0, 0, 0);
        mockAppointments.push({
          id: i + 1,
          client: `Cliente ${i + 1}`,
          service: ["Corte", "Barba", "Escova"][i % 3],
          professional: `Prof. ${i + 1}`,
          time: date.toTimeString().split(" ")[0].slice(0, 5),
          status: ["confirmed", "pending", "completed"][i % 3],
        });
      }
      return {
        success: true,
        data: mockAppointments as T,
      };
    }

    if (endpoint.includes("/dashboard/birthdays")) {
      return {
        success: true,
        data: [
          { id: 1, name: "Maria Silva", date: "15/12", avatar: null },
          { id: 2, name: "João Santos", date: "16/12", avatar: null },
          { id: 3, name: "Ana Costa", date: "17/12", avatar: null },
        ] as T,
      };
    }

    // Clients endpoints
    if (endpoint.includes("/clients")) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Maria Silva",
            email: "maria@email.com",
            phone: "(11) 99999-9999",
            totalVisits: 12,
            totalSpent: 890.5,
            lastVisit: "2024-12-10",
          },
        ] as T,
      };
    }

    // Appointments endpoints
    if (endpoint.includes("/appointments")) {
      return {
        success: true,
        data: [
          {
            id: 1,
            clientName: "Maria Silva",
            serviceName: "Corte Feminino",
            professionalName: "Ana Costa",
            date: "2024-12-15",
            time: "14:00",
            status: "scheduled",
            price: 45.0,
          },
        ] as T,
      };
    }

    // Services endpoints
    if (endpoint.includes("/services")) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Corte Masculino",
            price: 25.0,
            duration: 30,
            category: "Cabelo",
            isActive: true,
          },
        ] as T,
      };
    }

    // Professionals endpoints
    if (endpoint.includes("/professionals")) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Ana Costa",
            email: "ana@salao.com",
            role: "Cabeleireira",
            isActive: true,
          },
        ] as T,
      };
    }

    // Default mock response
    return {
      success: true,
      data: [] as T,
      message: `Mock data for ${endpoint} (backend unavailable)`,
    };
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

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const htmlContent = await response.text();
        if (
          htmlContent.includes("<script>") ||
          htmlContent.includes("<html>")
        ) {
          throw new Error(
            "Server returned HTML instead of JSON - backend may be unavailable",
          );
        }
        throw new Error(`Server returned non-JSON response: ${contentType}`);
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      console.warn("Falling back to mock data...");

      // Return mock data for development/demo when backend is unavailable
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  // Generic CRUD methods
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    // Filter out undefined values to avoid "undefined" strings in URL
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null,
          ),
        )
      : {};

    const queryString =
      Object.keys(cleanParams).length > 0
        ? new URLSearchParams(cleanParams).toString()
        : "";
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

  async getRevenueData(period?: string, compare?: boolean) {
    return this.get("/dashboard/revenue", { period, compare });
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

  async getFinancialMetrics(period?: string) {
    return this.get("/dashboard/financial-metrics", { period });
  }

  async getOperationalMetrics() {
    return this.get("/dashboard/operational-metrics");
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
    return this.get("/transactions", params);
  }

  async getTransactionById(id: number) {
    return this.get(`/transactions/${id}`);
  }

  async createTransaction(transactionData: any) {
    return this.post("/transactions", transactionData);
  }

  async updateTransaction(id: number, transactionData: any) {
    return this.put(`/transactions/${id}`, transactionData);
  }

  async deleteTransaction(id: number) {
    return this.delete(`/transactions/${id}`);
  }

  async getFinancialStats(period?: string) {
    return this.get("/transactions/stats", { period });
  }

  async getMonthlyRevenue(months?: number) {
    return this.get("/transactions/monthly-revenue", { months });
  }

  // Reports API
  async getBusinessReports(period?: string) {
    return this.get("/reports/business", { period });
  }

  async getSalesPerformance(period?: string, limit?: number) {
    return this.get("/reports/sales", { period, limit });
  }

  async getProfessionalReports(period?: string) {
    return this.get("/reports/professionals", { period });
  }

  async getClientAnalysis(period?: string) {
    return this.get("/reports/clients", { period });
  }

  async getAppointmentTrends(period?: string) {
    return this.get("/reports/appointments", { period });
  }

  async getFinancialAnalysis(period?: string) {
    return this.get("/reports/financial", { period });
  }

  async getInventoryReport() {
    return this.get("/reports/inventory");
  }

  async exportReportData(reportType: string, period?: string) {
    return this.get("/reports/export", { reportType, period });
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
