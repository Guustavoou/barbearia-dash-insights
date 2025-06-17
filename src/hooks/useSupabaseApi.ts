import { useState, useEffect, useCallback } from "react";
import { supabaseApi } from "@/lib/supabaseApi";
import { useToast } from "@/hooks/use-toast";
import { logSupabaseDebug, logSupabaseError } from "@/lib/supabaseConfig";

interface UseSupabaseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseSupabaseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
}

// Hook genérico para queries do Supabase - APENAS DADOS REAIS
export function useSupabaseQuery<T>(
  queryFn: () => Promise<any>,
  dependencies: any[] = [],
) {
  const [state, setState] = useState<UseSupabaseState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    logSupabaseDebug("🔄 [Real Data] Iniciando fetch...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await queryFn();

      if (response.success) {
        logSupabaseDebug("✅ [Real Data] Dados carregados com sucesso");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        logSupabaseError("⚠️ [Real Data] Falha na resposta", response.error);
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch data",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ [Real Data] Erro no fetch", errorMessage);
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Hook para mutations
export function useSupabaseMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<any>,
  options?: UseSupabaseMutationOptions<TData, TVariables>,
) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      try {
        const response = await mutationFn(variables);

        if (response.success) {
          logSupabaseDebug("✅ [Real Data] Mutation executada com sucesso");
          options?.onSuccess?.(response.data);
          return response;
        } else {
          throw new Error(response.error || "Mutation failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logSupabaseError("❌ [Real Data] Erro na mutation", errorMessage);
        options?.onError?.(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options],
  );

  const mutateAsync = mutate;

  return {
    mutate,
    mutateAsync,
    isLoading,
  };
}

// ==============================================
// HOOKS ESPECÍFICOS - APENAS DADOS REAIS
// ==============================================

// CLIENTS
export function useSupabaseClients(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getClients(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (clientData) => supabaseApi.createClient(clientData),
    options,
  );
}

export function useUpdateSupabaseClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (data: { id: string; [key: string]: any }) =>
      supabaseApi.updateClient(data.id, data),
    options,
  );
}

export function useDeleteSupabaseClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (clientId: string) => supabaseApi.deleteClient(clientId),
    options,
  );
}

// APPOINTMENTS
export function useSupabaseAppointments(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getAppointments(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (appointmentData) => supabaseApi.createAppointment(appointmentData),
    options,
  );
}

export function useUpdateSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (data: { id: string; [key: string]: any }) =>
      supabaseApi.updateAppointment(data.id, data),
    options,
  );
}

export function useDeleteSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (appointmentId: string) => supabaseApi.deleteAppointment(appointmentId),
    options,
  );
}

// SERVICES
export function useSupabaseServices(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getServices(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (serviceData) => supabaseApi.createService(serviceData),
    options,
  );
}

export function useUpdateSupabaseService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (data: { id: string; [key: string]: any }) =>
      supabaseApi.updateService(data.id, data),
    options,
  );
}

export function useDeleteSupabaseService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (serviceId: string) => supabaseApi.deleteService(serviceId),
    options,
  );
}

// PROFESSIONALS
export function useSupabaseProfessionals(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getProfessionals(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (professionalData) => supabaseApi.createProfessional(professionalData),
    options,
  );
}

export function useUpdateSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (data: { id: string; [key: string]: any }) =>
      supabaseApi.updateProfessional(data.id, data),
    options,
  );
}

export function useDeleteSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (professionalId: string) => supabaseApi.deleteProfessional(professionalId),
    options,
  );
}

// PRODUCTS
export function useSupabaseProducts(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getProducts(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseProduct(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (productData) => supabaseApi.createProduct(productData),
    options,
  );
}

export function useUpdateSupabaseProduct(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (data: { id: string; [key: string]: any }) =>
      supabaseApi.updateProduct(data.id, data),
    options,
  );
}

export function useDeleteSupabaseProduct(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (productId: string) => supabaseApi.deleteProduct(productId),
    options,
  );
}

// TRANSACTIONS
export function useSupabaseTransactions(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getTransactions(params),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseTransaction(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (transactionData) => supabaseApi.createTransaction(transactionData),
    options,
  );
}

// DASHBOARD & REPORTS
export function useSupabaseDashboardStats() {
  return useSupabaseQuery(() => supabaseApi.getDashboardStats(), []);
}

export function useSupabaseBusinessReports(period: string) {
  return useSupabaseQuery(
    () => supabaseApi.getBusinessReports(period),
    [period],
  );
}

export function useSupabaseSalesPerformance(period: string, limit: number) {
  return useSupabaseQuery(
    () => supabaseApi.getSalesPerformance(period, limit),
    [period, limit],
  );
}

export function useSupabaseFinancialStats(period?: string) {
  return useSupabaseQuery(
    () => supabaseApi.getFinancialStats(period),
    [period],
  );
}
