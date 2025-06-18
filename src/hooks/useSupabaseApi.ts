
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
