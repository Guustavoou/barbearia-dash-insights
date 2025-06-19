import { supabase } from "./supabase";

export async function testSupabaseAuth() {
  console.log("🔐 Testando autenticação Supabase...");

  try {
    // Teste 1: Verificar se consegue acessar informações básicas
    console.log("📋 Configuração Supabase:", {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey
        ? `${supabase.supabaseKey.substring(0, 10)}...`
        : "Não definida",
    });

    // Teste 2: Verificar usuário atual
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.log("⚠️ Erro ao verificar usuário:", {
        message: userError.message,
        status: userError.status,
      });
    } else {
      console.log("👤 Status do usuário:", {
        authenticated: !!user?.user,
        userId: user?.user?.id || "Anônimo",
      });
    }

    // Teste 3: Verificar se consegue fazer uma query simples no auth
    try {
      const { data: session } = await supabase.auth.getSession();
      console.log("🔑 Sessão:", {
        hasSession: !!session?.session,
        expired: session?.session
          ? new Date(session.session.expires_at! * 1000) < new Date()
          : "N/A",
      });
    } catch (sessionError) {
      console.log("❌ Erro ao verificar sessão:", sessionError);
    }

    // Teste 4: Verificar RLS - tentar acessar uma tabela simples
    const { data, error } = await supabase
      .rpc("version") // Função que sempre existe
      .catch(() => null);

    if (data) {
      console.log("✅ Conexão com Supabase OK - versão:", data);
    } else {
      console.log("⚠️ Não conseguiu executar RPC version");
    }

    // Teste 5: Tentar listar schemas disponíveis
    try {
      const { data: schemas, error: schemaError } = await supabase
        .from("information_schema.schemata")
        .select("schema_name")
        .limit(5)
        .catch(() => ({ data: null, error: "Não disponível" }));

      if (schemas && schemas.length > 0) {
        console.log(
          "📚 Schemas disponíveis:",
          schemas.map((s) => s.schema_name),
        );
      } else {
        console.log("⚠️ Não conseguiu listar schemas:", schemaError);
      }
    } catch (error) {
      console.log("❌ Erro ao listar schemas:", error);
    }

    return {
      success: true,
      authenticated: !!user?.user,
      connectionOk: !!data,
    };
  } catch (error) {
    console.error("💥 Erro geral no teste de auth:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

// Auto-executar teste
testSupabaseAuth().then((result) => {
  console.log("🏁 Resultado do teste de auth:", result);
});
