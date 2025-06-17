import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Database,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DatabaseConnectionDiagnosticProps {
  onFixRequired?: () => void;
}

interface TableStatus {
  name: string;
  exists: boolean;
  error?: string;
}

export const DatabaseConnectionDiagnostic: React.FC<
  DatabaseConnectionDiagnosticProps
> = ({ onFixRequired }) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "failed"
  >("unknown");
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);

  const requiredTables = [
    "businesses",
    "clients",
    "appointments",
    "services",
    "professionals",
    "products",
    "transactions",
  ];

  const checkDatabaseConnection = async () => {
    setIsChecking(true);
    setConnectionStatus("unknown");
    setTableStatuses([]);

    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .limit(1);

      if (connectionError) {
        setConnectionStatus("failed");
        toast({
          title: "❌ Erro de Conexão",
          description: "Não foi possível conectar ao Supabase",
          variant: "destructive",
        });
        return;
      }

      setConnectionStatus("connected");

      // Check each required table
      const statuses: TableStatus[] = [];

      for (const tableName of requiredTables) {
        try {
          const { error } = await supabase.from(tableName).select("*").limit(1);

          if (error) {
            statuses.push({
              name: tableName,
              exists: false,
              error: error.message,
            });
          } else {
            statuses.push({
              name: tableName,
              exists: true,
            });
          }
        } catch (error) {
          statuses.push({
            name: tableName,
            exists: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      setTableStatuses(statuses);

      const missingTables = statuses.filter((s) => !s.exists);
      if (missingTables.length > 0) {
        toast({
          title: "⚠️ Tabelas Não Encontradas",
          description: `${missingTables.length} tabelas precisam ser criadas`,
          variant: "destructive",
        });

        if (onFixRequired) {
          onFixRequired();
        }
      } else {
        toast({
          title: "✅ Banco Configurado",
          description: "Todas as tabelas existem e estão funcionando",
        });
      }
    } catch (error) {
      setConnectionStatus("failed");
      toast({
        title: "❌ Erro na Verificação",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const openSupabaseSQLEditor = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const projectId = supabaseUrl.split("//")[1].split(".")[0];
      const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;
      window.open(sqlEditorUrl, "_blank");
    } else {
      toast({
        title: "❌ URL do Supabase não encontrada",
        description: "Verifique suas variáveis de ambiente",
        variant: "destructive",
      });
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Falha
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Database className="w-3 h-3 mr-1" />
            Não testado
          </Badge>
        );
    }
  };

  const missingTables = tableStatuses.filter((s) => !s.exists);
  const existingTables = tableStatuses.filter((s) => s.exists);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
            Diagnóstico do Banco de Dados
          </span>
          {getConnectionStatusBadge()}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={checkDatabaseConnection}
            disabled={isChecking}
            className="bg-[#00112F] hover:bg-blue-800 text-white"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Verificar Conexão
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={openSupabaseSQLEditor}
            className="border-[#00112F] text-[#00112F] hover:bg-[#00112F] hover:text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir SQL Editor
          </Button>
        </div>

        {/* Results */}
        {tableStatuses.length > 0 && (
          <div className="space-y-3">
            {/* Missing Tables Alert */}
            {missingTables.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-800 dark:text-red-400">
                    ⚠️ Ação Necessária: {missingTables.length} tabelas não
                    encontradas
                  </h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Execute o script <code>URGENT_DATABASE_FIX.sql</code> no SQL
                  Editor do Supabase para criar as tabelas.
                </p>
                <div className="space-y-1">
                  {missingTables.map((table) => (
                    <div key={table.name} className="text-sm">
                      <span className="font-mono bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-red-800 dark:text-red-300">
                        {table.name}
                      </span>
                      {table.error && (
                        <span className="text-red-600 dark:text-red-400 ml-2">
                          - {table.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Tables */}
            {existingTables.length > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800 dark:text-green-400">
                    ✅ Tabelas funcionando: {existingTables.length}
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {existingTables.map((table) => (
                    <Badge
                      key={table.name}
                      className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {table.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {connectionStatus === "connected" && missingTables.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              📋 Instruções para Correção:
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Clique em "Abrir SQL Editor" acima</li>
              <li>
                Copie todo o conteúdo do arquivo{" "}
                <code>URGENT_DATABASE_FIX.sql</code>
              </li>
              <li>Cole no SQL Editor e clique em "Run"</li>
              <li>Volte aqui e clique em "Verificar Conexão"</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
