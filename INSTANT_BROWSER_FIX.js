// 🚨 EXECUTAR NO CONSOLE DO NAVEGADOR (F12)
// Script para resolver erro 42P01 - appointments table does not exist

console.log("🚨 Resolvendo erro 42P01: appointments table does not exist");

async function fixAppointmentsTable() {
  try {
    // 1. Obter URL do projeto Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const projectId = supabaseUrl?.split("//")[1]?.split(".")[0];

    if (!projectId) {
      console.error("❌ Não foi possível extrair Project ID do Supabase");
      return;
    }

    console.log("📊 Project ID detectado:", projectId);

    // 2. Script SQL para criar a tabela
    const createTableScript = `-- CRIAR TABELA APPOINTMENTS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  client_name TEXT,
  service TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  status TEXT DEFAULT 'pendente',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

GRANT ALL ON public.businesses TO anon, authenticated;
GRANT ALL ON public.appointments TO anon, authenticated;

INSERT INTO public.businesses (id, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.appointments (business_id, client_name, service, date, start_time) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Cliente Teste', 'Serviço Teste', CURRENT_DATE, '10:00');

SELECT 'TABELA APPOINTMENTS CRIADA!' as resultado;`;

    // 3. Copiar script para clipboard
    try {
      await navigator.clipboard.writeText(createTableScript);
      console.log("✅ Script copiado para clipboard!");
    } catch (error) {
      console.log("⚠️ Erro ao copiar - script mostrado abaixo:");
      console.log(createTableScript);
    }

    // 4. Abrir SQL Editor do Supabase
    const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;
    window.open(sqlEditorUrl, "_blank");

    console.log("✅ SQL Editor aberto em nova aba");
    console.log(`
🎯 PRÓXIMOS PASSOS:
1. ✅ Script copiado para clipboard
2. ✅ SQL Editor aberto em nova aba  
3. 📋 Cole o script no editor (Ctrl+V)
4. ▶️ Clique em "Run"
5. 🔄 Recarregue esta página: window.location.reload()

🚨 IMPORTANTE: Execute o script completo no SQL Editor!
    `);

    // 5. Mostrar URL direta se necessário
    console.log("🔗 URL do SQL Editor:", sqlEditorUrl);
  } catch (error) {
    console.error("❌ Erro:", error);
    console.log(`
🔧 SOLUÇÃO MANUAL:
1. Abra: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new
2. Cole este script:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.businesses (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS public.appointments (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, business_id UUID REFERENCES public.businesses(id), client_name TEXT, service TEXT, date DATE NOT NULL, start_time TIME NOT NULL, status TEXT DEFAULT 'pendente', price NUMERIC DEFAULT 0);
GRANT ALL ON public.businesses TO anon, authenticated;
GRANT ALL ON public.appointments TO anon, authenticated;
INSERT INTO public.businesses (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium');
SELECT 'RESOLVIDO!' as resultado;

3. Execute e recarregue a página
    `);
  }
}

// Executar correção
fixAppointmentsTable();

// Função para recarregar depois de aplicar a correção
window.reloadAfterFix = function () {
  console.log("🔄 Recarregando aplicação...");
  window.location.reload();
};

console.log("💡 Após aplicar o script no Supabase, execute: reloadAfterFix()");
