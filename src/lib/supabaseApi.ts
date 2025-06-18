import { supabase } from './supabase';
import { NeonClient, ApiResponse } from './clientsApi';
import { 
  DashboardStats, 
  Client, 
  Service, 
  Professional, 
  Appointment, 
  Product, 
  Transaction 
} from './types';

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

interface SearchParams extends PaginationParams {
  search?: string;
  status?: string;
  category?: string;
  is_active?: boolean;
}

export const supabaseAPI = {
  // Dashboard Stats
  async getDashboardStats(businessId?: string): Promise<ApiResponse<DashboardStats>> {
    try {
      console.log('🔍 [Supabase API] Fetching dashboard stats...');

      const [
        { count: totalClients },
        { count: totalAppointments },
        { count: totalServices },
        { count: totalProfessionals }
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('professionals').select('*', { count: 'exact', head: true })
      ]);

      const today = new Date().toISOString().split('T')[0];
      const { count: todayAppointments } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('booking_date', today);

      const stats: DashboardStats = {
        totalClients: totalClients || 0,
        totalAppointments: totalAppointments || 0,
        totalServices: totalServices || 0,
        totalProfessionals: totalProfessionals || 0,
        todayAppointments: todayAppointments || 0,
        monthlyRevenue: 0,
        pendingAppointments: 0,
        completedAppointments: 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  // Clients CRUD
  async createClient(clientData: Omit<NeonClient, 'createdAt' | 'id' | 'visits' | 'totalSpent' | 'visitCount' | 'avgInterval'>): Promise<ApiResponse<NeonClient>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          city: clientData.city,
          birth_date: clientData.birth_date,
          notes: clientData.notes,
          business_id: clientData.business_id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          birth_date: data.birth_date,
          notes: data.notes,
          business_id: data.business_id,
          created_at: data.created_at,
          status: data.status,
          total_spent: data.total_spent,
          visits: 0
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create client'
      };
    }
  },

  async updateClient(id: string, updates: Partial<NeonClient>): Promise<ApiResponse<NeonClient>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          city: updates.city,
          birth_date: updates.birth_date,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          birth_date: data.birth_date,
          notes: data.notes,
          business_id: data.business_id,
          created_at: data.created_at,
          status: data.status,
          total_spent: data.total_spent,
          visits: 0
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update client'
      };
    }
  },

  async deleteClient(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      };
    }
  },

  async getClients(params?: SearchParams): Promise<ApiResponse<{ data: Client[]; pagination: any }>> {
    try {
      let query = supabase.from('clients').select('*', { count: 'exact' });

      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      };
    }
  },

  // Services CRUD with corrected property names
  async getServices(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<ApiResponse<{ data: Service[]; pagination: any }>> {
    try {
      let query = supabase.from('services').select('*', { count: 'exact' });

      if (params?.is_active !== undefined) {
        query = query.eq('is_active', params.is_active);
      }

      if (params?.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch services'
      };
    }
  },

  async createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration_minutes: serviceData.duration,
          category: serviceData.category,
          is_active: serviceData.isActive
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Service
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create service'
      };
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          duration_minutes: updates.duration,
          category: updates.category,
          is_active: updates.isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Service
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update service'
      };
    }
  },

  async deleteService(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete service'
      };
    }
  },

  // Professionals CRUD with corrected property names
  async getProfessionals(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    status?: string;
  }): Promise<ApiResponse<{ data: Professional[]; pagination: any }>> {
    try {
      let query = supabase.from('professionals').select('*', { count: 'exact' });

      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch professionals'
      };
    }
  },

  async createProfessional(professionalData: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Professional>> {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert({
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone,
          specialty: professionalData.specialty,
          commission_rate: professionalData.commissionRate,
          status: professionalData.status
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Professional
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create professional'
      };
    }
  },

  async updateProfessional(id: string, updates: Partial<Professional>): Promise<ApiResponse<Professional>> {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          specialty: updates.specialty,
          commission_rate: updates.commissionRate,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Professional
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update professional'
      };
    }
  },

  async deleteProfessional(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete professional'
      };
    }
  },

  // Appointments CRUD
  async getAppointments(params?: SearchParams): Promise<ApiResponse<{ data: Appointment[]; pagination: any }>> {
    try {
      let query = supabase.from('appointments').select('*', { count: 'exact' });

      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch appointments'
      };
    }
  },

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: appointmentData.clientId,
          professional_id: appointmentData.professionalId,
          service_id: appointmentData.serviceId,
          date: appointmentData.date,
          time: appointmentData.time,
          status: appointmentData.status,
          price: appointmentData.price,
          notes: appointmentData.notes
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Appointment
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create appointment'
      };
    }
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          client_id: updates.clientId,
          professional_id: updates.professionalId,
          service_id: updates.serviceId,
          date: updates.date,
          time: updates.time,
          status: updates.status,
          price: updates.price,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Appointment
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update appointment'
      };
    }
  },

  async deleteAppointment(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete appointment'
      };
    }
  },

  // Products CRUD with corrected property names
  async getProducts(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<ApiResponse<{ data: Product[]; pagination: any }>> {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (params?.is_active !== undefined) {
        query = query.eq('isActive', params.is_active);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch products'
      };
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          sku: productData.sku,
          category: productData.category,
          brand: productData.brand,
          cost_price: productData.costPrice,
          price: productData.price,
          current_stock: productData.currentStock,
          min_stock: productData.minStock,
          status: productData.status
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create product'
      };
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          sku: updates.sku,
          category: updates.category,
          brand: updates.brand,
          cost_price: updates.costPrice,
          price: updates.price,
          current_stock: updates.currentStock,
          min_stock: updates.minStock,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update product'
      };
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete product'
      };
    }
  },

  // Transactions CRUD
  async getTransactions(params?: SearchParams): Promise<ApiResponse<{ data: Transaction[]; pagination: any }>> {
    try {
      let query = supabase.from('transactions').select('*', { count: 'exact' });

      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total: count || 0
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions'
      };
    }
  },

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: transactionData.type,
          category: transactionData.category,
          amount: transactionData.amount,
          payment_method: transactionData.paymentMethod,
          appointment_id: transactionData.appointmentId,
          description: transactionData.description,
          date: transactionData.date,
          status: transactionData.status
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Transaction
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create transaction'
      };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          type: updates.type,
          category: updates.category,
          amount: updates.amount,
          payment_method: updates.paymentMethod,
          appointment_id: updates.appointmentId,
          description: updates.description,
          date: updates.date,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Transaction
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update transaction'
      };
    }
  },

  async deleteTransaction(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete transaction'
      };
    }
  },

  // Simplified stats method
  async getAdvancedStats(): Promise<ApiResponse<any>> {
    try {
      // Return simple mock data to avoid complex queries
      const stats = {
        totalRevenue: 0,
        totalClients: 0,
        averageTicket: 0,
        growthRate: 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch advanced stats'
      };
    }
  }
};
