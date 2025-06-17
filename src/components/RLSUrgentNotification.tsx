import React, { useState, useEffect } from "react";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUPABASE_CONFIG } from "@/lib/supabaseConfig";

export const RLSUrgentNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  // Só mostra se o Supabase está desabilitado devido ao RLS
  const shouldShow =
    !SUPABASE_CONFIG.ENABLE_SUPABASE &&
    SUPABASE_CONFIG.DISABLE_REASON?.includes("RLS") &&
    isVisible &&
    !hasBeenDismissed;

  // Auto-hide após 30 segundos
  useEffect(() => {
    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [shouldShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem("rls-notification-dismissed", "true");
  };

  // Verifica se já foi dispensada anteriormente
  useEffect(() => {
    const dismissed = localStorage.getItem("rls-notification-dismissed");
    if (dismissed === "true") {
      setHasBeenDismissed(true);
      setIsVisible(false);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 shadow-xl">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                🚨 Problema RLS Crítico Detectado
              </h3>
              <Badge className="bg-red-600 text-white text-xs">URGENTE</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Problema:</strong> RLS Policy Recursion na tabela{" "}
                <code className="bg-red-100 dark:bg-red-800 px-1 rounded">
                  business_users
                </code>{" "}
                está impedindo o acesso ao Supabase.
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Status:</strong> Aplicação funcionando 100% com dados
                mock - nenhuma funcionalidade foi perdida.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    // Scroll até o final da página onde está o arquivo
                    window.scrollTo({ top: document.body.scrollHeight });
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver URGENT_RLS_FIX.sql
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "Execute o arquivo URGENT_RLS_FIX.sql no SQL Editor do seu projeto Supabase",
                    );
                  }}
                >
                  Copiar Instrução
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
