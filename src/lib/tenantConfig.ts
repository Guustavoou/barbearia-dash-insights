// Configuração global de tenant para isolamento multi-tenant
export const TENANT_CONFIG = {
  // Business ID atual (em produção, isso viria da autenticação)
  CURRENT_BUSINESS_ID: "2a270416-d688-4d5f-8f4e-923225371071",

  // Flag para habilitar isolamento por tenant
  ENABLE_TENANT_ISOLATION: true,

  // Configurações de debug
  DEBUG_TENANT: true,
};

export function getCurrentBusinessId(): string {
  // Em produção, isso viria do contexto de autenticação
  // Por agora, retorna o business_id fixo para desenvolvimento
  return TENANT_CONFIG.CURRENT_BUSINESS_ID;
}

export function logTenantDebug(message: string, data?: any) {
  if (TENANT_CONFIG.DEBUG_TENANT) {
    console.log(`🏢 [Tenant] ${message}`, data || "");
  }
}

export function logTenantError(message: string, error?: any) {
  console.error(`❌ [Tenant Error] ${message}`, error || "");
}

export function logTenantSuccess(message: string, data?: any) {
  if (TENANT_CONFIG.DEBUG_TENANT) {
    console.log(`✅ [Tenant Success] ${message}`, data || "");
  }
}

// Função para adicionar filtro de tenant a queries
export function addTenantFilter(query: any, businessId?: string): any {
  if (!TENANT_CONFIG.ENABLE_TENANT_ISOLATION) {
    return query;
  }

  const currentBusinessId = businessId || getCurrentBusinessId();
  logTenantDebug(`Aplicando filtro de tenant: ${currentBusinessId}`);

  return query.eq("business_id", currentBusinessId);
}

// Função para adicionar business_id aos dados de inserção
export function addTenantToData(data: any, businessId?: string): any {
  if (!TENANT_CONFIG.ENABLE_TENANT_ISOLATION) {
    return data;
  }

  const currentBusinessId = businessId || getCurrentBusinessId();
  logTenantDebug(`Adicionando business_id aos dados: ${currentBusinessId}`);

  return {
    ...data,
    business_id: currentBusinessId,
  };
}
