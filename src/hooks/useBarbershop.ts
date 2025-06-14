
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type Barbershop = Database['public']['Tables']['barbershops']['Row'];

export const useBarbershop = () => {
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBarbershop();
    }
  }, [user]);

  const fetchBarbershop = async () => {
    try {
      const { data, error } = await supabase
        .from('barbershops')
        .select('*')
        .eq('owner_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching barbershop:', error);
      } else {
        setBarbershop(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { barbershop, loading, refetch: fetchBarbershop };
};
