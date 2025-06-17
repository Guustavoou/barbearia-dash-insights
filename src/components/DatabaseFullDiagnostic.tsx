import React, { useState, useEffect } from "react";
import {
  Database,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  Shield,
  Key,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DiagnosticResult {
  test: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
}

export const DatabaseFullDiagnostic: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>(
    {},
  );

  const runFullDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnosticResults: DiagnosticResult[] = [];

    try {
      // 1. Test basic connection
      console.log("🔍 Testing basic Supabase connection...");
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .limit(1);

        if (error) {
          diagnosticResults.push({
            test: "Basic Connection",
            status: "error",
            message: `Connection failed: ${error.message}`,
            details: error,
          });
        } else {
          diagnosticResults.push({
            test: "Basic Connection",
            status: "success",
            message: "Successfully connected to Supabase",
            details: { recordCount: data?.length || 0 },
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Basic Connection",
          status: "error",
          message: `Connection error: ${error}`,
          details: error,
        });
      }

      // 2. Test environment variables
      console.log("🔍 Checking environment variables...");
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || supabaseUrl.includes("your-project")) {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "error",
          message: "VITE_SUPABASE_URL not configured properly",
          details: { url: supabaseUrl },
        });
      } else if (!supabaseKey || supabaseKey.includes("your-anon-key")) {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "error",
          message: "VITE_SUPABASE_ANON_KEY not configured properly",
          details: { keyLength: supabaseKey?.length || 0 },
        });
      } else {
        diagnosticResults.push({
          test: "Environment Variables",
          status: "success",
          message: "Environment variables configured correctly",
          details: {
            url: supabaseUrl,
            keyLength: supabaseKey.length,
            projectId: supabaseUrl.split("//")[1]?.split(".")[0],
          },
        });
      }

      // 3. Test table existence using direct API call
      console.log("🔍 Testing table existence via API...");
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/appointments?select=*&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          diagnosticResults.push({
            test: "Table Existence (API)",
            status: "success",
            message: "Table 'appointments' exists and is accessible",
            details: {
              status: response.status,
              dataLength: data?.length || 0,
              headers: Object.fromEntries(response.headers.entries()),
            },
          });
        } else {
          const errorData = await response.json();
          diagnosticResults.push({
            test: "Table Existence (API)",
            status: "error",
            message: `API call failed: ${response.status} - ${errorData.message || "Unknown error"}`,
            details: {
              status: response.status,
              error: errorData,
              url: `${supabaseUrl}/rest/v1/appointments`,
            },
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Table Existence (API)",
          status: "error",
          message: `API call error: ${error}`,
          details: error,
        });
      }

      // 4. Test RLS policies
      console.log("🔍 Testing RLS policies...");
      try {
        // Try to get table info
        const { data: tableInfo, error: tableError } = await supabase
          .rpc("pg_get_tabledef", { table_name: "appointments" })
          .single();

        if (tableError) {
          // Try alternative method
          const { data: policyData, error: policyError } = await supabase
            .from("pg_policies")
            .select("*")
            .eq("tablename", "appointments");

          if (policyError) {
            diagnosticResults.push({
              test: "RLS Policies",
              status: "warning",
              message: "Cannot check RLS policies - limited permissions",
              details: { error: policyError },
            });
          } else {
            diagnosticResults.push({
              test: "RLS Policies",
              status: "success",
              message: `Found ${policyData?.length || 0} policies for appointments table`,
              details: { policies: policyData },
            });
          }
        } else {
          diagnosticResults.push({
            test: "RLS Policies",
            status: "success",
            message: "Table definition accessible",
            details: { tableInfo },
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "RLS Policies",
          status: "warning",
          message: "Could not check RLS policies",
          details: error,
        });
      }

      // 5. Test other tables
      console.log("🔍 Testing other tables...");
      const tables = ["businesses", "clients", "services", "professionals"];

      for (const tableName of tables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .limit(1);

          if (error) {
            diagnosticResults.push({
              test: `Table: ${tableName}`,
              status: "error",
              message: `Error accessing ${tableName}: ${error.message}`,
              details: error,
            });
          } else {
            diagnosticResults.push({
              test: `Table: ${tableName}`,
              status: "success",
              message: `Table ${tableName} accessible (${data?.length || 0} records tested)`,
              details: { recordCount: data?.length || 0 },
            });
          }
        } catch (error) {
          diagnosticResults.push({
            test: `Table: ${tableName}`,
            status: "error",
            message: `Exception accessing ${tableName}: ${error}`,
            details: error,
          });
        }
      }

      // 6. Test authentication status
      console.log("🔍 Testing authentication...");
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          diagnosticResults.push({
            test: "Authentication",
            status: "warning",
            message: "Not authenticated - using anonymous access",
            details: { error },
          });
        } else if (user) {
          diagnosticResults.push({
            test: "Authentication",
            status: "success",
            message: `Authenticated as: ${user.email || user.id}`,
            details: { user: { id: user.id, email: user.email } },
          });
        } else {
          diagnosticResults.push({
            test: "Authentication",
            status: "warning",
            message: "Anonymous access",
            details: { user: null },
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Authentication",
          status: "error",
          message: `Auth error: ${error}`,
          details: error,
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "General Error",
        status: "error",
        message: `Unexpected error: ${error}`,
        details: error,
      });
    }

    setResults(diagnosticResults);
    setIsRunning(false);

    // Show summary toast
    const errors = diagnosticResults.filter((r) => r.status === "error").length;
    const warnings = diagnosticResults.filter(
      (r) => r.status === "warning",
    ).length;
    const successes = diagnosticResults.filter(
      (r) => r.status === "success",
    ).length;

    toast({
      title: "🔍 Diagnóstico Completo",
      description: `✅ ${successes} sucessos, ⚠️ ${warnings} avisos, ❌ ${errors} erros`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700">Sucesso</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">Aviso</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const toggleDetails = (index: number) => {
    setShowDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#00112F]" />
            Diagnóstico Completo do Banco
          </span>
          <Button
            onClick={runFullDiagnostic}
            disabled={isRunning}
            className="bg-[#00112F] hover:bg-blue-800"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Executar Diagnóstico
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              Clique em "Executar Diagnóstico" para verificar o banco de dados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-semibold">{result.test}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(result.status)}
                    {result.details && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(index)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {showDetails[index] && result.details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                    <h5 className="font-medium mb-2">Detalhes:</h5>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
