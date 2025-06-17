// API Configuration and HTTP Client
// Use relative URL to leverage Vite proxy configuration
const API_BASE_URL = "/api";

// Circuit breaker for traditional API when Supabase is preferred
let API_CIRCUIT_BREAKER_ENABLED = false;
let CONSECUTIVE_FAILURES = 0;
const MAX_CONSECUTIVE_FAILURES = 3;

function shouldUseCircuitBreaker(): boolean {
  return (
    API_CIRCUIT_BREAKER_ENABLED ||
    CONSECUTIVE_FAILURES >= MAX_CONSECUTIVE_FAILURES
  );
}

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
          // Basic metrics (matching backend structure)
          total_clients: 214,
          total_professionals: 6,
          total_services: 12,
          upcoming_appointments: 28,
          today_appointments: 23,
          month_revenue: 45890.5,
          month_expenses: 15250.0,
          net_income: 30640.5,
          profit_margin: 66.8,

          // Advanced metrics
          pending_receivables: 8450.0,
          commission_paid: 12250.0,
          cancellation_rate: 4.2,
          inactive_clients: 45,
          new_client_conversion: 73.5,
          average_rating: 4.7,
          total_ratings: 156,

          // Peak hours
          peak_hours: [
            { hour: 9, appointment_count: 8, revenue: 640 },
            { hour: 10, appointment_count: 12, revenue: 960 },
            { hour: 14, appointment_count: 15, revenue: 1200 },
            { hour: 15, appointment_count: 18, revenue: 1440 },
            { hour: 16, appointment_count: 14, revenue: 1120 },
            { hour: 17, appointment_count: 10, revenue: 800 },
          ],

          // Payment methods
          payment_methods: [
            {
              payment_method: "PIX",
              count: 45,
              total_amount: 15680.0,
              percentage: 45.2,
            },
            {
              payment_method: "Cartão de Crédito",
              count: 32,
              total_amount: 12450.0,
              percentage: 30.8,
            },
            {
              payment_method: "Cartão de Débito",
              count: 18,
              total_amount: 8920.0,
              percentage: 15.1,
            },
            {
              payment_method: "Dinheiro",
              count: 12,
              total_amount: 4560.0,
              percentage: 8.9,
            },
          ],

          // Professional occupancy
          professional_occupancy: [
            {
              id: 1,
              name: "Isabella Martins",
              worked_hours: 34,
              weekly_available_hours: 40,
              occupancy_rate: 85,
            },
            {
              id: 2,
              name: "Sofia Rodrigues",
              worked_hours: 29,
              weekly_available_hours: 40,
              occupancy_rate: 72.5,
            },
            {
              id: 3,
              name: "Valentina Costa",
              worked_hours: 27,
              weekly_available_hours: 40,
              occupancy_rate: 67.5,
            },
            {
              id: 4,
              name: "Helena Santos",
              worked_hours: 32,
              weekly_available_hours: 40,
              occupancy_rate: 80,
            },
            {
              id: 5,
              name: "Aurora Lima",
              worked_hours: 25,
              weekly_available_hours: 40,
              occupancy_rate: 62.5,
            },
          ],

          // Messages sent
          messages_sent: {
            total_messages: 156,
            sent_messages: 148,
            delivered_messages: 142,
            whatsapp_messages: 89,
            sms_messages: 34,
            email_messages: 67,
          },

          // Campaign performance
          campaign_performance: {
            total_campaigns: 3,
            total_reach: 2450,
            total_clicks: 342,
            total_conversions: 28,
            click_rate: 14.0,
            conversion_rate: 8.2,
          },

          // Online users
          online_users: {
            total_online: 12,
            clients_online: 8,
            professionals_online: 3,
            admins_online: 1,
          },
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
      const mockCurrentData = [];
      const mockPreviousData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const revenue = Math.floor(Math.random() * 10000) + 15000;
        const expenses =
          Math.floor(revenue * 0.3) + Math.floor(Math.random() * 2000);

        mockCurrentData.push({
          period: date.toLocaleDateString("pt-BR", { month: "short" }),
          revenue: revenue,
          expenses: expenses,
          profit: revenue - expenses,
          transaction_count: Math.floor(Math.random() * 50) + 20,
        });

        // Previous period data for comparison
        mockPreviousData.push({
          period: date.toLocaleDateString("pt-BR", { month: "short" }),
          revenue: revenue * 0.9,
          expenses: expenses * 0.85,
          profit: revenue * 0.9 - expenses * 0.85,
          transaction_count: Math.floor(Math.random() * 40) + 15,
        });
      }

      return {
        success: true,
        data: {
          current: mockCurrentData,
          previous: mockPreviousData,
          summary: {
            total_revenue: mockCurrentData.reduce(
              (sum, item) => sum + item.revenue,
              0,
            ),
            total_expenses: mockCurrentData.reduce(
              (sum, item) => sum + item.expenses,
              0,
            ),
            total_profit: mockCurrentData.reduce(
              (sum, item) => sum + item.profit,
              0,
            ),
            total_transactions: mockCurrentData.reduce(
              (sum, item) => sum + item.transaction_count,
              0,
            ),
          },
        } as T,
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

    if (endpoint.includes("/dashboard/financial-metrics")) {
      return {
        success: true,
        data: {
          revenue_breakdown: [
            {
              category: "Serviços",
              total: 35840.5,
              count: 245,
              average_transaction: 146.29,
            },
            {
              category: "Produtos",
              total: 8950.25,
              count: 89,
              average_transaction: 100.56,
            },
            {
              category: "Outros",
              total: 1200.0,
              count: 12,
              average_transaction: 100.0,
            },
          ],
          expense_breakdown: [
            {
              category: "Pessoal",
              total: 12500.0,
              count: 6,
              average_transaction: 2083.33,
            },
            {
              category: "Fornecedores",
              total: 3200.5,
              count: 15,
              average_transaction: 213.37,
            },
            {
              category: "Operacional",
              total: 1890.75,
              count: 25,
              average_transaction: 75.63,
            },
          ],
          payment_methods: [
            {
              payment_method: "PIX",
              transactions: 145,
              total_amount: 18560.75,
              average_amount: 128.01,
              usage_percentage: 45.2,
            },
            {
              payment_method: "Cartão de Crédito",
              transactions: 98,
              total_amount: 14250.3,
              average_amount: 145.41,
              usage_percentage: 30.5,
            },
            {
              payment_method: "Cartão de Débito",
              transactions: 52,
              total_amount: 8920.45,
              average_amount: 171.55,
              usage_percentage: 16.2,
            },
            {
              payment_method: "Dinheiro",
              transactions: 26,
              total_amount: 3259.0,
              average_amount: 125.35,
              usage_percentage: 8.1,
            },
          ],
        } as T,
      };
    }

    if (endpoint.includes("/dashboard/operational-metrics")) {
      return {
        success: true,
        data: {
          services: [
            {
              id: 1,
              name: "Corte Feminino",
              category: "Cabelo",
              price: 80.0,
              bookings_30_days: 45,
              revenue_30_days: 3600.0,
              avg_rating: 4.8,
              rating_count: 38,
              avg_transaction_value: 80.0,
            },
            {
              id: 2,
              name: "Design de Sobrancelha",
              category: "Sobrancelha",
              price: 60.0,
              bookings_30_days: 38,
              revenue_30_days: 2280.0,
              avg_rating: 4.9,
              rating_count: 32,
              avg_transaction_value: 60.0,
            },
            {
              id: 3,
              name: "Manicure Simples",
              category: "Unhas",
              price: 35.0,
              bookings_30_days: 52,
              revenue_30_days: 1820.0,
              avg_rating: 4.7,
              rating_count: 45,
              avg_transaction_value: 35.0,
            },
            {
              id: 4,
              name: "Coloração Completa",
              category: "Cabelo",
              price: 180.0,
              bookings_30_days: 12,
              revenue_30_days: 2160.0,
              avg_rating: 4.6,
              rating_count: 10,
              avg_transaction_value: 180.0,
            },
          ],
          clients: {
            total_active_clients: 214,
            avg_lifetime_value: 456.75,
            avg_visits_per_client: 8.2,
            active_last_30_days: 145,
            new_clients_30_days: 18,
            activity_rate: 67.8,
          },
          professionals: [
            {
              id: 1,
              name: "Isabella Martins",
              commission: 40.0,
              appointments_30_days: 28,
              revenue_30_days: 4250.0,
              avg_rating: 4.8,
              rating_count: 25,
              commission_earned: 1700.0,
            },
            {
              id: 2,
              name: "Sofia Rodrigues",
              commission: 35.0,
              appointments_30_days: 24,
              revenue_30_days: 2880.0,
              avg_rating: 4.7,
              rating_count: 20,
              commission_earned: 1008.0,
            },
            {
              id: 3,
              name: "Valentina Costa",
              commission: 38.0,
              appointments_30_days: 22,
              revenue_30_days: 3190.0,
              avg_rating: 4.9,
              rating_count: 18,
              commission_earned: 1212.2,
            },
          ],
        } as T,
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
    // Circuit breaker check - return mock data immediately if enabled
    if (shouldUseCircuitBreaker()) {
      console.log(
        `🛑 [Circuit Breaker] Skipping API call to ${endpoint}, using mock data`,
      );
      return this.getMockResponse<T>(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      // Wrap fetch in a timeout promise to handle hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Request timeout after 8 seconds")),
          8000,
        );
      });

      const fetchPromise = fetch(url, defaultOptions);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

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

      // Reset failure count on successful request
      CONSECUTIVE_FAILURES = 0;

      return data;
    } catch (error) {
      // Increment failure count
      CONSECUTIVE_FAILURES++;

      // Enhanced error logging
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(
        `🔴 API request failed for ${endpoint} (${CONSECUTIVE_FAILURES}/${MAX_CONSECUTIVE_FAILURES}):`,
        errorMessage,
      );
      console.warn("🔄 Falling back to mock data...");

      // Auto-enable circuit breaker if too many failures
      if (CONSECUTIVE_FAILURES >= MAX_CONSECUTIVE_FAILURES) {
        API_CIRCUIT_BREAKER_ENABLED = true;
        console.warn(
          `🛑 Circuit breaker enabled after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`,
        );
      }

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

// Circuit breaker control functions
export function enableApiCircuitBreaker() {
  API_CIRCUIT_BREAKER_ENABLED = true;
  console.log("🛑 Traditional API circuit breaker manually enabled");
}

export function disableApiCircuitBreaker() {
  API_CIRCUIT_BREAKER_ENABLED = false;
  CONSECUTIVE_FAILURES = 0;
  console.log("✅ Traditional API circuit breaker disabled");
}

export function getApiCircuitBreakerStatus() {
  return {
    enabled: API_CIRCUIT_BREAKER_ENABLED,
    consecutiveFailures: CONSECUTIVE_FAILURES,
    maxFailures: MAX_CONSECUTIVE_FAILURES,
  };
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export types for use in components
export type { ApiResponse, PaginationParams };
