import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "../lib/tenantConfig";
import { formatErrorMessage, logError } from "./error-utils";

export interface IntegrityCheckResult {
  table: string;
  totalRecords: number;
  recordsWithBusinessId: number;
  recordsWithoutBusinessId: number;
  foreignKeyViolations: any[];
  dataConsistency: boolean;
  schemaValid: boolean;
  sampleData: any[];
}

export interface DatabaseIntegrityReport {
  timestamp: string;
  businessId: string;
  overallHealth: "HEALTHY" | "WARNING" | "CRITICAL";
  tables: IntegrityCheckResult[];
  summary: {
    totalTables: number;
    totalRecords: number;
    tablesWithIssues: number;
    foreignKeyViolations: number;
    dataConsistencyIssues: number;
  };
  recommendations: string[];
}

export class SupabaseIntegrityValidator {
  private businessId: string;
  private tables = [
    "clients",
    "appointments",
    "services",
    "professionals",
    "products",
    "transactions",
  ];

  constructor() {
    this.businessId = getCurrentBusinessId();
  }

  async validateDatabaseIntegrity(): Promise<DatabaseIntegrityReport> {
    console.log("🔍 Iniciando validação de integridade do banco de dados...");

    const timestamp = new Date().toISOString();
    const results: IntegrityCheckResult[] = [];
    const recommendations: string[] = [];

    // Validar cada tabela
    for (const table of this.tables) {
      try {
        const result = await this.validateTable(table);
        results.push(result);

        if (!result.dataConsistency) {
          recommendations.push(
            `Tabela ${table} tem problemas de consistência de dados`,
          );
        }

        if (result.recordsWithoutBusinessId > 0) {
          recommendations.push(
            `Tabela ${table} tem ${result.recordsWithoutBusinessId} registros sem business_id`,
          );
        }

        if (result.foreignKeyViolations.length > 0) {
          recommendations.push(
            `Tabela ${table} tem ${result.foreignKeyViolations.length} violações de chave estrangeira`,
          );
        }
      } catch (error) {
        const errorMessage = formatErrorMessage(error);
        logError(`Erro ao validar tabela ${table}`, error);
        results.push({
          table,
          totalRecords: 0,
          recordsWithBusinessId: 0,
          recordsWithoutBusinessId: 0,
          foreignKeyViolations: [],
          dataConsistency: false,
          schemaValid: false,
          sampleData: [],
        });
        recommendations.push(
          `Erro ao acessar tabela ${table}: ${errorMessage}`,
        );
      }
    }

    // Gerar resumo
    const totalRecords = results.reduce((sum, r) => sum + r.totalRecords, 0);
    const tablesWithIssues = results.filter(
      (r) =>
        !r.dataConsistency ||
        r.recordsWithoutBusinessId > 0 ||
        r.foreignKeyViolations.length > 0,
    ).length;
    const foreignKeyViolations = results.reduce(
      (sum, r) => sum + r.foreignKeyViolations.length,
      0,
    );
    const dataConsistencyIssues = results.filter(
      (r) => !r.dataConsistency,
    ).length;

    // Determinar saúde geral
    let overallHealth: "HEALTHY" | "WARNING" | "CRITICAL" = "HEALTHY";
    if (dataConsistencyIssues > 0 || foreignKeyViolations > 5) {
      overallHealth = "CRITICAL";
    } else if (tablesWithIssues > 0) {
      overallHealth = "WARNING";
    }

    return {
      timestamp,
      businessId: this.businessId,
      overallHealth,
      tables: results,
      summary: {
        totalTables: this.tables.length,
        totalRecords,
        tablesWithIssues,
        foreignKeyViolations,
        dataConsistencyIssues,
      },
      recommendations,
    };
  }

  private async validateTable(
    tableName: string,
  ): Promise<IntegrityCheckResult> {
    console.log(`🔍 Validando tabela: ${tableName}`);

    // Contar registros totais
    const { count: totalRecords, error: countError } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Contar registros com business_id
    const { count: recordsWithBusinessId, error: businessIdError } =
      await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true })
        .not("business_id", "is", null);

    if (businessIdError) throw businessIdError;

    const recordsWithoutBusinessId =
      (totalRecords || 0) - (recordsWithBusinessId || 0);

    // Buscar dados de amostra
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select("*")
      .eq("business_id", this.businessId)
      .limit(5);

    if (sampleError) throw sampleError;

    // Validar chaves estrangeiras específicas por tabela
    const foreignKeyViolations =
      await this.checkForeignKeyViolations(tableName);

    // Verificar consistência de dados
    const dataConsistency = await this.checkDataConsistency(
      tableName,
      sampleData || [],
    );

    // Verificar schema
    const schemaValid = await this.checkTableSchema(tableName);

    return {
      table: tableName,
      totalRecords: totalRecords || 0,
      recordsWithBusinessId: recordsWithBusinessId || 0,
      recordsWithoutBusinessId,
      foreignKeyViolations,
      dataConsistency,
      schemaValid,
      sampleData: sampleData || [],
    };
  }

  private async checkForeignKeyViolations(tableName: string): Promise<any[]> {
    const violations: any[] = [];

    try {
      switch (tableName) {
        case "appointments":
          // Verificar se client_id existe
          const { data: orphanedAppointments } = await supabase
            .from("appointments")
            .select(
              `
              id, client_id, professional_id,
              clients!inner(id),
              professionals!inner(id)
            `,
            )
            .eq("business_id", this.businessId);

          // Esta query falhará se houver violações FK
          break;

        case "clients":
          // Clientes não têm FKs obrigatórias para verificar
          break;

        case "services":
          // Serviços podem ter professional_id opcional
          break;

        case "professionals":
          // Profissionais não têm FKs obrigatórias para verificar
          break;

        case "products":
          // Produtos não têm FKs obrigatórias para verificar
          break;

        case "transactions":
          // Transações podem ter client_id opcional
          break;
      }
    } catch (error) {
      violations.push({
        table: tableName,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return violations;
  }

  private async checkDataConsistency(
    tableName: string,
    sampleData: any[],
  ): Promise<boolean> {
    if (sampleData.length === 0) return true;

    try {
      switch (tableName) {
        case "appointments":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.client_id &&
              record.date &&
              record.time &&
              ["agendado", "confirmado", "concluido", "cancelado"].includes(
                record.status,
              ),
          );

        case "clients":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.name &&
              record.name.trim().length > 0,
          );

        case "services":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.name &&
              record.price >= 0,
          );

        case "professionals":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.name &&
              record.name.trim().length > 0,
          );

        case "products":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.name &&
              record.price >= 0 &&
              record.stock_quantity >= 0,
          );

        case "transactions":
          return sampleData.every(
            (record) =>
              record.business_id === this.businessId &&
              record.amount !== null &&
              ["receita", "despesa"].includes(record.type),
          );

        default:
          return true;
      }
    } catch (error) {
      console.error(
        `Erro na verificação de consistência para ${tableName}:`,
        error,
      );
      return false;
    }
  }

  private async checkTableSchema(tableName: string): Promise<boolean> {
    try {
      // Verificar se a tabela tem a coluna business_id
      const { data, error } = await supabase
        .from(tableName)
        .select("business_id")
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  async validateMultiTenantIsolation(): Promise<{
    isolationValid: boolean;
    crossContamination: any[];
    businessDistribution: { [businessId: string]: { [table: string]: number } };
  }> {
    console.log("🔒 Validando isolamento multi-tenant...");

    // Buscar todos os business_ids
    const { data: businesses, error: businessError } = await supabase
      .from("businesses")
      .select("id, name");

    if (businessError) throw businessError;

    const businessDistribution: {
      [businessId: string]: { [table: string]: number };
    } = {};
    const crossContamination: any[] = [];

    // Para cada business, contar registros em cada tabela
    for (const business of businesses || []) {
      businessDistribution[business.id] = {};

      for (const table of this.tables) {
        const { count } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true })
          .eq("business_id", business.id);

        businessDistribution[business.id][table] = count || 0;
      }
    }

    // Verificar se há registros sem business_id ou com business_id inválido
    const validBusinessIds = (businesses || []).map((b) => b.id);

    for (const table of this.tables) {
      const { data: invalidRecords } = await supabase
        .from(table)
        .select("id, business_id")
        .not("business_id", "in", `(${validBusinessIds.join(",")})`)
        .limit(10);

      if (invalidRecords && invalidRecords.length > 0) {
        crossContamination.push({
          table,
          invalidRecords: invalidRecords.length,
          examples: invalidRecords,
        });
      }
    }

    return {
      isolationValid: crossContamination.length === 0,
      crossContamination,
      businessDistribution,
    };
  }

  async generateHealthReport(): Promise<string> {
    const integrityReport = await this.validateDatabaseIntegrity();
    const isolationReport = await this.validateMultiTenantIsolation();

    let report = `
# Relatório de Saúde do Banco de Dados
**Timestamp:** ${integrityReport.timestamp}
**Business ID:** ${integrityReport.businessId}
**Status Geral:** ${integrityReport.overallHealth}

## 📊 Resumo Executivo
- **Total de Tabelas:** ${integrityReport.summary.totalTables}
- **Total de Registros:** ${integrityReport.summary.totalRecords}
- **Tabelas com Problemas:** ${integrityReport.summary.tablesWithIssues}
- **Violações FK:** ${integrityReport.summary.foreignKeyViolations}
- **Problemas de Consistência:** ${integrityReport.summary.dataConsistencyIssues}

## 🔒 Isolamento Multi-Tenant
- **Isolamento Válido:** ${isolationReport.isolationValid ? "✅ SIM" : "❌ NÃO"}
- **Contaminações:** ${isolationReport.crossContamination.length}

## 📋 Detalhes por Tabela
`;

    integrityReport.tables.forEach((table) => {
      const status =
        table.dataConsistency && table.recordsWithoutBusinessId === 0
          ? "✅"
          : "⚠️";
      report += `
### ${status} ${table.table}
- **Registros Totais:** ${table.totalRecords}
- **Com business_id:** ${table.recordsWithBusinessId}
- **Sem business_id:** ${table.recordsWithoutBusinessId}
- **Consistência:** ${table.dataConsistency ? "✅" : "❌"}
- **Schema Válido:** ${table.schemaValid ? "✅" : "❌"}
`;
    });

    if (integrityReport.recommendations.length > 0) {
      report += `
## 🎯 Recomendações
`;
      integrityReport.recommendations.forEach((rec) => {
        report += `- ${rec}\n`;
      });
    }

    return report;
  }
}
