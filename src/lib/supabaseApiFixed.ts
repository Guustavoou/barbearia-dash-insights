import { supabase } from "./supabase";
import { NeonClient } from "./clientsApi";
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

export class SupabaseApiFixed {
  // =====================================================
  // APPOINTMENTS API - FIXED FOR ACTUAL DATABASE SCHEMA
  // =====================================================

  async getAppointments(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
    date?: string;
  }) {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      logSupabaseDebug("Supabase desabilitado, retornando dados mock");
      return {
        success: true,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }

    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching appointments from Supabase...", params);
      logTenantDebug(`Filtrando appointments para business: ${businessId}`);

      // Use the view instead of direct table
      let query = supabase.from("appointments").select("*");

      // Apply business filter
      query = query.eq("business_id", businessId);

      // Apply filters
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.date) {
        query = query.eq("date", params.date);
      }

      if (params?.search) {
        // Search in related data - we'll need to join
        query = supabase
          .from("appointments")
          .select(
            `
            *,
            clients!client_id(name, email, phone),
            services!service_id(name),
            professionals_view!professional_id(name)
          `,
          )
          .eq("business_id", businessId);
      }

      // Apply sorting
      const sortField = params?.sort || "date";
      const sortOrder = params?.order === "DESC" ? false : true;
      query = query.order(sortField, { ascending: sortOrder });

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("🚨 Supabase Error Details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Transform to frontend format
      const transformedAppointments =
        data?.map(this.transformAppointmentToFrontend) || [];

      logSupabaseSuccess(
        `✅ Loaded ${transformedAppointments.length} appointments from Supabase`,
      );

      return {
        success: true,
        data: transformedAppointments,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error fetching appointments", errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  }

  async createAppointment(appointment: any) {
    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Creating appointment...", appointment);

      const appointmentData = {
        business_id: businessId,
        client_id: appointment.clientId,
        professional_id: appointment.professionalId,
        service_id: appointment.serviceId,
        date: appointment.date,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        duration: appointment.duration || 60,
        status: appointment.status || "pendente",
        price: appointment.price || 0,
        notes: appointment.notes || "",
        payment_method: appointment.paymentMethod,
      };

      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      logSupabaseSuccess("✅ Appointment created successfully");
      return {
        success: true,
        data: this.transformAppointmentToFrontend(data),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error creating appointment", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async updateAppointment(id: string, appointment: any) {
    try {
      logSupabaseDebug("Updating appointment...", { id, appointment });

      const updateData = {
        client_id: appointment.clientId,
        professional_id: appointment.professionalId,
        service_id: appointment.serviceId,
        date: appointment.date,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        duration: appointment.duration,
        status: appointment.status,
        price: appointment.price,
        notes: appointment.notes,
        payment_method: appointment.paymentMethod,
      };

      const { data, error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      logSupabaseSuccess("✅ Appointment updated successfully");
      return {
        success: true,
        data: this.transformAppointmentToFrontend(data),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error updating appointment", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async deleteAppointment(id: string) {
    try {
      logSupabaseDebug("Deleting appointment...", { id });

      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      logSupabaseSuccess("✅ Appointment deleted successfully");
      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error deleting appointment", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // =====================================================
  // CLIENTS API - USING EXISTING TABLE
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
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching clients from Supabase...", params);

      let query = supabase.from("clients").select("*");
      query = query.eq("business_id", businessId);

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`,
        );
      }

      const sortField = params?.sort || "name";
      const sortOrder = params?.order === "DESC" ? false : true;
      query = query.order(sortField, { ascending: sortOrder });

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      logSupabaseSuccess(
        `✅ Loaded ${data?.length || 0} clients from Supabase`,
      );

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error fetching clients", errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  }

  // =====================================================
  // SERVICES API - USING EXISTING TABLE
  // =====================================================

  async getServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching services from Supabase...", params);

      let query = supabase.from("services").select("*");
      query = query.eq("business_id", businessId);
      query = query.eq("is_active", true);

      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,description.ilike.%${params.search}%`,
        );
      }

      const { data, error } = await query.order("name");

      if (error) throw error;

      logSupabaseSuccess(
        `✅ Loaded ${data?.length || 0} services from Supabase`,
      );

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error fetching services", errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
      };
    }
  }

  // =====================================================
  // PROFESSIONALS API - USING VIEW
  // =====================================================

  async getProfessionals(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching professionals from Supabase...", params);

      let query = supabase.from("professionals_view").select("*");
      query = query.eq("business_id", businessId);

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
        );
      }

      const { data, error } = await query.order("name");

      if (error) throw error;

      logSupabaseSuccess(
        `✅ Loaded ${data?.length || 0} professionals from Supabase`,
      );

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error fetching professionals", errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
      };
    }
  }

  // =====================================================
  // TRANSACTIONS API - USING EXISTING TABLE
  // =====================================================

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching transactions from Supabase...", params);

      let query = supabase.from("transactions").select("*");
      query = query.eq("business_id", businessId);

      if (params?.type && params.type !== "all") {
        query = query.eq("type", params.type);
      }

      // For now, skip date filtering until we confirm column names
      // Date filtering will be re-enabled once we confirm the correct column name

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      logSupabaseSuccess(
        `✅ Loaded ${data?.length || 0} transactions from Supabase`,
      );

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ Error fetching transactions", errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
      };
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private transformAppointmentToFrontend(appointment: any) {
    return {
      id: appointment.id,
      clientId: appointment.client_id,
      clientName: appointment.client_name || "Cliente",
      professionalId: appointment.professional_id,
      professionalName: appointment.professional_name || "Profissional",
      serviceId: appointment.service_id,
      serviceName: appointment.service_name || "Serviço",
      date: appointment.date,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      duration: appointment.duration || 60,
      status: appointment.status || "pendente",
      price: appointment.price || 0,
      notes: appointment.notes || "",
      paymentMethod: appointment.payment_method,
      rating: appointment.rating,
      feedbackComment: appointment.feedback_comment,
      reminderSent: appointment.reminder_sent || false,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at,
    };
  }
}

// Create singleton instance
export const supabaseApiFixed = new SupabaseApiFixed();
