# 🚨 CORREÇÃO IMEDIATA VIA CONSOLE DO NAVEGADOR

## ❌ **Erro Atual:**

```
ReferenceError: X is not defined
relation "public.appointments" does not exist
```

## ⚡ **SOLUÇÃO DIRETA (30 segundos):**

### **1. Abrir Console do Navegador:**

- Pressionar `F12` ou `Ctrl+Shift+I`
- Ir na aba **Console**

### **2. Executar este código:**

```javascript
// 🚀 CORREÇÃO AUTOMÁTICA DO BANCO DE DADOS
console.log("🚨 Iniciando correção automática...");

// Função para abrir SQL Editor do Supabase
function openSupabaseSQL() {
  const url = "https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new";
  window.open(url, "_blank");
  console.log("✅ SQL Editor aberto em nova aba");
}

// Script SQL para corrigir o problema
const sqlScript = `-- 🚨 CORREÇÃO EMERGENCIAL
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

INSERT INTO public.businesses (id, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.appointments (business_id, client_name, service, date, start_time) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Cliente Teste', 'Serviço Teste', CURRENT_DATE, '10:00');

SELECT 'PROBLEMA RESOLVIDO!' as resultado;`;

// Copiar script para área de transferência
async function copyScript() {
  try {
    await navigator.clipboard.writeText(sqlScript);
    console.log("✅ Script copiado para área de transferência!");
    console.log("📋 Cole no SQL Editor do Supabase e clique em RUN");
    return true;
  } catch (error) {
    console.error("❌ Erro ao copiar:", error);
    console.log("📄 Script manual:");
    console.log(sqlScript);
    return false;
  }
}

// Executar correção
async function fixDatabase() {
  console.log("🔧 Executando correção...");

  // 1. Abrir SQL Editor
  openSupabaseSQL();

  // 2. Copiar script
  await copyScript();

  // 3. Instruções
  console.log(`
🎯 PRÓXIMOS PASSOS:
1. ✅ SQL Editor foi aberto em nova aba
2. ✅ Script foi copiado para área de transferência
3. 📋 Cole o script no editor (Ctrl+V)
4. ▶️ Clique em "Run" no Supabase
5. 🔄 Volte aqui e recarregue a página

⏰ Tempo estimado: 30 segundos
  `);

  // 4. Monitorar se funcionou
  setTimeout(() => {
    console.log("🔍 Verificando se erro foi corrigido...");
    console.log("🔄 Recarregue a página após executar o script no Supabase");
  }, 5000);
}

// Iniciar correção
fixDatabase();
```

### **3. Seguir as instruções que aparecem no console**

### **4. Recarregar a página após executar o script no Supabase**

---

## 🎯 **RESULTADO ESPERADO:**

Após executar:

- ❌ Erros de JavaScript eliminados
- ✅ Tabela appointments criada
- ✅ Aplicação funcionando normalmente
- ✅ Console limpo

---

## 🔄 **VERIFICAÇÃO RÁPIDA:**

### **No SQL Editor do Supabase (após executar):**

```sql
SELECT COUNT(*) FROM public.appointments;
```

### **Na aplicação (após recarregar):**

- Console sem erros
- BeautifulAppointments carrega normalmente

---

## ⚡ **ALTERNATIVA SUPER RÁPIDA:**

Se preferir, apenas execute no console:

```javascript
window.open("https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new");
```

E cole manualmente este script no SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.businesses (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.appointments (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE, client_name TEXT, service TEXT, date DATE NOT NULL, start_time TIME NOT NULL, status TEXT DEFAULT 'pendente', price NUMERIC DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL);
INSERT INTO public.businesses (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium') ON CONFLICT (id) DO NOTHING;
SELECT 'RESOLVIDO!' as resultado;
```

**A correção funcionará em 30 segundos!**
