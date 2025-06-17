import { supabase } from "./supabase";
import { NeonClient, Visit } from "./clientsApi";
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
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      logSupabaseDebug("Supabase desabilitado, retornando dados mock");
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    try {
      const businessId = getCurrentBusinessId();
      logSupabaseDebug("Fetching clients from Supabase...", params);
      logTenantDebug(`Filtrando clientes para business: ${businessId}`);

      let query = supabase.from("clients").select("*");

      // ISOLAMENTO MULTI-TENANT: Aplicar filtro de business_id
      query = addTenantFilter(query);

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
      const errorMessage = (() => {
        if (error instanceof Error) {
          return `${error.name}: ${error.message}`;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      console.error("❌ Error fetching clients:", errorMessage);
      return {
        success: false,
        error: `Failed to fetch clients from Supabase: ${errorMessage}`,
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

      // ISOLAMENTO MULTI-TENANT: Adicionar business_id
      const tenantData = addTenantToData(backendData);

      const { data, error } = await supabase
        .from("clients")
        .insert(tenantData)
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

  // APPOINTMENTS API
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "ASC" | "DESC";
    search?: string;
    status?: string;
    date?: string;
  }) {
    try {
      console.log("🔍 Fetching appointments from Supabase...");
      logTenantDebug(
        `Filtrando appointments para business: ${getCurrentBusinessId()}`,
      );

      let query = supabase.from("appointments").select("*", { count: "exact" });

      // ISOLAMENTO MULTI-TENANT: Aplicar filtro de business_id
      query = addTenantFilter(query);

      // Apply filters
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.date) {
        query = query.eq("date", params.date);
      }

      if (params?.search) {
        query = query.or(
          `notes.ilike.%${params.search}%,client_name.ilike.%${params.search}%`,
        );
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
      const errorMessage = (() => {
        if (error instanceof Error) {
          return `${error.name}: ${error.message}`;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      console.error("❌ Error fetching appointments:", errorMessage);
      return {
        success: false,
        error: `Failed to fetch appointments from Supabase: ${errorMessage}`,
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
    is_active?: boolean;
  }) {
    try {
      console.log("🔍 Fetching products from Supabase...");
      logTenantDebug(
        `Filtrando products para business: ${getCurrentBusinessId()}`,
      );

      let query = supabase.from("products").select("*");

      // ISOLAMENTO MULTI-TENANT: Aplicar filtro de business_id
      query = addTenantFilter(query);

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

      const baseData = {
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        price: productData.price,
        cost_price: productData.cost || productData.cost_price,
        stock_quantity:
          productData.stock_quantity || productData.stockQuantity || 0,
        min_stock: productData.min_stock || productData.minStock || 0,
        supplier: productData.supplier,
        status: productData.status || "ativo",
      };

      // ISOLAMENTO MULTI-TENANT: Adicionar business_id
      const tenantData = addTenantToData(baseData);

      const { data, error } = await supabase
        .from("products")
        .insert(tenantData)
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

  async updateProduct(productId: string, productData: any) {
    try {
      console.log("✏️ Updating product in Supabase...");

      const { data, error } = await supabase
        .from("products")
        .update({
          name: productData.name,
          brand: productData.brand,
          category: productData.category,
          price: productData.price,
          cost_price: productData.cost || productData.cost_price,
          stock_quantity:
            productData.stock_quantity || productData.stockQuantity,
          min_stock: productData.min_stock || productData.minStock,
          supplier: productData.supplier,
          status: productData.status,
        })
        .eq("id", productId)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Product updated in Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error updating product:", error);
      return {
        success: false,
        error: "Failed to update product in Supabase",
      };
    }
  }

  async deleteProduct(productId: string) {
    try {
      console.log("🗑️ Deleting product from Supabase...");

      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Product deleted from Supabase");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      return {
        success: false,
        error: "Failed to delete product from Supabase",
      };
    }
  }

  async getStock(params?: any) {
    try {
      console.log("🔍 Fetching stock from Supabase...");

      let query = supabase.from("products").select("*");

      // Filter for low stock if needed
      if (params?.lowStock) {
        query = query.lt("stock_quantity", supabase.raw("min_stock"));
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
          .gte("date", dateFilter.split("T")[0]),
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

      // Query simples sem relacionamentos até configurarmos foreign keys
      const { data, error } = await supabase
        .from("services")
        .select("*")
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
      const errorMessage = (() => {
        if (error instanceof Error) {
          return `${error.name}: ${error.message}`;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      console.error("❌ Error fetching sales performance:", errorMessage);
      return {
        success: false,
        error: `Failed to fetch sales performance: ${errorMessage}`,
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
