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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
