-- 🚨 CORREÇÃO MÍNIMA: Criar tabela appointments (Resolver erro 42P01)
-- Execute este script no Supabase SQL Editor: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela businesses se não existir (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    business_type TEXT DEFAULT 'salon',
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela clients se não existir (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela services se não existir (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela professionals se não existir (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🎯 CRIAR TABELA APPOINTMENTS (RESOLVE O ERRO 42P01!)
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

-- Garantir permissões para todas as tabelas
GRANT ALL PRIVILEGES ON public.businesses TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.clients TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.services TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.professionals TO anon, authenticated;
GRANT ALL PRIVILEGES ON public.appointments TO anon, authenticated;

-- Inserir dados mínimos se necessário
INSERT INTO public.businesses (id, name, business_type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salon')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns agendamentos de teste
INSERT INTO public.appointments (business_id, client_name, service, date, start_time, status, price) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva', 'Corte Feminino', CURRENT_DATE, '10:00', 'confirmado', 80.00),
('550e8400-e29b-41d4-a716-446655440000', 'Maria Costa', 'Coloração', CURRENT_DATE, '14:00', 'pendente', 150.00),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Santos', 'Corte Masculino', CURRENT_DATE + 1, '09:00', 'confirmado', 50.00)
ON CONFLICT DO NOTHING;

-- Verificação final - DEVE RETORNAR A TABELA E DADOS
SELECT 'APPOINTMENTS TABLE CREATED' as status;

SELECT 
    'VERIFICAÇÃO' as test,
    table_name,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'appointments';

SELECT 
    'DADOS DE TESTE' as test,
    COUNT(*) as total_appointments
FROM public.appointments;

-- Testar uma query básica (igual à que estava falhando)
SELECT 
    'TESTE QUERY' as test,
    id,
    client_name,
    service,
    date,
    start_time,
    status
FROM public.appointments
ORDER BY date, start_time
LIMIT 3;

-- Mensagem final
DO $$ 
BEGIN
    RAISE NOTICE '✅ ERRO 42P01 RESOLVIDO!';
    RAISE NOTICE '📋 Tabela appointments criada com sucesso';
    RAISE NOTICE '🔄 Recarregue a aplicação agora!';
END $$;
