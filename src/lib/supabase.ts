import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (can be auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          city?: string;
          status: "ativo" | "inativo";
          birthday?: string;
          total_spent?: number;
          visits?: number;
          last_visit?: string;
          created_at: string;
          updated_at: string;
          notes?: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          city?: string;
          status?: "ativo" | "inativo";
          birthday?: string;
          total_spent?: number;
          visits?: number;
          last_visit?: string;
          created_at?: string;
          updated_at?: string;
          notes?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          city?: string;
          status?: "ativo" | "inativo";
          birthday?: string;
          total_spent?: number;
          visits?: number;
          last_visit?: string;
          updated_at?: string;
          notes?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          professional_id: string;
          service_id: string;
          date: string;
          time: string;
          status: "agendado" | "concluido" | "cancelado" | "faltou";
          price: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          professional_id: string;
          service_id: string;
          date: string;
          time: string;
          status?: "agendado" | "concluido" | "cancelado" | "faltou";
          price: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          professional_id?: string;
          service_id?: string;
          date?: string;
          time?: string;
          status?: "agendado" | "concluido" | "cancelado" | "faltou";
          price?: number;
          notes?: string;
          updated_at?: string;
        };
      };
      professionals: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          specialty: string;
          commission_rate: number;
          status: "ativo" | "inativo";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          specialty: string;
          commission_rate?: number;
          status?: "ativo" | "inativo";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          specialty?: string;
          commission_rate?: number;
          status?: "ativo" | "inativo";
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description?: string;
          price: number;
          duration_minutes: number;
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          duration_minutes: number;
          category: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          duration_minutes?: number;
          category?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category: string;
          brand?: string;
          cost_price: number;
          price: number;
          current_stock: number;
          min_stock: number;
          status: "ativo" | "inativo";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          category: string;
          brand?: string;
          cost_price: number;
          price: number;
          current_stock?: number;
          min_stock?: number;
          status?: "ativo" | "inativo";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          category?: string;
          brand?: string;
          cost_price?: number;
          price?: number;
          current_stock?: number;
          min_stock?: number;
          status?: "ativo" | "inativo";
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          type: "receita" | "despesa";
          category: string;
          amount: number;
          payment_method?: string;
          appointment_id?: string;
          description?: string;
          date: string;
          status: "pendente" | "confirmado" | "cancelado";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "receita" | "despesa";
          category: string;
          amount: number;
          payment_method?: string;
          appointment_id?: string;
          description?: string;
          date: string;
          status?: "pendente" | "confirmado" | "cancelado";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "receita" | "despesa";
          category?: string;
          amount?: number;
          payment_method?: string;
          appointment_id?: string;
          description?: string;
          date?: string;
          status?: "pendente" | "confirmado" | "cancelado";
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
