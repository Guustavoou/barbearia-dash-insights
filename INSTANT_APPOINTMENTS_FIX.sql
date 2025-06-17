-- 🚨 EXECUÇÃO IMEDIATA - Resolve erro 42P01 em 30 segundos
-- Copie este SQL e execute no Supabase: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

-- Criar view appointments que mapeia para Appointments (table existente)
CREATE OR REPLACE VIEW public.appointments AS
SELECT 
    id,
    business_id,
    client_id,
    employee_id as professional_id,
    service_id,
    booking_date as date,
    start_time,
    end_time,
    duration,
    status,
    price,
    notes,
    created_at,
    updated_at
FROM public."Appointments";

-- Dar permissões
GRANT ALL ON public.appointments TO anon, authenticated;

-- Verificar se funcionou
SELECT 'SUCCESS: appointments view created!' as result, COUNT(*) as records 
FROM public.appointments;
