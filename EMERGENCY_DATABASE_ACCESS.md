# 🚨 ACESSO EMERGENCIAL - CORREÇÃO DO BANCO

## ⚡ **Acesso Direto à Página de Correção:**

Se a aplicação estiver com erro, acesse diretamente a página de correção:

### **URL da Página de Emergência:**

```
http://localhost:3000/?page=database-emergency
```

### **Ou pelo console do navegador:**

1. Abrir console (F12)
2. Executar:

```javascript
// Redirecionar para página de emergência
window.location.hash = "#database-emergency";
window.location.reload();
```

## 🔧 **Correção Manual Direta:**

### **1. Abrir Supabase SQL Editor:**

https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

### **2. Executar este script mínimo:**

```sql
-- SCRIPT EMERGENCIAL MÍNIMO
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar businesses (tenant principal)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_type TEXT DEFAULT 'salon',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar appointments (resolve o erro principal)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  status TEXT DEFAULT 'pendente',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir business padrão
INSERT INTO public.businesses (id, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium')
ON CONFLICT (id) DO NOTHING;

-- Inserir appointment de teste
INSERT INTO public.appointments (business_id, client_name, service, date, start_time) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Cliente Teste', 'Serviço Teste', CURRENT_DATE, '10:00')
ON CONFLICT DO NOTHING;

SELECT 'Erro resolvido! Tabelas criadas.' as resultado;
```

## 🎯 **Verificação Rápida:**

### **Testar se funcionou:**

```sql
-- Verificar se tabelas existem
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('businesses', 'appointments');

-- Verificar dados
SELECT COUNT(*) FROM public.appointments;
```

## 📱 **Botão de Emergência na Aplicação:**

### **Adicionar temporariamente ao dashboard:**

No console do navegador:

```javascript
// Criar botão de emergência
const emergencyBtn = document.createElement("button");
emergencyBtn.innerHTML = "🚨 CORRIGIR BANCO";
emergencyBtn.style.cssText =
  "position:fixed;top:10px;right:10px;z-index:9999;background:red;color:white;padding:10px;border:none;border-radius:5px;cursor:pointer;font-weight:bold;";
emergencyBtn.onclick = () => (window.location.hash = "#database-emergency");
document.body.appendChild(emergencyBtn);
```

## ⚡ **Script Completo de Emergência:**

Se quiser criar TODAS as tabelas de uma vez, use o arquivo:
`URGENT_DATABASE_FIX.sql`

## 🚀 **Resultado Esperado:**

Após executar qualquer um dos scripts:

- ❌ Erro "appointments does not exist" desaparece
- ✅ Dashboard mostra dados
- ✅ BeautifulAppointments funciona
- ✅ Aplicação 100% operacional

---

**⏰ Tempo estimado de correção: 2-5 minutos**
