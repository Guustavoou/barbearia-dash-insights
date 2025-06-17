import { testRunner } from "./test-runner";
import { ComprehensiveTestSuite } from "./comprehensive-test-suite";
import { LoadTestSimulator } from "./load-test-simulator";
import { SupabaseIntegrityValidator } from "./supabase-integrity-validator";

// Função para executar testes automaticamente e gerar relatório
export async function runAutomaticValidation() {
  console.log("🚀 INICIANDO VALIDAÇÃO AUTOMÁTICA DA APLICAÇÃO");
  console.log("=".repeat(60));

  try {
    // 1. Executar teste de conexão básica
    console.log("1️�� Verificando conectividade básica...");
    const basicConnectivity = await checkBasicConnectivity();
    console.log(`✅ Conectividade: ${basicConnectivity ? "OK" : "FALHA"}`);

    // 2. Executar testes funcionais
    console.log("\n2️⃣ Executando testes funcionais...");
    const functionalSuite = new ComprehensiveTestSuite();
    const functionalResults = await functionalSuite.runAllTests();
    console.log(
      `✅ Funcionais: ${functionalResults.passed}/${functionalResults.totalTests} passaram`,
    );

    // 3. Executar teste de carga leve
    console.log("\n3️⃣ Executando teste de carga...");
    const loadSimulator = new LoadTestSimulator();
    const loadResults = await loadSimulator.runLoadTest(
      LoadTestSimulator.getLightLoadConfig(),
    );
    console.log(
      `✅ Carga: ${loadResults.operationsPerSecond.toFixed(1)} ops/s, ${loadResults.errorRate.toFixed(1)}% erro`,
    );

    // 4. Validar integridade
    console.log("\n4️⃣ Validando integridade do banco...");
    const integrityValidator = new SupabaseIntegrityValidator();
    const integrityResults =
      await integrityValidator.validateDatabaseIntegrity();
    console.log(`✅ Integridade: ${integrityResults.overallHealth}`);

    // 5. Gerar relatório final
    console.log("\n5️⃣ Gerando relatório final...");
    const finalReport = await generateSummaryReport({
      basicConnectivity,
      functionalResults,
      loadResults,
      integrityResults,
    });

    console.log("\n" + "=".repeat(60));
    console.log("📊 RELATÓRIO FINAL DE VALIDAÇÃO");
    console.log("=".repeat(60));
    console.log(finalReport);

    return {
      success: true,
      report: finalReport,
      details: {
        basicConnectivity,
        functionalResults,
        loadResults,
        integrityResults,
      },
    };
  } catch (error) {
    console.error("❌ Erro durante a validação automática:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkBasicConnectivity(): Promise<boolean> {
  try {
    // Verificar se o Supabase está disponível
    const response = await fetch(
      import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
      {
        method: "HEAD",
        timeout: 5000,
      } as any,
    );
    return response.ok;
  } catch (error) {
    console.warn("Conectividade Supabase não verificável:", error);
    return false;
  }
}

function generateSummaryReport(results: any): string {
  const {
    basicConnectivity,
    functionalResults,
    loadResults,
    integrityResults,
  } = results;

  const timestamp = new Date().toLocaleString("pt-BR");
  const functionalScore =
    (functionalResults.passed / functionalResults.totalTests) * 100;
  const performanceScore = Math.max(100 - loadResults.errorRate * 5, 0);
  const integrityScore =
    integrityResults.overallHealth === "HEALTHY"
      ? 100
      : integrityResults.overallHealth === "WARNING"
        ? 70
        : 30;

  const overallScore =
    (functionalScore + performanceScore + integrityScore) / 3;

  let status = "🎉 APROVADO";
  if (overallScore < 70) status = "❌ REPROVADO";
  else if (overallScore < 85) status = "⚠️ APROVADO COM RESSALVAS";

  return `
🏆 RESULTADO FINAL: ${status}
📊 Score Geral: ${overallScore.toFixed(1)}/100

📋 DETALHES:
• Conectividade: ${basicConnectivity ? "✅ OK" : "❌ FALHA"}
• Testes Funcionais: ${functionalResults.passed}/${functionalResults.totalTests} (${functionalScore.toFixed(1)}%)
• Performance: ${loadResults.operationsPerSecond.toFixed(1)} ops/s, ${loadResults.errorRate.toFixed(1)}% erro
• Integridade: ${integrityResults.overallHealth} (${integrityScore}/100)

🎯 RESUMO:
${overallScore >= 85 ? "✅ Aplicação pronta para produção!" : overallScore >= 70 ? "⚠️ Aplicação funcional com ressalvas" : "❌ Correções necessárias antes da produção"}

📊 MÉTRICAS:
• Total de Operações: ${loadResults.totalOperations}
• Tempo Médio: ${loadResults.averageResponseTime.toFixed(0)}ms
• Registros no Banco: ${integrityResults.summary.totalRecords}
• Tabelas Validadas: ${integrityResults.summary.totalTables}

🕒 Validação executada em: ${timestamp}
`;
}

// Auto-executar se estiver em modo de desenvolvimento
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Executar após 5 segundos para dar tempo de carregamento
  setTimeout(() => {
    console.log(
      "🔄 Modo de desenvolvimento detectado - iniciando validação automática...",
    );
    runAutomaticValidation().then((result) => {
      if (result.success) {
        console.log("✅ Validação automática concluída com sucesso!");
      } else {
        console.error("❌ Validação automática falhou:", result.error);
      }
    });
  }, 5000);
}
