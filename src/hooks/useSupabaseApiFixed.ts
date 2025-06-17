import { useState, useEffect, useCallback } from "react";
import { supabaseApiFixed } from "@/lib/supabaseApiFixed";
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

// =====================================================
// APPOINTMENTS HOOKS - FIXED
// =====================================================

export function useSupabaseAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
}) {
  const [state, setState] = useState<UseSupabaseState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAppointments = useCallback(async () => {
    logSupabaseDebug("🔄 [Fixed API] Fetching appointments...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await supabaseApiFixed.getAppointments(params);

      if (response.success) {
        logSupabaseDebug("✅ [Fixed API] Appointments loaded successfully");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        logSupabaseError(
          "⚠️ [Fixed API] Failed to load appointments",
          response.error,
        );
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch appointments",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logSupabaseError(
        "❌ [Fixed API] Error fetching appointments",
        errorMessage,
      );
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [params?.page, params?.limit, params?.status, params?.date]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    ...state,
    refetch: fetchAppointments,
  };
}

export function useSupabaseAppointmentMutation(
  options?: UseSupabaseMutationOptions<any, any>,
) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAppointment = useCallback(
    async (appointmentData: any) => {
      setIsLoading(true);
      try {
        const response =
          await supabaseApiFixed.createAppointment(appointmentData);

        if (response.success) {
          logSupabaseDebug("✅ [Fixed API] Appointment created successfully");
          options?.onSuccess?.(response.data);
          toast({
            title: "Sucesso",
            description: "Agendamento criado com sucesso!",
          });
          return response;
        } else {
          throw new Error(response.error || "Failed to create appointment");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logSupabaseError(
          "❌ [Fixed API] Error creating appointment",
          errorMessage,
        );
        options?.onError?.(errorMessage);
        toast({
          title: "Erro",
          description: "Erro ao criar agendamento: " + errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options, toast],
  );

  const updateAppointment = useCallback(
    async (id: string, appointmentData: any) => {
      setIsLoading(true);
      try {
        const response = await supabaseApiFixed.updateAppointment(
          id,
          appointmentData,
        );

        if (response.success) {
          logSupabaseDebug("✅ [Fixed API] Appointment updated successfully");
          options?.onSuccess?.(response.data);
          toast({
            title: "Sucesso",
            description: "Agendamento atualizado com sucesso!",
          });
          return response;
        } else {
          throw new Error(response.error || "Failed to update appointment");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logSupabaseError(
          "❌ [Fixed API] Error updating appointment",
          errorMessage,
        );
        options?.onError?.(errorMessage);
        toast({
          title: "Erro",
          description: "Erro ao atualizar agendamento: " + errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options, toast],
  );

  const deleteAppointment = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const response = await supabaseApiFixed.deleteAppointment(id);

        if (response.success) {
          logSupabaseDebug("✅ [Fixed API] Appointment deleted successfully");
          toast({
            title: "Sucesso",
            description: "Agendamento excluído com sucesso!",
          });
          return response;
        } else {
          throw new Error(response.error || "Failed to delete appointment");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logSupabaseError(
          "❌ [Fixed API] Error deleting appointment",
          errorMessage,
        );
        toast({
          title: "Erro",
          description: "Erro ao excluir agendamento: " + errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    isLoading,
  };
}

// =====================================================
// CLIENTS HOOKS - FIXED
// =====================================================

export function useSupabaseClients(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const [state, setState] = useState<UseSupabaseState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchClients = useCallback(async () => {
    logSupabaseDebug("🔄 [Fixed API] Fetching clients...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await supabaseApiFixed.getClients(params);

      if (response.success) {
        logSupabaseDebug("✅ [Fixed API] Clients loaded successfully");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch clients",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [params?.page, params?.limit, params?.status, params?.search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    ...state,
    refetch: fetchClients,
  };
}

// =====================================================
// SERVICES HOOKS - FIXED
// =====================================================

export function useSupabaseServices(params?: {
  category?: string;
  search?: string;
}) {
  const [state, setState] = useState<UseSupabaseState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchServices = useCallback(async () => {
    logSupabaseDebug("🔄 [Fixed API] Fetching services...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await supabaseApiFixed.getServices(params);

      if (response.success) {
        logSupabaseDebug("✅ [Fixed API] Services loaded successfully");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch services",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [params?.category, params?.search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    ...state,
    refetch: fetchServices,
  };
}

// =====================================================
// PROFESSIONALS HOOKS - FIXED
// =====================================================

export function useSupabaseProfessionals(params?: {
  status?: string;
  search?: string;
}) {
  const [state, setState] = useState<UseSupabaseState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProfessionals = useCallback(async () => {
    logSupabaseDebug("🔄 [Fixed API] Fetching professionals...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await supabaseApiFixed.getProfessionals(params);

      if (response.success) {
        logSupabaseDebug("✅ [Fixed API] Professionals loaded successfully");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch professionals",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [params?.status, params?.search]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    ...state,
    refetch: fetchProfessionals,
  };
}

// =====================================================
// TRANSACTIONS HOOKS - FIXED
// =====================================================

export function useSupabaseTransactions(params?: {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const [state, setState] = useState<UseSupabaseState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchTransactions = useCallback(async () => {
    logSupabaseDebug("🔄 [Fixed API] Fetching transactions...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await supabaseApiFixed.getTransactions(params);

      if (response.success) {
        logSupabaseDebug("✅ [Fixed API] Transactions loaded successfully");
        setState({
          data: response.data || [],
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: [],
          loading: false,
          error: response.error || "Failed to fetch transactions",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [params?.type, params?.dateFrom, params?.dateTo]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    ...state,
    refetch: fetchTransactions,
  };
}
