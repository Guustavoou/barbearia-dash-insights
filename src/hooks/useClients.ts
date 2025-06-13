
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchClients();
    }
  }, [barbershop?.id]);

  const fetchClients = async () => {
    if (!barbershop?.id) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<ClientInsert, 'barbershop_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          barbershop_id: barbershop.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding client:', error);
        return null;
      }

      setClients(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        return null;
      }

      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        return false;
      }

      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
