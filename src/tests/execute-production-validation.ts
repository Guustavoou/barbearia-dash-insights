import { productionValidator } from "./production-validation-runner";

// Função para executar a validação completa e exibir resultados
export async function executeProductionValidation() {
  console.log("🎯 INICIANDO VALIDAÇÃO COMPLETA PARA PRODUÇÃO");
  console.log("=".repeat(80));
  console.log("📋 ESCOPO: Todas as funcionalidades e módulos");
  console.log("🎯 OBJETIVO: Validar prontidão para produção");
  console.log("=".repeat(80));

  try {
    // Executar validação completa
    const report = await productionValidator.runCompleteValidation();

    // Gerar relatório detalhado
    const detailedReport = await productionValidator.generateProductionReport();

    // Exibir resumo no console
    console.log("\n" + "=".repeat(80));
    console.log("📊 VALIDAÇÃO COMPLETA - RESUMO EXECUTIVO");
    console.log("=".repeat(80));

    const statusEmojis = {
      READY: "🟢",
      WARNING: "🟡",
      NOT_READY: "🔴",
    };

    console.log(
      `\n🎯 STATUS FINAL: ${statusEmojis[report.productionReadiness.status]} ${report.productionReadiness.status}`,
    );
    console.log(`📊 SCORE GERAL: ${report.productionReadiness.score}/100`);

    // Métricas principais
    console.log(`\n📈 MÉTRICAS PRINCIPAIS:`);
    console.log(
      `   • Operações Testadas: ${report.performanceMetrics.totalOperations}`,
    );
    console.log(
      `   • Taxa de Sucesso: ${report.performanceMetrics.successRate.toFixed(1)}%`,
    );
    console.log(
      `   • Tempo Médio: ${report.performanceMetrics.averageResponseTime.toFixed(0)}ms`,
    );
    console.log(
      `   • Testes Funcionais: ${report.functionalTests.passed}/${report.functionalTests.totalTests}`,
    );

    // Status dos módulos
    console.log(`\n📱 STATUS DOS MÓDULOS:`);
    Object.entries(report.moduleValidation).forEach(([module, status]) => {
      console.log(
        `   ${status ? "✅" : "❌"} ${module.toUpperCase()}: ${status ? "FUNCIONAL" : "PROBLEMAS"}`,
      );
    });

    // Bloqueadores (se houver)
    if (report.productionReadiness.blockers.length > 0) {
      console.log(`\n⚠️ BLOQUEADORES CRÍTICOS:`);
      report.productionReadiness.blockers.forEach((blocker) => {
        console.log(`   ❌ ${blocker}`);
      });
    }

    // Recomendações principais
    console.log(`\n🎯 PRINCIPAIS RECOMENDAÇÕES:`);
    report.productionReadiness.recommendations.slice(0, 5).forEach((rec) => {
      console.log(`   • ${rec}`);
    });

    // Salvar relatório
    if (typeof window !== "undefined") {
      try {
        // Salvar no localStorage para acesso posterior
        localStorage.setItem(
          "productionValidationReport",
          JSON.stringify(report),
        );
        localStorage.setItem("productionValidationReportMd", detailedReport);
        localStorage.setItem(
          "lastValidationTimestamp",
          new Date().toISOString(),
        );

        console.log(`\n💾 Relatório salvo no localStorage`);
        console.log(
          `📄 Acesse o relatório completo via: localStorage.getItem("productionValidationReportMd")`,
        );
      } catch (error) {
        console.warn("⚠️ Não foi possível salvar o relatório:", error);
      }
    }

    console.log("\n" + "=".repeat(80));

    // Conclusão baseada no status
    if (report.productionReadiness.status === "READY") {
      console.log("🎉 APLICAÇÃO PRONTA PARA PRODUÇÃO!");
      console.log("✅ Todos os testes críticos passaram");
      console.log("✅ Performance dentro dos parâmetros aceitáveis");
      console.log("✅ Integridade dos dados garantida");
      console.log("✅ Multi-tenant funcionando corretamente");
      console.log("\n🚀 Pode prosseguir com o deployment!");
    } else if (report.productionReadiness.status === "WARNING") {
      console.log("⚠️ APLICAÇÃO COM RESSALVAS");
      console.log("🔧 Alguns problemas foram identificados");
      console.log("📋 Revisar recomendações antes do deployment");
      console.log("\n⏳ Corrigir questões e re-executar validação");
    } else {
      console.log("❌ APLICAÇÃO NÃO PRONTA PARA PRODUÇÃO");
      console.log("🚫 Bloqueadores críticos identificados");
      console.log("🔧 Correções obrigatórias necessárias");
      console.log("\n⛔ NÃO fazer deployment até resolução");
    }

    console.log("=".repeat(80));

    return {
      report,
      detailedReport,
      success: true,
    };
  } catch (error) {
    console.error("❌ ERRO DURANTE A VALIDAÇÃO:", error);
    console.log("\n⛔ VALIDAÇÃO INTERROMPIDA");
    console.log("🔧 Verificar configuração e tentar novamente");

    return {
      report: null,
      detailedReport: null,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Auto-executar se estiver em modo de desenvolvimento
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Disponibilizar globalmente para execução manual
  (window as any).__EXECUTE_PRODUCTION_VALIDATION__ =
    executeProductionValidation;

  console.log("🧪 Sistema de Validação de Produção carregado");
  console.log("📋 Para executar: window.__EXECUTE_PRODUCTION_VALIDATION__()");
}
