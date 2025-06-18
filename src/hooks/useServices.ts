
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';

type Service = {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ServiceInsert = {
  business_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  is_active?: boolean;
};

type ServiceUpdate = Partial<Omit<ServiceInsert, 'business_id'>>;

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
        .eq('business_id', barbershop.id)
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

  const addService = async (serviceData: Omit<ServiceInsert, 'business_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          business_id: barbershop.id,
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
