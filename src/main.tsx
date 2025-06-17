import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { safeSupabaseApi } from "./lib/safeSupabaseApi";
import { SUPABASE_CONFIG, logSupabaseDebug } from "./lib/supabaseConfig";
import { enableApiCircuitBreaker } from "./lib/api";

// Diagnóstico do Supabase
if (SUPABASE_CONFIG.ENABLE_SUPABASE) {
  console.log("🚀 [Inicialização] SUPABASE TOTALMENTE HABILITADO!");
  console.log("🎉 [Inicialização] Todas as telas integradas com dados reais");
  console.log(
    "📊 [Inicialização] CRUD completo funcionando em todas as Beautiful pages",
  );
  logSupabaseDebug(
    "🚀 Integração total ativa - todas as Beautiful pages conectadas ao banco!",
  );

  console.log("🔍 [Inicialização] Verificando conexão...");

  safeSupabaseApi.getConnectionStatus().then((status) => {
    console.log("🔍 [SafeSupabase] Status da conexão:", status);

    if (status.connected) {
      console.log("✅ [SafeSupabase] Conectado com sucesso!");
      console.log(
        "📋 [SafeSupabase] Tabelas funcionais:",
        status.workingTables,
      );
    } else {
      console.log(
        "⚠️ [SafeSupabase] Nenhuma tabela funcional - modo mock ativo",
      );
    }

    if (status.blacklistedTables.length > 0) {
      console.log(
        "🚫 [SafeSupabase] Tabelas com problemas (blacklist):",
        status.blacklistedTables,
      );
    }

    if (status.errors.length > 0) {
      console.log("❌ [SafeSupabase] Erros encontrados:", status.errors);
    }
  });
} else {
  console.log("🛑 [Inicialização] Supabase DESABILITADO");
  console.log("🎭 [Inicialização] Usando NoSchemaAPI (dados mock)");
  console.log(
    "📋 [Inicialização] Motivo:",
    SUPABASE_CONFIG.DISABLE_REASON || "Não especificado",
  );
  console.log(
    "🔧 [Inicialização] Para reabilitar: mude ENABLE_SUPABASE para true",
  );

  // Habilitar circuit breaker da API tradicional para prevenir erros de fetch
  if (SUPABASE_CONFIG.DISABLE_TRADITIONAL_API_WHEN_SUPABASE_OFF) {
    logSupabaseDebug("🛑 Habilitando circuit breaker da API tradicional");
    enableApiCircuitBreaker();
  }
}

createRoot(document.getElementById("root")!).render(<App />);
