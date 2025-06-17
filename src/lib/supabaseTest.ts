import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  console.log("🔍 Testando conectividade Supabase...");

  try {
    // Teste 1: Verificar conexão básica
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(5);

    if (tablesError) {
      console.error("❌ Erro ao buscar tabelas:", tablesError);
      return {
        success: false,
        error: tablesError.message,
        details: tablesError,
      };
    }

    console.log("✅ Tabelas encontradas:", tables);

    // Teste 2: Verificar se a tabela clients existe
    const {
      data: clientsTest,
      error: clientsError,
      count,
    } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    if (clientsError) {
      console.error("❌ Erro ao acessar tabela clients:", clientsError);
      return {
        success: false,
        error: `Tabela clients: ${clientsError.message}`,
        details: clientsError,
      };
    }

    console.log(`✅ Tabela clients OK - ${count || 0} registros`);

    // Teste 3: Verificar outras tabelas essenciais
    const testTables = [
      "appointments",
      "services",
      "professionals",
      "transactions",
      "products",
    ];
    const tableResults = [];

    for (const tableName of testTables) {
      try {
        const { error, count } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });

        if (error) {
          console.warn(`⚠️ Tabela ${tableName} não encontrada:`, error.message);
          tableResults.push({
            table: tableName,
            exists: false,
            error: error.message,
          });
        } else {
          console.log(`✅ Tabela ${tableName} OK - ${count || 0} registros`);
          tableResults.push({
            table: tableName,
            exists: true,
            count: count || 0,
          });
        }
      } catch (err) {
        console.warn(`⚠️ Erro ao testar tabela ${tableName}:`, err);
        tableResults.push({
          table: tableName,
          exists: false,
          error: String(err),
        });
      }
    }

    return {
      success: true,
      tables: tableResults,
      clientsCount: count || 0,
    };
  } catch (error) {
    console.error("❌ Erro geral na conexão Supabase:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    };
  }
}

// Função para executar teste automaticamente
export async function autoTestSupabase() {
  console.log("🚀 Iniciando teste automático do Supabase...");
  const result = await testSupabaseConnection();

  if (result.success) {
    console.log("🎉 Supabase conectado com sucesso!");
    console.log("📊 Resumo das tabelas:", result.tables);
  } else {
    console.error("💥 Falha na conexão Supabase:", result.error);
    console.error("🔍 Detalhes:", result.details);
  }

  return result;
}
