// Configuração para debug do Supabase
export const SUPABASE_CONFIG = {
  // Flag para desabilitar Supabase durante debug (temporariamente false para evitar erros)
  ENABLE_SUPABASE: false,

  // Flag para usar dados mock como fallback
  USE_MOCK_FALLBACK: true,

  // Log level
  DEBUG_MODE: true,
};

export function logSupabaseDebug(message: string, data?: any) {
  if (SUPABASE_CONFIG.DEBUG_MODE) {
    console.log(`🔍 [Supabase Debug] ${message}`, data || "");
  }
}

export function logSupabaseError(message: string, error?: any) {
  console.error(`❌ [Supabase Error] ${message}`, error || "");
}

export function logSupabaseSuccess(message: string, data?: any) {
  if (SUPABASE_CONFIG.DEBUG_MODE) {
    console.log(`✅ [Supabase Success] ${message}`, data || "");
  }
}
