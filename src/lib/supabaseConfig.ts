// Configuração para integração completa com Supabase
export const SUPABASE_CONFIG = {
  // 🚀 SUPABASE TOTALMENTE HABILITADO - INTEGRAÇÃO COMPLETA ATIVA!
  ENABLE_SUPABASE: true,

  // Flag para usar dados mock como fallback em caso de erro
  USE_MOCK_FALLBACK: true,

  // Reabilitar API tradicional como fallback secundário
  DISABLE_TRADITIONAL_API_WHEN_SUPABASE_OFF: false,

  // Log level para monitoramento
  DEBUG_MODE: true,

  // Status da integração
  INTEGRATION_STATUS:
    "🎉 SUPABASE INTEGRADO COM SUCESSO - TODAS AS TELAS USANDO DADOS REAIS",
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
