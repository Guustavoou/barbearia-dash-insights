import { supabase } from "./supabase";

export async function testDirectQuery() {
  console.log("🔍 Teste direto de query Supabase...");

  try {
    // Teste 1: Query mais simples possível
    const { data, error } = await supabase.from("clients").select("count");

    if (error) {
      console.error("❌ Erro na query count:", error);

      // Se count não funciona, tenta select simples
      const { data: simpleData, error: simpleError } = await supabase
        .from("clients")
        .select("*")
        .limit(1);

      if (simpleError) {
        console.error("❌ Erro na query select:", simpleError);
        return {
          success: false,
          error: `Select failed: ${simpleError.message}`,
          details: simpleError,
        };
      }

      console.log("✅ Query select funcionou:", simpleData);
      return {
        success: true,
        message: "Select works, count doesn't",
        data: simpleData,
      };
    }

    console.log("✅ Query count funcionou:", data);
    return {
      success: true,
      message: "Both count and select work",
      count: data,
    };
  } catch (error) {
    console.error("❌ Erro geral:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

// Executar teste
testDirectQuery().then((result) => {
  console.log("📋 Resultado do teste direto:", result);
});
