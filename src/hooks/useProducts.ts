
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBarbershop } from './useBarbershop';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { barbershop } = useBarbershop();

  useEffect(() => {
    if (barbershop?.id) {
      fetchProducts();
    }
  }, [barbershop?.id]);

  const fetchProducts = async () => {
    if (!barbershop?.id) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<ProductInsert, 'barbershop_id'>) => {
    if (!barbershop?.id) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          barbershop_id: barbershop.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return null;
      }

      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return null;
      }

      setProducts(prev => prev.map(product => 
        product.id === id ? data : product
      ));
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
