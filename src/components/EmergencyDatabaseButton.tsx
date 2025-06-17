import React, { useState, useEffect } from "react";
import { AlertTriangle, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageType } from "@/lib/types";

interface EmergencyDatabaseButtonProps {
  onPageChange: (page: PageType) => void;
}

export const EmergencyDatabaseButton: React.FC<
  EmergencyDatabaseButtonProps
> = ({ onPageChange }) => {
  const [showButton, setShowButton] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    let errorTimer: NodeJS.Timeout;

    // Intercept console errors
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);

      const errorString = args.join(" ");
      if (
        errorString.includes("42P01") ||
        errorString.includes("does not exist") ||
        errorString.includes("appointments")
      ) {
        setErrorCount((prev) => prev + 1);
        setShowButton(true);

        // Auto-hide after 30 seconds if user doesn't interact
        clearTimeout(errorTimer);
        errorTimer = setTimeout(() => {
          setShowButton(false);
        }, 30000);
      }
    };

    return () => {
      console.error = originalError;
      clearTimeout(errorTimer);
    };
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-bounce">
      <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 shadow-2xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm">
              🚨 Erro do Banco Detectado
            </span>
            {errorCount > 1 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {errorCount}x
              </span>
            )}
          </div>

          <p className="text-xs text-red-600 dark:text-red-400">
            Tabela "appointments" não existe no Supabase
          </p>

          <div className="flex space-x-2">
            <Button
              onClick={() => onPageChange("database-emergency")}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Zap className="w-3 h-3 mr-1" />
              Corrigir Agora
            </Button>

            <Button
              onClick={() => setShowButton(false)}
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Hook para usar em qualquer componente
export const useEmergencyDatabaseDetection = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const originalError = console.error;

    console.error = (...args) => {
      originalError.apply(console, args);

      const errorString = args.join(" ");
      if (
        errorString.includes("42P01") ||
        errorString.includes("relation") ||
        errorString.includes("does not exist")
      ) {
        setHasError(true);
      }
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const clearError = () => setHasError(false);

  return { hasError, clearError };
};
