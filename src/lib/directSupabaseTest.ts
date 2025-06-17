import { supabase } from "./supabase";

export async function testDirectQuery() {
  console.log("🔍 Teste direto de query Supabase...");

  // Teste diferentes nomes de tabela e cenários
  const testTables = [
    "clients",
    "Clients",
    "appointments",
    "Appointments",
    "services",
    "Services",
  ];

  const results = [];

  for (const tableName of testTables) {
    try {
      console.log(`🔍 Testando tabela: ${tableName}`);

      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.log(`❌ Tabela ${tableName} erro:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        results.push({
          table: tableName,
          success: false,
          error: error.message,
          code: error.code,
        });
      } else {
        console.log(`✅ Tabela ${tableName} OK - ${count} registros`);
        results.push({
          table: tableName,
          success: true,
          count: count || 0,
        });
      }
    } catch (error) {
      console.log(`💥 Erro inesperado na tabela ${tableName}:`, error);
      results.push({
        table: tableName,
        success: false,
        error: String(error),
      });
    }
  }

  return {
    success: results.some((r) => r.success),
    results,
    workingTables: results.filter((r) => r.success).map((r) => r.table),
  };
}

// Executar teste
testDirectQuery().then((result) => {
  console.log("📋 Resultado do teste direto:", result);
});
