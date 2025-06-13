export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          barbershop_id: string
          client_id: string
          created_at: string | null
          duration: number
          id: string
          notes: string | null
          price: number
          professional_id: string | null
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          barbershop_id: string
          client_id: string
          created_at?: string | null
          duration: number
          id?: string
          notes?: string | null
          price: number
          professional_id?: string | null
          service_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          barbershop_id?: string
          client_id?: string
          created_at?: string | null
          duration?: number
          id?: string
          notes?: string | null
          price?: number
          professional_id?: string | null
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      arquiteturas: {
        Row: {
          componentes: Json | null
          created_at: string
          descricao: string | null
          diagrama: string | null
          id: string
          nome: string
          projeto_id: string
          updated_at: string
          versao: string | null
        }
        Insert: {
          componentes?: Json | null
          created_at?: string
          descricao?: string | null
          diagrama?: string | null
          id?: string
          nome: string
          projeto_id: string
          updated_at?: string
          versao?: string | null
        }
        Update: {
          componentes?: Json | null
          created_at?: string
          descricao?: string | null
          diagrama?: string | null
          id?: string
          nome?: string
          projeto_id?: string
          updated_at?: string
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquiteturas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      barbershops: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          owner_id: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          barbershop_id: string
          city: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string
          join_date: string | null
          last_visit: string | null
          name: string
          notes: string | null
          phone: string | null
          profession: string | null
          status: string | null
          total_spent: number | null
          updated_at: string | null
          visits: number | null
        }
        Insert: {
          barbershop_id: string
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          last_visit?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          profession?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          visits?: number | null
        }
        Update: {
          barbershop_id?: string
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          profession?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          visits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes: {
        Row: {
          configuracao: Json | null
          created_at: string
          id: string
          projeto_id: string
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          configuracao?: Json | null
          created_at?: string
          id?: string
          projeto_id: string
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          configuracao?: Json | null
          created_at?: string
          id?: string
          projeto_id?: string
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          arquivo: string | null
          codigo_corrigido: string | null
          codigo_original: string | null
          created_at: string
          descricao: string | null
          id: string
          linha: number | null
          projeto_id: string
          severidade: string | null
          solucao: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo?: string | null
          codigo_corrigido?: string | null
          codigo_original?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          linha?: number | null
          projeto_id: string
          severidade?: string | null
          solucao?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo?: string | null
          codigo_corrigido?: string | null
          codigo_original?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          linha?: number | null
          projeto_id?: string
          severidade?: string | null
          solucao?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_custo: {
        Row: {
          ano: number
          created_at: string
          custo_atual: number
          custo_otimizado: number | null
          detalhes: Json | null
          id: string
          mes: string
          moeda: string
          projeto_id: string
        }
        Insert: {
          ano: number
          created_at?: string
          custo_atual: number
          custo_otimizado?: number | null
          detalhes?: Json | null
          id?: string
          mes: string
          moeda?: string
          projeto_id: string
        }
        Update: {
          ano?: number
          created_at?: string
          custo_atual?: number
          custo_otimizado?: number | null
          detalhes?: Json | null
          id?: string
          mes?: string
          moeda?: string
          projeto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metricas_custo_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_llm: {
        Row: {
          api_key: string | null
          created_at: string
          endpoint: string | null
          id: string
          is_ativo: boolean | null
          nome: string
          parametros: Json | null
          provedor: string
          self_hosted: boolean | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          is_ativo?: boolean | null
          nome: string
          parametros?: Json | null
          provedor: string
          self_hosted?: boolean | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          is_ativo?: boolean | null
          nome?: string
          parametros?: Json | null
          provedor?: string
          self_hosted?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          barbershop_id: string
          barcode: string | null
          category: string
          created_at: string | null
          id: string
          last_sale: string | null
          min_quantity: number | null
          name: string
          price: number
          quantity: number | null
          sales_count: number | null
          status: string | null
          supplier: string | null
          updated_at: string | null
        }
        Insert: {
          barbershop_id: string
          barcode?: string | null
          category: string
          created_at?: string | null
          id?: string
          last_sale?: string | null
          min_quantity?: number | null
          name: string
          price: number
          quantity?: number | null
          sales_count?: number | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
        }
        Update: {
          barbershop_id?: string
          barcode?: string | null
          category?: string
          created_at?: string | null
          id?: string
          last_sale?: string | null
          min_quantity?: number | null
          name?: string
          price?: number
          quantity?: number | null
          sales_count?: number | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          avatar_url: string | null
          barbershop_id: string
          bio: string | null
          cancelled_services: number | null
          certifications: string[] | null
          commission: number | null
          completed_services: number | null
          created_at: string | null
          email: string | null
          experience: number | null
          hired_date: string | null
          id: string
          is_owner: boolean | null
          name: string
          phone: string | null
          rating: number | null
          specialties: string[] | null
          status: string | null
          total_revenue: number | null
          total_services: number | null
          updated_at: string | null
          work_days: string[] | null
          work_hours_end: string | null
          work_hours_start: string | null
        }
        Insert: {
          avatar_url?: string | null
          barbershop_id: string
          bio?: string | null
          cancelled_services?: number | null
          certifications?: string[] | null
          commission?: number | null
          completed_services?: number | null
          created_at?: string | null
          email?: string | null
          experience?: number | null
          hired_date?: string | null
          id?: string
          is_owner?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          total_revenue?: number | null
          total_services?: number | null
          updated_at?: string | null
          work_days?: string[] | null
          work_hours_end?: string | null
          work_hours_start?: string | null
        }
        Update: {
          avatar_url?: string | null
          barbershop_id?: string
          bio?: string | null
          cancelled_services?: number | null
          certifications?: string[] | null
          commission?: number | null
          completed_services?: number | null
          created_at?: string | null
          email?: string | null
          experience?: number | null
          hired_date?: string | null
          id?: string
          is_owner?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          total_revenue?: number | null
          total_services?: number | null
          updated_at?: string | null
          work_days?: string[] | null
          work_hours_end?: string | null
          work_hours_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          tipo_usuario: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          tipo_usuario?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          tipo_usuario?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          id: string
          nome: string
          repositorio_url: string | null
          status: string
          supabase_key: string | null
          supabase_url: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          nome: string
          repositorio_url?: string | null
          status?: string
          supabase_key?: string | null
          supabase_url?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          nome?: string
          repositorio_url?: string | null
          status?: string
          supabase_key?: string | null
          supabase_url?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          categoria: string | null
          conteudo: string
          created_at: string
          id: string
          modelo_id: string | null
          projeto_id: string | null
          tags: string[] | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          conteudo: string
          created_at?: string
          id?: string
          modelo_id?: string | null
          projeto_id?: string | null
          tags?: string[] | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          modelo_id?: string | null
          projeto_id?: string | null
          tags?: string[] | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "modelos_llm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      recomendacoes_custo: {
        Row: {
          created_at: string
          descricao: string
          economia_potencial: number
          id: string
          impacto: string
          projeto_id: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          economia_potencial: number
          id?: string
          impacto: string
          projeto_id: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          economia_potencial?: number
          id?: string
          impacto?: string
          projeto_id?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recomendacoes_custo_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          average_rating: number | null
          barbershop_id: string
          category: string
          commission: number | null
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          popularity: number | null
          price: number
          professionals: string[] | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          barbershop_id: string
          category: string
          commission?: number | null
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          name: string
          popularity?: number | null
          price: number
          professionals?: string[] | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          barbershop_id?: string
          category?: string
          commission?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          popularity?: number | null
          price?: number
          professionals?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          barbershop_id: string
          category: string
          client_id: string | null
          created_at: string | null
          description: string
          id: string
          payment_method: string | null
          professional_id: string | null
          recurring: boolean | null
          service_id: string | null
          status: string | null
          tags: string[] | null
          transaction_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          barbershop_id: string
          category: string
          client_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          payment_method?: string | null
          professional_id?: string | null
          recurring?: boolean | null
          service_id?: string | null
          status?: string | null
          tags?: string[] | null
          transaction_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          barbershop_id?: string
          category?: string
          client_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          payment_method?: string | null
          professional_id?: string | null
          recurring?: boolean | null
          service_id?: string | null
          status?: string | null
          tags?: string[] | null
          transaction_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_barbershop_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
