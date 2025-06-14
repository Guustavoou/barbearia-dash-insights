
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Client } from '@/lib/types'; // Use our local type
import { Database } from '@/integrations/supabase/types';

type DatabaseClient = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// Function to convert database client to our local Client type
const convertToLocalClient = (dbClient: DatabaseClient): Client => ({
  id: dbClient.id,
  name: dbClient.name,
  email: dbClient.email,
  phone: dbClient.phone,
  city: dbClient.city,
  last_visit: dbClient.last_visit,
  total_spent: dbClient.total_spent || 0,
  status: (dbClient.status as "ativo" | "inativo") || "ativo", // Type assertion with fallback
  join_date: dbClient.join_date,
  visits: dbClient.visits || 0,
  notes: dbClient.notes,
  cpf: dbClient.cpf,
  profession: dbClient.profession,
  barbershop_id: dbClient.barbershop_id,
  created_at: dbClient.created_at || '',
  updated_at: dbClient.updated_at || '',
});

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
        // Convert database clients to our local Client type
        const convertedClients = (data || []).map(convertToLocalClient);
        setClients(convertedClients);
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

      const convertedClient = convertToLocalClient(data);
      setClients(prev => [convertedClient, ...prev]);
      return convertedClient;
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

      const convertedClient = convertToLocalClient(data);
      setClients(prev => prev.map(client => 
        client.id === id ? convertedClient : client
      ));
      return convertedClient;
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
