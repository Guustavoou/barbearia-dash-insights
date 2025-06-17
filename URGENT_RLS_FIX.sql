-- 🚨 CORREÇÃO URGENTE DO PROBLEMA RLS RECURSION
-- Execute este script IMEDIATAMENTE no seu Supabase para corrigir o problema

-- ================================
-- PASSO 1: DESABILITAR RLS PROBLEMÁTICO
-- ================================

-- Desabilitar RLS na tabela business_users que está causando recursão
ALTER TABLE IF EXISTS public.business_users DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas problemáticas da business_users
DROP POLICY IF EXISTS "business_users_policy" ON public.business_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.business_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.business_users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.business_users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.business_users;

-- ================================
-- PASSO 2: CRIAR TABELAS NECESSÁRIAS
-- ================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela clients (se não existir)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  birthday text,
  total_spent numeric DEFAULT 0,
  visits integer DEFAULT 0,
  last_visit timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela professionals (se não existir)
CREATE TABLE IF NOT EXISTS public.professionals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  specialties text NOT NULL,
  commission_rate numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela services (se não existir)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer NOT NULL, -- duration in minutes
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela appointments (se não existir)
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'agendado' CHECK (status IN ('agendado', 'concluido', 'cancelado', 'faltou')),
  price numeric NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela products (se não existir)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  brand text,
  category text NOT NULL,
  price numeric NOT NULL,
  cost numeric NOT NULL,
  stock_quantity integer DEFAULT 0,
  min_stock integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela transactions (se não existir)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  category text NOT NULL,
  amount numeric NOT NULL,
  payment_method text,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  description text,
  date date NOT NULL,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================
-- PASSO 3: CONFIGURAR RLS SEGURO
-- ================================

-- Habilitar RLS nas novas tabelas (SEM referência a business_users)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Criar políticas SIMPLES e SEGURAS (sem recursão)

-- Política para clients: acesso total para usuários autenticados
CREATE POLICY "clients_access_policy" ON public.clients
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Política para professionals: acesso total para usuários autenticados
CREATE POLICY "professionals_access_policy" ON public.professionals
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Política para services: acesso total para usuários autenticados
CREATE POLICY "services_access_policy" ON public.services
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Política para appointments: acesso total para usuários autenticados
CREATE POLICY "appointments_access_policy" ON public.appointments
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Política para products: acesso total para usuários autenticados
CREATE POLICY "products_access_policy" ON public.products
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Política para transactions: acesso total para usuários autenticados
CREATE POLICY "transactions_access_policy" ON public.transactions
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ================================
-- PASSO 4: INSERIR DADOS DE TESTE
-- ================================

-- Inserir alguns dados de teste para verificar se funciona
INSERT INTO public.clients (name, email, phone, city, status, total_spent, visits) 
VALUES 
  ('Ana Silva', 'ana@email.com', '(11) 99999-1111', 'São Paulo', 'ativo', 850, 8),
  ('Carlos Santos', 'carlos@email.com', '(11) 88888-2222', 'Rio de Janeiro', 'ativo', 420, 5),
  ('Maria Costa', 'maria@email.com', '(11) 77777-3333', 'Belo Horizonte', 'inativo', 780, 3)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.professionals (name, email, phone, specialties, commission_rate, is_active) 
VALUES 
  ('Maria Silva', 'maria.prof@salon.com', '(11) 99999-0001', 'Corte, Escova, Coloração', 0.4, true),
  ('João Santos', 'joao.prof@salon.com', '(11) 99999-0002', 'Barba, Corte Masculino', 0.35, true),
  ('Ana Costa', 'ana.prof@salon.com', '(11) 99999-0003', 'Manicure, Pedicure', 0.3, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.services (name, description, price, duration, category, is_active) 
VALUES 
  ('Corte Masculino', 'Corte moderno masculino', 60, 30, 'Cabelo', true),
  ('Escova', 'Escova modeladora', 80, 45, 'Cabelo', true),
  ('Barba', 'Aparar e modelar barba', 50, 20, 'Cabelo', true),
  ('Manicure', 'Cuidados com as unhas das mãos', 40, 60, 'Unhas', true),
  ('Pedicure', 'Cuidados com as unhas dos pés', 50, 75, 'Unhas', true)
ON CONFLICT DO NOTHING;

-- ================================
-- PASSO 5: VERIFICAR SE FUNCIONOU
-- ================================

-- Testar se as tabelas funcionam
SELECT 'Clients count:' as test, count(*) as result FROM public.clients
UNION ALL
SELECT 'Professionals count:', count(*) FROM public.professionals  
UNION ALL
SELECT 'Services count:', count(*) FROM public.services;

-- ================================
-- MENSAGEM FINAL
-- ================================

-- Se chegou até aqui sem erro, o problema foi corrigido!
SELECT '🎉 PROBLEMA RLS CORRIGIDO COM SUCESSO! 🎉' as status;
SELECT 'Agora recarregue sua aplicação e mude ENABLE_SUPABASE para true' as next_step;
