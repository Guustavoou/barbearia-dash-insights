-- Schema SEGURO para Supabase (não dá erro se tabelas já existem)
-- Execute este script no SQL Editor do seu projeto Supabase

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist (cuidado: isso apaga os dados!)
drop table if exists public.transactions cascade;
drop table if exists public.appointments cascade;
drop table if exists public.products cascade;
drop table if exists public.services cascade;
drop table if exists public.professionals cascade;
drop table if exists public.clients cascade;

-- Table: clients
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  birthday text,
  total_spent numeric default 0,
  visits integer default 0,
  last_visit text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: professionals
create table public.professionals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  specialty text not null,
  commission_rate numeric default 0,
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: services
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  duration_minutes integer not null,
  category text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sku text not null unique,
  category text not null,
  brand text,
  cost_price numeric not null,
  price numeric not null,
  current_stock integer default 0,
  min_stock integer default 0,
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: appointments
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  date text not null,
  time text not null,
  status text default 'agendado' check (status in ('agendado', 'concluido', 'cancelado', 'faltou')),
  price numeric not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: transactions
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('receita', 'despesa')),
  category text not null,
  amount numeric not null,
  payment_method text,
  appointment_id uuid references public.appointments(id) on delete set null,
  description text,
  date text not null,
  status text default 'pendente' check (status in ('pendente', 'confirmado', 'cancelado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists idx_clients_email on public.clients(email);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_transactions_type on public.transactions(type);
create index if not exists idx_transactions_date on public.transactions(date);

-- Enable Row Level Security (RLS)
alter table public.clients enable row level security;
alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.appointments enable row level security;
alter table public.transactions enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Allow all operations on clients" on public.clients;
drop policy if exists "Allow all operations on professionals" on public.professionals;
drop policy if exists "Allow all operations on services" on public.services;
drop policy if exists "Allow all operations on products" on public.products;
drop policy if exists "Allow all operations on appointments" on public.appointments;
drop policy if exists "Allow all operations on transactions" on public.transactions;

-- Create policies for public access (adjust as needed for your security requirements)
-- Note: In production, you should implement proper user-based policies

-- Clients policies
create policy "Allow all operations on clients" on public.clients
  for all using (true) with check (true);

-- Professionals policies  
create policy "Allow all operations on professionals" on public.professionals
  for all using (true) with check (true);

-- Services policies
create policy "Allow all operations on services" on public.services
  for all using (true) with check (true);

-- Products policies
create policy "Allow all operations on products" on public.products
  for all using (true) with check (true);

-- Appointments policies
create policy "Allow all operations on appointments" on public.appointments
  for all using (true) with check (true);

-- Transactions policies
create policy "Allow all operations on transactions" on public.transactions
  for all using (true) with check (true);

-- Insert some sample data
INSERT INTO public.professionals (name, email, phone, specialty) VALUES
('Maria Silva', 'maria@salon.com', '(11) 99999-0001', 'Cabeleireira'),
('João Santos', 'joao@salon.com', '(11) 99999-0002', 'Barbeiro'),
('Paula Costa', 'paula@salon.com', '(11) 99999-0003', 'Esteticista');

INSERT INTO public.services (name, description, price, duration_minutes, category) VALUES
('Corte Masculino', 'Corte de cabelo masculino tradicional', 50.00, 30, 'Cabelo'),
('Corte + Escova', 'Corte feminino com escova', 120.00, 60, 'Cabelo'),
('Barba', 'Corte e aparação de barba', 50.00, 30, 'Barba'),
('Coloração', 'Coloração completa do cabelo', 180.00, 120, 'Cabelo'),
('Manicure', 'Cuidados das unhas das mãos', 25.00, 45, 'Unhas');

INSERT INTO public.clients (name, email, phone, city) VALUES
('Ana Silva', 'ana@email.com', '(11) 98888-0001', 'São Paulo'),
('Carlos Santos', 'carlos@email.com', '(11) 98888-0002', 'São Paulo'),
('Beatriz Costa', 'beatriz@email.com', '(11) 98888-0003', 'Osasco');

-- Mostrar quantos registros foram inseridos
SELECT 'Profissionais inseridos:' as tabela, count(*) as total FROM public.professionals
UNION ALL
SELECT 'Serviços inseridos:', count(*) FROM public.services
UNION ALL  
SELECT 'Clientes inseridos:', count(*) FROM public.clients;
