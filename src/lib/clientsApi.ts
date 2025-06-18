
import { supabase } from '@/integrations/supabase/client';

// Simplified client type based on actual database schema
export interface NeonClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  birth_date?: string;
  created_at?: string;
  last_visit?: string;
  status?: string;
  total_spent?: number;
  visits?: number;
  business_id?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ClientsApiResponse = ApiResponse<NeonClient | NeonClient[]>;

export const ClientsAPI = {
  async getAll(businessId?: string): Promise<ClientsApiResponse> {
    try {
      console.log('🔍 [Clients API] Fetching all clients...');
      
      let query = supabase.from('clients').select('*');
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('❌ [Clients API] Error fetching clients:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const clients: NeonClient[] = (data || []).map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        city: client.city,
        birth_date: client.birth_date,
        created_at: client.created_at,
        last_visit: client.last_visit,
        status: client.status,
        total_spent: client.total_spent,
        visits: 0, // Default value since this might not be in the schema
        business_id: client.business_id,
        notes: client.notes
      }));

      console.log('✅ [Clients API] Successfully fetched clients:', clients.length);
      return {
        success: true,
        data: clients
      };

    } catch (error: any) {
      console.error('❌ [Clients API] Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      };
    }
  },

  async getById(id: string): Promise<ClientsApiResponse> {
    try {
      console.log('🔍 [Clients API] Fetching client by ID:', id);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ [Clients API] Error fetching client:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const client: NeonClient = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        birth_date: data.birth_date,
        created_at: data.created_at,
        last_visit: data.last_visit,
        status: data.status,
        total_spent: data.total_spent,
        visits: 0, // Default value
        business_id: data.business_id,
        notes: data.notes
      };

      console.log('✅ [Clients API] Successfully fetched client');
      return {
        success: true,
        data: client
      };

    } catch (error: any) {
      console.error('❌ [Clients API] Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch client'
      };
    }
  },

  async create(clientData: Partial<NeonClient>): Promise<ClientsApiResponse> {
    try {
      console.log('🔍 [Clients API] Creating new client...');
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name || '',
          email: clientData.email,
          phone: clientData.phone,
          city: clientData.city,
          birth_date: clientData.birth_date,
          status: clientData.status || 'active',
          business_id: clientData.business_id,
          notes: clientData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [Clients API] Error creating client:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const client: NeonClient = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        birth_date: data.birth_date,
        created_at: data.created_at,
        last_visit: data.last_visit,
        status: data.status,
        total_spent: data.total_spent,
        visits: 0, // Default value
        business_id: data.business_id,
        notes: data.notes
      };

      console.log('✅ [Clients API] Successfully created client');
      return {
        success: true,
        data: client
      };

    } catch (error: any) {
      console.error('❌ [Clients API] Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create client'
      };
    }
  },

  async update(id: string, updates: Partial<NeonClient>): Promise<ClientsApiResponse> {
    try {
      console.log('🔍 [Clients API] Updating client:', id);
      
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          city: updates.city,
          birth_date: updates.birth_date,
          status: updates.status,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ [Clients API] Error updating client:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const client: NeonClient = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        birth_date: data.birth_date,
        created_at: data.created_at,
        last_visit: data.last_visit,
        status: data.status,
        total_spent: data.total_spent,
        visits: 0, // Default value
        business_id: data.business_id,
        notes: data.notes
      };

      console.log('✅ [Clients API] Successfully updated client');
      return {
        success: true,
        data: client
      };

    } catch (error: any) {
      console.error('❌ [Clients API] Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update client'
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔍 [Clients API] Deleting client:', id);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ [Clients API] Error deleting client:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ [Clients API] Successfully deleted client');
      return {
        success: true,
        data: true
      };

    } catch (error: any) {
      console.error('❌ [Clients API] Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      };
    }
  }
};
