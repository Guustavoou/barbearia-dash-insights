import { useState, useEffect, useCallback } from "react";
import { supabaseApi } from "@/lib/supabaseApi";
import { useToast } from "@/hooks/use-toast";

interface UseSupabaseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook genérico para queries do Supabase
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
    console.log("🔄 [Supabase] Iniciando fetch...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await queryFn();
      console.log("📦 [Supabase] Resposta recebida:", response);

      if (response.success && response.data) {
        console.log("✅ [Supabase] Dados carregados com sucesso");
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        console.log("⚠️ [Supabase] Falha na resposta:", response.error);
        setState({
          data: null,
          loading: false,
          error: response.error || "Failed to fetch data",
        });
      }
    } catch (error) {
      console.error("❌ [Supabase] Erro:", error);
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
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

// Hook para mutations (create, update, delete)
interface UseSupabaseMutationOptions<T, P> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useSupabaseMutation<T, P = any>(
  mutationFn: (params: P) => Promise<any>,
  options?: UseSupabaseMutationOptions<T, P>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const mutate = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(params);

        if (response.success && response.data) {
          options?.onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMessage = response.error || "Mutation failed";
          setError(errorMessage);
          options?.onError?.(errorMessage);
          toast({
            title: "Erro",
            description: errorMessage,
            variant: "destructive",
          });
          return null;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options, toast],
  );

  return {
    mutate,
    loading,
    error,
  };
}

// Hooks específicos para cada entidade

// CLIENTES
export function useSupabaseClients(params?: any) {
  return useSupabaseQuery(
    () => supabaseApi.getClients(params),
    [JSON.stringify(params)],
  );
}

export function useSupabaseClient(id: string) {
  return useSupabaseQuery(() => supabaseApi.getClientById(id), [id]);
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
  options?: UseSupabaseMutationOptions<any, { id: string; data: any }>,
) {
  return useSupabaseMutation(
    ({ id, data }) => supabaseApi.updateClient(id, data),
    options,
  );
}

export function useDeleteSupabaseClient(
  options?: UseSupabaseMutationOptions<any, string>,
) {
  return useSupabaseMutation((id) => supabaseApi.deleteClient(id), options);
}

// DASHBOARD
export function useSupabaseDashboardStats() {
  return useSupabaseQuery(() => supabaseApi.getDashboardStats());
}

export function useSupabaseBusinessReports(period?: string) {
  return useSupabaseQuery(
    () => supabaseApi.getBusinessReports(period),
    [period],
  );
}

export function useSupabaseSalesPerformance(period?: string, limit?: number) {
  return useSupabaseQuery(
    () => supabaseApi.getSalesPerformance(period, limit),
    [period, limit],
  );
}

// APPOINTMENTS
export function useSupabaseAppointments(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getAppointments?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (appointmentData) =>
      supabaseApi.createAppointment?.(appointmentData) ||
      Promise.resolve({ success: true, data: appointmentData }),
    options,
  );
}

export function useUpdateSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, { id: string; data: any }>,
) {
  return useSupabaseMutation(
    ({ id, data }) =>
      supabaseApi.updateAppointment?.(id, data) ||
      Promise.resolve({ success: true, data }),
    options,
  );
}

export function useDeleteSupabaseAppointment(
  options?: UseSupabaseMutationOptions<any, string>,
) {
  return useSupabaseMutation(
    (id) =>
      supabaseApi.deleteAppointment?.(id) || Promise.resolve({ success: true }),
    options,
  );
}

// SERVICES
export function useSupabaseServices(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getServices?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (serviceData) =>
      supabaseApi.createService?.(serviceData) ||
      Promise.resolve({ success: true, data: serviceData }),
    options,
  );
}

export function useUpdateSupabaseService(
  options?: UseSupabaseMutationOptions<any, { id: string; data: any }>,
) {
  return useSupabaseMutation(
    ({ id, data }) =>
      supabaseApi.updateService?.(id, data) ||
      Promise.resolve({ success: true, data }),
    options,
  );
}

export function useDeleteSupabaseService(
  options?: UseSupabaseMutationOptions<any, string>,
) {
  return useSupabaseMutation(
    (id) =>
      supabaseApi.deleteService?.(id) || Promise.resolve({ success: true }),
    options,
  );
}

// PROFESSIONALS
export function useSupabaseProfessionals(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getProfessionals?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (professionalData) =>
      supabaseApi.createProfessional?.(professionalData) ||
      Promise.resolve({ success: true, data: professionalData }),
    options,
  );
}

export function useUpdateSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, { id: string; data: any }>,
) {
  return useSupabaseMutation(
    ({ id, data }) =>
      supabaseApi.updateProfessional?.(id, data) ||
      Promise.resolve({ success: true, data }),
    options,
  );
}

export function useDeleteSupabaseProfessional(
  options?: UseSupabaseMutationOptions<any, string>,
) {
  return useSupabaseMutation(
    (id) =>
      supabaseApi.deleteProfessional?.(id) ||
      Promise.resolve({ success: true }),
    options,
  );
}

// FINANCIAL
export function useSupabaseTransactions(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getTransactions?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useSupabaseFinancialStats(period?: string) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getFinancialStats?.(period) ||
      Promise.resolve({ success: true, data: {} }),
    [period],
  );
}

export function useCreateSupabaseTransaction(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (transactionData) =>
      supabaseApi.createTransaction?.(transactionData) ||
      Promise.resolve({ success: true, data: transactionData }),
    options,
  );
}

// PRODUCTS/STOCK
export function useSupabaseProducts(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getProducts?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useSupabaseStock(params?: any) {
  return useSupabaseQuery(
    () =>
      supabaseApi.getStock?.(params) ||
      Promise.resolve({ success: true, data: [] }),
    [JSON.stringify(params)],
  );
}

export function useCreateSupabaseProduct(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (productData) =>
      supabaseApi.createProduct?.(productData) ||
      Promise.resolve({ success: true, data: productData }),
    options,
  );
}

// Real-time subscriptions
export function useSupabaseRealTimeClients(callback: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabaseApi.subscribeToClients(callback);
    return () => {
      subscription.unsubscribe();
    };
  }, [callback]);
}

export function useSupabaseRealTimeAppointments(
  callback: (payload: any) => void,
) {
  useEffect(() => {
    const subscription = supabaseApi.subscribeToAppointments(callback);
    return () => {
      subscription.unsubscribe();
    };
  }, [callback]);
}
