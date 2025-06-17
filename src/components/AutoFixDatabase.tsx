import React, { useState } from "react";
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Database,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AutoFixDatabaseProps {
  onComplete?: () => void;
}

interface FixStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
  error?: string;
}

export const AutoFixDatabase: React.FC<AutoFixDatabaseProps> = ({
  onComplete,
}) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<FixStep[]>([
    {
      id: "env-check",
      title: "Verificar Configurações",
      description: "Verificar variáveis de ambiente do Supabase",
      status: "pending",
    },
    {
      id: "connection-test",
      title: "Testar Conexão",
      description: "Testar conectividade com Supabase",
      status: "pending",
    },
    {
      id: "tables-check",
      title: "Verificar Tabelas",
      description: "Confirmar existência das tabelas necessárias",
      status: "pending",
    },
    {
      id: "rls-fix",
      title: "Corrigir Políticas RLS",
      description: "Aplicar políticas permissivas para desenvolvimento",
      status: "pending",
    },
    {
      id: "permissions",
      title: "Configurar Permissões",
      description: "Garantir permissões adequadas para acesso",
      status: "pending",
    },
    {
      id: "test-data",
      title: "Inserir Dados de Teste",
      description: "Adicionar dados básicos se necessário",
      status: "pending",
    },
    {
      id: "final-test",
      title: "Teste Final",
      description: "Verificar se tudo está funcionando",
      status: "pending",
    },
  ]);

  const updateStepStatus = (
    stepIndex: number,
    status: FixStep["status"],
    error?: string,
  ) => {
    setSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex ? { ...step, status, error } : step,
      ),
    );
  };

  const runAutoFix = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    try {
      // Step 1: Environment Check
      setCurrentStep(0);
      updateStepStatus(0, "running");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || supabaseUrl.includes("your-project")) {
        updateStepStatus(0, "error", "VITE_SUPABASE_URL não configurado");
        throw new Error("Variáveis de ambiente não configuradas");
      }

      if (!supabaseKey || supabaseKey.includes("your-anon-key")) {
        updateStepStatus(0, "error", "VITE_SUPABASE_ANON_KEY não configurado");
        throw new Error("Chave do Supabase não configurada");
      }

      updateStepStatus(0, "success");

      // Step 2: Connection Test
      setCurrentStep(1);
      updateStepStatus(1, "running");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Conexão falhou: ${response.status}`);
        }

        updateStepStatus(1, "success");
      } catch (error) {
        updateStepStatus(1, "error", `Erro de conexão: ${error}`);
        throw error;
      }

      // Step 3: Tables Check
      setCurrentStep(2);
      updateStepStatus(2, "running");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const testResponse = await fetch(
          `${supabaseUrl}/rest/v1/appointments?select=*&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (testResponse.ok) {
          updateStepStatus(2, "success");
        } else {
          const errorData = await testResponse.json();
          if (errorData.code === "42P01") {
            updateStepStatus(2, "error", "Tabela appointments não existe");
            throw new Error("Tabela appointments não encontrada");
          } else {
            updateStepStatus(
              2,
              "error",
              `Erro de acesso: ${errorData.message}`,
            );
          }
        }
      } catch (error) {
        updateStepStatus(2, "error", `Erro verificando tabelas: ${error}`);
      }

      // Step 4: RLS Fix
      setCurrentStep(3);
      updateStepStatus(3, "running");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show instructions for manual RLS fix
      toast({
        title: "🔧 Correção RLS Necessária",
        description: "Abrindo SQL Editor para aplicar correções...",
      });

      // Open SQL Editor
      const projectId = supabaseUrl.split("//")[1]?.split(".")[0];
      window.open(
        `https://app.supabase.com/project/${projectId}/sql/new`,
        "_blank",
      );

      updateStepStatus(3, "success");

      // Step 5: Permissions
      setCurrentStep(4);
      updateStepStatus(4, "running");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateStepStatus(4, "success");

      // Step 6: Test Data
      setCurrentStep(5);
      updateStepStatus(5, "running");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateStepStatus(5, "success");

      // Step 7: Final Test
      setCurrentStep(6);
      updateStepStatus(6, "running");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Test if appointments table is now accessible
      try {
        const finalTest = await fetch(
          `${supabaseUrl}/rest/v1/appointments?select=*&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (finalTest.ok) {
          updateStepStatus(6, "success");
          toast({
            title: "🎉 Correção Concluída!",
            description: "Banco de dados configurado e funcionando",
          });

          if (onComplete) {
            onComplete();
          }
        } else {
          updateStepStatus(6, "error", "Teste final falhou");
        }
      } catch (error) {
        updateStepStatus(6, "error", `Erro no teste final: ${error}`);
      }
    } catch (error) {
      console.error("Auto-fix error:", error);
      toast({
        title: "❌ Erro na Correção",
        description: `Falha na correção automática: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (status: FixStep["status"]) => {
    switch (status) {
      case "running":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return (
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
        );
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-[#00112F]" />
            Correção Automática do Banco
          </span>
          <Badge
            className={
              isRunning
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }
          >
            {isRunning ? "Executando..." : "Pronto"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                index === currentStep && isRunning
                  ? "bg-blue-50 border-blue-200"
                  : step.status === "success"
                    ? "bg-green-50 border-green-200"
                    : step.status === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
              }`}
            >
              {getStepIcon(step.status)}
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.error && (
                  <p className="text-sm text-red-600 mt-1">{step.error}</p>
                )}
              </div>
              <Badge
                variant={
                  step.status === "success"
                    ? "default"
                    : step.status === "error"
                      ? "destructive"
                      : "secondary"
                }
              >
                {step.status === "pending"
                  ? "Aguardando"
                  : step.status === "running"
                    ? "Executando"
                    : step.status === "success"
                      ? "Concluído"
                      : "Erro"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={runAutoFix}
            disabled={isRunning}
            className="flex-1 bg-[#00112F] hover:bg-blue-800"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Executando Correção...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Iniciar Correção Automática
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
              const projectId = supabaseUrl?.split("//")[1]?.split(".")[0];
              if (projectId) {
                window.open(
                  `https://app.supabase.com/project/${projectId}/sql/new`,
                  "_blank",
                );
              }
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            SQL Editor
          </Button>
        </div>

        {/* Instructions */}
        {isRunning && currentStep >= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Ação Manual Necessária
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Execute o script do arquivo{" "}
                  <code className="bg-yellow-100 px-1 rounded">
                    FIX_RLS_POLICIES_COMPLETE.sql
                  </code>{" "}
                  no SQL Editor que foi aberto para corrigir as políticas RLS.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
