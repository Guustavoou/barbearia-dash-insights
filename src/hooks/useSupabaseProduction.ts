import { useState, useEffect, useCallback, useMemo } from "react";
import { supabaseApiProduction } from "@/lib/supabaseApiProduction";
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

// Generic hook for Supabase queries - PRODUCTION READY
export function useSupabaseQuery<T>(
  queryFn: () => Promise<any>,
  dependencies: any[] = [],
  options?: { enabled?: boolean },
) {
  const [state, setState] = useState<UseSupabaseState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (options?.enabled === false) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    logSupabaseDebug("🔄 [Production] Starting fetch...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await queryFn();

      if (response.success) {
        logSupabaseDebug("✅ [Production] Data loaded successfully");
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        logSupabaseError("⚠️ [Production] Response failed", response.error);
        setState({
          data: null,
          loading: false,
          error: response.error || "Failed to fetch data",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError("❌ [Production] Fetch error", errorMessage);
      setState({
        data: null,
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

// Hook for mutations with toast notifications
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
          logSupabaseDebug("✅ [Production] Mutation successful");
          options?.onSuccess?.(response.data);
          return response;
        } else {
          throw new Error(response.error || "Mutation failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logSupabaseError("❌ [Production] Mutation error", errorMessage);
        options?.onError?.(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options, toast],
  );

  return {
    mutate,
    isLoading,
  };
}

// =====================================================
// DASHBOARD HOOKS - PRODUCTION
// =====================================================

export function useDashboardStats() {
  return useSupabaseQuery(() => supabaseApiProduction.getDashboardStats(), []);
}

export function useBusinessReports(dateFrom?: string, dateTo?: string) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getBusinessReports(dateFrom, dateTo),
    [dateFrom, dateTo],
  );
}

// =====================================================
// CLIENTS HOOKS - PRODUCTION
// =====================================================

export function useClients(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  search?: string;
  status?: string;
}) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getClients(params),
    [
      params?.page,
      params?.limit,
      params?.sort,
      params?.order,
      params?.search,
      params?.status,
    ],
  );
}

export function useCreateClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (clientData: any) => supabaseApiProduction.createClient(clientData),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useUpdateClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    ({ id, data }: { id: string; data: any }) =>
      supabaseApiProduction.updateClient(id, data),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useDeleteClient(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (id: string) => supabaseApiProduction.deleteClient(id),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Cliente excluído com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

// =====================================================
// APPOINTMENTS HOOKS - PRODUCTION
// =====================================================

export function useAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
  professionalId?: string;
}) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getAppointments(params),
    [
      params?.page,
      params?.limit,
      params?.status,
      params?.date,
      params?.professionalId,
    ],
  );
}

export function useCreateAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (appointmentData: any) =>
      supabaseApiProduction.createAppointment(appointmentData),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Agendamento criado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useUpdateAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    ({ id, data }: { id: string; data: any }) =>
      supabaseApiProduction.updateAppointment(id, data),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Agendamento atualizado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useDeleteAppointment(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (id: string) => supabaseApiProduction.deleteAppointment(id),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Agendamento excluído com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

// =====================================================
// SERVICES HOOKS - PRODUCTION
// =====================================================

export function useServices(params?: { category?: string; active?: boolean }) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getServices(params),
    [params?.category, params?.active],
  );
}

export function useCreateService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (serviceData: any) => supabaseApiProduction.createService(serviceData),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useUpdateService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    ({ id, data }: { id: string; data: any }) =>
      supabaseApiProduction.updateService(id, data),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useDeleteService(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (id: string) => supabaseApiProduction.deleteService(id),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Serviço excluído com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

// =====================================================
// PROFESSIONALS HOOKS - PRODUCTION
// =====================================================

export function useProfessionals(params?: { status?: string }) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getProfessionals(params),
    [params?.status],
  );
}

export function useCreateProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (professionalData: any) =>
      supabaseApiProduction.createProfessional(professionalData),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Profissional criado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useUpdateProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    ({ id, data }: { id: string; data: any }) =>
      supabaseApiProduction.updateProfessional(id, data),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Profissional atualizado com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

export function useDeleteProfessional(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (id: string) => supabaseApiProduction.deleteProfessional(id),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Profissional excluído com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

// =====================================================
// FINANCIAL HOOKS - PRODUCTION
// =====================================================

export function useTransactions(params?: {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  return useSupabaseQuery(
    () => supabaseApiProduction.getTransactions(params),
    [
      params?.type,
      params?.dateFrom,
      params?.dateTo,
      params?.page,
      params?.limit,
    ],
  );
}

export function useCreateTransaction(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  return useSupabaseMutation(
    (transactionData: any) =>
      supabaseApiProduction.createTransaction(transactionData),
    {
      ...options,
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso!",
        });
        options?.onSuccess?.(data);
      },
    },
  );
}

// =====================================================
// UTILITY HOOKS
// =====================================================

// Hook to get loading state across multiple queries
export function useGlobalLoading(...states: { loading: boolean }[]) {
  return useMemo(() => {
    return states.some((state) => state.loading);
  }, [states]);
}

// Hook to get combined error state
export function useGlobalError(...states: { error: string | null }[]) {
  return useMemo(() => {
    const errors = states
      .map((state) => state.error)
      .filter((error) => error !== null);
    return errors.length > 0 ? errors[0] : null;
  }, [states]);
}

// Re-export toast for convenience
function toast(params: any) {
  const { toast: toastFn } = useToast();
  return toastFn(params);
}
