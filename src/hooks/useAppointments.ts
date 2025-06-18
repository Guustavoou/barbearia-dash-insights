
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

// Use the correct table name from the database schema
type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  clients?: {
    name: string;
    phone: string;
  };
  services?: {
    name: string;
    price: number;
  };
  professionals?: {
    name: string;
  };
};

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchAppointments();
    }
  }, [barbershop?.id]);

  const fetchAppointments = async () => {
    if (!barbershop?.id) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients!inner(name, phone),
          professionals(name),
          services!inner(name, price)
        `)
        .eq('business_id', barbershop.id) // Changed from barbershop_id to business_id
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<AppointmentInsert, 'business_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          business_id: barbershop.id, // Changed from barbershop_id to business_id
        })
        .select(`
          *,
          clients!inner(name, phone),
          professionals(name),
          services!inner(name, price)
        `)
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        return null;
      }

      setAppointments(prev => [...prev, data].sort((a, b) => {
        const dateCompare = new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
        if (dateCompare === 0) {
          return (a.start_time || '').localeCompare(b.start_time || '');
        }
        return dateCompare;
      }));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateAppointment = async (id: string, updates: AppointmentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clients!inner(name, phone),
          professionals(name),
          services!inner(name, price)
        `)
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return null;
      }

      setAppointments(prev => prev.map(appointment => 
        appointment.id === id ? data : appointment
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        return false;
      }

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  };
};
