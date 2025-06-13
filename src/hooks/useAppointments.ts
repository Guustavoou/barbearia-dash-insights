
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

type Appointment = Database['public']['Tables']['appointments']['Row'];
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
          clients(name, phone),
          professionals(name),
          services(name, price)
        `)
        .eq('barbershop_id', barbershop.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

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

  const addAppointment = async (appointmentData: Omit<AppointmentInsert, 'barbershop_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          barbershop_id: barbershop.id,
        })
        .select(`
          *,
          clients(name, phone),
          professionals(name),
          services(name, price)
        `)
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        return null;
      }

      setAppointments(prev => [...prev, data].sort((a, b) => {
        const dateCompare = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        if (dateCompare === 0) {
          return a.appointment_time.localeCompare(b.appointment_time);
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
          clients(name, phone),
          professionals(name),
          services(name, price)
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
