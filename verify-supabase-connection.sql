-- VERIFICAÇÃO RÁPIDA DA CONEXÃO SUPABASE
-- Execute este script no SQL Editor do Supabase para verificar se tudo está funcionando

-- 1. Verificar se as tabelas principais existem
SELECT 
  'Tabelas existentes:' as status,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('businesses', 'clients', 'appointments', 'services', 'professionals', 'products', 'transactions')
ORDER BY table_name;

-- 2. Verificar se há dados nas tabelas
SELECT 
  'businesses' as tabela,
  COUNT(*) as total_registros
FROM public.businesses
UNION ALL
SELECT 
  'clients' as tabela,
  COUNT(*) as total_registros
FROM public.clients
UNION ALL
SELECT 
  'appointments' as tabela,
  COUNT(*) as total_registros
FROM public.appointments
UNION ALL
SELECT 
  'services' as tabela,
  COUNT(*) as total_registros
FROM public.services
UNION ALL
SELECT 
  'professionals' as tabela,
  COUNT(*) as total_registros
FROM public.professionals
UNION ALL
SELECT 
  'products' as tabela,
  COUNT(*) as total_registros
FROM public.products
UNION ALL
SELECT 
  'transactions' as tabela,
  COUNT(*) as total_registros
FROM public.transactions;

-- 3. Verificar RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_ativo
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('businesses', 'clients', 'appointments', 'services', 'professionals', 'products', 'transactions')
ORDER BY tablename;

-- 4. Teste de inserção simples (para verificar se funciona)
-- Descomente as linhas abaixo apenas para testar:

-- INSERT INTO public.businesses (name, business_type) VALUES ('Teste Conectividade', 'salon');
-- DELETE FROM public.businesses WHERE name = 'Teste Conectividade';

-- 5. Verificar se as policies RLS estão ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
