import React, { useEffect } from "react";
import { PageType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AutoDatabaseErrorHandlerProps {
  onPageChange: (page: PageType) => void;
}

export const AutoDatabaseErrorHandler: React.FC<
  AutoDatabaseErrorHandlerProps
> = ({ onPageChange }) => {
  const { toast } = useToast();

  useEffect(() => {
    // Intercept console errors to detect database issues
    const originalError = console.error;

    console.error = (...args) => {
      // Call original console.error
      originalError.apply(console, args);

      // Check for database table errors
      const errorString = args.join(" ");

      // Detect specific database table missing errors
      if (
        errorString.includes('relation "public.appointments" does not exist') ||
        errorString.includes("42P01") ||
        errorString.includes("relation does not exist")
      ) {
        console.log(
          "🚨 Database table error detected - redirecting to emergency fix...",
        );

        // Show notification
        toast({
          title: "🚨 Erro Crítico do Banco",
          description: "Redirecionando para correção automática...",
          variant: "destructive",
        });

        // Redirect to emergency page after a short delay
        setTimeout(() => {
          onPageChange("database-emergency");
        }, 1500);
      }
    };

    // Intercept fetch errors for Supabase API calls
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch.apply(window, args);

        // If it's a Supabase call and has an error, check the response
        const url = args[0] as string;
        if (url && url.includes("supabase.co")) {
          const clonedResponse = response.clone();

          try {
            const data = await clonedResponse.json();

            if (
              data.code === "42P01" ||
              (data.message && data.message.includes("does not exist"))
            ) {
              console.log("🚨 Supabase table error detected in API response");

              toast({
                title: "🚨 Tabelas do Banco Não Encontradas",
                description: "Redirecionando para correção...",
                variant: "destructive",
              });

              setTimeout(() => {
                onPageChange("database-emergency");
              }, 1000);
            }
          } catch (e) {
            // If we can't parse JSON, continue normally
          }
        }

        return response;
      } catch (error) {
        // If fetch fails, call original error and continue
        return originalFetch.apply(window, args);
      }
    };

    // Cleanup on unmount
    return () => {
      console.error = originalError;
      window.fetch = originalFetch;
    };
  }, [onPageChange, toast]);

  // Test database connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.log("🚨 Supabase environment variables not found");
          return;
        }

        // Test a simple query to appointments table
        const response = await fetch(
          `${supabaseUrl}/rest/v1/appointments?select=*&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();

          if (
            errorData.code === "42P01" ||
            (errorData.message && errorData.message.includes("does not exist"))
          ) {
            console.log("🚨 Database test failed - tables do not exist");

            toast({
              title: "🚨 Banco de Dados Não Configurado",
              description: "As tabelas precisam ser criadas. Redirecionando...",
              variant: "destructive",
            });

            setTimeout(() => {
              onPageChange("database-emergency");
            }, 2000);
          }
        }
      } catch (error) {
        console.log("Database test error:", error);
      }
    };

    // Test after a short delay to let the app initialize
    const timer = setTimeout(testConnection, 3000);

    return () => clearTimeout(timer);
  }, [onPageChange, toast]);

  return null; // This component has no UI
};
