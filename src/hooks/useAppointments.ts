
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';

// Use the bookings table which exists in the schema
type Appointment = {
  id: string;
  business_id: string;
  client_id: string;
  employee_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  price: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
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

type AppointmentInsert = {
  business_id: string;
  client_id: string;
  employee_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status?: string;
  price: number;
  notes?: string;
};

type AppointmentUpdate = Partial<Omit<AppointmentInsert, 'business_id'>>;

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
        .from('bookings')
        .select(`
          *,
          clients!inner(name, phone),
          professionals(name),
          services!inner(name, price)
        `)
        .eq('business_id', barbershop.id)
        .order('booking_date', { ascending: true })
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
        .from('bookings')
        .insert({
          ...appointmentData,
          business_id: barbershop.id,
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
        const dateCompare = new Date(a.booking_date || '').getTime() - new Date(b.booking_date || '').getTime();
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
        .from('bookings')
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
        .from('bookings')
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
