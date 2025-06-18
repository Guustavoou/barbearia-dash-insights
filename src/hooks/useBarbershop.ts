
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

// Use the correct table name from the database schema
type Business = Database['public']['Tables']['businesses']['Row'];

export const useBarbershop = () => {
  const [barbershop, setBarbershop] = useState<Business | null>(null);
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
        .from('businesses') // Changed from barbershops to businesses
        .select('*')
        .eq('admin_email', user?.email) // Use admin_email instead of owner_id
        .single();

      if (error) {
        console.error('Error fetching business:', error);
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
