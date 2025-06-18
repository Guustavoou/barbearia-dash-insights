
import { useState } from 'react';
import { clientsApi } from '@/lib/clientsApi';

export const useClients = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clientsApi.getClients();
      
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

  return { mutate, isLoading: loading, isPending: loading };
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

  return { mutate, isLoading: loading, isPending: loading };
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

  return { mutate, isLoading: loading, isPending: loading };
};

// Appointment hooks with consistent signatures
export const useAppointments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
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

export const useCreateAppointment = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (appointmentData: any) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useUpdateAppointment = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: any; data: any }) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useDeleteAppointment = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: any) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

// Professional hooks
export const useProfessionals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useCreateProfessional = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (professionalData: any) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useUpdateProfessional = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: any; data: any }) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useDeleteProfessional = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: any) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

// Services hooks
export const useServices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useCreateService = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (serviceData: any) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useUpdateService = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables: { id: string; data: any }) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

export const useDeleteService = (options?: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const mutate = async (id: string) => {
    setLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, isLoading: loading, isPending: loading };
};

// Products hooks
export const useProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Transactions hooks
export const useTransactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Dashboard stats hook
export const useDashboardStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        total_revenue: 0,
        total_expenses: 0,
        net_income: 0,
        profit_margin: 0,
        overview: {},
        data: []
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Financial stats hook with avgTicket alias
export const useFinancialStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        totalPayments: 0,
        approvedPayments: 0,
        totalAmount: 0,
        pendingAmount: 0,
        approvalRate: 0,
        averageTicket: 0,
        avgTicket: 0  // Adding this alias for compatibility
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Adding the missing useFinancialAnalysis hook
export const useFinancialAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        analysis: {},
        trends: [],
        insights: []
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Monthly revenue hook
export const useMonthlyRevenue = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        monthlyData: [],
        totalRevenue: 0,
        growth: 0
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Appointment trends hook
export const useAppointmentTrends = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        trends: [],
        growth: 0,
        totalAppointments: 0
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Business reports hook
export const useBusinessReports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        reports: [],
        summary: {},
        analytics: {}
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Adding missing client analysis hook
export const useClientAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setData({
        totalClients: 0,
        newClients: 0,
        retentionRate: 0,
        averageSpending: 0,
        topClients: [],
        segmentation: {}
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
