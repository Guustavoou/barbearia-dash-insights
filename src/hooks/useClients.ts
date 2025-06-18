
import { useState, useEffect } from 'react';
import { Client } from '@/lib/types';

interface UseClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: () => void;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    city: "São Paulo",
    status: "ativo",
    birthday: "1990-05-15",
    totalSpent: 450.00,
    visits: 8,
    lastVisit: "2024-01-15",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    notes: "Cliente preferencial",
    joinDate: "2023-06-01T10:00:00Z"
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 88888-8888",
    city: "Rio de Janeiro",
    status: "ativo",
    birthday: "1985-12-22",
    totalSpent: 680.00,
    visits: 12,
    lastVisit: "2024-01-20",
    createdAt: "2023-07-15T09:00:00Z",
    updatedAt: "2024-01-20T16:00:00Z",
    notes: "Gosta de cortes modernos",
    joinDate: "2023-07-15T09:00:00Z"
  }
];

export const useClients = (params: UseClientsParams = {}): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredClients = [...mockClients];

      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredClients = filteredClients.filter(client =>
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.phone.includes(params.search!)
        );
      }

      // Apply status filter
      if (params.status && params.status !== 'all') {
        filteredClients = filteredClients.filter(client => 
          client.status === params.status
        );
      }

      // Calculate pagination
      const limit = params.limit || 10;
      const page = params.page || 1;
      const total = filteredClients.length;
      const totalPagesCalc = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedClients = filteredClients.slice(startIndex, endIndex);

      setClients(paginatedClients);
      setTotalPages(totalPagesCalc);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    clients,
    loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchClients,
  };
};

export const useCreateClient = () => {
  const [loading, setLoading] = useState(false);

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalSpent: 0,
        visits: 0,
        joinDate: new Date().toISOString()
      };

      return { success: true, data: newClient };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { createClient, loading };
};

export const useUpdateClient = () => {
  const [loading, setLoading] = useState(false);

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedClient: Client = {
        ...clientData as Client,
        id,
        updatedAt: new Date().toISOString()
      };

      return { success: true, data: updatedClient };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { updateClient, loading };
};

export const useDeleteClient = () => {
  const [loading, setLoading] = useState(false);

  const deleteClient = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { deleteClient, loading };
};
