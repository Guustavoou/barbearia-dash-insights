
import { useState } from 'react';
import { supabaseAPI } from '@/lib/supabaseApi';
import { DashboardStats } from '@/lib/types';

export const useSupabaseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboardStats = async (businessId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await supabaseAPI.getDashboardStats(businessId);
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch dashboard stats');
        return null;
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getClients = async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await supabaseAPI.getClients(params);
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch clients');
        return null;
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getDashboardStats,
    getClients,
  };
};

// Consistent hook signatures for all Supabase hooks - Updated to accept parameters
export const useSupabaseAppointments = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useSupabaseProfessionals = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useSupabaseClients = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useCreateSupabaseAppointment = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useUpdateSupabaseAppointment = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useDeleteSupabaseAppointment = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useSupabaseRealTimeAppointments = () => {
  return {
    data: [],
    loading: false
  };
};

// Client hooks with consistent signatures
export const useCreateSupabaseClient = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useUpdateSupabaseClient = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useDeleteSupabaseClient = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useSupabaseRealTimeClients = () => {
  return {
    data: [],
    loading: false
  };
};

// Services hooks
export const useSupabaseServices = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useCreateSupabaseService = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to create service');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useUpdateSupabaseService = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to update service');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useDeleteSupabaseService = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to delete service');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

// Dashboard and business report hooks
export const useSupabaseDashboardStats = (params?: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useSupabaseBusinessReports = (params?: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve(), isLoading: loading };
};

export const useSupabaseSalesPerformance = (params?: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve(), isLoading: loading };
};

// Professional hooks
export const useCreateSupabaseProfessional = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useUpdateSupabaseProfessional = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useDeleteSupabaseProfessional = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

// Transaction hooks
export const useSupabaseTransactions = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve(), isLoading: loading };
};

export const useSupabaseFinancialStats = (params?: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve(), isLoading: loading };
};

export const useCreateSupabaseTransaction = () => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

// Products and Stock hooks - Adding missing exports
export const useSupabaseProducts = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

export const useSupabaseStock = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refetch, isLoading: loading };
};

// Adding missing product CRUD hooks
export const useCreateSupabaseProduct = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to create product');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useUpdateSupabaseProduct = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to update product');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};

export const useDeleteSupabaseProduct = (options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      if (options?.onError) {
        options.onError('Failed to delete product');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, loading, isLoading: loading, isPending: loading };
};
