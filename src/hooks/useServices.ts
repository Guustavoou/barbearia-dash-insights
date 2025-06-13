
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];
type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchServices();
    }
  }, [barbershop?.id]);

  const fetchServices = async () => {
    if (!barbershop?.id) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (serviceData: Omit<ServiceInsert, 'barbershop_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          barbershop_id: barbershop.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding service:', error);
        return null;
      }

      setServices(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateService = async (id: string, updates: ServiceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        return null;
      }

      setServices(prev => prev.map(service => 
        service.id === id ? data : service
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        return false;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    services,
    loading,
    addService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};
