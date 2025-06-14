// Runner para executar testes de carga do Unclic Manager
import { UnclicLoadTester } from "./loadTesting";

// Configurações de diferentes cenários de teste
const TEST_SCENARIOS = {
  // Teste leve - desenvolvimento
  LIGHT: {
    concurrent_users: 10,
    test_duration_minutes: 1,
    ramp_up_seconds: 10,
    establishments_count: 5,
  },

  // Teste médio - staging
  MEDIUM: {
    concurrent_users: 50,
    test_duration_minutes: 3,
    ramp_up_seconds: 30,
    establishments_count: 20,
  },

  // Teste pesado - pré-produção
  HEAVY: {
    concurrent_users: 100,
    test_duration_minutes: 5,
    ramp_up_seconds: 60,
    establishments_count: 50,
  },

  // Teste extremo - stress máximo
  EXTREME: {
    concurrent_users: 500,
    test_duration_minutes: 10,
    ramp_up_seconds: 120,
    establishments_count: 100,
  },
};

// Classe para executar múltiplos cenários
export class UnclicTestRunner {
  // Executa teste específico
  static async runScenario(scenarioName: keyof typeof TEST_SCENARIOS) {
    console.log(`🎬 EXECUTANDO CENÁRIO: ${scenarioName}`);
    console.log(`======================================`);

    const config = TEST_SCENARIOS[scenarioName];
    const tester = new UnclicLoadTester(config);

    const results = await tester.runFullTestSuite();

    return {
      scenario: scenarioName,
      config,
      results,
      summary: {
        total_tests: results.length,
        passed: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        total_duration: results.reduce((sum, r) => sum + r.duration, 0),
      },
    };
  }

  // Executa todos os cenários em sequência
  static async runAllScenarios() {
    console.log(`🚀 INICIANDO SUITE COMPLETA DE TESTES DE CARGA`);
    console.log(`==============================================`);
    console.log(`📅 Data/Hora: ${new Date().toLocaleString()}`);
    console.log(`🖥️ Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`==============================================\n`);

    const allResults = [];

    for (const [scenarioName, config] of Object.entries(TEST_SCENARIOS)) {
      try {
        console.log(`\n🎯 Cenário: ${scenarioName}`);
        console.log(
          `⚙️ Config: ${config.concurrent_users} usuários, ${config.establishments_count} estabelecimentos`,
        );
        console.log(`─────────────────────────────────────────\n`);

        const result = await this.runScenario(
          scenarioName as keyof typeof TEST_SCENARIOS,
        );
        allResults.push(result);

        // Pausa entre cenários
        console.log(`\n⏸️ Pausa de 30s antes do próximo cenário...\n`);
        await new Promise((resolve) => setTimeout(resolve, 30000));
      } catch (error) {
        console.error(`❌ Erro no cenário ${scenarioName}:`, error);
        allResults.push({
          scenario: scenarioName,
          config,
          results: [],
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    this.generateConsolidatedReport(allResults);
    return allResults;
  }

  // Gera relatório consolidado
  private static generateConsolidatedReport(allResults: any[]) {
    console.log(`\n📊 RELATÓRIO CONSOLIDADO DE TODOS OS CENÁRIOS`);
    console.log(`=============================================`);

    const summary = allResults.map((result) => ({
      scenario: result.scenario,
      concurrent_users: result.config.concurrent_users,
      establishments: result.config.establishments_count,
      tests_passed: result.summary?.passed || 0,
      tests_failed: result.summary?.failed || 0,
      total_duration: Math.round((result.summary?.total_duration || 0) / 1000),
      success_rate: result.summary
        ? Math.round((result.summary.passed / result.summary.total_tests) * 100)
        : 0,
    }));

    console.table(summary);

    // Análise de performance
    console.log(`\n🔍 ANÁLISE DE PERFORMANCE:`);

    const totalTests = allResults.reduce(
      (sum, r) => sum + (r.summary?.total_tests || 0),
      0,
    );
    const totalPassed = allResults.reduce(
      (sum, r) => sum + (r.summary?.passed || 0),
      0,
    );
    const totalFailed = allResults.reduce(
      (sum, r) => sum + (r.summary?.failed || 0),
      0,
    );
    const overallSuccessRate = Math.round((totalPassed / totalTests) * 100);

    console.log(`📈 Total de testes executados: ${totalTests}`);
    console.log(`✅ Testes bem-sucedidos: ${totalPassed}`);
    console.log(`❌ Testes falharam: ${totalFailed}`);
    console.log(`🎯 Taxa de sucesso geral: ${overallSuccessRate}%`);

    // Recomendações finais
    console.log(`\n💡 RECOMENDAÇÕES FINAIS:`);

    if (overallSuccessRate >= 95) {
      console.log(`🌟 EXCELENTE! Taxa de sucesso acima de 95%`);
      console.log(`✅ Sistema pronto para produção com alta carga`);
    } else if (overallSuccessRate >= 85) {
      console.log(`👍 BOM! Taxa de sucesso acima de 85%`);
      console.log(`⚠️ Considere otimizações antes de lançar`);
    } else if (overallSuccessRate >= 70) {
      console.log(`⚠️ ATENÇÃO! Taxa de sucesso entre 70-85%`);
      console.log(`🔧 Necessárias otimizações significativas`);
    } else {
      console.log(`🚨 CRÍTICO! Taxa de sucesso abaixo de 70%`);
      console.log(`🛠️ Revisão completa do sistema necessária`);
    }

    // Identifica gargalos
    const failedScenarios = allResults.filter(
      (r) => (r.summary?.failed || 0) > 0,
    );
    if (failedScenarios.length > 0) {
      console.log(`\n🔍 CENÁRIOS COM FALHAS:`);
      failedScenarios.forEach((scenario) => {
        console.log(
          `• ${scenario.scenario}: ${scenario.summary.failed} falhas`,
        );
      });
    }

    console.log(`\n=============================================`);
    console.log(
      `🏁 SUITE DE TESTES CONCLUÍDA EM ${new Date().toLocaleString()}`,
    );
    console.log(`=============================================`);
  }
}

// Função para executar testes via linha de comando
export async function runTests(scenario?: string) {
  if (scenario && scenario in TEST_SCENARIOS) {
    return await UnclicTestRunner.runScenario(
      scenario as keyof typeof TEST_SCENARIOS,
    );
  } else {
    return await UnclicTestRunner.runAllScenarios();
  }
}

// Auto-execução se rodado diretamente
if (require.main === module) {
  const scenario = process.argv[2];

  runTests(scenario)
    .then(() => {
      console.log(`\n✅ Testes concluídos com sucesso!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n❌ Erro na execução dos testes:`, error);
      process.exit(1);
    });
}
