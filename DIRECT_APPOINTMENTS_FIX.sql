-- ⚡ CORREÇÃO DIRETA - Criar tabela appointments
-- Copie e execute AGORA no SQL Editor do Supabase
-- URL: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

-- Criar tabela appointments (MÍNIMA para resolver erro 42P01)
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID DEFAULT '550e8400-e29b-41d4-a716-446655440000',
  client_name TEXT,
  service TEXT,
  professional TEXT,
  date DATE DEFAULT CURRENT_DATE,
  start_time TIME DEFAULT '09:00',
  end_time TIME,
  status TEXT DEFAULT 'pendente',
  price NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dar permissões
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.appointments FOR ALL USING (true);

-- Inserir dados de teste
INSERT INTO public.appointments (client_name, service, date, start_time, status, price) VALUES 
('Ana Silva', 'Corte Feminino', CURRENT_DATE, '10:00', 'confirmado', 80.00),
('Maria Costa', 'Coloração', CURRENT_DATE, '14:00', 'pendente', 150.00),
('Carlos Santos', 'Corte Masculino', CURRENT_DATE + 1, '09:00', 'confirmado', 50.00);

-- Verificar se funcionou
SELECT 'SUCCESS: Appointments table created!' as result, COUNT(*) as records FROM public.appointments;
