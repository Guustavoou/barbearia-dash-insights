import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { safeSupabaseApi } from "./lib/safeSupabaseApi";
import { SUPABASE_CONFIG } from "./lib/supabaseConfig";

// Diagnóstico do Supabase apenas se estiver habilitado
if (SUPABASE_CONFIG.ENABLE_SUPABASE) {
  console.log(
    "🔍 [Inicialização] Supabase habilitado - verificando conexão...",
  );

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
}

createRoot(document.getElementById("root")!).render(<App />);
