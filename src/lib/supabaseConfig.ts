// Configuração para debug do Supabase
export const SUPABASE_CONFIG = {
  // Flag para desabilitar Supabase durante debug (DESABILITADO devido a RLS recursion em business_users)
  ENABLE_SUPABASE: false,

  // Flag para usar dados mock como fallback
  USE_MOCK_FALLBACK: true,

  // Flag para desabilitar API tradicional quando Supabase está desabilitado (previne erros de fetch)
  DISABLE_TRADITIONAL_API_WHEN_SUPABASE_OFF: true,

  // Log level
  DEBUG_MODE: true,

  // Razão da desabilitação
  DISABLE_REASON:
    "RLS Policy Recursion em business_users - Execute as instruções SQL para corrigir",
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
