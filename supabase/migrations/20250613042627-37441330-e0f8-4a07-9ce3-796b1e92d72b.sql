
-- Primeiro, vamos habilitar RLS em todas as tabelas principais se ainda não estiver habilitado
ALTER TABLE public.barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para barbershops
DROP POLICY IF EXISTS "Users can view their own barbershop" ON public.barbershops;
CREATE POLICY "Users can view their own barbershop" ON public.barbershops
  FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own barbershop" ON public.barbershops;
CREATE POLICY "Users can update their own barbershop" ON public.barbershops
  FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own barbershop" ON public.barbershops;
CREATE POLICY "Users can insert their own barbershop" ON public.barbershops
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Políticas RLS para clientes
DROP POLICY IF EXISTS "Users can view clients from their barbershop" ON public.clients;
CREATE POLICY "Users can view clients from their barbershop" ON public.clients
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert clients to their barbershop" ON public.clients;
CREATE POLICY "Users can insert clients to their barbershop" ON public.clients
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update clients from their barbershop" ON public.clients;
CREATE POLICY "Users can update clients from their barbershop" ON public.clients
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete clients from their barbershop" ON public.clients;
CREATE POLICY "Users can delete clients from their barbershop" ON public.clients
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para agendamentos
DROP POLICY IF EXISTS "Users can view appointments from their barbershop" ON public.appointments;
CREATE POLICY "Users can view appointments from their barbershop" ON public.appointments
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert appointments to their barbershop" ON public.appointments;
CREATE POLICY "Users can insert appointments to their barbershop" ON public.appointments
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update appointments from their barbershop" ON public.appointments;
CREATE POLICY "Users can update appointments from their barbershop" ON public.appointments
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete appointments from their barbershop" ON public.appointments;
CREATE POLICY "Users can delete appointments from their barbershop" ON public.appointments
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para serviços
DROP POLICY IF EXISTS "Users can view services from their barbershop" ON public.services;
CREATE POLICY "Users can view services from their barbershop" ON public.services
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert services to their barbershop" ON public.services;
CREATE POLICY "Users can insert services to their barbershop" ON public.services
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update services from their barbershop" ON public.services;
CREATE POLICY "Users can update services from their barbershop" ON public.services
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete services from their barbershop" ON public.services;
CREATE POLICY "Users can delete services from their barbershop" ON public.services
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para profissionais
DROP POLICY IF EXISTS "Users can view professionals from their barbershop" ON public.professionals;
CREATE POLICY "Users can view professionals from their barbershop" ON public.professionals
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert professionals to their barbershop" ON public.professionals;
CREATE POLICY "Users can insert professionals to their barbershop" ON public.professionals
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update professionals from their barbershop" ON public.professionals;
CREATE POLICY "Users can update professionals from their barbershop" ON public.professionals
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete professionals from their barbershop" ON public.professionals;
CREATE POLICY "Users can delete professionals from their barbershop" ON public.professionals
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para produtos
DROP POLICY IF EXISTS "Users can view products from their barbershop" ON public.products;
CREATE POLICY "Users can view products from their barbershop" ON public.products
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert products to their barbershop" ON public.products;
CREATE POLICY "Users can insert products to their barbershop" ON public.products
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update products from their barbershop" ON public.products;
CREATE POLICY "Users can update products from their barbershop" ON public.products
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete products from their barbershop" ON public.products;
CREATE POLICY "Users can delete products from their barbershop" ON public.products
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para transações
DROP POLICY IF EXISTS "Users can view transactions from their barbershop" ON public.transactions;
CREATE POLICY "Users can view transactions from their barbershop" ON public.transactions
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can insert transactions to their barbershop" ON public.transactions;
CREATE POLICY "Users can insert transactions to their barbershop" ON public.transactions
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can update transactions from their barbershop" ON public.transactions;
CREATE POLICY "Users can update transactions from their barbershop" ON public.transactions
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

DROP POLICY IF EXISTS "Users can delete transactions from their barbershop" ON public.transactions;
CREATE POLICY "Users can delete transactions from their barbershop" ON public.transactions
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());
