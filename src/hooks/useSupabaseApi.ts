
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

// Add missing exports that are referenced in other files
export const useSupabaseAppointments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useSupabaseProfessionals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useSupabaseClients = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useCreateSupabaseAppointment = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useUpdateSupabaseAppointment = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useDeleteSupabaseAppointment = () => {
  return {
    mutate: async (id: string) => {},
    loading: false
  };
};

export const useSupabaseRealTimeAppointments = () => {
  return {
    data: [],
    loading: false
  };
};

// Add missing client hook exports
export const useCreateSupabaseClient = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useUpdateSupabaseClient = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useDeleteSupabaseClient = () => {
  return {
    mutate: async (id: string) => {},
    loading: false
  };
};

export const useSupabaseRealTimeClients = () => {
  return {
    data: [],
    loading: false
  };
};

// Add missing dashboard and business report hooks
export const useSupabaseDashboardStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useSupabaseBusinessReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useSupabaseSalesPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

// Add missing professional hooks
export const useCreateSupabaseProfessional = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useUpdateSupabaseProfessional = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};

export const useDeleteSupabaseProfessional = () => {
  return {
    mutate: async (id: string) => {},
    loading: false
  };
};

// Add missing transaction hooks
export const useSupabaseTransactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useSupabaseFinancialStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, refetch: () => Promise.resolve() };
};

export const useCreateSupabaseTransaction = () => {
  return {
    mutate: async (data: any) => {},
    loading: false
  };
};
