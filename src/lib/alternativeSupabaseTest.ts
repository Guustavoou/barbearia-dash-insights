import { supabase } from "./supabase";
import {
  logSupabaseDebug,
  logSupabaseError,
  logSupabaseSuccess,
} from "./supabaseConfig";

export async function testAlternativeMethods() {
  logSupabaseDebug("🔬 Testando métodos alternativos de acesso...");

  const testTables = ["clients", "appointments", "services", "professionals"];
  const results = [];

  for (const tableName of testTables) {
    const tableResult = {
      table: tableName,
      methods: {},
    };

    // Método 1: Select com limit 0 (não retorna dados mas verifica se tabela existe)
    try {
      logSupabaseDebug(`Testando ${tableName} com select limit 0...`);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(0);

      if (error) {
        const errorInfo = {
          message: error.message || "Sem mensagem",
          code: error.code || "Sem código",
          details: error.details || "Sem detalhes",
        };
        logSupabaseError(
          `Select limit 0 falhou para ${tableName}:`,
          JSON.stringify(errorInfo, null, 2),
        );
        tableResult.methods["select_limit_0"] = { success: false, error };
      } else {
        logSupabaseSuccess(`Select limit 0 funcionou para ${tableName}`);
        tableResult.methods["select_limit_0"] = { success: true, data };
      }
    } catch (error) {
      logSupabaseError(
        `Erro inesperado no select limit 0 para ${tableName}:`,
        error,
      );
      tableResult.methods["select_limit_0"] = {
        success: false,
        error: String(error),
      };
    }

    // Método 2: Select com count estimado
    try {
      logSupabaseDebug(`Testando ${tableName} com count estimado...`);
      const { count, error } = await supabase
        .from(tableName)
        .select("*", { count: "estimated", head: true });

      if (error) {
        const errorInfo = {
          message: error.message || "Sem mensagem",
          code: error.code || "Sem código",
        };
        logSupabaseError(
          `Count estimado falhou para ${tableName}:`,
          JSON.stringify(errorInfo, null, 2),
        );
        tableResult.methods["count_estimated"] = { success: false, error };
      } else {
        logSupabaseSuccess(
          `Count estimado funcionou para ${tableName}: ${count}`,
        );
        tableResult.methods["count_estimated"] = { success: true, count };
      }
    } catch (error) {
      logSupabaseError(
        `Erro inesperado no count estimado para ${tableName}:`,
        error,
      );
      tableResult.methods["count_estimated"] = {
        success: false,
        error: String(error),
      };
    }

    // Método 3: Select simples com 1 registro
    try {
      logSupabaseDebug(`Testando ${tableName} com select single...`);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        const errorInfo = {
          message: error.message || "Sem mensagem",
          code: error.code || "Sem código",
        };
        logSupabaseError(
          `Select single falhou para ${tableName}:`,
          JSON.stringify(errorInfo, null, 2),
        );
        tableResult.methods["select_single"] = { success: false, error };
      } else {
        logSupabaseSuccess(`Select single funcionou para ${tableName}`);
        tableResult.methods["select_single"] = {
          success: true,
          hasData: !!data,
        };
      }
    } catch (error) {
      logSupabaseError(
        `Erro inesperado no select single para ${tableName}:`,
        error,
      );
      tableResult.methods["select_single"] = {
        success: false,
        error: String(error),
      };
    }

    // Método 4: Verificar se algum método funcionou
    const anySuccess = Object.values(tableResult.methods).some(
      (method: any) => method.success,
    );
    if (anySuccess) {
      logSupabaseSuccess(`✅ Tabela ${tableName} é acessível`);
    } else {
      logSupabaseError(
        `❌ Tabela ${tableName} não é acessível por nenhum método`,
      );
    }

    results.push(tableResult);
  }

  // Resumo final
  const workingTables = results.filter((result) =>
    Object.values(result.methods).some((method: any) => method.success),
  );

  logSupabaseSuccess(
    `📊 Resumo: ${workingTables.length}/${results.length} tabelas acessíveis`,
  );
  logSupabaseDebug(
    "📋 Tabelas funcionais:",
    workingTables.map((r) => r.table),
  );

  return {
    success: workingTables.length > 0,
    workingTables: workingTables.map((r) => r.table),
    allResults: results,
  };
}

// Auto-executar
testAlternativeMethods().then((result) => {
  console.log("🎯 Resultado dos testes alternativos:", result);
});
