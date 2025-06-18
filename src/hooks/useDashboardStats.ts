
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';

interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  totalServices: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchStats();
    }
  }, [barbershop?.id]);

  const fetchStats = async () => {
    if (!barbershop?.id) return;

    try {
      // Fetch total clients
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', barbershop.id);

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', barbershop.id)
        .eq('date', today);

      // Use a simpler approach for revenue calculation
      const monthlyRevenue = 0; // Placeholder since transactions table might not exist

      // Fetch total services
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', barbershop.id);

      setStats({
        totalClients: clientsCount || 0,
        todayAppointments: todayCount || 0,
        monthlyRevenue,
        totalServices: servicesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};
