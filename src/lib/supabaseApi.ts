import { supabase } from "./supabase";
import { NeonClient, Visit } from "./clientsApi";

export class SupabaseApi {
  // Clients API
  async getClients(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
  }) {
    try {
      console.log("🔍 Fetching clients from Supabase...");

      let query = supabase.from("clients").select("*");

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
      const sortOrder = params?.order === "DESC" ? false : true;
      query = query.order(sortField, { ascending: sortOrder });

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform to frontend format
      const transformedClients = data?.map(this.transformToFrontend) || [];

      console.log(
        `✅ Loaded ${transformedClients.length} clients from Supabase`,
      );

      return {
        success: true,
        data: transformedClients,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      return {
        success: false,
        error: "Failed to fetch clients from Supabase",
      };
    }
  }

  async getClientById(id: string) {
    try {
      console.log(`🔍 Fetching client ${id} from Supabase...`);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const transformedClient = this.transformToFrontend(data);

      console.log(`✅ Loaded client ${id} from Supabase`);

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      console.error(`❌ Error fetching client ${id}:`, error);
      return {
        success: false,
        error: "Failed to fetch client from Supabase",
      };
    }
  }

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
  ) {
    try {
      console.log("➕ Creating client in Supabase...", clientData.name);

      const backendData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        city: clientData.address,
        birthday: clientData.birthDate,
        notes: clientData.notes,
        status: clientData.status,
        total_spent: 0,
        visits: 0,
      };

      const { data, error } = await supabase
        .from("clients")
        .insert(backendData)
        .select()
        .single();

      if (error) throw error;

      const transformedClient = this.transformToFrontend(data);

      console.log(`✅ Client ${clientData.name} created in Supabase`);

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      console.error("❌ Error creating client:", error);
      return {
        success: false,
        error: "Failed to create client in Supabase",
      };
    }
  }

  async updateClient(id: string, clientData: Partial<NeonClient>) {
    try {
      console.log(`✏️ Updating client ${id} in Supabase...`);

      const backendData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        city: clientData.address,
        birthday: clientData.birthDate,
        notes: clientData.notes,
        status: clientData.status,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("clients")
        .update(backendData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const transformedClient = this.transformToFrontend(data);

      console.log(`✅ Client ${id} updated in Supabase`);

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      console.error(`❌ Error updating client ${id}:`, error);
      return {
        success: false,
        error: "Failed to update client in Supabase",
      };
    }
  }

  async deleteClient(id: string) {
    try {
      console.log(`🗑️ Deleting client ${id} from Supabase...`);

      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;

      console.log(`✅ Client ${id} deleted from Supabase`);

      return {
        success: true,
        message: "Client deleted successfully",
      };
    } catch (error) {
      console.error(`❌ Error deleting client ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete client from Supabase",
      };
    }
  }

  // Dashboard/Reports API
  async getDashboardStats() {
    try {
      console.log("📊 Fetching dashboard stats from Supabase...");

      // Get basic counts
      const [clientsResult, appointmentsResult, professionalsResult] =
        await Promise.all([
          supabase.from("clients").select("*", { count: "exact" }),
          supabase.from("appointments").select("*", { count: "exact" }),
          supabase.from("professionals").select("*", { count: "exact" }),
        ]);

      // Calculate revenue from transactions
      const { data: revenueData } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "receita")
        .eq("status", "confirmado");

      const totalRevenue =
        revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const stats = {
        total_clients: clientsResult.count || 0,
        total_appointments: appointmentsResult.count || 0,
        total_professionals: professionalsResult.count || 0,
        total_revenue: totalRevenue,
      };

      console.log("✅ Dashboard stats loaded from Supabase");

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      return {
        success: false,
        error: "Failed to fetch dashboard stats",
      };
    }
  }

  async getBusinessReports(period?: string) {
    try {
      console.log("📊 Fetching business reports from Supabase...");

      // Calculate date filter based on period
      const now = new Date();
      let dateFilter = "";

      switch (period) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = weekAgo.toISOString();
          break;
        case "year":
          const yearAgo = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          dateFilter = yearAgo.toISOString();
          break;
        default: // month
          const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          dateFilter = monthAgo.toISOString();
      }

      // Get current period data
      const [revenueData, appointmentsData] = await Promise.all([
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "receita")
          .eq("status", "confirmado")
          .gte("date", dateFilter),
        supabase
          .from("appointments")
          .select("*")
          .gte("date", dateFilter.split("T")[0]),
      ]);

      const currentRevenue =
        revenueData.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const currentAppointments = appointmentsData.data?.length || 0;

      // Mock growth calculation (you can implement proper comparison logic)
      const overview = {
        current_revenue: currentRevenue,
        current_appointments: currentAppointments,
        revenue_growth: 12.5, // Calculate vs previous period
        appointment_growth: 15.3, // Calculate vs previous period
      };

      console.log("✅ Business reports loaded from Supabase");

      return {
        success: true,
        data: { overview },
      };
    } catch (error) {
      console.error("❌ Error fetching business reports:", error);
      return {
        success: false,
        error: "Failed to fetch business reports",
      };
    }
  }

  async getSalesPerformance(period?: string, limit?: number) {
    try {
      console.log("📊 Fetching sales performance from Supabase...");

      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          appointments(
            price,
            status,
            date
          )
        `,
        )
        .eq("is_active", true)
        .limit(limit || 10);

      if (error) throw error;

      // Transform data to match expected format
      const salesData =
        data?.map((service) => ({
          service_name: service.name,
          category: service.category,
          total_appointments: service.appointments?.length || 0,
          total_revenue:
            service.appointments?.reduce(
              (sum: number, apt: any) =>
                apt.status === "concluido" ? sum + apt.price : sum,
              0,
            ) || 0,
          average_price: service.price,
        })) || [];

      console.log("✅ Sales performance loaded from Supabase");

      return {
        success: true,
        data: salesData,
      };
    } catch (error) {
      console.error("❌ Error fetching sales performance:", error);
      return {
        success: false,
        error: "Failed to fetch sales performance",
      };
    }
  }

  // Utility methods
  private transformToFrontend(backendClient: any): NeonClient {
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
      avgInterval: 0, // Calculate based on visits
      notes: backendClient.notes,
      visits: [], // Will be populated separately if needed
    };
  }

  // Real-time subscriptions
  subscribeToClients(callback: (payload: any) => void) {
    return supabase
      .channel("clients-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clients",
        },
        callback,
      )
      .subscribe();
  }

  subscribeToAppointments(callback: (payload: any) => void) {
    return supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        callback,
      )
      .subscribe();
  }
}

// Create and export API instance
export const supabaseApi = new SupabaseApi();
