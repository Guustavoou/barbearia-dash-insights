
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Professional = Database['public']['Tables']['professionals']['Row'];
type ProfessionalInsert = Database['public']['Tables']['professionals']['Insert'];
type ProfessionalUpdate = Database['public']['Tables']['professionals']['Update'];

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching professionals:', error);
      } else {
        setProfessionals(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProfessional = async (professionalData: ProfessionalInsert) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert(professionalData)
        .select()
        .single();

      if (error) {
        console.error('Error adding professional:', error);
        return null;
      }

      setProfessionals(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateProfessional = async (id: string, updates: ProfessionalUpdate) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating professional:', error);
        return null;
      }

      setProfessionals(prev => prev.map(professional => 
        professional.id === id ? data : professional
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting professional:', error);
        return false;
      }

      setProfessionals(prev => prev.filter(professional => professional.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    professionals,
    loading,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    refetch: fetchProfessionals,
  };
};
