
import { useState } from 'react';
import { clientsApi } from '@/lib/clientsApi';

export const useClients = (params?: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clientsApi.getClients(params);
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch clients');
        return;
      }
      
      setData(result.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useCreateClient = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (clientData: any) => {
    setLoading(true);
    try {
      const result = await clientsApi.addClient(clientData);
      if (result.success && options?.onSuccess) {
        options.onSuccess();
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading };
};

export const useUpdateClient = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      const result = await clientsApi.updateClient(variables.id, variables.data);
      if (result.success && options?.onSuccess) {
        options.onSuccess();
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading };
};

export const useDeleteClient = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      const result = await clientsApi.deleteClient(id);
      if (result.success && options?.onSuccess) {
        options.onSuccess();
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading };
};
