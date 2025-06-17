-- 🚨 CORREÇÃO EMERGENCIAL: Tabela "appointments" não existe
-- Execute este script mínimo no SQL Editor do Supabase para resolver o erro imediatamente

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela businesses (necessária para foreign key)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_type TEXT DEFAULT 'salon',
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criar tabela appointments (RESOLVE O ERRO!)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  client_id UUID,
  professional_id UUID,
  service_id UUID,
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

-- 4. Habilitar Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 5. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON public.appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- 6. Inserir business padrão
INSERT INTO public.businesses (id, name, business_type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salon')
ON CONFLICT (id) DO NOTHING;

-- 7. Inserir alguns agendamentos de teste
INSERT INTO public.appointments (business_id, client_name, service, date, start_time, status, price) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva', 'Corte Feminino', CURRENT_DATE, '10:00', 'confirmado', 80.00),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Santos', 'Corte Masculino', CURRENT_DATE, '14:00', 'pendente', 50.00),
('550e8400-e29b-41d4-a716-446655440000', 'Maria Costa', 'Coloração', CURRENT_DATE + 1, '09:00', 'confirmado', 150.00)
ON CONFLICT DO NOTHING;

-- 8. Verificar se funcionou
SELECT 
  'SUCCESS: Tabela appointments criada com sucesso!' as resultado,
  COUNT(*) as total_agendamentos
FROM public.appointments;

-- 9. Mostrar dados inseridos
SELECT 
  id,
  client_name,
  service,
  date,
  start_time,
  status,
  price
FROM public.appointments
ORDER BY date, start_time;

-- ✅ RESULTADO ESPERADO:
-- - Erro "42P01" desaparece
-- - BeautifulAppointments funciona
-- - Dashboard mostra agendamentos reais
-- - CRUD de agendamentos operacional
