import { supabase } from "./supabase";
import {
  SUPABASE_CONFIG,
  logSupabaseDebug,
  logSupabaseError,
  logSupabaseSuccess,
} from "./supabaseConfig";
import {
  getCurrentBusinessId,
  addTenantFilter,
  addTenantToData,
  logTenantDebug,
} from "./tenantConfig";

export class SupabaseApiProduction {
  private businessId: string;

  constructor() {
    this.businessId = getCurrentBusinessId();
    logTenantDebug(`API initialized for business: ${this.businessId}`);
  }

  // =====================================================
  // GENERIC HELPERS
  // =====================================================

  private handleResponse<T>(data: T, error: any, operation: string) {
    if (error) {
      logSupabaseError(`${operation} failed`, error);
      return {
        success: false,
        error: error.message || "Unknown error occurred",
        data: null,
      };
    }

    logSupabaseSuccess(`${operation} completed successfully`);
    return {
      success: true,
      error: null,
      data,
    };
  }

  private addBusinessFilter(query: any) {
    return query.eq("business_id", this.businessId);
  }

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  async getDashboardStats() {
    try {
      logSupabaseDebug("Fetching dashboard statistics...");

      // Get basic counts
      const [
        { count: totalClients },
        { count: totalAppointments },
        { count: totalServices },
        { count: totalProfessionals },
      ] = await Promise.all([
        supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("business_id", this.businessId),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("business_id", this.businessId),
        supabase
          .from("services")
          .select("*", { count: "exact", head: true })
          .eq("business_id", this.businessId),
        supabase
          .from("professionals")
          .select("*", { count: "exact", head: true })
          .eq("business_id", this.businessId),
      ]);

      // Get today's appointments
      const today = new Date().toISOString().split("T")[0];
      const { data: todayAppointments, error: todayError } = await supabase
        .from("appointments")
        .select("*")
        .eq("business_id", this.businessId)
        .eq("date", today);

      if (todayError) throw todayError;

      // Calculate revenue
      const { data: monthlyRevenue, error: revenueError } = await supabase
        .from("appointments")
        .select("price")
        .eq("business_id", this.businessId)
        .eq("status", "completed")
        .gte(
          "date",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0],
        );

      if (revenueError) throw revenueError;

      const totalRevenue =
        monthlyRevenue?.reduce(
          (sum, apt) => sum + (Number(apt.price) || 0),
          0,
        ) || 0;

      const stats = {
        totalClients: totalClients || 0,
        totalAppointments: totalAppointments || 0,
        totalServices: totalServices || 0,
        totalProfessionals: totalProfessionals || 0,
        todayAppointments: todayAppointments?.length || 0,
        monthlyRevenue: totalRevenue,
        pendingAppointments:
          todayAppointments?.filter((apt) => apt.status === "pending")
            ?.length || 0,
        completedAppointments:
          todayAppointments?.filter((apt) => apt.status === "completed")
            ?.length || 0,
      };

      return this.handleResponse(stats, null, "Dashboard stats fetch");
    } catch (error) {
      return this.handleResponse(null, error, "Dashboard stats fetch");
    }
  }

  // =====================================================
  // CLIENTS API
  // =====================================================

  async getClients(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
  }) {
    try {
      logSupabaseDebug("Fetching clients...", params);

      let query = supabase.from("clients").select("*", { count: "exact" });
      query = this.addBusinessFilter(query);

      // Apply filters
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`,
        );
      }

      // Apply sorting
      const sortField = params?.sort || "name";
      const ascending = params?.order === "ASC";
      query = query.order(sortField, { ascending });

      // Apply pagination
      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      logSupabaseDebug("Executing transactions query...");
      const { data, error, count } = await query;

      if (error) {
        logSupabaseError("Transactions query failed", error);
        throw error;
      }

      logSupabaseDebug(
        `Transactions query successful: ${data?.length || 0} results, total count: ${count}`,
      );

      return this.handleResponse(
        {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / (params?.limit || 50)),
          },
        },
        null,
        "Clients fetch",
      );
    } catch (error) {
      return this.handleResponse(null, error, "Clients fetch");
    }
  }

  async createClient(clientData: any) {
    try {
      logSupabaseDebug("Creating client...", clientData);

      const dataWithTenant = addTenantToData({
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("clients")
        .insert([dataWithTenant])
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Client creation");
    } catch (error) {
      return this.handleResponse(null, error, "Client creation");
    }
  }

  async updateClient(id: string, clientData: any) {
    try {
      logSupabaseDebug("Updating client...", { id, clientData });

      const { data, error } = await supabase
        .from("clients")
        .update({ ...clientData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("business_id", this.businessId)
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Client update");
    } catch (error) {
      return this.handleResponse(null, error, "Client update");
    }
  }

  async deleteClient(id: string) {
    try {
      logSupabaseDebug("Deleting client...", { id });

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)
        .eq("business_id", this.businessId);

      if (error) throw error;

      return this.handleResponse({ id }, null, "Client deletion");
    } catch (error) {
      return this.handleResponse(null, error, "Client deletion");
    }
  }

  // =====================================================
  // APPOINTMENTS API
  // =====================================================

  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    professionalId?: string;
  }) {
    try {
      logSupabaseDebug("Fetching appointments...", params);

      // Fetch appointments without joins to avoid view relationship issues
      let query = supabase.from("appointments").select("*", { count: "exact" });
      query = this.addBusinessFilter(query);

      // Apply filters
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.date) {
        query = query.eq("date", params.date);
      }

      if (params?.professionalId) {
        query = query.eq("professional_id", params.professionalId);
      }

      // Sort by date and time
      query = query
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      // Apply pagination
      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data: appointments, error, count } = await query;

      if (error) throw error;

      // Get related data separately to avoid join issues
      const clientIds = [
        ...new Set(
          appointments?.map((apt) => apt.client_id).filter(Boolean) || [],
        ),
      ];
      const serviceIds = [
        ...new Set(
          appointments?.map((apt) => apt.service_id).filter(Boolean) || [],
        ),
      ];
      const professionalIds = [
        ...new Set(
          appointments?.map((apt) => apt.professional_id).filter(Boolean) || [],
        ),
      ];

      // Fetch related data
      const [clientsData, servicesData, professionalsData] = await Promise.all([
        clientIds.length > 0
          ? supabase
              .from("clients")
              .select("id, name, email, phone")
              .in("id", clientIds)
          : { data: [], error: null },
        serviceIds.length > 0
          ? supabase
              .from("services")
              .select("id, name, price, duration")
              .in("id", serviceIds)
          : { data: [], error: null },
        professionalIds.length > 0
          ? supabase
              .from("professionals")
              .select("id, name")
              .in("id", professionalIds)
          : { data: [], error: null },
      ]);

      // Create lookup maps
      const clientsMap = new Map(clientsData.data?.map((c) => [c.id, c]) || []);
      const servicesMap = new Map(
        servicesData.data?.map((s) => [s.id, s]) || [],
      );
      const professionalsMap = new Map(
        professionalsData.data?.map((p) => [p.id, p]) || [],
      );

      // Transform data for frontend
      const transformedData =
        appointments?.map((appointment) => {
          const client = clientsMap.get(appointment.client_id);
          const service = servicesMap.get(appointment.service_id);
          const professional = professionalsMap.get(
            appointment.professional_id,
          );

          return {
            id: appointment.id,
            clientId: appointment.client_id,
            clientName: client?.name || "Cliente",
            professionalId: appointment.professional_id,
            professionalName: professional?.name || "Profissional",
            serviceId: appointment.service_id,
            serviceName: service?.name || "Serviço",
            date: appointment.date,
            startTime: appointment.start_time,
            endTime: appointment.end_time,
            duration: appointment.duration || service?.duration || 60,
            status: appointment.status,
            price: appointment.price || service?.price || 0,
            notes: appointment.notes,
            createdAt: appointment.created_at,
            updatedAt: appointment.updated_at,
          };
        }) || [];

      return this.handleResponse(
        {
          data: transformedData,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / (params?.limit || 50)),
          },
        },
        null,
        "Appointments fetch",
      );
    } catch (error) {
      return this.handleResponse(null, error, "Appointments fetch");
    }
  }

  async createAppointment(appointmentData: any) {
    try {
      logSupabaseDebug("Creating appointment...", appointmentData);

      const dataWithTenant = addTenantToData({
        client_id: appointmentData.clientId,
        professional_id: appointmentData.professionalId,
        service_id: appointmentData.serviceId,
        date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        duration: appointmentData.duration || 60,
        status: appointmentData.status || "pending",
        price: appointmentData.price || 0,
        notes: appointmentData.notes || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("appointments")
        .insert([dataWithTenant])
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Appointment creation");
    } catch (error) {
      return this.handleResponse(null, error, "Appointment creation");
    }
  }

  async updateAppointment(id: string, appointmentData: any) {
    try {
      logSupabaseDebug("Updating appointment...", { id, appointmentData });

      const updateData = {
        client_id: appointmentData.clientId,
        professional_id: appointmentData.professionalId,
        service_id: appointmentData.serviceId,
        date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        duration: appointmentData.duration,
        status: appointmentData.status,
        price: appointmentData.price,
        notes: appointmentData.notes,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", id)
        .eq("business_id", this.businessId)
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Appointment update");
    } catch (error) {
      return this.handleResponse(null, error, "Appointment update");
    }
  }

  async deleteAppointment(id: string) {
    try {
      logSupabaseDebug("Deleting appointment...", { id });

      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .eq("business_id", this.businessId);

      if (error) throw error;

      return this.handleResponse({ id }, null, "Appointment deletion");
    } catch (error) {
      return this.handleResponse(null, error, "Appointment deletion");
    }
  }

  // =====================================================
  // SERVICES API
  // =====================================================

  async getServices(params?: { category?: string; active?: boolean }) {
    try {
      logSupabaseDebug("Fetching services...", params);

      let query = supabase.from("services").select("*");
      query = this.addBusinessFilter(query);

      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params?.active !== undefined) {
        query = query.eq("is_active", params.active);
      }

      query = query.order("name");

      const { data, error } = await query;

      if (error) throw error;

      return this.handleResponse(data || [], null, "Services fetch");
    } catch (error) {
      return this.handleResponse(null, error, "Services fetch");
    }
  }

  async createService(serviceData: any) {
    try {
      logSupabaseDebug("Creating service...", serviceData);

      const dataWithTenant = addTenantToData({
        ...serviceData,
        is_active: serviceData.is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("services")
        .insert([dataWithTenant])
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Service creation");
    } catch (error) {
      return this.handleResponse(null, error, "Service creation");
    }
  }

  async updateService(id: string, serviceData: any) {
    try {
      logSupabaseDebug("Updating service...", { id, serviceData });

      const { data, error } = await supabase
        .from("services")
        .update({ ...serviceData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("business_id", this.businessId)
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Service update");
    } catch (error) {
      return this.handleResponse(null, error, "Service update");
    }
  }

  async deleteService(id: string) {
    try {
      logSupabaseDebug("Deleting service...", { id });

      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id)
        .eq("business_id", this.businessId);

      if (error) throw error;

      return this.handleResponse({ id }, null, "Service deletion");
    } catch (error) {
      return this.handleResponse(null, error, "Service deletion");
    }
  }

  // =====================================================
  // PROFESSIONALS API
  // =====================================================

  async getProfessionals(params?: { status?: string }) {
    try {
      logSupabaseDebug("Fetching professionals...", params);

      let query = supabase.from("professionals").select("*");
      query = this.addBusinessFilter(query);

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      query = query.order("name");

      const { data, error } = await query;

      if (error) throw error;

      return this.handleResponse(data || [], null, "Professionals fetch");
    } catch (error) {
      return this.handleResponse(null, error, "Professionals fetch");
    }
  }

  async createProfessional(professionalData: any) {
    try {
      logSupabaseDebug("Creating professional...", professionalData);

      const dataWithTenant = addTenantToData({
        ...professionalData,
        isActive: professionalData.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("professionals")
        .insert([dataWithTenant])
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Professional creation");
    } catch (error) {
      return this.handleResponse(null, error, "Professional creation");
    }
  }

  async updateProfessional(id: string, professionalData: any) {
    try {
      logSupabaseDebug("Updating professional...", { id, professionalData });

      const { data, error } = await supabase
        .from("professionals")
        .update({ ...professionalData, updatedAt: new Date().toISOString() })
        .eq("id", id)
        .eq("business_id", this.businessId)
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Professional update");
    } catch (error) {
      return this.handleResponse(null, error, "Professional update");
    }
  }

  async deleteProfessional(id: string) {
    try {
      logSupabaseDebug("Deleting professional...", { id });

      const { error } = await supabase
        .from("professionals")
        .delete()
        .eq("id", id)
        .eq("business_id", this.businessId);

      if (error) throw error;

      return this.handleResponse({ id }, null, "Professional deletion");
    } catch (error) {
      return this.handleResponse(null, error, "Professional deletion");
    }
  }

  // =====================================================
  // FINANCIAL API
  // =====================================================

  async getTransactions(params?: {
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      logSupabaseDebug("Fetching transactions...", params);
      logSupabaseDebug(`Using business_id: ${this.businessId}`);

      let query = supabase.from("transactions").select("*", { count: "exact" });
      query = this.addBusinessFilter(query);

      if (params?.type && params.type !== "all") {
        query = query.eq("type", params.type);
      }

      // For now, skip date filtering until we confirm column names
      // Date filtering will be re-enabled once we confirm the correct column name

      query = query.order("created_at", { ascending: false });

      // Apply pagination
      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      logSupabaseDebug("Executing transactions query...");
      const { data, error, count } = await query;

      if (error) {
        logSupabaseError("Transactions query failed", error);
        throw error;
      }

      logSupabaseDebug(
        `Transactions query successful: ${data?.length || 0} results, total count: ${count}`,
      );

      return this.handleResponse(
        {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / (params?.limit || 50)),
          },
        },
        null,
        "Transactions fetch",
      );
    } catch (error) {
      return this.handleResponse(null, error, "Transactions fetch");
    }
  }

  async createTransaction(transactionData: any) {
    try {
      logSupabaseDebug("Creating transaction...", transactionData);

      const dataWithTenant = addTenantToData({
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from("transactions")
        .insert([dataWithTenant])
        .select()
        .single();

      if (error) throw error;

      return this.handleResponse(data, null, "Transaction creation");
    } catch (error) {
      return this.handleResponse(null, error, "Transaction creation");
    }
  }

  // =====================================================
  // REPORTS API
  // =====================================================

  async getBusinessReports(dateFrom?: string, dateTo?: string) {
    try {
      logSupabaseDebug("Fetching business reports...", { dateFrom, dateTo });

      // Default to current month if no dates provided
      const startDate =
        dateFrom ||
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0];
      const endDate = dateTo || new Date().toISOString().split("T")[0];

      // Get revenue data
      const { data: revenueData, error: revenueError } = await supabase
        .from("appointments")
        .select("date, price, status")
        .eq("business_id", this.businessId)
        .gte("date", startDate)
        .lte("date", endDate)
        .eq("status", "completed");

      if (revenueError) throw revenueError;

      // Get service performance
      const { data: serviceData, error: serviceError } = await supabase
        .from("appointments")
        .select(
          `
          services!service_id(name),
          price,
          status
        `,
        )
        .eq("business_id", this.businessId)
        .eq("status", "completed")
        .gte("date", startDate)
        .lte("date", endDate);

      if (serviceError) throw serviceError;

      // Process data for charts
      const revenueByDay =
        revenueData?.reduce((acc: any, item: any) => {
          const date = item.date;
          acc[date] = (acc[date] || 0) + Number(item.price || 0);
          return acc;
        }, {}) || {};

      const servicePerformance =
        serviceData?.reduce((acc: any, item: any) => {
          const serviceName = item.services?.name || "Outros";
          if (!acc[serviceName]) {
            acc[serviceName] = { count: 0, revenue: 0 };
          }
          acc[serviceName].count += 1;
          acc[serviceName].revenue += Number(item.price || 0);
          return acc;
        }, {}) || {};

      const reports = {
        overview: Object.entries(revenueByDay).map(([date, revenue]) => ({
          date,
          revenue: Number(revenue),
          appointments:
            revenueData?.filter((item) => item.date === date).length || 0,
        })),
        servicePerformance: Object.entries(servicePerformance).map(
          ([name, data]: [string, any]) => ({
            name,
            count: data.count,
            revenue: data.revenue,
          }),
        ),
        totalRevenue:
          revenueData?.reduce(
            (sum, item) => sum + Number(item.price || 0),
            0,
          ) || 0,
        totalAppointments: revenueData?.length || 0,
      };

      return this.handleResponse(reports, null, "Business reports fetch");
    } catch (error) {
      return this.handleResponse(null, error, "Business reports fetch");
    }
  }
}

// Create singleton instance
export const supabaseApiProduction = new SupabaseApiProduction();
