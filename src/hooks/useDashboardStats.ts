
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
        .eq('barbershop_id', barbershop.id);

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('barbershop_id', barbershop.id)
        .eq('appointment_date', today);

      // Fetch monthly revenue
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('barbershop_id', barbershop.id)
        .eq('type', 'receita')
        .gte('transaction_date', `${currentMonth}-01`)
        .lt('transaction_date', `${currentMonth}-32`);

      const monthlyRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

      // Fetch total services
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('barbershop_id', barbershop.id);

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
