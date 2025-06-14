// Script principal para executar TODOS os testes do Unclic Manager
import { UnclicTestRunner } from "./runLoadTests";
import { UnclicFunctionalityTester } from "./functionalityTests";

console.log(`
🚀 UNCLIC MANAGER - SUITE COMPLETA DE TESTES
===========================================
📅 Data/Hora: ${new Date().toLocaleString()}
🔧 Versão: 1.0.0
🌍 Ambiente: ${process.env.NODE_ENV || "development"}
===========================================
`);

async function runCompleteTestSuite() {
  console.log(`🎯 INICIANDO SUITE COMPLETA DE TESTES...`);
  console.log(`=======================================\n`);

  const overallStartTime = Date.now();
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  try {
    // 1. TESTES DE FUNCIONALIDADES
    console.log(`1️⃣ EXECUTANDO TESTES DE FUNCIONALIDADES`);
    console.log(`=====================================`);

    const functionalityTester = new UnclicFunctionalityTester();
    const functionalityResults =
      await functionalityTester.runAllFunctionalityTests();

    const funcPassed = functionalityResults.filter((r) => r.success).length;
    const funcFailed = functionalityResults.length - funcPassed;

    totalTests += functionalityResults.length;
    totalPassed += funcPassed;
    totalFailed += funcFailed;

    console.log(
      `✅ Funcionalidades: ${funcPassed}/${functionalityResults.length} passaram\n`,
    );

    // 2. TESTES DE CARGA E STRESS
    console.log(`2️⃣ EXECUTANDO TESTES DE CARGA E STRESS`);
    console.log(`=====================================`);

    // Cenário LIGHT para demonstração rápida
    const loadResults = await UnclicTestRunner.runScenario("LIGHT");

    const loadPassed = loadResults.results.filter((r: any) => r.success).length;
    const loadFailed = loadResults.results.length - loadPassed;

    totalTests += loadResults.results.length;
    totalPassed += loadPassed;
    totalFailed += loadFailed;

    console.log(
      `✅ Carga: ${loadPassed}/${loadResults.results.length} passaram\n`,
    );

    // 3. RELATÓRIO FINAL CONSOLIDADO
    generateConsolidatedReport({
      totalTests,
      totalPassed,
      totalFailed,
      functionalityResults,
      loadResults,
      totalDuration: Date.now() - overallStartTime,
    });

    return {
      success: totalFailed === 0,
      totalTests,
      totalPassed,
      totalFailed,
      successRate: Math.round((totalPassed / totalTests) * 100),
    };
  } catch (error) {
    console.error(`❌ ERRO CRÍTICO NA EXECUÇÃO DOS TESTES:`);
    console.error(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function generateConsolidatedReport(data: any) {
  console.log(`📊 RELATÓRIO CONSOLIDADO FINAL`);
  console.log(`=============================`);

  const { totalTests, totalPassed, totalFailed, totalDuration } = data;
  const successRate = Math.round((totalPassed / totalTests) * 100);

  console.log(
    `⏱️ Tempo total de execução: ${Math.round(totalDuration / 1000)}s`,
  );
  console.log(`🎯 Total de testes executados: ${totalTests}`);
  console.log(`✅ Testes bem-sucedidos: ${totalPassed}`);
  console.log(`❌ Testes falharam: ${totalFailed}`);
  console.log(`📈 Taxa de sucesso geral: ${successRate}%`);

  console.log(`\n📋 DETALHES POR CATEGORIA:`);

  // Funcionalidades
  const funcResults = data.functionalityResults;
  const funcModules = [...new Set(funcResults.map((r: any) => r.module))];

  console.log(`\n🔧 FUNCIONALIDADES:`);
  funcModules.forEach((module: string) => {
    const moduleResults = funcResults.filter((r: any) => r.module === module);
    const passed = moduleResults.filter((r: any) => r.success).length;
    const total = moduleResults.length;
    const rate = Math.round((passed / total) * 100);

    console.log(`   • ${module}: ${passed}/${total} (${rate}%)`);
  });

  // Carga
  console.log(`\n⚡ TESTES DE CARGA:`);
  data.loadResults.results.forEach((result: any) => {
    const status = result.success ? "✅" : "❌";
    console.log(`   • ${result.testName}: ${status}`);
  });

  // Avaliação final
  console.log(`\n🎖️ AVALIAÇÃO FINAL:`);

  if (successRate >= 98) {
    console.log(`🌟 EXCEPCIONAL! Sistema pronto para produção`);
    console.log(`   ✨ Qualidade de código: EXCELENTE`);
    console.log(`   🚀 Performance: ÓTIMA`);
    console.log(`   🛡️ Estabilidade: MÁXIMA`);
  } else if (successRate >= 95) {
    console.log(`🎉 EXCELENTE! Sistema muito bem testado`);
    console.log(`   ✅ Qualidade de código: MUITO BOA`);
    console.log(`   🚀 Performance: BOA`);
    console.log(`   🛡️ Estabilidade: ALTA`);
  } else if (successRate >= 90) {
    console.log(`👍 BOM! Sistema funcional com pequenos ajustes`);
    console.log(`   ⚠️ Qualidade de código: BOA`);
    console.log(`   🔧 Performance: ACEITÁVEL`);
    console.log(`   🛡️ Estabilidade: MÉDIA`);
  } else if (successRate >= 80) {
    console.log(`⚠️ ATENÇÃO! Necessárias melhorias antes do lançamento`);
    console.log(`   🔧 Qualidade de código: REGULAR`);
    console.log(`   ⚠️ Performance: PRECISA MELHORAR`);
    console.log(`   🛡️ Estabilidade: BAIXA`);
  } else {
    console.log(`🚨 CRÍTICO! Sistema não está pronto para produção`);
    console.log(`   ❌ Qualidade de código: INSUFICIENTE`);
    console.log(`   🚨 Performance: INADEQUADA`);
    console.log(`   ⛔ Estabilidade: MUITO BAIXA`);
  }

  // Próximos passos
  console.log(`\n📋 PRÓXIMOS PASSOS RECOMENDADOS:`);

  if (successRate >= 95) {
    console.log(`✅ 1. Deploy em ambiente de staging`);
    console.log(`✅ 2. Testes de aceitação do usuário`);
    console.log(`✅ 3. Preparação para produção`);
  } else if (successRate >= 85) {
    console.log(`🔧 1. Corrigir testes falhados`);
    console.log(`🔧 2. Otimizar performance`);
    console.log(`🔧 3. Executar testes novamente`);
  } else {
    console.log(`🛠️ 1. Revisão completa do código`);
    console.log(`🛠️ 2. Correção de bugs críticos`);
    console.log(`🛠️ 3. Refatoração de componentes com falha`);
    console.log(`🛠️ 4. Nova bateria de testes`);
  }

  // M��tricas detalhadas
  console.log(`\n📊 MÉTRICAS DETALHADAS:`);

  const avgTestDuration =
    funcResults.reduce((sum: number, r: any) => sum + r.duration, 0) /
    funcResults.length;
  console.log(`⏱️ Tempo médio por teste: ${Math.round(avgTestDuration)}ms`);

  const failedTests = funcResults.filter((r: any) => !r.success);
  if (failedTests.length > 0) {
    console.log(`\n❌ TESTES FALHADOS:`);
    failedTests.forEach((test: any) => {
      console.log(
        `   • ${test.module} - ${test.functionality}: ${test.error || "Erro não especificado"}`,
      );
    });
  }

  console.log(`\n=============================`);
  console.log(`🏁 SUITE DE TESTES CONCLUÍDA`);
  console.log(`=============================`);
}

// Função para executar testes específicos
export async function runSpecificTests(
  testType: "functionality" | "load" | "all" = "all",
) {
  switch (testType) {
    case "functionality":
      const functionalityTester = new UnclicFunctionalityTester();
      return await functionalityTester.runAllFunctionalityTests();

    case "load":
      return await UnclicTestRunner.runScenario("LIGHT");

    case "all":
    default:
      return await runCompleteTestSuite();
  }
}

// Auto-execução se rodado diretamente
if (require.main === module) {
  const testType = process.argv[2] as "functionality" | "load" | "all";

  runSpecificTests(testType)
    .then((results) => {
      if (results && "success" in results) {
        console.log(
          `\n${results.success ? "✅" : "❌"} Execução ${results.success ? "bem-sucedida" : "falhou"}`,
        );
        process.exit(results.success ? 0 : 1);
      } else {
        console.log(`\n✅ Testes executados com sucesso!`);
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error(`\n❌ Erro na execução:`, error);
      process.exit(1);
    });
}

export { runCompleteTestSuite };
