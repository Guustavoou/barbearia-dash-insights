-- 🔧 CORREÇÃO COMPLETA: Políticas RLS e Permissões
-- Execute este script para resolver TODOS os problemas de acesso às tabelas

-- =====================================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================

-- Verificar tabelas existentes
SELECT 
  'Verificação de Tabelas' as check_type,
  table_name,
  'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('businesses', 'clients', 'appointments', 'services', 'professionals', 'products', 'transactions')
ORDER BY table_name;

-- =====================================================
-- 2. DESABILITAR RLS TEMPORARIAMENTE PARA CORREÇÃO
-- =====================================================

-- Desabilitar RLS em todas as tabelas para permitir acesso total
ALTER TABLE IF EXISTS public.businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.businesses;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.appointments;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.services;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.professionals;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.transactions;

-- Remover qualquer outra política que possa existir
DROP POLICY IF EXISTS "Allow public read access" ON public.businesses;
DROP POLICY IF EXISTS "Allow public read access" ON public.clients;
DROP POLICY IF EXISTS "Allow public read access" ON public.appointments;
DROP POLICY IF EXISTS "Allow public read access" ON public.services;
DROP POLICY IF EXISTS "Allow public read access" ON public.professionals;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.transactions;

-- =====================================================
-- 4. CRIAR POLÍTICAS PERMISSIVAS (DESENVOLVIMENTO)
-- =====================================================

-- Para DESENVOLVIMENTO - Acesso total a todos os dados
-- NOTA: Em produção, implementar políticas mais restritivas

-- Businesses
CREATE POLICY "Allow all operations on businesses" ON public.businesses
  FOR ALL USING (true) WITH CHECK (true);

-- Clients  
CREATE POLICY "Allow all operations on clients" ON public.clients
  FOR ALL USING (true) WITH CHECK (true);

-- Appointments
CREATE POLICY "Allow all operations on appointments" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);

-- Services
CREATE POLICY "Allow all operations on services" ON public.services
  FOR ALL USING (true) WITH CHECK (true);

-- Professionals
CREATE POLICY "Allow all operations on professionals" ON public.professionals
  FOR ALL USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "Allow all operations on products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- Transactions
CREATE POLICY "Allow all operations on transactions" ON public.transactions
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 5. HABILITAR RLS NOVAMENTE
-- =====================================================

-- Reabilitar RLS com as novas políticas permissivas
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. GARANTIR PERMISSÕES PARA ANON E AUTHENTICATED
-- =====================================================

-- Dar permissões completas para usuários anônimos e autenticados
GRANT ALL ON public.businesses TO anon, authenticated;
GRANT ALL ON public.clients TO anon, authenticated;
GRANT ALL ON public.appointments TO anon, authenticated;
GRANT ALL ON public.services TO anon, authenticated;
GRANT ALL ON public.professionals TO anon, authenticated;
GRANT ALL ON public.products TO anon, authenticated;
GRANT ALL ON public.transactions TO anon, authenticated;

-- Permissões para sequences (IDs automáticos)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- 7. VERIFICAR SE AS TABELAS TÊM DADOS
-- =====================================================

-- Verificar contagem de registros
SELECT 'businesses' as tabela, COUNT(*) as registros FROM public.businesses
UNION ALL
SELECT 'clients' as tabela, COUNT(*) as registros FROM public.clients
UNION ALL
SELECT 'appointments' as tabela, COUNT(*) as registros FROM public.appointments
UNION ALL
SELECT 'services' as tabela, COUNT(*) as registros FROM public.services
UNION ALL
SELECT 'professionals' as tabela, COUNT(*) as registros FROM public.professionals
UNION ALL
SELECT 'products' as tabela, COUNT(*) as registros FROM public.products
UNION ALL
SELECT 'transactions' as tabela, COUNT(*) as registros FROM public.transactions;

-- =====================================================
-- 8. INSERIR DADOS DE TESTE SE NECESSÁRIO
-- =====================================================

-- Inserir business padrão se não existir
INSERT INTO public.businesses (id, name, business_type, email, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salon', 'contato@salaopremium.com', '(11) 99999-0000'),
('550e8400-e29b-41d4-a716-446655440001', 'Barbearia Elite', 'barbershop', 'contato@barbearia.com', '(11) 99999-0001')
ON CONFLICT (id) DO NOTHING;

-- Inserir clientes de teste
INSERT INTO public.clients (business_id, name, email, phone, city, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva Santos', 'ana.silva@email.com', '(11) 99999-1111', 'São Paulo', 'ativo'),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Roberto Lima', 'carlos.lima@email.com', '(11) 88888-2222', 'São Paulo', 'ativo'),
('550e8400-e29b-41d4-a716-446655440001', 'João Pedro Silva', 'joao.silva@email.com', '(11) 77777-3333', 'Rio de Janeiro', 'ativo')
ON CONFLICT DO NOTHING;

-- Inserir profissionais de teste
INSERT INTO public.professionals (business_id, name, email, phone, specialties, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Maria Santos', 'maria@salon.com', '(11) 99999-4444', ARRAY['Corte', 'Coloração'], 'ativo'),
('550e8400-e29b-41d4-a716-446655440000', 'Paula Costa', 'paula@salon.com', '(11) 99999-5555', ARRAY['Escova', 'Tratamentos'], 'ativo'),
('550e8400-e29b-41d4-a716-446655440001', 'Roberto Silva', 'roberto@barber.com', '(11) 99999-6666', ARRAY['Corte Masculino', 'Barba'], 'ativo')
ON CONFLICT DO NOTHING;

-- Inserir serviços de teste
INSERT INTO public.services (business_id, name, description, price, duration, category, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Corte Feminino', 'Corte profissional feminino', 80.00, 60, 'corte', true),
('550e8400-e29b-41d4-a716-446655440000', 'Coloração Completa', 'Coloração com produtos premium', 150.00, 120, 'coloracao', true),
('550e8400-e29b-41d4-a716-446655440000', 'Escova Progressiva', 'Escova para alisamento', 200.00, 180, 'tratamento', true),
('550e8400-e29b-41d4-a716-446655440001', 'Corte Masculino', 'Corte tradicional masculino', 50.00, 30, 'corte', true),
('550e8400-e29b-41d4-a716-446655440001', 'Barba Completa', 'Barba e bigode', 30.00, 20, 'barba', true)
ON CONFLICT DO NOTHING;

-- Inserir agendamentos de teste
INSERT INTO public.appointments (business_id, client_id, professional_id, service_id, date, start_time, end_time, status, price, notes) 
SELECT 
    b.id as business_id,
    c.id as client_id,
    p.id as professional_id,
    s.id as service_id,
    CURRENT_DATE as date,
    '10:00'::time as start_time,
    '11:00'::time as end_time,
    'confirmado' as status,
    s.price,
    'Agendamento de teste' as notes
FROM public.businesses b
JOIN public.clients c ON c.business_id = b.id
JOIN public.professionals p ON p.business_id = b.id
JOIN public.services s ON s.business_id = b.id
WHERE b.name = 'Salão Premium'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Inserir mais agendamentos de teste
INSERT INTO public.appointments (business_id, client_id, professional_id, service_id, date, start_time, end_time, status, price, notes) 
SELECT 
    b.id as business_id,
    c.id as client_id,
    p.id as professional_id,
    s.id as service_id,
    CURRENT_DATE + 1 as date,
    '14:00'::time as start_time,
    '15:00'::time as end_time,
    'pendente' as status,
    s.price,
    'Agendamento futuro' as notes
FROM public.businesses b
JOIN public.clients c ON c.business_id = b.id
JOIN public.professionals p ON p.business_id = b.id
JOIN public.services s ON s.business_id = b.id
WHERE b.name = 'Barbearia Elite'
LIMIT 1
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. TESTE FINAL - VERIFICAR SE TUDO FUNCIONA
-- =====================================================

-- Testar SELECT em todas as tabelas
SELECT 'TEST: businesses' as test_table, COUNT(*) as count FROM public.businesses;
SELECT 'TEST: clients' as test_table, COUNT(*) as count FROM public.clients;
SELECT 'TEST: appointments' as test_table, COUNT(*) as count FROM public.appointments;
SELECT 'TEST: services' as test_table, COUNT(*) as count FROM public.services;
SELECT 'TEST: professionals' as test_table, COUNT(*) as count FROM public.professionals;

-- Testar JOIN complexo (simulando query da aplicação)
SELECT 
    'TEST: Complex query' as test_type,
    COUNT(*) as appointments_with_relations
FROM public.appointments a
LEFT JOIN public.clients c ON a.client_id = c.id
LEFT JOIN public.services s ON a.service_id = s.id
LEFT JOIN public.professionals p ON a.professional_id = p.id;

-- =====================================================
-- 10. RESULTADO FINAL
-- =====================================================

SELECT 
    '🎉 CORREÇÃO CONCLUÍDA!' as status,
    'Todas as tabelas configuradas com acesso total' as message,
    'RLS habilitado com políticas permissivas' as rls_status,
    'Dados de teste inseridos' as data_status;

-- Mostrar políticas ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
