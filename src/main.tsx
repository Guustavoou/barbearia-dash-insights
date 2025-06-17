import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { safeSupabaseApi } from "./lib/safeSupabaseApi";
import "./lib/authTest";
import "./lib/alternativeSupabaseTest";

// Diagnóstico completo do Supabase na inicialização
safeSupabaseApi.getConnectionStatus().then((status) => {
  console.log("🔍 [SafeSupabase] Status da conexão:", status);

  if (status.connected) {
    console.log("✅ [SafeSupabase] Conectado com sucesso!");
    console.log("📋 [SafeSupabase] Tabelas funcionais:", status.workingTables);
  } else {
    console.log("⚠️ [SafeSupabase] Nenhuma tabela funcional - modo mock ativo");
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

createRoot(document.getElementById("root")!).render(<App />);
