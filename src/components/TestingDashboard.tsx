import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  ComprehensiveTestSuite,
  TestSuiteResult,
} from "../tests/comprehensive-test-suite";
import {
  LoadTestSimulator,
  LoadTestResult,
} from "../tests/load-test-simulator";
import {
  SupabaseIntegrityValidator,
  DatabaseIntegrityReport,
} from "../tests/supabase-integrity-validator";

export const TestingDashboard: React.FC = () => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResult | null>(
    null,
  );
  const [integrityReport, setIntegrityReport] =
    useState<DatabaseIntegrityReport | null>(null);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    setProgress(0);
    setCurrentTest("Iniciando testes...");

    try {
      const suite = new ComprehensiveTestSuite();

      setCurrentTest("Executando testes funcionais...");
      setProgress(25);
      const results = await suite.runAllTests();
      setTestResults(results);

      setCurrentTest("Executando teste de carga...");
      setProgress(50);
      const loadSimulator = new LoadTestSimulator();
      const loadResults = await loadSimulator.runLoadTest(
        LoadTestSimulator.getRealisticLoadConfig(),
      );
      setLoadTestResults(loadResults);

      setCurrentTest("Validando integridade do banco...");
      setProgress(75);
      const validator = new SupabaseIntegrityValidator();
      const integrity = await validator.validateDatabaseIntegrity();
      setIntegrityReport(integrity);

      setProgress(100);
      setCurrentTest("Testes concluídos!");
    } catch (error) {
      console.error("Erro durante os testes:", error);
      setCurrentTest("Erro durante os testes");
    } finally {
      setIsRunningTests(false);
    }
  };

  const runLoadTest = async (
    testType: "light" | "medium" | "heavy" | "realistic",
  ) => {
    setIsRunningTests(true);
    setCurrentTest(`Executando teste de carga ${testType}...`);

    try {
      const simulator = new LoadTestSimulator();
      let config;

      switch (testType) {
        case "light":
          config = LoadTestSimulator.getLightLoadConfig();
          break;
        case "medium":
          config = LoadTestSimulator.getMediumLoadConfig();
          break;
        case "heavy":
          config = LoadTestSimulator.getHeavyLoadConfig();
          break;
        case "realistic":
          config = LoadTestSimulator.getRealisticLoadConfig();
          break;
      }

      const results = await simulator.runLoadTest(config);
      setLoadTestResults(results);
      setCurrentTest("Teste de carga concluído!");
    } catch (error) {
      console.error("Erro no teste de carga:", error);
      setCurrentTest("Erro no teste de carga");
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
      case "HEALTHY":
        return "bg-green-500";
      case "FAIL":
      case "CRITICAL":
        return "bg-red-500";
      case "WARNING":
        return "bg-yellow-500";
      case "SKIP":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centro de Testes da Aplicação</h1>
          <p className="text-gray-600">
            Validação completa de funcionalidade, carga e integridade
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runComprehensiveTests}
            disabled={isRunningTests}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunningTests ? "Executando..." : "Executar Todos os Testes"}
          </Button>
        </div>
      </div>

      {isRunningTests && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 animate-spin" />
                <span className="font-medium">{currentTest}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="functional">Testes Funcionais</TabsTrigger>
          <TabsTrigger value="load">Teste de Carga</TabsTrigger>
          <TabsTrigger value="integrity">Integridade DB</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Testes Funcionais
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testResults
                    ? `${testResults.passed}/${testResults.totalTests}`
                    : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {testResults && (
                    <span
                      className={
                        testResults.failed === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {testResults.failed === 0
                        ? "Todos passaram"
                        : `${testResults.failed} falharam`}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadTestResults
                    ? `${loadTestResults.operationsPerSecond.toFixed(1)} ops/s`
                    : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loadTestResults &&
                    `${loadTestResults.averageResponseTime.toFixed(0)}ms média`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Integridade
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrityReport ? integrityReport.overallHealth : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {integrityReport &&
                    `${integrityReport.summary.totalRecords} registros`}
                </p>
              </CardContent>
            </Card>
          </div>

          {(testResults || loadTestResults || integrityReport) && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo dos Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${testResults.failed === 0 ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="font-medium">Testes Funcionais</p>
                        <p className="text-sm text-gray-600">
                          {testResults.passed} passou, {testResults.failed}{" "}
                          falhou
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        testResults.failed === 0 ? "default" : "destructive"
                      }
                    >
                      {formatDuration(testResults.duration)}
                    </Badge>
                  </div>
                )}

                {loadTestResults && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${loadTestResults.errorRate < 5 ? "bg-green-500" : "bg-yellow-500"}`}
                      />
                      <div>
                        <p className="font-medium">Teste de Carga</p>
                        <p className="text-sm text-gray-600">
                          {loadTestResults.successfulOperations} operações,{" "}
                          {loadTestResults.errorRate.toFixed(1)}% erro
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        loadTestResults.errorRate < 5 ? "default" : "secondary"
                      }
                    >
                      {loadTestResults.operationsPerSecond.toFixed(1)} ops/s
                    </Badge>
                  </div>
                )}

                {integrityReport && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(integrityReport.overallHealth)}`}
                      />
                      <div>
                        <p className="font-medium">Integridade do Banco</p>
                        <p className="text-sm text-gray-600">
                          {integrityReport.summary.totalTables} tabelas,{" "}
                          {integrityReport.summary.tablesWithIssues} com
                          problemas
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        integrityReport.overallHealth === "HEALTHY"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {integrityReport.overallHealth}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="functional" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Resultados dos Testes Funcionais
            </h3>
            <Button
              onClick={runComprehensiveTests}
              disabled={isRunningTests}
              variant="outline"
            >
              Executar Novamente
            </Button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.passed}
                    </div>
                    <p className="text-sm text-muted-foreground">Passaram</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.failed}
                    </div>
                    <p className="text-sm text-muted-foreground">Falharam</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-gray-600">
                      {testResults.skipped}
                    </div>
                    <p className="text-sm text-muted-foreground">Pulados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {formatDuration(testResults.duration)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Duração Total
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes dos Testes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(result.status)}`}
                          />
                          <div>
                            <p className="font-medium">{result.testName}</p>
                            {result.error && (
                              <p className="text-sm text-red-600">
                                {result.error}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            result.status === "PASS" ? "default" : "destructive"
                          }
                        >
                          {formatDuration(result.duration)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {(testResults.supabaseConnectionValid === false ||
                testResults.multiTenantIsolationValid === false) && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Problemas Detectados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-red-700">
                      {!testResults.supabaseConnectionValid && (
                        <li>• Problema na conexão com Supabase</li>
                      )}
                      {!testResults.multiTenantIsolationValid && (
                        <li>• Problema no isolamento multi-tenant</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="load" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Testes de Carga</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => runLoadTest("light")}
                disabled={isRunningTests}
                variant="outline"
                size="sm"
              >
                Leve
              </Button>
              <Button
                onClick={() => runLoadTest("medium")}
                disabled={isRunningTests}
                variant="outline"
                size="sm"
              >
                Médio
              </Button>
              <Button
                onClick={() => runLoadTest("heavy")}
                disabled={isRunningTests}
                variant="outline"
                size="sm"
              >
                Pesado
              </Button>
              <Button
                onClick={() => runLoadTest("realistic")}
                disabled={isRunningTests}
                variant="outline"
                size="sm"
              >
                Realista
              </Button>
            </div>
          </div>

          {loadTestResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {loadTestResults.totalOperations}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Operações Total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {loadTestResults.operationsPerSecond.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">Ops/Segundo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {loadTestResults.averageResponseTime.toFixed(0)}ms
                    </div>
                    <p className="text-sm text-muted-foreground">Tempo Médio</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {loadTestResults.errorRate.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Taxa de Erro
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Configuração do Teste</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Usuários Simultâneos</p>
                      <p className="text-gray-600">
                        {loadTestResults.config.concurrentUsers}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Ops por Usuário</p>
                      <p className="text-gray-600">
                        {loadTestResults.config.operationsPerUser}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Duração</p>
                      <p className="text-gray-600">
                        {formatDuration(loadTestResults.config.testDurationMs)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Operações</p>
                      <p className="text-gray-600">
                        {loadTestResults.config.operationTypes.join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Operação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(loadTestResults.performanceByOperation).map(
                      ([operation, stats]) => (
                        <div
                          key={operation}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium capitalize">
                              {operation}
                            </p>
                            <p className="text-sm text-gray-600">
                              {stats.count} operações
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {stats.avgTime.toFixed(0)}ms
                            </p>
                            <p className="text-sm text-gray-600">
                              {stats.successRate.toFixed(1)}% sucesso
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {loadTestResults.errors.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800">
                      Erros Encontrados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {loadTestResults.errors
                        .slice(0, 10)
                        .map((error, index) => (
                          <p
                            key={index}
                            className="text-sm text-red-700 font-mono"
                          >
                            {error}
                          </p>
                        ))}
                      {loadTestResults.errors.length > 10 && (
                        <p className="text-sm text-red-600">
                          ... e mais {loadTestResults.errors.length - 10} erros
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Integridade do Banco de Dados
            </h3>
            <Button
              onClick={async () => {
                setIsRunningTests(true);
                const validator = new SupabaseIntegrityValidator();
                const report = await validator.validateDatabaseIntegrity();
                setIntegrityReport(report);
                setIsRunningTests(false);
              }}
              disabled={isRunningTests}
              variant="outline"
            >
              Verificar Integridade
            </Button>
          </div>

          {integrityReport && (
            <div className="space-y-4">
              <Card
                className={`${
                  integrityReport.overallHealth === "HEALTHY"
                    ? "border-green-200 bg-green-50"
                    : integrityReport.overallHealth === "WARNING"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-red-200 bg-red-50"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${getStatusColor(integrityReport.overallHealth)}`}
                    />
                    Status: {integrityReport.overallHealth}
                  </CardTitle>
                  <CardDescription>
                    Verificado em{" "}
                    {new Date(integrityReport.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total de Registros</p>
                      <p className="text-2xl font-bold">
                        {integrityReport.summary.totalRecords}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tabelas</p>
                      <p className="text-2xl font-bold">
                        {integrityReport.summary.totalTables}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Problemas</p>
                      <p className="text-2xl font-bold text-red-600">
                        {integrityReport.summary.tablesWithIssues}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Violações FK</p>
                      <p className="text-2xl font-bold text-red-600">
                        {integrityReport.summary.foreignKeyViolations}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status por Tabela</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {integrityReport.tables.map((table, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              table.dataConsistency &&
                              table.recordsWithoutBusinessId === 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{table.table}</p>
                            <p className="text-sm text-gray-600">
                              {table.totalRecords} registros
                              {table.recordsWithoutBusinessId > 0 &&
                                ` (${table.recordsWithoutBusinessId} sem business_id)`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              table.schemaValid ? "default" : "destructive"
                            }
                          >
                            Schema {table.schemaValid ? "OK" : "Erro"}
                          </Badge>
                          <Badge
                            variant={
                              table.dataConsistency ? "default" : "destructive"
                            }
                          >
                            Dados {table.dataConsistency ? "OK" : "Erro"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {integrityReport.recommendations.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">
                      Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {integrityReport.recommendations.map((rec, index) => (
                        <li key={index} className="text-yellow-700">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
