# 🚨 CORREÇÃO IMEDIATA - Tabela Appointments (Erro 42P01)

## Solução Rápida via Console do Navegador

### 1. Abrir Console

1. Pressione `F12`
2. Vá para aba "Console"
3. Cole e execute o código abaixo:

```javascript
// 🚨 FIX IMEDIATO - Criar tabela appointments
async function createAppointmentsTable() {
  console.log("🔧 Criando tabela appointments...");

  const sql = `
    -- Criar extensão UUID se necessário
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Criar businesses mínima se não existir
    CREATE TABLE IF NOT EXISTS public.businesses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'Business',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Inserir business padrão
    INSERT INTO public.businesses (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium')
    ON CONFLICT (id) DO NOTHING;
    
    -- CRIAR TABELA APPOINTMENTS (resolve erro 42P01)
    CREATE TABLE IF NOT EXISTS public.appointments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      business_id UUID DEFAULT '550e8400-e29b-41d4-a716-446655440000',
      client_name TEXT,
      service TEXT,
      professional TEXT,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      start_time TIME NOT NULL DEFAULT '09:00',
      end_time TIME,
      duration INTEGER DEFAULT 60,
      status TEXT DEFAULT 'pendente',
      price NUMERIC DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Dar permissões
    GRANT ALL ON public.businesses TO anon, authenticated;
    GRANT ALL ON public.appointments TO anon, authenticated;
    
    -- Inserir dados de teste
    INSERT INTO public.appointments (client_name, service, date, start_time, status, price) VALUES 
    ('Ana Silva', 'Corte Feminino', CURRENT_DATE, '10:00', 'confirmado', 80.00),
    ('Maria Costa', 'Coloração', CURRENT_DATE, '14:00', 'pendente', 150.00),
    ('Carlos Santos', 'Corte Masculino', CURRENT_DATE + 1, '09:00', 'confirmado', 50.00)
    ON CONFLICT DO NOTHING;
    
    -- Verificar criação
    SELECT 'SUCCESS' as status, COUNT(*) as appointments FROM public.appointments;
  `;

  // Tentar via fetch (pode não funcionar em todos os casos)
  try {
    const response = await fetch(
      "https://jcdymkgmtxpryceziazt.supabase.co/rest/v1/rpc/sql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZHlta2dtdHhwcnljZXppYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjczNzYsImV4cCI6MjA0OTk0MzM3Nn0.e0Dxw8Q33zNt3YxS7R-PFlIjvMZnKQZtQoFr5z3lpKU",
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZHlta2dtdHhwcnljZXppYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjczNzYsImV4cCI6MjA0OTk0MzM3Nn0.e0Dxw8Q33zNt3YxS7R-PFlIjvMZnKQZtQoFr5z3lpKU",
        },
        body: JSON.stringify({ query: sql }),
      },
    );

    if (response.ok) {
      console.log("✅ Tabela appointments criada com sucesso!");
      console.log("🔄 Recarregando página...");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }
  } catch (error) {
    console.log("⚠️ Método automático falhou, use método manual");
  }

  // Fallback: instruções manuais
  console.log("📋 MÉTODO MANUAL:");
  console.log(
    "1. Acesse: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new",
  );
  console.log("2. Execute o arquivo: FIX_APPOINTMENTS_TABLE_ONLY.sql");
  console.log("3. Ou cole este SQL básico:");
  console.log(`
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID DEFAULT '550e8400-e29b-41d4-a716-446655440000',
  client_name TEXT,
  service TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL DEFAULT '09:00',
  status TEXT DEFAULT 'pendente',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON public.appointments TO anon, authenticated;

INSERT INTO public.appointments (client_name, service) VALUES ('Teste', 'Corte');
  `);
}

// Executar
createAppointmentsTable();
```

### 2. Método Manual (Se o console não funcionar)

1. **Acesse o SQL Editor do Supabase**:
   https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

2. **Execute este SQL mínimo**:

```sql
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID DEFAULT '550e8400-e29b-41d4-a716-446655440000',
  client_name TEXT,
  service TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL DEFAULT '09:00',
  status TEXT DEFAULT 'pendente',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON public.appointments TO anon, authenticated;

INSERT INTO public.appointments (client_name, service) VALUES ('Teste', 'Corte');

SELECT 'APPOINTMENTS TABLE CREATED' as result;
```

3. **Clique em "Run"**

### 3. Verificação

Após a execução, você deve ver:

- ✅ Tabela criada sem erros
- ✅ Pelo menos 1 registro inserido
- ✅ Mensagem "APPOINTMENTS TABLE CREATED"

### 4. Teste na Aplicação

1. Recarregue a página (F5)
2. Acesse a página de agendamentos
3. O erro 42P01 deve ter desaparecido

---

**⚡ EXECUTE AGORA**: Cole o código JavaScript no console
**🎯 RESULTADO**: Erro 42P01 será resolvido
**⏱️ TEMPO**: 30 segundos para resolver
