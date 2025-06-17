import { supabase } from "./supabase";
import {
  logSupabaseDebug,
  logSupabaseError,
  logSupabaseSuccess,
} from "./supabaseConfig";

interface TableConfig {
  name: string;
  exists: boolean;
  alternativeNames: string[];
  verified: boolean;
}

class AdaptiveSupabaseApi {
  private tableConfig: Record<string, TableConfig> = {
    clients: {
      name: "clients",
      exists: false,
      alternativeNames: ["Clients", "client", "Client"],
      verified: false,
    },
    appointments: {
      name: "appointments",
      exists: false,
      alternativeNames: ["Appointments", "appointment", "Appointment"],
      verified: false,
    },
    services: {
      name: "services",
      exists: false,
      alternativeNames: ["Services", "service", "Service"],
      verified: false,
    },
    professionals: {
      name: "professionals",
      exists: false,
      alternativeNames: ["Professionals", "professional", "Professional"],
      verified: false,
    },
    transactions: {
      name: "transactions",
      exists: false,
      alternativeNames: ["Transactions", "transaction", "Transaction"],
      verified: false,
    },
    products: {
      name: "products",
      exists: false,
      alternativeNames: ["Products", "product", "Product"],
      verified: false,
    },
  };

  async verifyTable(tableKey: string): Promise<string | null> {
    const config = this.tableConfig[tableKey];
    if (!config) return null;

    if (config.verified && config.exists) {
      return config.name;
    }

    // Testa o nome principal e alternativas
    const namesToTest = [config.name, ...config.alternativeNames];

    for (const tableName of namesToTest) {
      try {
        logSupabaseDebug(`Verificando tabela: ${tableName}`);

        const { error } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });

        if (!error) {
          logSupabaseSuccess(`Tabela encontrada: ${tableName}`);
          config.name = tableName;
          config.exists = true;
          config.verified = true;
          return tableName;
        } else {
          const errorMsg =
            typeof error === "object" && error !== null
              ? JSON.stringify(error, null, 2)
              : String(error);
          logSupabaseDebug(`Tabela ${tableName} não funciona:`, errorMsg);
        }
      } catch (error) {
        const errorMsg =
          typeof error === "object" && error !== null
            ? JSON.stringify(error, null, 2)
            : String(error);
        logSupabaseDebug(`Erro ao verificar ${tableName}:`, errorMsg);
      }
    }

    config.verified = true;
    config.exists = false;
    logSupabaseError(`Nenhuma variação da tabela ${tableKey} foi encontrada`);
    return null;
  }

  async getClients(params?: any) {
    const tableName = await this.verifyTable("clients");
    if (!tableName) {
      return {
        success: false,
        error: "Tabela clients não encontrada em nenhuma variação",
      };
    }

    try {
      logSupabaseDebug(`Buscando clientes da tabela: ${tableName}`, params);

      let query = supabase.from(tableName).select("*");

      // Apply filters safely
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.search) {
        // Tenta diferentes variações de nomes de coluna
        const searchFields = ["name", "email", "phone"];
        const orConditions = searchFields
          .map((field) => `${field}.ilike.%${params.search}%`)
          .join(",");
        query = query.or(orConditions);
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
        logSupabaseError("Erro na query de clientes:", error);
        throw error;
      }

      logSupabaseSuccess(`Carregados ${data?.length || 0} clientes`);

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
      const errorMsg = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      logSupabaseError("Erro ao buscar clientes:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  async getAppointments(params?: any) {
    const tableName = await this.verifyTable("appointments");
    if (!tableName) {
      return {
        success: false,
        error: "Tabela appointments não encontrada em nenhuma variação",
      };
    }

    try {
      logSupabaseDebug(`Buscando agendamentos da tabela: ${tableName}`, params);

      // Query simples sem relacionamentos
      let query = supabase.from(tableName).select("*");

      // Apply filters
      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params?.date) {
        query = query.eq("date", params.date);
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logSupabaseError("Erro na query de agendamentos:", error);
        throw error;
      }

      logSupabaseSuccess(`Carregados ${data?.length || 0} agendamentos`);

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
      const errorMsg = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      logSupabaseError("Erro ao buscar agendamentos:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  async getServices(params?: any) {
    const tableName = await this.verifyTable("services");
    if (!tableName) {
      return {
        success: false,
        error: "Tabela services não encontrada em nenhuma variação",
      };
    }

    try {
      logSupabaseDebug(`Buscando serviços da tabela: ${tableName}`, params);

      let query = supabase.from(tableName).select("*");

      // Apply filters
      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params?.isActive !== undefined) {
        query = query.eq("is_active", params.isActive);
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logSupabaseError("Erro na query de serviços:", error);
        throw error;
      }

      logSupabaseSuccess(`Carregados ${data?.length || 0} serviços`);

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
      const errorMsg = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      logSupabaseError("Erro ao buscar serviços:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  async getDashboardStats() {
    try {
      logSupabaseDebug("Calculando estatísticas do dashboard...");

      // Verifica quais tabelas existem
      const clientsTable = await this.verifyTable("clients");
      const appointmentsTable = await this.verifyTable("appointments");
      const professionalsTable = await this.verifyTable("professionals");

      const stats: any = {};

      // Conta clientes se a tabela existir
      if (clientsTable) {
        const { count: clientsCount } = await supabase
          .from(clientsTable)
          .select("*", { count: "exact", head: true });
        stats.total_clients = clientsCount || 0;
      }

      // Conta agendamentos se a tabela existir
      if (appointmentsTable) {
        const { count: appointmentsCount } = await supabase
          .from(appointmentsTable)
          .select("*", { count: "exact", head: true });
        stats.total_appointments = appointmentsCount || 0;
      }

      // Conta profissionais se a tabela existir
      if (professionalsTable) {
        const { count: professionalsCount } = await supabase
          .from(professionalsTable)
          .select("*", { count: "exact", head: true });
        stats.total_professionals = professionalsCount || 0;
      }

      logSupabaseSuccess("Estatísticas calculadas:", stats);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      const errorMsg = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "object" && error !== null) {
          return JSON.stringify(error, null, 2);
        }
        return String(error);
      })();

      logSupabaseError("Erro ao calcular estatísticas:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  // Método para verificar todas as tabelas de uma vez
  async verifyAllTables() {
    logSupabaseDebug("Verificando todas as tabelas...");

    const results = {};
    for (const tableKey of Object.keys(this.tableConfig)) {
      const tableName = await this.verifyTable(tableKey);
      results[tableKey] = {
        found: !!tableName,
        actualName: tableName,
      };
    }

    logSupabaseSuccess("Verificação de tabelas concluída:", results);
    return results;
  }
}

export const adaptiveSupabaseApi = new AdaptiveSupabaseApi();
