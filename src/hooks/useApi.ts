import { useState, useEffect, useCallback } from "react";
import { api, ApiResponse } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || "Failed to fetch data",
        });
      }
    } catch (error) {
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

// Specialized hooks for common API calls
export function useDashboardStats() {
  return useApi(() => api.getDashboardStats());
}

export function useRevenueData(period?: string) {
  return useApi(() => api.getRevenueData(period), [period]);
}

export function useTopServices(limit?: number) {
  return useApi(() => api.getTopServices(limit), [limit]);
}

export function useUpcomingAppointments(limit?: number) {
  return useApi(() => api.getUpcomingAppointments(limit), [limit]);
}

export function useBirthdays() {
  return useApi(() => api.getBirthdaysThisMonth());
}

export function useClients(params?: any) {
  return useApi(() => api.getClients(params), [JSON.stringify(params)]);
}

export function useAppointments(params?: any) {
  return useApi(() => api.getAppointments(params), [JSON.stringify(params)]);
}

export function useServices(params?: any) {
  return useApi(() => api.getServices(params), [JSON.stringify(params)]);
}

export function useProfessionals(params?: any) {
  return useApi(() => api.getProfessionals(params), [JSON.stringify(params)]);
}

export function useProducts(params?: any) {
  return useApi(() => api.getProducts(params), [JSON.stringify(params)]);
}

// Hook for API mutations (create, update, delete)
interface UseMutationOptions<T, P> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options?: UseMutationOptions<T, P>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          return null;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options],
  );

  return {
    mutate,
    loading,
    error,
  };
}

// Specialized mutation hooks
export function useCreateClient(options?: UseMutationOptions<any, any>) {
  return useMutation((clientData) => api.createClient(clientData), options);
}

export function useUpdateClient(
  options?: UseMutationOptions<any, { id: number; data: any }>,
) {
  return useMutation(({ id, data }) => api.updateClient(id, data), options);
}

export function useDeleteClient(options?: UseMutationOptions<any, number>) {
  return useMutation((id) => api.deleteClient(id), options);
}

export function useCreateAppointment(options?: UseMutationOptions<any, any>) {
  return useMutation(
    (appointmentData) => api.createAppointment(appointmentData),
    options,
  );
}

export function useUpdateAppointment(
  options?: UseMutationOptions<any, { id: number; data: any }>,
) {
  return useMutation(
    ({ id, data }) => api.updateAppointment(id, data),
    options,
  );
}

export function useDeleteAppointment(
  options?: UseMutationOptions<any, number>,
) {
  return useMutation((id) => api.deleteAppointment(id), options);
}
