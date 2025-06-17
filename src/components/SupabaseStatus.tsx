import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { safeSupabaseApi } from "@/lib/safeSupabaseApi";
import { SUPABASE_CONFIG } from "@/lib/supabaseConfig";

export const SupabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const connectionStatus = await safeSupabaseApi.getConnectionStatus();
      setStatus(connectionStatus);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!isVisible || !SUPABASE_CONFIG.DEBUG_MODE) {
    return null;
  }

  const getStatusColor = () => {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) return "red";
    if (!status) return "gray";
    if (status.connected && status.workingTables.length > 0) return "green";
    if (status.workingTables.length > 0) return "yellow";
    return "red";
  };

  const getStatusMessage = () => {
    if (!SUPABASE_CONFIG.ENABLE_SUPABASE) {
      return `🚨 Supabase Desabilitado - ${SUPABASE_CONFIG.DISABLE_REASON || "Motivo não especificado"}`;
    }

    if (!status) return "Verificando...";

    if (status.connected && status.workingTables.length > 0) {
      return `✅ Supabase conectado - ${status.workingTables.length} tabelas funcionais`;
    }

    if (status.workingTables.length > 0) {
      return `⚠️ Conexão parcial - ${status.workingTables.length} tabelas funcionais`;
    }

    return "🎭 Modo Mock - Execute as instruções do SUPABASE_SETUP_INSTRUCTIONS.md";
  };

  const statusColor = getStatusColor();

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 border shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-sm">Status Supabase</span>
            <Badge
              variant={statusColor === "green" ? "default" : "secondary"}
              className={`text-xs ${
                statusColor === "green"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : statusColor === "yellow"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {!SUPABASE_CONFIG.ENABLE_SUPABASE
                ? "Desabilitado"
                : statusColor === "green"
                  ? "Conectado"
                  : statusColor === "yellow"
                    ? "Parcial"
                    : "Mock"}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={checkStatus}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw
                className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            {statusColor === "green" ? (
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {getStatusMessage()}
            </p>
          </div>

          {status && (
            <div className="text-xs space-y-1">
              {status.workingTables.length > 0 && (
                <div>
                  <span className="text-green-600 font-medium">
                    Funcionais:{" "}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {status.workingTables.join(", ")}
                  </span>
                </div>
              )}

              {status.blacklistedTables.length > 0 && (
                <div>
                  <span className="text-red-600 font-medium">Problemas: </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {status.blacklistedTables.join(", ")}
                  </span>
                </div>
              )}

              {!SUPABASE_CONFIG.ENABLE_SUPABASE && (
                <div className="space-y-1">
                  <div className="text-red-600 text-xs font-medium">
                    🚨 URGENTE: Execute URGENT_RLS_FIX.sql no Supabase
                  </div>
                  <div className="text-gray-600 text-xs">
                    Problema: RLS Policy Recursion em business_users
                  </div>
                  <div className="text-blue-600 text-xs">
                    Aplicação funcionando 100% com dados mock
                  </div>
                </div>
              )}

              {SUPABASE_CONFIG.ENABLE_SUPABASE &&
                !status.connected &&
                status.workingTables.length === 0 && (
                  <div className="text-blue-600 text-xs">
                    📖 Consulte SUPABASE_SETUP_INSTRUCTIONS.md para configuração
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
