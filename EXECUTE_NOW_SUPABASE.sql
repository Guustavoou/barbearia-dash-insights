-- 🚨 SCRIPT DEFINITIVO - RESOLVER ERRO 42P01
-- COPIE ESTE SCRIPT COMPLETO E EXECUTE NO SUPABASE SQL EDITOR
-- URL: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

-- =====================================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Iniciando criação das tabelas...';
END $$;

-- =====================================================
-- 2. HABILITAR EXTENSÕES
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 3. CRIAR TABELAS SE NÃO EXISTIREM
-- =====================================================

-- Businesses (empresas/estabelecimentos)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    business_type TEXT DEFAULT 'salon',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clients (clientes)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    city TEXT,
    status TEXT DEFAULT 'ativo',
    birthday TEXT,
    total_spent NUMERIC DEFAULT 0,
    visits INTEGER DEFAULT 0,
    last_visit TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services (serviços)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    duration INTEGER DEFAULT 60,
    category TEXT DEFAULT 'geral',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Professionals (profissionais)
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialties TEXT[] DEFAULT '{}',
    commission NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointments (RESOLVE O ERRO 42P01!)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    client_name TEXT,
    service TEXT,
    professional TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    duration INTEGER DEFAULT 60,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
    price NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products (produtos/estoque)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    price NUMERIC NOT NULL,
    cost_price NUMERIC DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    supplier TEXT,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions (transações financeiras)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    payment_method TEXT,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 4. GARANTIR PERMISSÕES COMPLETAS (SEM RLS)
-- =====================================================

-- Dar permissões completas para anon e authenticated
GRANT ALL PRIVILEGES ON public.businesses TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.clients TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.services TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.professionals TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.appointments TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.products TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.transactions TO anon, authenticated;

-- Permissões para sequences (auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- 5. INSERIR DADOS DE TESTE
-- =====================================================

-- Business padrão
INSERT INTO public.businesses (id, name, business_type, email, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salon', 'contato@salaopremium.com', '(11) 99999-0000')
ON CONFLICT (id) DO NOTHING;

-- Clientes de teste
INSERT INTO public.clients (business_id, name, email, phone, city, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva Santos', 'ana.silva@email.com', '(11) 99999-1111', 'São Paulo', 'ativo'),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Roberto Lima', 'carlos.lima@email.com', '(11) 88888-2222', 'São Paulo', 'ativo'),
('550e8400-e29b-41d4-a716-446655440000', 'Maria Costa Oliveira', 'maria.costa@email.com', '(11) 77777-3333', 'Santo André', 'ativo')
ON CONFLICT DO NOTHING;

-- Profissionais de teste
INSERT INTO public.professionals (business_id, name, email, phone, specialties, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Maria Santos', 'maria@salon.com', '(11) 99999-4444', ARRAY['Corte', 'Coloração'], 'ativo'),
('550e8400-e29b-41d4-a716-446655440000', 'Paula Costa', 'paula@salon.com', '(11) 99999-5555', ARRAY['Escova', 'Tratamentos'], 'ativo')
ON CONFLICT DO NOTHING;

-- Serviços de teste
INSERT INTO public.services (business_id, name, description, price, duration, category, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Corte Feminino', 'Corte profissional feminino', 80.00, 60, 'corte', true),
('550e8400-e29b-41d4-a716-446655440000', 'Coloração Completa', 'Coloração com produtos premium', 150.00, 120, 'coloracao', true),
('550e8400-e29b-41d4-a716-446655440000', 'Escova Progressiva', 'Escova para alisamento', 200.00, 180, 'tratamento', true)
ON CONFLICT DO NOTHING;

-- Agendamentos de teste (RESOLVE O ERRO 42P01!)
INSERT INTO public.appointments (business_id, client_name, service, date, start_time, end_time, status, price, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva Santos', 'Corte Feminino', CURRENT_DATE, '10:00', '11:00', 'confirmado', 80.00, 'Cliente preferencial'),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Roberto Lima', 'Corte Masculino', CURRENT_DATE, '14:00', '14:30', 'pendente', 50.00, 'Primeira vez'),
('550e8400-e29b-41d4-a716-446655440000', 'Maria Costa Oliveira', 'Coloração Completa', CURRENT_DATE + 1, '09:00', '11:00', 'confirmado', 150.00, 'Retoque de raiz'),
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva Santos', 'Escova Progressiva', CURRENT_DATE + 2, '13:00', '16:00', 'confirmado', 200.00, 'Tratamento completo'),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Roberto Lima', 'Corte Masculino', CURRENT_DATE + 3, '16:00', '16:30', 'pendente', 50.00, 'Agendamento recorrente')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
    'VERIFICAÇÃO DE TABELAS' as tipo_check,
    table_name as tabela,
    'CRIADA COM SUCESSO' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('businesses', 'clients', 'appointments', 'services', 'professionals', 'products', 'transactions')
ORDER BY table_name;

-- Verificar dados inseridos
SELECT 'BUSINESSES' as tabela, COUNT(*) as registros FROM public.businesses
UNION ALL
SELECT 'CLIENTS' as tabela, COUNT(*) as registros FROM public.clients
UNION ALL
SELECT 'APPOINTMENTS' as tabela, COUNT(*) as registros FROM public.appointments
UNION ALL
SELECT 'SERVICES' as tabela, COUNT(*) as registros FROM public.services
UNION ALL
SELECT 'PROFESSIONALS' as tabela, COUNT(*) as registros FROM public.professionals
UNION ALL
SELECT 'PRODUCTS' as tabela, COUNT(*) as registros FROM public.products
UNION ALL
SELECT 'TRANSACTIONS' as tabela, COUNT(*) as registros FROM public.transactions;

-- Teste específico da tabela appointments
SELECT 
    'TESTE APPOINTMENTS' as teste,
    id,
    client_name,
    service,
    date,
    start_time,
    status,
    price
FROM public.appointments
ORDER BY date, start_time
LIMIT 5;

-- =====================================================
-- 7. MENSAGEM DE SUCESSO
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '🎉 SUCESSO! Todas as tabelas foram criadas.';
    RAISE NOTICE '✅ Erro 42P01 resolvido!';
    RAISE NOTICE '📊 Dados de teste inseridos.';
    RAISE NOTICE '🔄 Recarregue a aplicação agora!';
END $$;

-- Resultado final
SELECT 
    '🎉 ERRO 42P01 RESOLVIDO!' as status,
    'Tabela appointments criada com sucesso' as message,
    COUNT(*) as total_appointments
FROM public.appointments;
