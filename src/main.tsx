import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { adaptiveSupabaseApi } from "./lib/adaptiveSupabaseApi";
import "./lib/directSupabaseTest";

// Verificar tabelas na inicialização
adaptiveSupabaseApi.verifyAllTables().then((results) => {
  console.log("🔍 [Inicialização] Tabelas verificadas:", results);

  const workingTables = Object.entries(results)
    .filter(([_, config]: [string, any]) => config.found)
    .map(([table, config]: [string, any]) => `${table} (${config.actualName})`);

  if (workingTables.length > 0) {
    console.log("✅ [Inicialização] Tabelas funcionais:", workingTables);
  } else {
    console.log(
      "⚠️ [Inicialização] Nenhuma tabela encontrada - usando dados mock",
    );
  }
});

createRoot(document.getElementById("root")!).render(<App />);
