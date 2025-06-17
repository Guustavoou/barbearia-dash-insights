import { ComprehensiveTestSuite } from "./comprehensive-test-suite";
import { LoadTestSimulator } from "./load-test-simulator";
import { SupabaseIntegrityValidator } from "./supabase-integrity-validator";

export interface FullTestReport {
  timestamp: string;
  environment: {
    userAgent: string;
    url: string;
    businessId: string;
  };
  functionalTests: any;
  loadTests: any;
  integrityReport: any;
  overallStatus: "PASS" | "FAIL" | "WARNING";
  recommendations: string[];
  executionTime: number;
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    criticalIssues: number;
    performanceScore: number;
    integrityScore: number;
  };
}

export class TestRunner {
  async runCompleteValidation(): Promise<FullTestReport> {
    console.log("🚀 Iniciando validação completa da aplicação...");
    const startTime = Date.now();

    const report: FullTestReport = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        businessId: "",
      },
      functionalTests: null,
      loadTests: null,
      integrityReport: null,
      overallStatus: "PASS",
      recommendations: [],
      executionTime: 0,
      summary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        criticalIssues: 0,
        performanceScore: 0,
        integrityScore: 0,
      },
    };

    try {
      // 1. Testes Funcionais
      console.log("📋 Executando testes funcionais...");
      const functionalSuite = new ComprehensiveTestSuite();
      report.functionalTests = await functionalSuite.runAllTests();

      // 2. Testes de Carga
      console.log("🔥 Executando testes de carga...");
      const loadSimulator = new LoadTestSimulator();
      report.loadTests = await loadSimulator.runLoadTest(
        LoadTestSimulator.getRealisticLoadConfig(),
      );

      // 3. Validação de Integridade
      console.log("🔍 Validando integridade do banco...");
      const integrityValidator = new SupabaseIntegrityValidator();
      report.integrityReport =
        await integrityValidator.validateDatabaseIntegrity();

      // 4. Análise e Geração do Relatório
      this.analyzeResults(report);

      report.executionTime = Date.now() - startTime;

      console.log(
        `✅ Validação completa concluída em ${this.formatDuration(report.executionTime)}`,
      );
      console.log(`📊 Status: ${report.overallStatus}`);

      return report;
    } catch (error) {
      console.error("❌ Erro durante a validação:", error);
      report.overallStatus = "FAIL";
      report.recommendations.push(`Erro crítico durante a execução: ${error}`);
      report.executionTime = Date.now() - startTime;
      return report;
    }
  }

  private analyzeResults(report: FullTestReport): void {
    const recommendations: string[] = [];
    let criticalIssues = 0;
    let overallStatus: "PASS" | "FAIL" | "WARNING" = "PASS";

    // Análise dos Testes Funcionais
    if (report.functionalTests) {
      report.summary.totalTests += report.functionalTests.totalTests;
      report.summary.totalPassed += report.functionalTests.passed;
      report.summary.totalFailed += report.functionalTests.failed;

      if (report.functionalTests.failed > 0) {
        criticalIssues += report.functionalTests.failed;
        overallStatus = "FAIL";
        recommendations.push(
          `${report.functionalTests.failed} testes funcionais falharam - revisar funcionalidades críticas`,
        );
      }

      if (!report.functionalTests.supabaseConnectionValid) {
        criticalIssues++;
        overallStatus = "FAIL";
        recommendations.push(
          "Conexão com Supabase falhou - verificar configuração e conectividade",
        );
      }

      if (!report.functionalTests.multiTenantIsolationValid) {
        criticalIssues++;
        overallStatus = "FAIL";
        recommendations.push(
          "Isolamento multi-tenant comprometido - verificar políticas RLS",
        );
      }
    }

    // Análise dos Testes de Carga
    if (report.loadTests) {
      const errorRate = report.loadTests.errorRate;
      const avgResponseTime = report.loadTests.averageResponseTime;
      const opsPerSecond = report.loadTests.operationsPerSecond;

      // Calcular pontuação de performance (0-100)
      let performanceScore = 100;

      if (errorRate > 5) {
        performanceScore -= Math.min(errorRate * 5, 50);
        if (errorRate > 10) {
          overallStatus = overallStatus === "PASS" ? "WARNING" : overallStatus;
          recommendations.push(
            `Taxa de erro alta (${errorRate.toFixed(1)}%) - investigar problemas de estabilidade`,
          );
        }
      }

      if (avgResponseTime > 1000) {
        performanceScore -= Math.min((avgResponseTime - 1000) / 100, 30);
        if (avgResponseTime > 2000) {
          overallStatus = overallStatus === "PASS" ? "WARNING" : overallStatus;
          recommendations.push(
            `Tempo de resposta alto (${avgResponseTime.toFixed(0)}ms) - otimizar queries e índices`,
          );
        }
      }

      if (opsPerSecond < 10) {
        performanceScore -= 20;
        recommendations.push(
          `Performance baixa (${opsPerSecond.toFixed(1)} ops/s) - considerar otimizações de infraestrutura`,
        );
      }

      report.summary.performanceScore = Math.max(performanceScore, 0);
    }

    // Análise de Integridade
    if (report.integrityReport) {
      let integrityScore = 100;

      if (report.integrityReport.overallHealth === "WARNING") {
        integrityScore = 70;
        overallStatus = overallStatus === "PASS" ? "WARNING" : overallStatus;
        recommendations.push(
          "Problemas menores de integridade detectados - revisar recomendações",
        );
      } else if (report.integrityReport.overallHealth === "CRITICAL") {
        integrityScore = 30;
        criticalIssues++;
        overallStatus = "FAIL";
        recommendations.push(
          "Problemas críticos de integridade - ação imediata necessária",
        );
      }

      if (report.integrityReport.summary.tablesWithIssues > 0) {
        const issueRatio =
          report.integrityReport.summary.tablesWithIssues /
          report.integrityReport.summary.totalTables;
        integrityScore -= issueRatio * 40;
        recommendations.push(
          `${report.integrityReport.summary.tablesWithIssues} tabelas com problemas de ${report.integrityReport.summary.totalTables} - verificar estrutura`,
        );
      }

      if (report.integrityReport.summary.foreignKeyViolations > 0) {
        integrityScore -= Math.min(
          report.integrityReport.summary.foreignKeyViolations * 10,
          30,
        );
        recommendations.push(
          `${report.integrityReport.summary.foreignKeyViolations} violações de chave estrangeira - corrigir referências`,
        );
      }

      report.summary.integrityScore = Math.max(integrityScore, 0);
    }

    // Recomendações Gerais
    if (criticalIssues === 0 && overallStatus === "PASS") {
      recommendations.push(
        "✅ Aplicação validada com sucesso - pronta para produção",
      );
    } else if (overallStatus === "WARNING") {
      recommendations.push(
        "⚠️ Aplicação funcional com algumas questões - revisar recomendações antes da produção",
      );
    } else {
      recommendations.push(
        "❌ Problemas críticos detectados - não recomendado para produção até correção",
      );
    }

    // Recommendations específicas baseadas nos scores
    if (report.summary.performanceScore < 70) {
      recommendations.push(
        "Considerar implementar cache, otimizar queries e revisar índices do banco",
      );
    }

    if (report.summary.integrityScore < 80) {
      recommendations.push(
        "Executar limpeza de dados e validar relacionamentos entre tabelas",
      );
    }

    report.summary.criticalIssues = criticalIssues;
    report.overallStatus = overallStatus;
    report.recommendations = recommendations;
  }

  async generateDetailedReport(): Promise<string> {
    const report = await this.runCompleteValidation();

    return `
# 📊 RELATÓRIO COMPLETO DE VALIDAÇÃO DA APLICAÇÃO

**Data/Hora:** ${new Date(report.timestamp).toLocaleString("pt-BR")}
**Duração:** ${this.formatDuration(report.executionTime)}
**Status Geral:** ${this.getStatusEmoji(report.overallStatus)} ${report.overallStatus}

---

## 🎯 RESUMO EXECUTIVO

- **Total de Testes:** ${report.summary.totalTests}
- **Testes Aprovados:** ${report.summary.totalPassed}
- **Testes Falharam:** ${report.summary.totalFailed}
- **Problemas Críticos:** ${report.summary.criticalIssues}
- **Score Performance:** ${report.summary.performanceScore}/100
- **Score Integridade:** ${report.summary.integrityScore}/100

---

## 📋 TESTES FUNCIONAIS

${
  report.functionalTests
    ? `
### Resultados:
- **Total:** ${report.functionalTests.totalTests} testes
- **Aprovados:** ${report.functionalTests.passed}
- **Falharam:** ${report.functionalTests.failed}
- **Pulados:** ${report.functionalTests.skipped}
- **Duração:** ${this.formatDuration(report.functionalTests.duration)}

### Conexões:
- **Supabase:** ${report.functionalTests.supabaseConnectionValid ? "✅ OK" : "❌ FALHA"}
- **Multi-Tenant:** ${report.functionalTests.multiTenantIsolationValid ? "✅ OK" : "❌ FALHA"}

### Detalhes dos Testes:
${report.functionalTests.results
  .map(
    (test: any) =>
      `- ${this.getStatusEmoji(test.status)} **${test.testName}** (${this.formatDuration(test.duration)})${test.error ? ` - ${test.error}` : ""}`,
  )
  .join("\n")}
`
    : "Não executado"
}

---

## 🔥 TESTES DE CARGA

${
  report.loadTests
    ? `
### Configuração:
- **Usuários Simultâneos:** ${report.loadTests.config.concurrentUsers}
- **Operações por Usuário:** ${report.loadTests.config.operationsPerUser}
- **Duração:** ${this.formatDuration(report.loadTests.config.testDurationMs)}

### Resultados:
- **Total de Operações:** ${report.loadTests.totalOperations}
- **Operações/Segundo:** ${report.loadTests.operationsPerSecond.toFixed(2)}
- **Tempo Médio:** ${report.loadTests.averageResponseTime.toFixed(0)}ms
- **Taxa de Erro:** ${report.loadTests.errorRate.toFixed(1)}%
- **Operações Bem-sucedidas:** ${report.loadTests.successfulOperations}
- **Operações Falharam:** ${report.loadTests.failedOperations}

### Performance por Operação:
${Object.entries(report.loadTests.performanceByOperation)
  .map(
    ([op, stats]: [string, any]) =>
      `- **${op}:** ${stats.count} ops, ${stats.avgTime.toFixed(0)}ms média, ${stats.successRate.toFixed(1)}% sucesso`,
  )
  .join("\n")}
`
    : "Não executado"
}

---

## 🔍 INTEGRIDADE DO BANCO

${
  report.integrityReport
    ? `
### Status Geral: ${this.getStatusEmoji(report.integrityReport.overallHealth)} ${report.integrityReport.overallHealth}

### Resumo:
- **Total de Tabelas:** ${report.integrityReport.summary.totalTables}
- **Total de Registros:** ${report.integrityReport.summary.totalRecords}
- **Tabelas com Problemas:** ${report.integrityReport.summary.tablesWithIssues}
- **Violações FK:** ${report.integrityReport.summary.foreignKeyViolations}

### Status por Tabela:
${report.integrityReport.tables
  .map(
    (table: any) =>
      `- **${table.table}:** ${table.totalRecords} registros, ${table.dataConsistency ? "✅" : "❌"} consistência, ${table.schemaValid ? "✅" : "❌"} schema`,
  )
  .join("\n")}
`
    : "Não executado"
}

---

## 🎯 RECOMENDAÇÕES

${report.recommendations.map((rec: string) => `- ${rec}`).join("\n")}

---

## 🏁 CONCLUSÃO

${this.generateConclusion(report)}

---

*Relatório gerado automaticamente pelo Sistema de Testes da Aplicação*
`;
  }

  private generateConclusion(report: FullTestReport): string {
    if (
      report.overallStatus === "PASS" &&
      report.summary.criticalIssues === 0
    ) {
      return `
🎉 **APLICAÇÃO APROVADA PARA PRODUÇÃO**

A aplicação passou em todos os testes críticos e está pronta para uso em produção. 
Todos os sistemas estão funcionando corretamente, a performance está dentro dos parâmetros 
aceitáveis e a integridade dos dados está garantida.

**Próximos passos:**
- Deploy para produção pode ser realizado
- Monitoramento contínuo recomendado
- Backups automatizados configurados`;
    } else if (report.overallStatus === "WARNING") {
      return `
⚠️ **APLICAÇÃO COM RESSALVAS**

A aplicação está funcional mas apresenta algumas questões que devem ser endereçadas 
antes do deploy em produção. Os problemas identificados não são críticos mas podem 
impactar a experiência do usuário.

**Próximos passos:**
- Revisar e corrigir os problemas identificados
- Re-executar testes após correções
- Deploy condicional com monitoramento intensivo`;
    } else {
      return `
❌ **APLICAÇÃO NÃO APROVADA**

Foram identificados problemas críticos que impedem o deploy seguro em produção. 
É necessário corrigir os problemas antes de considerar a aplicação pronta.

**Próximos passos:**
- Corrigir problemas críticos imediatamente
- Re-executar bateria completa de testes
- Não realizar deploy até aprovação`;
    }
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case "PASS":
      case "HEALTHY":
        return "✅";
      case "FAIL":
      case "CRITICAL":
        return "❌";
      case "WARNING":
        return "⚠️";
      case "SKIP":
        return "⏭️";
      default:
        return "❓";
    }
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }

  // Métodos para diferentes tipos de teste
  async runQuickTest(): Promise<FullTestReport> {
    const report = await this.runCompleteValidation();
    // Quick test só executa testes essenciais
    return report;
  }

  async runProductionReadinessTest(): Promise<FullTestReport> {
    const report = await this.runCompleteValidation();
    // Production readiness test inclui testes mais rigorosos
    return report;
  }

  async runPerformanceOnlyTest(): Promise<any> {
    const loadSimulator = new LoadTestSimulator();
    return await loadSimulator.runLoadTest(
      LoadTestSimulator.getHeavyLoadConfig(),
    );
  }

  async runIntegrityOnlyTest(): Promise<any> {
    const validator = new SupabaseIntegrityValidator();
    return await validator.validateDatabaseIntegrity();
  }
}

// Inst��ncia global para uso fácil
export const testRunner = new TestRunner();
