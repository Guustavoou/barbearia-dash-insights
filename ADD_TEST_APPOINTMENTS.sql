-- 📊 ADICIONAR DADOS DE TESTE - Resolve tabela vazia
-- Execute no Supabase SQL Editor

-- Primeiro, verificar se temos business
INSERT INTO public.businesses (id, name, slug) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salao-premium')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados diretamente na tabela Appointments (maiúscula)
INSERT INTO public."Appointments" (
    id,
    business_id,
    client_id,
    employee_id,
    service_id,
    booking_date,
    start_time,
    end_time,
    duration,
    status,
    price,
    notes
) VALUES 
(
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    CURRENT_DATE,
    '10:00',
    '11:00',
    60,
    'confirmado',
    80.00,
    'Teste de agendamento'
),
(
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    CURRENT_DATE,
    '14:00',
    '15:30',
    90,
    'pendente',
    150.00,
    'Agendamento de teste 2'
),
(
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    CURRENT_DATE + 1,
    '09:00',
    '10:00',
    60,
    'concluido',
    100.00,
    'Agendamento concluído'
);

-- Verificar se os dados foram inseridos
SELECT 'DADOS INSERIDOS!' as resultado, COUNT(*) as total_appointments 
FROM public.appointments;

-- Testar a view appointments
SELECT 
    id,
    business_id,
    professional_id,
    date,
    start_time,
    status,
    price
FROM public.appointments
LIMIT 3;
