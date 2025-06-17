-- 🔧 CORREÇÃO COMPLETA DO BANCO DE DADOS
-- Execute este script para alinhar o banco com a aplicação

-- =====================================================
-- 1. CRIAR VIEWS PARA COMPATIBILITY
-- =====================================================

-- Criar view 'appointments' que mapeia para 'Appointments'
CREATE OR REPLACE VIEW public.appointments AS
SELECT 
    id,
    business_id,
    client_id,
    employee_id as professional_id,  -- Mapear employee_id para professional_id
    service_id,
    booking_date as date,           -- Mapear booking_date para date
    start_time,
    end_time,
    duration,
    status,
    price,
    notes,
    payment_method,
    rating,
    feedback_comment,
    reminder_sent,
    created_at,
    updated_at
FROM public."Appointments";

-- Dar permissões para a view
GRANT ALL ON public.appointments TO anon, authenticated;

-- =====================================================
-- 2. CRIAR VIEWS PARA OUTRAS TABELAS IMPORTANTES
-- =====================================================

-- View para clients (garantir lowercase)
CREATE OR REPLACE VIEW public.clients_view AS
SELECT * FROM public.clients;

-- View para services (garantir lowercase)  
CREATE OR REPLACE VIEW public.services_view AS
SELECT * FROM public.services;

-- View para professionals (mapear de professionals ou employees)
CREATE OR REPLACE VIEW public.professionals_view AS
SELECT 
    id,
    business_id,
    name,
    email,
    phone,
    avatar_url,
    bio,
    rating,
    total_reviews,
    status,
    "isActive" as is_active,
    "workingHours" as working_hours,
    created_at as "createdAt",
    updated_at as "updatedAt"
FROM public.professionals;

-- =====================================================
-- 3. CRIAR FUNCTIONS PARA INSERT/UPDATE/DELETE
-- =====================================================

-- Function para inserir appointments via view
CREATE OR REPLACE FUNCTION insert_appointment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Appointments" (
        business_id, client_id, employee_id, service_id,
        booking_date, start_time, end_time, duration,
        status, price, notes, payment_method
    ) VALUES (
        NEW.business_id, NEW.client_id, NEW.professional_id, NEW.service_id,
        NEW.date, NEW.start_time, NEW.end_time, NEW.duration,
        COALESCE(NEW.status, 'pendente'), COALESCE(NEW.price, 0), NEW.notes, NEW.payment_method
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function para atualizar appointments via view
CREATE OR REPLACE FUNCTION update_appointment()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Appointments" SET
        business_id = NEW.business_id,
        client_id = NEW.client_id,
        employee_id = NEW.professional_id,
        service_id = NEW.service_id,
        booking_date = NEW.date,
        start_time = NEW.start_time,
        end_time = NEW.end_time,
        duration = NEW.duration,
        status = NEW.status,
        price = NEW.price,
        notes = NEW.notes,
        payment_method = NEW.payment_method,
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function para deletar appointments via view
CREATE OR REPLACE FUNCTION delete_appointment()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public."Appointments" WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. CRIAR TRIGGERS PARA AS VIEWS
-- =====================================================

-- Trigger para INSERT
CREATE TRIGGER appointments_insert_trigger
    INSTEAD OF INSERT ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION insert_appointment();

-- Trigger para UPDATE
CREATE TRIGGER appointments_update_trigger
    INSTEAD OF UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_appointment();

-- Trigger para DELETE
CREATE TRIGGER appointments_delete_trigger
    INSTEAD OF DELETE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION delete_appointment();

-- =====================================================
-- 5. INSERIR DADOS DE TESTE COMPATÍVEIS
-- =====================================================

-- Inserir business se não existir
INSERT INTO public.businesses (id, name, slug, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salao-premium', 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns clientes de teste
INSERT INTO public.clients (id, business_id, name, email, phone, status) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Ana Silva', 'ana@email.com', '(11) 99999-1111', 'ativo'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Maria Costa', 'maria@email.com', '(11) 99999-2222', 'ativo')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns serviços de teste
INSERT INTO public.services (id, business_id, name, price, duration, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Corte Feminino', 80.00, 60, true),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Coloração', 150.00, 120, true)
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns profissionais de teste
INSERT INTO public.professionals (id, business_id, name, email, phone, "isActive") VALUES 
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Maria Santos', 'maria.prof@salon.com', '(11) 99999-3333', true),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Paula Costa', 'paula.prof@salon.com', '(11) 99999-4444', true)
ON CONFLICT (id) DO NOTHING;

-- Inserir appointments de teste via tabela original
INSERT INTO public."Appointments" (
    business_id, client_id, employee_id, service_id,
    booking_date, start_time, status, price
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001', 
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    CURRENT_DATE,
    '10:00',
    'confirmado',
    80.00
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440006', 
    '550e8400-e29b-41d4-a716-446655440004',
    CURRENT_DATE,
    '14:00',
    'pendente',
    150.00
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. VERIFICAÇÕES FINAIS
-- =====================================================

-- Testar a view appointments
SELECT 'VIEW APPOINTMENTS TEST' as test, COUNT(*) as records FROM public.appointments;

-- Testar insert via view
INSERT INTO public.appointments (
    business_id, professional_id, client_id, service_id,
    date, start_time, status, price
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    CURRENT_DATE + 1,
    '16:00',
    'pendente',
    80.00
);

-- Verificar dados finais
SELECT 
    'FINAL CHECK' as status,
    id,
    business_id,
    professional_id,
    date,
    start_time,
    status,
    price
FROM public.appointments
ORDER BY date, start_time
LIMIT 5;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '🎉 BANCO DE DADOS TOTALMENTE ALINHADO!';
    RAISE NOTICE '✅ Views de compatibilidade criadas';
    RAISE NOTICE '✅ Triggers para INSERT/UPDATE/DELETE ativos';
    RAISE NOTICE '✅ Dados de teste inseridos';
    RAISE NOTICE '🔄 Aplicação agora deve funcionar perfeitamente!';
END $$;
