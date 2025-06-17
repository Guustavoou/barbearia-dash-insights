# 🔧 Instruções para Configurar Supabase

## 📋 **Status Atual**

Sua aplicação está funcionando **100% com dados mock** porque as tabelas não existem no Supabase.

### **❌ Problemas Detectados:**

- `relation "public.clients" does not exist`
- `relation "public.appointments" does not exist`
- `relation "public.services" does not exist`
- `infinite recursion detected in policy for relation "business_users"`

## 🛠️ **Como Corrigir**

### **Opção 1: Executar SQL no Supabase (Recomendado)**

1. **Acesse seu projeto Supabase:**

   - Vá para [app.supabase.com](https://app.supabase.com)
   - Selecione seu projeto: `jcdymkgmtxpryceziazt`

2. **Abra o SQL Editor:**

   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o script de criação:**

   - Copie e cole o conteúdo do arquivo `supabase_schema_safe.sql`
   - Clique em "Run" para executar

4. **Verifique se as tabelas foram criadas:**
   - Vá para "Table Editor"
   - Você deve ver: `clients`, `appointments`, `services`, `professionals`, etc.

### **Opção 2: Usando Migration Files**

Se você tem acesso ao CLI do Supabase:

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login no Supabase
supabase login

# 3. Link com seu projeto
supabase link --project-ref jcdymkgmtxpryceziazt

# 4. Aplicar migrations
supabase db push
```

## 📝 **Script SQL Necessário**

```sql
-- Enable extensions
create extension if not exists "uuid-ossp";

-- Create clients table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  city text,
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  birthday text,
  total_spent numeric default 0,
  visits integer default 0,
  last_visit timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create professionals table
create table public.professionals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  specialties text not null,
  commission_rate numeric default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- duration in minutes
  category text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create appointments table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text default 'agendado' check (status in ('agendado', 'concluido', 'cancelado', 'faltou')),
  price numeric not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text,
  category text not null,
  price numeric not null,
  cost numeric not null,
  stock_quantity integer default 0,
  min_stock integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('receita', 'despesa')),
  category text not null,
  amount numeric not null,
  payment_method text,
  appointment_id uuid references public.appointments(id) on delete set null,
  description text,
  date date not null,
  status text default 'pendente' check (status in ('pendente', 'confirmado', 'cancelado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.clients enable row level security;
alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;

-- Create simple policies for now (allow all for authenticated users)
create policy "Allow all operations for authenticated users" on public.clients
  for all using (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users" on public.professionals
  for all using (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users" on public.services
  for all using (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users" on public.appointments
  for all using (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users" on public.products
  for all using (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users" on public.transactions
  for all using (auth.role() = 'authenticated');

-- Allow anonymous access for now (for testing)
create policy "Allow anonymous read" on public.clients
  for select using (true);

create policy "Allow anonymous read" on public.services
  for select using (true);

create policy "Allow anonymous read" on public.professionals
  for select using (true);
```

## 🔧 **Correção do Problema RLS Recursion**

Se você está enfrentando o erro de "infinite recursion", execute:

```sql
-- Remove políticas problemáticas da tabela business_users
drop policy if exists "business_users_policy" on public.business_users;

-- Ou desabilite RLS nesta tabela temporariamente
alter table public.business_users disable row level security;
```

## ✅ **Verificação**

Após executar o script, verifique se funcionou:

1. **No Supabase Dashboard:**

   - Vá para "Table Editor"
   - Você deve ver todas as tabelas listadas

2. **Na aplicação:**
   - Recarregue a página
   - Os logs devem mostrar: "✅ Tabela X é segura"
   - Os dados reais do Supabase serão carregados

## 🎯 **Status Esperado Após Configuração**

```
✅ [SafeSupabase] Conectado com sucesso!
📋 [SafeSupabase] Tabelas funcionais: ['clients', 'appointments', 'services', 'professionals']
🎭 [NoSchema] → 🔄 [Supabase] Migração completa!
```

## 📞 **Precisa de Ajuda?**

Se encontrar problemas:

1. **Verifique as credenciais** no arquivo `.env`
2. **Execute o script SQL** passo a passo
3. **Verifique permissões** do seu usuário Supabase
4. **Desabilite RLS temporariamente** se necessário

---

**💡 Dica:** A aplicação continuará funcionando normalmente com dados mock enquanto você configura o Supabase. Não há pressa - faça com calma!
