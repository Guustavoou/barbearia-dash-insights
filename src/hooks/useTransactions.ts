
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchTransactions();
    }
  }, [barbershop?.id]);

  const fetchTransactions = async () => {
    if (!barbershop?.id) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          clients(name),
          professionals(name),
          services(name)
        `)
        .eq('barbershop_id', barbershop.id)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<TransactionInsert, 'barbershop_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          barbershop_id: barbershop.id,
        })
        .select(`
          *,
          clients(name),
          professionals(name),
          services(name)
        `)
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        return null;
      }

      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clients(name),
          professionals(name),
          services(name)
        `)
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        return null;
      }

      setTransactions(prev => prev.map(transaction => 
        transaction.id === id ? data : transaction
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        return false;
      }

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};
