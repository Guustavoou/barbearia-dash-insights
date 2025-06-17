import { supabase } from "./supabase";
import {
  SUPABASE_CONFIG,
  logSupabaseDebug,
  logSupabaseError,
  logSupabaseSuccess,
} from "./supabaseConfig";

// Lista de problemas conhecidos a evitar
const PROBLEMATIC_PATTERNS = {
  RLS_RECURSION: "infinite recursion detected in policy",
  MISSING_TABLE: "does not exist",
  MISSING_RELATION: "Could not find a relationship",
  BUSINESS_USERS: "business_users", // Tabela problemática
};

class SafeSupabaseApi {
  private blacklistedTables = new Set<string>();
  private verifiedTables = new Map<string, boolean>();

  // Método para verificar se uma tabela é segura de usar
  async isTableSafe(tableName: string): Promise<boolean> {
    if (this.blacklistedTables.has(tableName)) {
      logSupabaseDebug(`Tabela ${tableName} está na blacklist`);
      return false;
    }

    if (this.verifiedTables.has(tableName)) {
      return this.verifiedTables.get(tableName)!;
    }

    try {
      logSupabaseDebug(`Testando segurança da tabela: ${tableName}`);

      // Método 1: Tentar select com limit 0 (mais leve)
      let { error } = await supabase.from(tableName).select("*").limit(0);

      // Se limit 0 falhou, tenta count estimado
      if (error) {
        logSupabaseDebug(
          `Limit 0 falhou para ${tableName}, tentando count estimado...`,
        );

        const result = await supabase
          .from(tableName)
          .select("*", { count: "estimated", head: true });

        error = result.error;
      }

      // Se count estimado falhou, tenta select simples
      if (error) {
        logSupabaseDebug(
          `Count estimado falhou para ${tableName}, tentando select simples...`,
        );

        const result = await supabase
          .from(tableName)
          .select("*")
          .limit(1)
          .maybeSingle();

        error = result.error;
      }

      if (error) {
        // Debug mais detalhado do erro
        logSupabaseDebug(`Erro bruto para ${tableName}:`, {
          error,
          keys: Object.keys(error || {}),
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        });

        const errorStr = JSON.stringify(error, null, 2);

        // Se message está vazio, pode ser um problema de acesso
        if (!error?.message && !error?.code) {
          logSupabaseError(
            `Tabela ${tableName} - erro sem detalhes (possível problema de acesso)`,
          );
          this.verifiedTables.set(tableName, false);
          return false;
        }

        logSupabaseError(`Tabela ${tableName} não é segura:`, {
          message: error?.message || "Sem mensagem",
          code: error?.code || "Sem código",
          details: error?.details || "Sem detalhes",
          hint: error?.hint || "Sem dica",
          fullError: errorStr,
        });

        // Verifica se é um dos problemas conhecidos
        if (errorStr.includes(PROBLEMATIC_PATTERNS.RLS_RECURSION)) {
          logSupabaseError(
            `RLS recursion detectado em ${tableName} - adicionando à blacklist`,
          );
          this.blacklistedTables.add(tableName);
        }

        if (errorStr.includes(PROBLEMATIC_PATTERNS.MISSING_TABLE)) {
          logSupabaseError(`Tabela ${tableName} não existe`);
        }

        if (errorStr.includes(PROBLEMATIC_PATTERNS.BUSINESS_USERS)) {
          logSupabaseError(
            `Problema com business_users detectado - evitando esta query`,
          );
          this.blacklistedTables.add(tableName);
        }

        // Se é erro vazio, pode ser problema de autenticação
        if (!error?.message) {
          logSupabaseError(
            `Possível problema de autenticação/acesso para ${tableName}`,
          );
        }

        this.verifiedTables.set(tableName, false);
        return false;
      }

      logSupabaseSuccess(`Tabela ${tableName} é segura`);
      this.verifiedTables.set(tableName, true);
      return true;
    } catch (error) {
      const errorStr =
        typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : String(error);

      logSupabaseError(`Erro ao testar tabela ${tableName}:`, errorStr);
      this.verifiedTables.set(tableName, false);
      return false;
    }
  }

  // Método para tentar diferentes nomes de tabela
  async findWorkingTableName(baseNames: string[]): Promise<string | null> {
    for (const tableName of baseNames) {
      const isSafe = await this.isTableSafe(tableName);
      if (isSafe) {
        logSupabaseSuccess(`Tabela funcional encontrada: ${tableName}`);
        return tableName;
      }
    }

    logSupabaseError(
      `Nenhuma tabela funcional encontrada em: ${baseNames.join(", ")}`,
    );
    return null;
  }

  async safeGetClients(params?: any) {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      return this.getMockResponse("clients", []);
    }

    try {
      logSupabaseDebug("Tentando buscar clientes com segurança...");

      // Tenta diferentes nomes de tabela
      const possibleNames = ["clients", "Clients", "client", "Client"];
      const workingTable = await this.findWorkingTableName(possibleNames);

      if (!workingTable) {
        logSupabaseError("Nenhuma tabela de clientes funcional encontrada");
        return this.getMockResponse("clients", []);
      }

      // Query mais simples possível
      let query = supabase.from(workingTable).select("*");

      // Aplicar apenas filtros básicos e seguros
      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error, count } = await query;

      if (error) {
        const errorStr = JSON.stringify(error, null, 2);
        logSupabaseError("Erro na query de clientes:", errorStr);

        // Se é problema de RLS, blacklist a tabela
        if (errorStr.includes(PROBLEMATIC_PATTERNS.RLS_RECURSION)) {
          this.blacklistedTables.add(workingTable);
        }

        return this.getMockResponse("clients", []);
      }

      logSupabaseSuccess(`Clientes carregados: ${data?.length || 0}`);

      return {
        success: true,
        data: data || [],
        pagination: {
          page: 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10)),
        },
      };
    } catch (error) {
      const errorStr =
        typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : String(error);

      logSupabaseError("Erro geral ao buscar clientes:", errorStr);
      return this.getMockResponse("clients", []);
    }
  }

  async safeGetAppointments(params?: any) {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      return this.getMockResponse("appointments", []);
    }

    try {
      logSupabaseDebug("Tentando buscar agendamentos com segurança...");

      const possibleNames = [
        "appointments",
        "Appointments",
        "appointment",
        "Appointment",
      ];
      const workingTable = await this.findWorkingTableName(possibleNames);

      if (!workingTable) {
        logSupabaseError("Nenhuma tabela de agendamentos funcional encontrada");
        return this.getMockResponse("appointments", []);
      }

      // Query mais simples possível - sem relacionamentos
      let query = supabase.from(workingTable).select("*");

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error, count } = await query;

      if (error) {
        const errorStr = JSON.stringify(error, null, 2);
        logSupabaseError("Erro na query de agendamentos:", errorStr);

        if (errorStr.includes(PROBLEMATIC_PATTERNS.RLS_RECURSION)) {
          this.blacklistedTables.add(workingTable);
        }

        return this.getMockResponse("appointments", []);
      }

      logSupabaseSuccess(`Agendamentos carregados: ${data?.length || 0}`);

      return {
        success: true,
        data: data || [],
        pagination: {
          page: 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10)),
        },
      };
    } catch (error) {
      const errorStr =
        typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : String(error);

      logSupabaseError("Erro geral ao buscar agendamentos:", errorStr);
      return this.getMockResponse("appointments", []);
    }
  }

  async safeGetServices(params?: any) {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      return this.getMockResponse("services", []);
    }

    try {
      logSupabaseDebug("Tentando buscar serviços com segurança...");

      const possibleNames = ["services", "Services", "service", "Service"];
      const workingTable = await this.findWorkingTableName(possibleNames);

      if (!workingTable) {
        logSupabaseError("Nenhuma tabela de serviços funcional encontrada");
        return this.getMockResponse("services", []);
      }

      // Query simples sem relacionamentos
      let query = supabase.from(workingTable).select("*");

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error, count } = await query;

      if (error) {
        const errorStr = JSON.stringify(error, null, 2);
        logSupabaseError("Erro na query de serviços:", errorStr);

        if (errorStr.includes(PROBLEMATIC_PATTERNS.RLS_RECURSION)) {
          this.blacklistedTables.add(workingTable);
        }

        return this.getMockResponse("services", []);
      }

      logSupabaseSuccess(`Serviços carregados: ${data?.length || 0}`);

      return {
        success: true,
        data: data || [],
        pagination: {
          page: 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10)),
        },
      };
    } catch (error) {
      const errorStr =
        typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : String(error);

      logSupabaseError("Erro geral ao buscar serviços:", errorStr);
      return this.getMockResponse("services", []);
    }
  }

  async safeGetDashboardStats() {
    logSupabaseDebug("Calculando estatísticas do dashboard com segurança...");

    const stats = {
      total_clients: 0,
      total_appointments: 0,
      total_professionals: 0,
      total_services: 0,
      total_revenue: 0,
    };

    try {
      // Tenta cada estatística individualmente para não quebrar tudo se uma falhar

      // Clientes
      try {
        const clientsResult = await this.safeGetClients({ limit: 1 });
        if (clientsResult.success && clientsResult.pagination) {
          stats.total_clients = clientsResult.pagination.total;
        }
      } catch (error) {
        logSupabaseDebug("Erro ao contar clientes, mantendo 0");
      }

      // Agendamentos
      try {
        const appointmentsResult = await this.safeGetAppointments({ limit: 1 });
        if (appointmentsResult.success && appointmentsResult.pagination) {
          stats.total_appointments = appointmentsResult.pagination.total;
        }
      } catch (error) {
        logSupabaseDebug("Erro ao contar agendamentos, mantendo 0");
      }

      // Serviços
      try {
        const servicesResult = await this.safeGetServices({ limit: 1 });
        if (servicesResult.success && servicesResult.pagination) {
          stats.total_services = servicesResult.pagination.total;
        }
      } catch (error) {
        logSupabaseDebug("Erro ao contar serviços, mantendo 0");
      }

      logSupabaseSuccess("Estatísticas calculadas:", stats);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      const errorStr =
        typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : String(error);

      logSupabaseError("Erro ao calcular estatísticas:", errorStr);

      return {
        success: true,
        data: stats, // Retorna stats zeradas em vez de erro
      };
    }
  }

  // Método para retornar resposta mock padronizada
  private getMockResponse(type: string, data: any[]) {
    logSupabaseDebug(`Retornando dados mock para ${type}`);
    return {
      success: true,
      data,
      pagination: {
        page: 1,
        limit: 10,
        total: data.length,
        totalPages: Math.ceil(data.length / 10),
      },
    };
  }

  // Método para verificar o status geral do Supabase
  async getConnectionStatus() {
    const status = {
      connected: false,
      workingTables: [] as string[],
      blacklistedTables: Array.from(this.blacklistedTables),
      errors: [] as string[],
    };

    const tablesToTest = [
      "clients",
      "appointments",
      "services",
      "professionals",
    ];

    for (const tableName of tablesToTest) {
      try {
        const isSafe = await this.isTableSafe(tableName);
        if (isSafe) {
          status.workingTables.push(tableName);
          status.connected = true;
        }
      } catch (error) {
        const errorStr =
          typeof error === "object" && error !== null
            ? JSON.stringify(error, null, 2)
            : String(error);
        status.errors.push(`${tableName}: ${errorStr}`);
      }
    }

    return status;
  }
}

export const safeSupabaseApi = new SafeSupabaseApi();
