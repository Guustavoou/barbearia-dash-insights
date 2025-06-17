-- URGENT FIX: Correct Multi-Tenant Schema for Supabase
-- This script creates the complete database structure that the application expects
-- Execute this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's safely drop existing tables if they exist (CAREFUL: This deletes data!)
-- Only uncomment if you want to start fresh
-- DROP TABLE IF EXISTS public.transactions CASCADE;
-- DROP TABLE IF EXISTS public.appointments CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.services CASCADE;
-- DROP TABLE IF EXISTS public.professionals CASCADE;
-- DROP TABLE IF EXISTS public.clients CASCADE;
-- DROP TABLE IF EXISTS public.businesses CASCADE;

-- Create businesses table (tenant root entity)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  business_type TEXT DEFAULT 'salon',
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trial')),
  subscription_plan TEXT DEFAULT 'basic',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clients table with business_id
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  birthday TEXT,
  total_spent NUMERIC DEFAULT 0,
  visits INTEGER DEFAULT 0,
  last_visit TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professionals table with business_id
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  commission_rate NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create services table with business_id
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table with business_id
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  cost_price NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appointments table with business_id
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- Store service name directly for flexibility
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado', 'faltou')),
  price NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create transactions table with business_id
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  description TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON public.clients(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON public.appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON public.appointments(professional_id);

CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_business_id ON public.professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON public.transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop policies for businesses
    DROP POLICY IF EXISTS "public_access_businesses" ON public.businesses;
    
    -- Drop policies for clients
    DROP POLICY IF EXISTS "public_access_clients" ON public.clients;
    
    -- Drop policies for professionals
    DROP POLICY IF EXISTS "public_access_professionals" ON public.professionals;
    
    -- Drop policies for services
    DROP POLICY IF EXISTS "public_access_services" ON public.services;
    
    -- Drop policies for products
    DROP POLICY IF EXISTS "public_access_products" ON public.products;
    
    -- Drop policies for appointments
    DROP POLICY IF EXISTS "public_access_appointments" ON public.appointments;
    
    -- Drop policies for transactions
    DROP POLICY IF EXISTS "public_access_transactions" ON public.transactions;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Ignore if policies don't exist
END $$;

-- Create public access policies for all tables (simplified for development)
-- Note: In production, implement proper authentication-based policies

CREATE POLICY "public_access_businesses" ON public.businesses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_clients" ON public.clients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_professionals" ON public.professionals
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_services" ON public.services
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_appointments" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_access_transactions" ON public.transactions
  FOR ALL USING (true) WITH CHECK (true);

-- Insert sample businesses
INSERT INTO public.businesses (id, name, email, phone, business_type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'contato@salaopremium.com', '(11) 99999-0001', 'salon'),
('550e8400-e29b-41d4-a716-446655440001', 'Barbearia Elite', 'contato@barbearia.com', '(11) 99999-0002', 'barbershop')
ON CONFLICT (id) DO NOTHING;

-- Get the first business ID for sample data
DO $$
DECLARE
    business_1_id UUID := '550e8400-e29b-41d4-a716-446655440000';
    business_2_id UUID := '550e8400-e29b-41d4-a716-446655440001';
BEGIN
    -- Insert sample professionals for business 1
    INSERT INTO public.professionals (business_id, name, email, phone, specialty) VALUES
    (business_1_id, 'Maria Silva', 'maria@salaopremium.com', '(11) 99999-0001', 'Cabeleireira'),
    (business_1_id, 'Ana Costa', 'ana@salaopremium.com', '(11) 99999-0002', 'Manicure'),
    (business_1_id, 'Paula Santos', 'paula@salaopremium.com', '(11) 99999-0003', 'Esteticista');
    
    -- Insert sample services for business 1
    INSERT INTO public.services (business_id, name, description, price, duration, category) VALUES
    (business_1_id, 'Corte + Escova', 'Corte feminino com escova', 120.00, 60, 'Cabelo'),
    (business_1_id, 'Coloração', 'Coloração completa do cabelo', 180.00, 120, 'Cabelo'),
    (business_1_id, 'Manicure', 'Cuidados das unhas das mãos', 25.00, 45, 'Unhas'),
    (business_1_id, 'Pedicure', 'Cuidados das unhas dos pés', 35.00, 60, 'Unhas'),
    (business_1_id, 'Limpeza de Pele', 'Limpeza facial completa', 80.00, 90, 'Estética');
    
    -- Insert sample clients for business 1
    INSERT INTO public.clients (business_id, name, email, phone, city) VALUES
    (business_1_id, 'Ana Silva', 'ana@email.com', '(11) 98888-0001', 'São Paulo'),
    (business_1_id, 'Carlos Santos', 'carlos@email.com', '(11) 98888-0002', 'São Paulo'),
    (business_1_id, 'Beatriz Costa', 'beatriz@email.com', '(11) 98888-0003', 'Osasco'),
    (business_1_id, 'Mariana Oliveira', 'mariana@email.com', '(11) 98888-0004', 'São Paulo'),
    (business_1_id, 'João Silva', 'joao@email.com', '(11) 98888-0005', 'Guarulhos');
    
    -- Insert sample products for business 1
    INSERT INTO public.products (business_id, name, description, category, cost_price, price, stock_quantity) VALUES
    (business_1_id, 'Shampoo Profissional', 'Shampoo para cabelos oleosos', 'Cabelo', 15.00, 25.00, 50),
    (business_1_id, 'Condicionador Hidratante', 'Condicionador para cabelos secos', 'Cabelo', 18.00, 30.00, 35),
    (business_1_id, 'Esmalte Vermelho', 'Esmalte profissional vermelho', 'Unhas', 8.00, 15.00, 20),
    (business_1_id, 'Máscara Facial', 'Máscara hidratante facial', 'Estética', 12.00, 25.00, 15);

    -- Insert sample data for business 2 (smaller dataset)
    INSERT INTO public.professionals (business_id, name, email, phone, specialty) VALUES
    (business_2_id, 'João Barbeiro', 'joao@barbearia.com', '(11) 88888-0001', 'Barbeiro');
    
    INSERT INTO public.services (business_id, name, description, price, duration, category) VALUES
    (business_2_id, 'Corte Masculino', 'Corte tradicional masculino', 50.00, 30, 'Cabelo'),
    (business_2_id, 'Barba', 'Corte e aparação de barba', 30.00, 20, 'Barba');
    
    INSERT INTO public.clients (business_id, name, email, phone, city) VALUES
    (business_2_id, 'Pedro Santos', 'pedro@email.com', '(11) 97777-0001', 'São Paulo');
    
END $$;

-- Create some sample appointments
DO $$
DECLARE
    business_1_id UUID := '550e8400-e29b-41d4-a716-446655440000';
    client_1 UUID;
    prof_1 UUID;
BEGIN
    -- Get first client and professional
    SELECT id INTO client_1 FROM public.clients WHERE business_id = business_1_id LIMIT 1;
    SELECT id INTO prof_1 FROM public.professionals WHERE business_id = business_1_id LIMIT 1;
    
    IF client_1 IS NOT NULL AND prof_1 IS NOT NULL THEN
        INSERT INTO public.appointments (business_id, client_id, professional_id, service_name, date, time, status, price) VALUES
        (business_1_id, client_1, prof_1, 'Corte + Escova', '2024-12-20', '10:00', 'agendado', 120.00),
        (business_1_id, client_1, prof_1, 'Manicure', '2024-12-21', '14:00', 'confirmado', 25.00);
    END IF;
END $$;

-- Create sample transactions
DO $$
DECLARE
    business_1_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    INSERT INTO public.transactions (business_id, type, category, amount, description, date, status) VALUES
    (business_1_id, 'receita', 'Serviços', 120.00, 'Corte + Escova - Ana Silva', '2024-12-20', 'confirmado'),
    (business_1_id, 'receita', 'Produtos', 25.00, 'Venda de Shampoo', '2024-12-20', 'confirmado'),
    (business_1_id, 'despesa', 'Produtos', 15.00, 'Compra de Shampoo', '2024-12-19', 'confirmado');
END $$;

-- Show summary of inserted data
SELECT 
    'Businesses' as table_name, 
    count(*) as total_records 
FROM public.businesses
UNION ALL
SELECT 
    'Clients', 
    count(*) 
FROM public.clients
UNION ALL
SELECT 
    'Professionals', 
    count(*) 
FROM public.professionals
UNION ALL
SELECT 
    'Services', 
    count(*) 
FROM public.services
UNION ALL
SELECT 
    'Products', 
    count(*) 
FROM public.products
UNION ALL
SELECT 
    'Appointments', 
    count(*) 
FROM public.appointments
UNION ALL
SELECT 
    'Transactions', 
    count(*) 
FROM public.transactions;

-- Verify business_id distribution
SELECT 
    b.name as business_name,
    (SELECT count(*) FROM public.clients c WHERE c.business_id = b.id) as clients,
    (SELECT count(*) FROM public.appointments a WHERE a.business_id = b.id) as appointments,
    (SELECT count(*) FROM public.services s WHERE s.business_id = b.id) as services,
    (SELECT count(*) FROM public.professionals p WHERE p.business_id = b.id) as professionals,
    (SELECT count(*) FROM public.products pr WHERE pr.business_id = b.id) as products,
    (SELECT count(*) FROM public.transactions t WHERE t.business_id = b.id) as transactions
FROM public.businesses b
ORDER BY b.name;

-- Success message
SELECT 'DATABASE SCHEMA APPLIED SUCCESSFULLY! All tables created with multi-tenant support.' as status;
