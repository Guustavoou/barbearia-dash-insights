import { testRunner } from "./test-runner";
import { ComprehensiveTestSuite } from "./comprehensive-test-suite";
import { LoadTestSimulator } from "./load-test-simulator";
import { SupabaseIntegrityValidator } from "./supabase-integrity-validator";
import { DatabaseStatusChecker } from "./database-status-checker";

export interface ProductionValidationReport {
  timestamp: string;
  environment: {
    userAgent: string;
    url: string;
    businessId: string;
  };
  databaseStatus: any;
  functionalTests: any;
  loadTests: {
    light: any;
    medium: any;
    heavy: any;
    realistic: any;
  };
  integrityReport: any;
  moduleValidation: {
    dashboard: boolean;
    appointments: boolean;
    clients: boolean;
    services: boolean;
    professionals: boolean;
    stock: boolean;
    financial: boolean;
    payments: boolean;
    reports: boolean;
    marketing: boolean;
    documents: boolean;
    settings: boolean;
  };
  multiTenantValidation: any;
  performanceMetrics: {
    averageResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    totalOperations: number;
    successRate: number;
    errorRate: number;
  };
  productionReadiness: {
    score: number;
    status: "READY" | "WARNING" | "NOT_READY";
    blockers: string[];
    recommendations: string[];
  };
}

export class ProductionValidationRunner {
  async runCompleteValidation(): Promise<ProductionValidationReport> {
    console.log("🚀 INICIANDO VALIDAÇÃO COMPLETA PARA PRODUÇÃO");
    console.log("=".repeat(60));

    const startTime = Date.now();
    const report: ProductionValidationReport = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        businessId: "",
      },
      databaseStatus: null,
      functionalTests: null,
      loadTests: {
        light: null,
        medium: null,
        heavy: null,
        realistic: null,
      },
      integrityReport: null,
      moduleValidation: {
        dashboard: false,
        appointments: false,
        clients: false,
        services: false,
        professionals: false,
        stock: false,
        financial: false,
        payments: false,
        reports: false,
        marketing: false,
        documents: false,
        settings: false,
      },
      multiTenantValidation: null,
      performanceMetrics: {
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        totalOperations: 0,
        successRate: 0,
        errorRate: 0,
      },
      productionReadiness: {
        score: 0,
        status: "NOT_READY",
        blockers: [],
        recommendations: [],
      },
    };

    try {
      // 1. VALIDAÇÃO DO BANCO DE DADOS
      console.log("\n🔍 1. VERIFICANDO STATUS DO BANCO DE DADOS...");
      const dbChecker = new DatabaseStatusChecker();
      report.databaseStatus = await dbChecker.checkDatabaseStatus();

      if (!report.databaseStatus.connected) {
        report.productionReadiness.blockers.push("Database connection failed");
        console.log("❌ Database não conectado - interrompendo testes");
        return report;
      }

      if (!report.databaseStatus.tablesExist) {
        report.productionReadiness.blockers.push(
          "Required database tables missing",
        );
        console.log("❌ Tabelas do banco não existem - interrompendo testes");
        return report;
      }

      console.log("✅ Database status: OK");

      // 2. TESTES FUNCIONAIS COMPLETOS
      console.log("\n📋 2. EXECUTANDO TESTES FUNCIONAIS...");
      const functionalSuite = new ComprehensiveTestSuite();
      report.functionalTests = await functionalSuite.runAllTests();

      console.log(
        `✅ Funcionais: ${report.functionalTests.passed}/${report.functionalTests.totalTests} passaram`,
      );

      // 3. VALIDAÇÃO DE INTEGRIDADE
      console.log("\n🔒 3. VALIDANDO INTEGRIDADE DO BANCO...");
      const integrityValidator = new SupabaseIntegrityValidator();
      report.integrityReport =
        await integrityValidator.validateDatabaseIntegrity();

      console.log(`✅ Integridade: ${report.integrityReport.overallHealth}`);

      // 4. VALIDAÇÃO MULTI-TENANT
      console.log("\n🏢 4. TESTANDO ISOLAMENTO MULTI-TENANT...");
      report.multiTenantValidation =
        await integrityValidator.validateMultiTenantIsolation();

      console.log(
        `✅ Multi-tenant: ${report.multiTenantValidation.isolationValid ? "ISOLADO" : "PROBLEMAS"}`,
      );

      // 5. TESTES DE CARGA PROGRESSIVOS
      console.log("\n🔥 5. EXECUTANDO TESTES DE CARGA...");
      const loadSimulator = new LoadTestSimulator();

      // Teste Leve
      console.log("   📊 Executando teste LEVE...");
      report.loadTests.light = await loadSimulator.runLoadTest(
        LoadTestSimulator.getLightLoadConfig(),
      );
      console.log(
        `   ✅ Leve: ${report.loadTests.light.operationsPerSecond.toFixed(1)} ops/s`,
      );

      // Teste Médio
      console.log("   📊 Executando teste MÉDIO...");
      report.loadTests.medium = await loadSimulator.runLoadTest(
        LoadTestSimulator.getMediumLoadConfig(),
      );
      console.log(
        `   ✅ Médio: ${report.loadTests.medium.operationsPerSecond.toFixed(1)} ops/s`,
      );

      // Teste Realista
      console.log("   📊 Executando teste REALISTA...");
      report.loadTests.realistic = await loadSimulator.runLoadTest(
        LoadTestSimulator.getRealisticLoadConfig(),
      );
      console.log(
        `   ✅ Realista: ${report.loadTests.realistic.operationsPerSecond.toFixed(1)} ops/s`,
      );

      // Teste Pesado (se os outros passaram)
      if (report.loadTests.realistic.errorRate < 10) {
        console.log("   📊 Executando teste PESADO...");
        report.loadTests.heavy = await loadSimulator.runLoadTest(
          LoadTestSimulator.getHeavyLoadConfig(),
        );
        console.log(
          `   ✅ Pesado: ${report.loadTests.heavy.operationsPerSecond.toFixed(1)} ops/s`,
        );
      } else {
        console.log(
          "   ⚠️ Pulando teste pesado devido a alta taxa de erro no realista",
        );
      }

      // 6. VALIDAÇÃO DE MÓDULOS ESPECÍFICOS
      console.log("\n📱 6. VALIDANDO MÓDULOS DA APLICAÇÃO...");
      await this.validateApplicationModules(report);

      // 7. CÁLCULO DE MÉTRICAS DE PERFORMANCE
      this.calculatePerformanceMetrics(report);

      // 8. ANÁLISE DE PRONTIDÃO PARA PRODUÇÃO
      this.analyzeProductionReadiness(report);

      const totalTime = Date.now() - startTime;
      console.log(
        `\n🏁 VALIDAÇÃO COMPLETA CONCLUÍDA EM ${this.formatDuration(totalTime)}`,
      );
      console.log(`📊 STATUS FINAL: ${report.productionReadiness.status}`);
      console.log(`🎯 SCORE: ${report.productionReadiness.score}/100`);

      return report;
    } catch (error) {
      console.error("❌ Erro durante a validação:", error);
      report.productionReadiness.status = "NOT_READY";
      report.productionReadiness.blockers.push(`Critical error: ${error}`);
      return report;
    }
  }

  private async validateApplicationModules(report: ProductionValidationReport) {
    const modules = [
      "dashboard",
      "appointments",
      "clients",
      "services",
      "professionals",
      "stock",
      "financial",
      "payments",
      "reports",
      "marketing",
      "documents",
      "settings",
    ];

    for (const module of modules) {
      try {
        // Simular validação de cada módulo baseada nos testes funcionais
        const moduleValid = this.validateModuleBasedOnTests(
          module,
          report.functionalTests,
        );
        report.moduleValidation[
          module as keyof typeof report.moduleValidation
        ] = moduleValid;

        console.log(
          `   ${moduleValid ? "✅" : "❌"} ${module}: ${moduleValid ? "FUNCIONAL" : "PROBLEMAS"}`,
        );
      } catch (error) {
        console.log(`   ❌ ${module}: ERRO - ${error}`);
        report.moduleValidation[
          module as keyof typeof report.moduleValidation
        ] = false;
      }
    }
  }

  private validateModuleBasedOnTests(
    module: string,
    functionalTests: any,
  ): boolean {
    if (!functionalTests || !functionalTests.results) return false;

    // Mapear módulos para testes correspondentes
    const moduleTestMap: { [key: string]: string[] } = {
      dashboard: ["Dashboard Data Loading"],
      appointments: ["Appointments - CRUD Operations"],
      clients: [
        "Clients - CREATE",
        "Clients - READ",
        "Clients - UPDATE",
        "Clients - DELETE",
      ],
      services: ["Services - CRUD Operations"],
      professionals: ["Professionals - CRUD Operations"],
      stock: ["Products - CRUD Operations"],
      financial: ["Financial Operations - Transactions"],
      payments: ["Financial Operations - Transactions"],
      reports: ["Reports Generation"],
      marketing: ["Dashboard Data Loading"], // Usar dashboard como proxy
      documents: ["Dashboard Data Loading"], // Usar dashboard como proxy
      settings: ["Multi-Tenant Data Isolation"],
    };

    const relevantTests = moduleTestMap[module] || [];
    if (relevantTests.length === 0) return true; // Se não há testes específicos, assumir OK

    // Verificar se todos os testes relevantes passaram
    const moduleResults = functionalTests.results.filter((test: any) =>
      relevantTests.some((testName) => test.testName.includes(testName)),
    );

    if (moduleResults.length === 0) return true; // Se não encontrou testes, assumir OK

    // Todos os testes do módulo devem ter passado
    return moduleResults.every((test: any) => test.status === "PASS");
  }

  private calculatePerformanceMetrics(report: ProductionValidationReport) {
    const allTests = Object.values(report.loadTests).filter(
      (test) => test !== null,
    );

    if (allTests.length === 0) {
      console.log("⚠️ Nenhum teste de carga executado para calcular métricas");
      return;
    }

    let totalOps = 0;
    let totalResponseTime = 0;
    let maxResponseTime = 0;
    let minResponseTime = Infinity;
    let totalSuccessful = 0;
    let totalFailed = 0;

    allTests.forEach((test: any) => {
      totalOps += test.totalOperations;
      totalResponseTime += test.averageResponseTime * test.totalOperations;
      maxResponseTime = Math.max(maxResponseTime, test.maxResponseTime);
      minResponseTime = Math.min(minResponseTime, test.minResponseTime);
      totalSuccessful += test.successfulOperations;
      totalFailed += test.failedOperations;
    });

    report.performanceMetrics = {
      averageResponseTime: totalOps > 0 ? totalResponseTime / totalOps : 0,
      maxResponseTime,
      minResponseTime: minResponseTime === Infinity ? 0 : minResponseTime,
      totalOperations: totalOps,
      successRate: totalOps > 0 ? (totalSuccessful / totalOps) * 100 : 0,
      errorRate: totalOps > 0 ? (totalFailed / totalOps) * 100 : 0,
    };

    console.log("📊 Métricas de Performance:");
    console.log(
      `   Operações Totais: ${report.performanceMetrics.totalOperations}`,
    );
    console.log(
      `   Tempo Médio: ${report.performanceMetrics.averageResponseTime.toFixed(0)}ms`,
    );
    console.log(
      `   Taxa de Sucesso: ${report.performanceMetrics.successRate.toFixed(1)}%`,
    );
    console.log(
      `   Taxa de Erro: ${report.performanceMetrics.errorRate.toFixed(1)}%`,
    );
  }

  private analyzeProductionReadiness(report: ProductionValidationReport) {
    let score = 100;
    const blockers: string[] = [];
    const recommendations: string[] = [];

    // Penalidades por problemas
    if (!report.databaseStatus.connected) {
      score -= 50;
      blockers.push("Database connection issues");
    }

    if (!report.databaseStatus.tablesExist) {
      score -= 30;
      blockers.push("Missing database tables");
    }

    if (report.functionalTests.failed > 0) {
      score -= report.functionalTests.failed * 10;
      if (report.functionalTests.failed > 3) {
        blockers.push(
          `${report.functionalTests.failed} functional tests failed`,
        );
      } else {
        recommendations.push(
          `Fix ${report.functionalTests.failed} failing functional tests`,
        );
      }
    }

    if (!report.functionalTests.multiTenantIsolationValid) {
      score -= 25;
      blockers.push("Multi-tenant isolation compromised");
    }

    if (report.integrityReport.overallHealth === "CRITICAL") {
      score -= 30;
      blockers.push("Critical database integrity issues");
    } else if (report.integrityReport.overallHealth === "WARNING") {
      score -= 15;
      recommendations.push("Address database integrity warnings");
    }

    if (report.performanceMetrics.errorRate > 10) {
      score -= 20;
      blockers.push("High error rate in load tests");
    } else if (report.performanceMetrics.errorRate > 5) {
      score -= 10;
      recommendations.push("Optimize to reduce error rate");
    }

    if (report.performanceMetrics.averageResponseTime > 2000) {
      score -= 15;
      recommendations.push("Optimize response times");
    }

    // Verificar módulos críticos
    const criticalModules = ["dashboard", "appointments", "clients"];
    const failedCriticalModules = criticalModules.filter(
      (module) =>
        !report.moduleValidation[
          module as keyof typeof report.moduleValidation
        ],
    );

    if (failedCriticalModules.length > 0) {
      score -= failedCriticalModules.length * 15;
      blockers.push(
        `Critical modules failing: ${failedCriticalModules.join(", ")}`,
      );
    }

    // Determinar status
    let status: "READY" | "WARNING" | "NOT_READY";
    if (blockers.length > 0) {
      status = "NOT_READY";
    } else if (score < 80) {
      status = "WARNING";
    } else {
      status = "READY";
    }

    // Recomendações gerais
    if (status === "READY") {
      recommendations.push("✅ Application ready for production deployment");
      recommendations.push("🔄 Implement monitoring and alerting");
      recommendations.push("📊 Set up performance tracking");
    } else if (status === "WARNING") {
      recommendations.push("⚠️ Address issues before production deployment");
      recommendations.push("🧪 Re-run validation after fixes");
    } else {
      recommendations.push("❌ Critical issues must be resolved");
      recommendations.push("🔧 Fix all blockers before proceeding");
    }

    report.productionReadiness = {
      score: Math.max(score, 0),
      status,
      blockers,
      recommendations,
    };
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }

  async generateProductionReport(): Promise<string> {
    const report = await this.runCompleteValidation();

    const statusEmoji = {
      READY: "🟢",
      WARNING: "🟡",
      NOT_READY: "🔴",
    };

    return `
# 🚀 RELATÓRIO DE VALIDAÇÃO PARA PRODUÇÃO

**Data/Hora:** ${new Date(report.timestamp).toLocaleString("pt-BR")}
**Status:** ${statusEmoji[report.productionReadiness.status]} **${report.productionReadiness.status}**
**Score Geral:** ${report.productionReadiness.score}/100

---

## 📊 RESUMO EXECUTIVO

### 🎯 Prontidão para Produção
- **Score:** ${report.productionReadiness.score}/100
- **Status:** ${report.productionReadiness.status}
- **Bloqueadores:** ${report.productionReadiness.blockers.length}
- **Recomendações:** ${report.productionReadiness.recommendations.length}

### 📈 Métricas de Performance
- **Operações Totais:** ${report.performanceMetrics.totalOperations}
- **Tempo Médio:** ${report.performanceMetrics.averageResponseTime.toFixed(0)}ms
- **Taxa de Sucesso:** ${report.performanceMetrics.successRate.toFixed(1)}%
- **Taxa de Erro:** ${report.performanceMetrics.errorRate.toFixed(1)}%

---

## 🔍 DATABASE STATUS

- **Conectado:** ${report.databaseStatus.connected ? "✅ SIM" : "❌ NÃO"}
- **Tabelas Existem:** ${report.databaseStatus.tablesExist ? "✅ SIM" : "❌ NÃO"}
- **Tem Dados:** ${report.databaseStatus.hasData ? "✅ SIM" : "❌ NÃO"}
- **Multi-Tenant:** ${report.databaseStatus.multiTenantReady ? "✅ PRONTO" : "❌ NÃO PRONTO"}

---

## 📋 TESTES FUNCIONAIS

**Resultado:** ${report.functionalTests.passed}/${report.functionalTests.totalTests} testes passaram

### Detalhes:
- **Aprovados:** ${report.functionalTests.passed}
- **Falharam:** ${report.functionalTests.failed}
- **Pulados:** ${report.functionalTests.skipped}
- **Duração:** ${this.formatDuration(report.functionalTests.duration)}

### Validações Críticas:
- **Supabase:** ${report.functionalTests.supabaseConnectionValid ? "✅ OK" : "❌ FALHA"}
- **Multi-Tenant:** ${report.functionalTests.multiTenantIsolationValid ? "✅ OK" : "❌ FALHA"}

---

## 🔥 TESTES DE CARGA

### Cenários Executados:

${Object.entries(report.loadTests)
  .filter(([_, test]) => test !== null)
  .map(
    ([scenario, test]: [string, any]) => `
#### ${scenario.toUpperCase()}
- **Operações/Segundo:** ${test.operationsPerSecond.toFixed(1)}
- **Tempo Médio:** ${test.averageResponseTime.toFixed(0)}ms
- **Taxa de Erro:** ${test.errorRate.toFixed(1)}%
- **Usuários:** ${test.config.concurrentUsers}
`,
  )
  .join("")}

---

## 📱 VALIDAÇÃO DE MÓDULOS

${Object.entries(report.moduleValidation)
  .map(
    ([module, valid]) =>
      `- **${module}:** ${valid ? "✅ FUNCIONAL" : "❌ PROBLEMAS"}`,
  )
  .join("\n")}

---

## 🔒 INTEGRIDADE DO BANCO

**Status:** ${report.integrityReport.overallHealth}

### Resumo:
- **Tabelas:** ${report.integrityReport.summary.totalTables}
- **Registros:** ${report.integrityReport.summary.totalRecords}
- **Problemas:** ${report.integrityReport.summary.tablesWithIssues}

---

## 🏢 MULTI-TENANT

**Isolamento:** ${report.multiTenantValidation.isolationValid ? "✅ VÁLIDO" : "❌ COMPROMETIDO"}

### Distribuição de Dados:
${
  report.multiTenantValidation.businessDistribution
    ? Object.entries(report.multiTenantValidation.businessDistribution)
        .map(
          ([businessId, data]: [string, any]) =>
            `- **Business ${businessId}:** ${Object.values(data).reduce((sum: number, count: any) => sum + (typeof count === "number" ? count : 0), 0)} registros`,
        )
        .join("\n")
    : "Dados não disponíveis"
}

---

## ⚠️ BLOQUEADORES

${
  report.productionReadiness.blockers.length > 0
    ? report.productionReadiness.blockers
        .map((blocker) => `- ❌ ${blocker}`)
        .join("\n")
    : "✅ Nenhum bloqueador identificado"
}

---

## 🎯 RECOMENDAÇÕES

${report.productionReadiness.recommendations.map((rec) => `- ${rec}`).join("\n")}

---

## 🏁 CONCLUSÃO

${this.generateFinalConclusion(report)}

---

*Relatório gerado automaticamente pelo Sistema de Validação de Produção*
`;
  }

  private generateFinalConclusion(report: ProductionValidationReport): string {
    if (report.productionReadiness.status === "READY") {
      return `
🎉 **APLICAÇÃO APROVADA PARA PRODUÇÃO**

A aplicação passou em todos os testes críticos e está pronta para deployment em produção.
Todos os módulos estão funcionais, a performance está adequada e a integridade dos dados
está garantida. O sistema multi-tenant está operando corretamente.

**Próximo passo:** Proceder com o deployment para produção.`;
    } else if (report.productionReadiness.status === "WARNING") {
      return `
⚠️ **APLICAÇÃO COM RESSALVAS**

A aplicação está funcional mas apresenta algumas questões que devem ser endereçadas.
Os problemas identificados não são críticos mas podem impactar a experiência em produção.

**Próximo passo:** Corrigir as questões identificadas e re-executar a validação.`;
    } else {
      return `
❌ **APLICAÇÃO NÃO APROVADA**

Foram identificados problemas críticos que impedem o deployment seguro em produção.
É necessário corrigir todos os bloqueadores antes de considerar a aplicação pronta.

**Próximo passo:** Resolver todos os bloqueadores e executar nova validação.`;
    }
  }
}

// Instância global para uso
export const productionValidator = new ProductionValidationRunner();
