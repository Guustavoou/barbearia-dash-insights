// Tenant Configuration System
// Manages multi-tenant isolation and business context

// Default business IDs (matching the database)
const DEFAULT_BUSINESS_ID = "550e8400-e29b-41d4-a716-446655440000"; // Salão Premium
const SECONDARY_BUSINESS_ID = "550e8400-e29b-41d4-a716-446655440001"; // Barbearia Elite

// Get current business ID from localStorage or default
export const getCurrentBusinessId = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_BUSINESS_ID;
  }

  const stored = localStorage.getItem("currentBusinessId");
  if (stored && stored.trim() !== "") {
    return stored;
  }

  // Set default business ID if none exists
  localStorage.setItem("currentBusinessId", DEFAULT_BUSINESS_ID);
  return DEFAULT_BUSINESS_ID;
};

// Set current business ID
export const setCurrentBusinessId = (businessId: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentBusinessId", businessId);
    console.log(`🏢 Tenant switched to business: ${businessId}`);
  }
};

// Get available businesses
export const getAvailableBusinesses = () => [
  {
    id: DEFAULT_BUSINESS_ID,
    name: "Salão Premium",
    type: "salon",
  },
  {
    id: SECONDARY_BUSINESS_ID,
    name: "Barbearia Elite",
    type: "barbershop",
  },
];

// Switch between businesses (for testing)
export const switchToBusiness = (
  businessName: "salon" | "barbershop",
): void => {
  const businessId =
    businessName === "salon" ? DEFAULT_BUSINESS_ID : SECONDARY_BUSINESS_ID;
  setCurrentBusinessId(businessId);

  // Trigger a page reload to update all data
  if (typeof window !== "undefined") {
    window.location.reload();
  }
};

// Add business_id filter to Supabase queries
export const addTenantFilter = (query: any) => {
  const businessId = getCurrentBusinessId();
  console.log(`🔍 Adding tenant filter: business_id = ${businessId}`);
  return query.eq("business_id", businessId);
};

// Add business_id to data before inserting
export const addTenantToData = (data: any) => {
  const businessId = getCurrentBusinessId();
  const tenantData = {
    ...data,
    business_id: businessId,
  };
  console.log(
    `📝 Adding tenant to data: business_id = ${businessId}`,
    tenantData,
  );
  return tenantData;
};

// Debug logging for tenant operations
export const logTenantOperation = (
  operation: string,
  table: string,
  data?: any,
) => {
  const businessId = getCurrentBusinessId();
  console.log(`🏢 [Tenant ${businessId}] ${operation} on ${table}`, data);
};

// Debug logging for tenant filtering (used by supabaseApi)
export const logTenantDebug = (message: string, data?: any) => {
  const businessId = getCurrentBusinessId();
  console.log(`🔍 [Tenant ${businessId}] ${message}`, data || "");
};

// Verify tenant isolation
export const verifyTenantIsolation = async (supabaseClient: any) => {
  const businessId = getCurrentBusinessId();
  console.log(`🔍 Verifying tenant isolation for business: ${businessId}`);

  try {
    // Check if business exists
    const { data: business, error: businessError } = await supabaseClient
      .from("businesses")
      .select("id, name")
      .eq("id", businessId)
      .single();

    if (businessError) {
      console.error("❌ Business not found:", businessError);
      return false;
    }

    console.log(`✅ Business found: ${business.name}`);

    // Check data counts for this business
    const tables = [
      "clients",
      "appointments",
      "services",
      "professionals",
      "products",
      "transactions",
    ];

    for (const table of tables) {
      const { count, error } = await supabaseClient
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId);

      if (error) {
        console.error(`❌ Error checking ${table}:`, error);
      } else {
        console.log(`📊 ${table}: ${count} records for business ${businessId}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Tenant isolation verification failed:", error);
    return false;
  }
};

// Initialize tenant system
export const initializeTenantSystem = () => {
  const businessId = getCurrentBusinessId();
  console.log(`🚀 Tenant system initialized with business: ${businessId}`);

  // Store in global context for debugging
  if (typeof window !== "undefined") {
    (window as any).__UNCLIC_TENANT__ = {
      currentBusinessId: businessId,
      availableBusinesses: getAvailableBusinesses(),
      switch: switchToBusiness,
      verify: verifyTenantIsolation,
    };
  }

  return businessId;
};

// Export default business ID for use in components
export { DEFAULT_BUSINESS_ID, SECONDARY_BUSINESS_ID };
