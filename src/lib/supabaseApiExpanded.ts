import { supabase } from "./supabase";
import { SupabaseApi } from "./supabaseApi";

// Expandir a classe SupabaseApi com métodos adicionais para todas as entidades
export class ExpandedSupabaseApi extends SupabaseApi {
  // APPOINTMENTS API
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
    date?: string;
    professionalId?: string;
  }) {
    try {
      console.log("🔍 Fetching appointments from Supabase...");

      let query = supabase.from("appointments").select(`
        *,
        clients(name, phone, email),
        professionals(name),
        services(name, duration, price)
      `);

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

      if (params?.search) {
        query = query.or(
          `notes.ilike.%${params.search}%,clients.name.ilike.%${params.search}%`,
        );
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

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} appointments from Supabase`);

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
      console.error("❌ Error fetching appointments:", error);
      return {
        success: false,
        error: "Failed to fetch appointments from Supabase",
      };
    }
  }

  async createAppointment(appointmentData: any) {
    try {
      console.log("➕ Creating appointment in Supabase...");

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          client_id: appointmentData.clientId,
          professional_id: appointmentData.professionalId,
          service_id: appointmentData.serviceId,
          date: appointmentData.date,
          start_time: appointmentData.startTime,
          end_time: appointmentData.endTime,
          status: appointmentData.status || "pendente",
          notes: appointmentData.notes,
          price: appointmentData.price,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Appointment created in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error creating appointment:", error);
      return {
        success: false,
        error: "Failed to create appointment in Supabase",
      };
    }
  }

  async updateAppointment(id: string, appointmentData: any) {
    try {
      console.log(`✏️ Updating appointment ${id} in Supabase...`);

      const { data, error } = await supabase
        .from("appointments")
        .update({
          ...appointmentData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Appointment ${id} updated in Supabase`);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ Error updating appointment ${id}:`, error);
      return {
        success: false,
        error: "Failed to update appointment in Supabase",
      };
    }
  }

  async deleteAppointment(id: string) {
    try {
      console.log(`🗑️ Deleting appointment ${id} from Supabase...`);

      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      console.log(`✅ Appointment ${id} deleted from Supabase`);

      return {
        success: true,
        message: "Appointment deleted successfully",
      };
    } catch (error) {
      console.error(`❌ Error deleting appointment ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete appointment from Supabase",
      };
    }
  }

  // SERVICES API
  async getServices(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    category?: string;
    isActive?: boolean;
  }) {
    try {
      console.log("🔍 Fetching services from Supabase...");

      let query = supabase.from("services").select("*");

      // Apply filters
      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params?.isActive !== undefined) {
        query = query.eq("is_active", params.isActive);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,description.ilike.%${params.search}%`,
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

      console.log(`✅ Loaded ${data?.length || 0} services from Supabase`);

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
      console.error("❌ Error fetching services:", error);
      return {
        success: false,
        error: "Failed to fetch services from Supabase",
      };
    }
  }

  async createService(serviceData: any) {
    try {
      console.log("➕ Creating service in Supabase...");

      const { data, error } = await supabase
        .from("services")
        .insert({
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration: serviceData.duration,
          category: serviceData.category,
          is_active: serviceData.isActive ?? true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Service created in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error creating service:", error);
      return {
        success: false,
        error: "Failed to create service in Supabase",
      };
    }
  }

  async updateService(id: string, serviceData: any) {
    try {
      console.log(`✏️ Updating service ${id} in Supabase...`);

      const { data, error } = await supabase
        .from("services")
        .update({
          ...serviceData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Service ${id} updated in Supabase`);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ Error updating service ${id}:`, error);
      return {
        success: false,
        error: "Failed to update service in Supabase",
      };
    }
  }

  async deleteService(id: string) {
    try {
      console.log(`🗑️ Deleting service ${id} from Supabase...`);

      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      console.log(`✅ Service ${id} deleted from Supabase`);

      return {
        success: true,
        message: "Service deleted successfully",
      };
    } catch (error) {
      console.error(`❌ Error deleting service ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete service from Supabase",
      };
    }
  }

  // PROFESSIONALS API
  async getProfessionals(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    isActive?: boolean;
  }) {
    try {
      console.log("🔍 Fetching professionals from Supabase...");

      let query = supabase.from("professionals").select("*");

      // Apply filters
      if (params?.isActive !== undefined) {
        query = query.eq("is_active", params.isActive);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,email.ilike.%${params.search}%,specialties.ilike.%${params.search}%`,
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

      console.log(`✅ Loaded ${data?.length || 0} professionals from Supabase`);

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
      console.error("❌ Error fetching professionals:", error);
      return {
        success: false,
        error: "Failed to fetch professionals from Supabase",
      };
    }
  }

  async createProfessional(professionalData: any) {
    try {
      console.log("➕ Creating professional in Supabase...");

      const { data, error } = await supabase
        .from("professionals")
        .insert({
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone,
          specialties: professionalData.specialties,
          is_active: professionalData.isActive ?? true,
          commission_rate: professionalData.commissionRate || 0,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Professional created in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error creating professional:", error);
      return {
        success: false,
        error: "Failed to create professional in Supabase",
      };
    }
  }

  async updateProfessional(id: string, professionalData: any) {
    try {
      console.log(`✏️ Updating professional ${id} in Supabase...`);

      const { data, error } = await supabase
        .from("professionals")
        .update({
          ...professionalData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Professional ${id} updated in Supabase`);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ Error updating professional ${id}:`, error);
      return {
        success: false,
        error: "Failed to update professional in Supabase",
      };
    }
  }

  async deleteProfessional(id: string) {
    try {
      console.log(`🗑️ Deleting professional ${id} from Supabase...`);

      const { error } = await supabase
        .from("professionals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      console.log(`✅ Professional ${id} deleted from Supabase`);

      return {
        success: true,
        message: "Professional deleted successfully",
      };
    } catch (error) {
      console.error(`❌ Error deleting professional ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete professional from Supabase",
      };
    }
  }

  // FINANCIAL/TRANSACTIONS API
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    type?: "receita" | "despesa";
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    try {
      console.log("🔍 Fetching transactions from Supabase...");

      let query = supabase.from("transactions").select("*");

      // Apply filters
      if (params?.type) {
        query = query.eq("type", params.type);
      }

      if (params?.status) {
        query = query.eq("status", params.status);
      }

      if (params?.dateFrom) {
        query = query.gte("date", params.dateFrom);
      }

      if (params?.dateTo) {
        query = query.lte("date", params.dateTo);
      }

      if (params?.search) {
        query = query.or(
          `description.ilike.%${params.search}%,category.ilike.%${params.search}%`,
        );
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

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} transactions from Supabase`);

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
      console.error("❌ Error fetching transactions:", error);
      return {
        success: false,
        error: "Failed to fetch transactions from Supabase",
      };
    }
  }

  async createTransaction(transactionData: any) {
    try {
      console.log("➕ Creating transaction in Supabase...");

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          description: transactionData.description,
          amount: transactionData.amount,
          type: transactionData.type,
          category: transactionData.category,
          date: transactionData.date,
          status: transactionData.status || "pendente",
          payment_method: transactionData.paymentMethod,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Transaction created in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error creating transaction:", error);
      return {
        success: false,
        error: "Failed to create transaction in Supabase",
      };
    }
  }

  async getFinancialStats(period?: string) {
    try {
      console.log("📊 Fetching financial stats from Supabase...");

      // Calculate date filter based on period
      const now = new Date();
      let dateFilter = "";

      switch (period) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = weekAgo.toISOString().split("T")[0];
          break;
        case "year":
          const yearAgo = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          dateFilter = yearAgo.toISOString().split("T")[0];
          break;
        default: // month
          const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          dateFilter = monthAgo.toISOString().split("T")[0];
      }

      // Get revenue and expenses
      const [revenueData, expensesData] = await Promise.all([
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "receita")
          .eq("status", "confirmado")
          .gte("date", dateFilter),
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "despesa")
          .eq("status", "confirmado")
          .gte("date", dateFilter),
      ]);

      const totalRevenue =
        revenueData.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalExpenses =
        expensesData.data?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const stats = {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        net_income: totalRevenue - totalExpenses,
        profit_margin:
          totalRevenue > 0
            ? ((totalRevenue - totalExpenses) / totalRevenue) * 100
            : 0,
      };

      console.log("✅ Financial stats loaded from Supabase");

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("❌ Error fetching financial stats:", error);
      return {
        success: false,
        error: "Failed to fetch financial stats",
      };
    }
  }

  // PRODUCTS/STOCK API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    category?: string;
    isActive?: boolean;
  }) {
    try {
      console.log("🔍 Fetching products from Supabase...");

      let query = supabase.from("products").select("*");

      // Apply filters
      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params?.isActive !== undefined) {
        query = query.eq("is_active", params.isActive);
      }

      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,brand.ilike.%${params.search}%`,
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

      console.log(`✅ Loaded ${data?.length || 0} products from Supabase`);

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
      console.error("❌ Error fetching products:", error);
      return {
        success: false,
        error: "Failed to fetch products from Supabase",
      };
    }
  }

  async createProduct(productData: any) {
    try {
      console.log("➕ Creating product in Supabase...");

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: productData.name,
          brand: productData.brand,
          category: productData.category,
          price: productData.price,
          cost: productData.cost,
          stock_quantity: productData.stockQuantity || 0,
          min_stock: productData.minStock || 0,
          is_active: productData.isActive ?? true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Product created in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error creating product:", error);
      return {
        success: false,
        error: "Failed to create product in Supabase",
      };
    }
  }

  async getStock(params?: any) {
    try {
      console.log("���� Fetching stock from Supabase...");

      let query = supabase.from("products").select("*");

      // Filter for low stock if needed
      if (params?.lowStock) {
        query = query.lt(
          "stock_quantity",
          supabase.rpc("COALESCE", ["min_stock", 10]),
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} stock items from Supabase`);

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error("❌ Error fetching stock:", error);
      return {
        success: false,
        error: "Failed to fetch stock from Supabase",
      };
    }
  }
}

// Create and export expanded API instance
export const expandedSupabaseApi = new ExpandedSupabaseApi();
