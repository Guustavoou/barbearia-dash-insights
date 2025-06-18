
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';

type Transaction = {
  id: string;
  business_id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  status?: string;
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
  clients?: {
    name: string;
  };
  professionals?: {
    name: string;
  };
  services?: {
    name: string;
  };
};

type TransactionInsert = {
  business_id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  status?: string;
  payment_method?: string;
};

type TransactionUpdate = Partial<Omit<TransactionInsert, 'business_id'>>;

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
      // First try to get from payments table, fallback to simple structure if needed
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('business_id', barbershop.id)
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        // Set empty array on error
        setTransactions([]);
      } else {
        // Transform payments data to match Transaction type
        const transformedData = (data || []).map(payment => ({
          id: payment.id,
          business_id: payment.business_id,
          description: `Payment for booking ${payment.booking_id}`,
          amount: payment.amount,
          type: 'receita',
          category: 'payment',
          date: payment.payment_date,
          status: payment.status,
          payment_method: payment.payment_method,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
        }));
        setTransactions(transformedData);
      }
    } catch (error) {
      console.error('Error:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<TransactionInsert, 'business_id'>) => {
    if (!barbershop?.id) return null;

    try {
      // Add to payments table
      const { data, error } = await supabase
        .from('payments')
        .insert({
          business_id: barbershop.id,
          amount: transactionData.amount,
          payment_method: transactionData.payment_method || 'cash',
          status: transactionData.status || 'completed',
          payment_date: transactionData.date,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        return null;
      }

      // Transform and add to state
      const transformedData = {
        id: data.id,
        business_id: data.business_id,
        description: `Payment for booking ${data.booking_id}`,
        amount: data.amount,
        type: 'receita',
        category: 'payment',
        date: data.payment_date,
        status: data.status,
        payment_method: data.payment_method,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setTransactions(prev => [transformedData, ...prev]);
      return transformedData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount: updates.amount,
          payment_method: updates.payment_method,
          status: updates.status,
          payment_date: updates.date,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        return null;
      }

      const transformedData = {
        id: data.id,
        business_id: data.business_id,
        description: `Payment for booking ${data.booking_id}`,
        amount: data.amount,
        type: 'receita',
        category: 'payment',
        date: data.payment_date,
        status: data.status,
        payment_method: data.payment_method,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setTransactions(prev => prev.map(transaction => 
        transaction.id === id ? transformedData : transaction
      ));
      return transformedData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
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
