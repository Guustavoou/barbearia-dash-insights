import React, { useState } from "react";
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
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Download,
  RefreshCw,
  Target,
  Zap,
} from "lucide-react";
import { executeProductionValidation } from "../tests/execute-production-validation";

interface ValidationResult {
  report: any;
  detailedReport: string;
  success: boolean;
  error?: string;
}

export const ProductionValidationPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ValidationResult | null>(null);

  const runProductionValidation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentStep("Iniciando validação completa...");
    setResults(null);

    try {
      // Simular progresso durante a execução
      const progressSteps = [
        { step: "Verificando status do banco de dados...", progress: 10 },
        { step: "Executando testes funcionais...", progress: 30 },
        { step: "Validando integridade dos dados...", progress: 50 },
        { step: "Testando isolamento multi-tenant...", progress: 60 },
        { step: "Executando testes de carga (leve)...", progress: 70 },
        { step: "Executando testes de carga (médio)...", progress: 80 },
        { step: "Executando testes de carga (realista)...", progress: 85 },
        { step: "Validando módulos da aplicação...", progress: 90 },
        { step: "Gerando relatório final...", progress: 95 },
        { step: "Concluindo análise...", progress: 100 },
      ];

      // Executar com delay para mostrar progresso
      for (const { step, progress: stepProgress } of progressSteps) {
        setCurrentStep(step);
        setProgress(stepProgress);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Executar validação real
      const result = await executeProductionValidation();
      setResults(result);
    } catch (error) {
      console.error("Erro durante validação:", error);
      setResults({
        report: null,
        detailedReport: "",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsRunning(false);
      setCurrentStep("Validação concluída!");
    }
  };

  const downloadReport = () => {
    if (!results?.detailedReport) return;

    const blob = new Blob([results.detailedReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `validacao-producao-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "READY":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "WARNING":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "NOT_READY":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY":
        return "border-green-200 bg-green-50";
      case "WARNING":
        return "border-yellow-200 bg-yellow-50";
      case "NOT_READY":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Action Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-6 h-6" />
            🚀 Validação Completa para Produção
          </CardTitle>
          <CardDescription className="text-blue-600">
            Execute uma bateria completa de testes funcionais, de carga e
            validação de backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={runProductionValidation}
              disabled={isRunning}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Executando Validação...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Validação Completa
                </>
              )}
            </Button>

            {results?.detailedReport && (
              <Button
                onClick={downloadReport}
                variant="outline"
                className="border-blue-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Relatório
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="font-medium">{currentStep}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">{progress}% concluído</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-4">
          {results.success && results.report ? (
            <>
              {/* Summary Card */}
              <Card
                className={getStatusColor(
                  results.report.productionReadiness.status,
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(results.report.productionReadiness.status)}
                    Status: {results.report.productionReadiness.status}
                  </CardTitle>
                  <CardDescription>
                    Score Geral: {results.report.productionReadiness.score}/100
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.report.functionalTests.passed}/
                        {results.report.functionalTests.totalTests}
                      </div>
                      <p className="text-sm text-gray-600">Testes Funcionais</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.report.performanceMetrics.successRate.toFixed(
                          1,
                        )}
                        %
                      </div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.report.performanceMetrics.averageResponseTime.toFixed(
                          0,
                        )}
                        ms
                      </div>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {results.report.performanceMetrics.totalOperations}
                      </div>
                      <p className="text-sm text-gray-600">Operações</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Module Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Status dos Módulos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(results.report.moduleValidation).map(
                      ([module, status]) => (
                        <div
                          key={module}
                          className="flex items-center gap-2 p-2 border rounded-lg"
                        >
                          {status ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm capitalize">{module}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Load Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Resultados dos Testes de Carga
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(results.report.loadTests)
                      .filter(([_, test]) => test !== null)
                      .map(([scenario, test]: [string, any]) => (
                        <div key={scenario} className="p-4 border rounded-lg">
                          <h4 className="font-semibold capitalize mb-2">
                            {scenario}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              Ops/seg: {test.operationsPerSecond.toFixed(1)}
                            </p>
                            <p>
                              Tempo médio: {test.averageResponseTime.toFixed(0)}
                              ms
                            </p>
                            <p>Taxa de erro: {test.errorRate.toFixed(1)}%</p>
                            <p>Usuários: {test.config.concurrentUsers}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Blockers and Recommendations */}
              {(results.report.productionReadiness.blockers.length > 0 ||
                results.report.productionReadiness.recommendations.length >
                  0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Bloqueadores e Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.report.productionReadiness.blockers.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          🚫 Bloqueadores Críticos:
                        </h4>
                        <ul className="space-y-1">
                          {results.report.productionReadiness.blockers.map(
                            (blocker: string, index: number) => (
                              <li key={index} className="text-red-700 text-sm">
                                • {blocker}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {results.report.productionReadiness.recommendations.length >
                      0 && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">
                          💡 Recomendações:
                        </h4>
                        <ul className="space-y-1">
                          {results.report.productionReadiness.recommendations
                            .slice(0, 5)
                            .map((rec: string, index: number) => (
                              <li key={index} className="text-blue-700 text-sm">
                                • {rec}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Error Display */
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-6 h-6" />
                  Erro na Validação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  {results.error || "Erro desconhecido durante a validação"}
                </p>
                <Button
                  onClick={runProductionValidation}
                  className="mt-4"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Test Scope Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-700" />
            Escopo da Validação Completa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🔍 Testes Funcionais</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Operações CRUD completas</li>
                <li>• Conexão Supabase</li>
                <li>• Isolamento multi-tenant</li>
                <li>• Integridade de dados</li>
                <li>• Todas as telas e módulos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔥 Testes de Carga</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Múltiplos usuários simultâneos</li>
                <li>• Cenários progressivos</li>
                <li>• Medição de performance</li>
                <li>• Taxa de erro</li>
                <li>• Tempo de resposta</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Validação Backend</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Zero dados mockados</li>
                <li>• Persistência no Supabase</li>
                <li>• Políticas RLS</li>
                <li>• Schema de tabelas</li>
                <li>• Chaves estrangeiras</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
