
-- Criar tabela de barbearias (tenants)
CREATE TABLE public.barbershops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de funcionários/profissionais
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  specialties TEXT[],
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias')),
  commission DECIMAL(5,2) DEFAULT 0,
  work_days TEXT[],
  work_hours_start TIME,
  work_hours_end TIME,
  hired_date DATE DEFAULT CURRENT_DATE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_services INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  completed_services INTEGER DEFAULT 0,
  cancelled_services INTEGER DEFAULT 0,
  bio TEXT,
  experience INTEGER DEFAULT 0,
  certifications TEXT[],
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  cpf TEXT,
  profession TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  last_visit DATE,
  total_spent DECIMAL(10,2) DEFAULT 0,
  visits INTEGER DEFAULT 0,
  notes TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  commission DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  popularity INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  professionals UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado', 'faltou')),
  price DECIMAL(8,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos/estoque
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  status TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN quantity = 0 THEN 'sem-estoque'
      WHEN quantity <= min_quantity THEN 'estoque-baixo'
      ELSE 'em-estoque'
    END
  ) STORED,
  last_sale DATE,
  sales_count INTEGER DEFAULT 0,
  supplier TEXT,
  barcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transações financeiras
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id UUID REFERENCES public.barbershops(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('dinheiro', 'cartao-credito', 'cartao-debito', 'pix', 'transferencia')),
  status TEXT DEFAULT 'confirmado' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  recurring BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para barbearias
CREATE POLICY "Users can view their own barbershops" ON public.barbershops
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own barbershops" ON public.barbershops
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own barbershops" ON public.barbershops
  FOR UPDATE USING (owner_id = auth.uid());

-- Função helper para verificar se o usuário pertence à barbearia
CREATE OR REPLACE FUNCTION public.user_barbershop_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT id FROM public.barbershops WHERE owner_id = auth.uid() LIMIT 1;
$$;

-- Políticas RLS para profissionais
CREATE POLICY "Users can view professionals from their barbershop" ON public.professionals
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create professionals in their barbershop" ON public.professionals
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update professionals in their barbershop" ON public.professionals
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete professionals from their barbershop" ON public.professionals
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para clientes
CREATE POLICY "Users can view clients from their barbershop" ON public.clients
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create clients in their barbershop" ON public.clients
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update clients in their barbershop" ON public.clients
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete clients from their barbershop" ON public.clients
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para serviços
CREATE POLICY "Users can view services from their barbershop" ON public.services
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create services in their barbershop" ON public.services
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update services in their barbershop" ON public.services
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete services from their barbershop" ON public.services
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para agendamentos
CREATE POLICY "Users can view appointments from their barbershop" ON public.appointments
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create appointments in their barbershop" ON public.appointments
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update appointments in their barbershop" ON public.appointments
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete appointments from their barbershop" ON public.appointments
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para produtos
CREATE POLICY "Users can view products from their barbershop" ON public.products
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create products in their barbershop" ON public.products
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update products in their barbershop" ON public.products
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete products from their barbershop" ON public.products
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Políticas RLS para transações
CREATE POLICY "Users can view transactions from their barbershop" ON public.transactions
  FOR SELECT USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can create transactions in their barbershop" ON public.transactions
  FOR INSERT WITH CHECK (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can update transactions in their barbershop" ON public.transactions
  FOR UPDATE USING (barbershop_id = public.user_barbershop_id());

CREATE POLICY "Users can delete transactions from their barbershop" ON public.transactions
  FOR DELETE USING (barbershop_id = public.user_barbershop_id());

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_barbershops_updated_at BEFORE UPDATE ON public.barbershops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
