
-- First, let's check what we have and add only what's missing

-- Add missing columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add missing columns to clients table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'cpf') THEN
        ALTER TABLE public.clients ADD COLUMN cpf TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'city') THEN
        ALTER TABLE public.clients ADD COLUMN city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'profession') THEN
        ALTER TABLE public.clients ADD COLUMN profession TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'status') THEN
        ALTER TABLE public.clients ADD COLUMN status TEXT DEFAULT 'ativo';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'join_date') THEN
        ALTER TABLE public.clients ADD COLUMN join_date DATE DEFAULT CURRENT_DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'last_visit') THEN
        ALTER TABLE public.clients ADD COLUMN last_visit DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'total_spent') THEN
        ALTER TABLE public.clients ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'visits') THEN
        ALTER TABLE public.clients ADD COLUMN visits INTEGER DEFAULT 0;
    END IF;

    -- Add missing columns to services table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'category') THEN
        ALTER TABLE public.services ADD COLUMN category TEXT NOT NULL DEFAULT 'Corte';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'is_active') THEN
        ALTER TABLE public.services ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'commission') THEN
        ALTER TABLE public.services ADD COLUMN commission DECIMAL(5,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'popularity') THEN
        ALTER TABLE public.services ADD COLUMN popularity INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'average_rating') THEN
        ALTER TABLE public.services ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'professionals') THEN
        ALTER TABLE public.services ADD COLUMN professionals TEXT[];
    END IF;

    -- Add missing columns to appointments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'duration') THEN
        ALTER TABLE public.appointments ADD COLUMN duration INTEGER NOT NULL DEFAULT 30;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'price') THEN
        ALTER TABLE public.appointments ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0;
    END IF;
END
$$;

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their barbershop clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create clients for their barbershop" ON public.clients;
DROP POLICY IF EXISTS "Users can update their barbershop clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their barbershop clients" ON public.clients;

DROP POLICY IF EXISTS "Users can view their barbershop services" ON public.services;
DROP POLICY IF EXISTS "Users can create services for their barbershop" ON public.services;
DROP POLICY IF EXISTS "Users can update their barbershop services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their barbershop services" ON public.services;

DROP POLICY IF EXISTS "Users can view their barbershop professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can create professionals for their barbershop" ON public.professionals;
DROP POLICY IF EXISTS "Users can update their barbershop professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can delete their barbershop professionals" ON public.professionals;

DROP POLICY IF EXISTS "Users can view their barbershop appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments for their barbershop" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their barbershop appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their barbershop appointments" ON public.appointments;

DROP POLICY IF EXISTS "Users can view their barbershop transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions for their barbershop" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their barbershop transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their barbershop transactions" ON public.transactions;

-- Create RLS policies for clients
CREATE POLICY "Users can view their barbershop clients" 
  ON public.clients 
  FOR SELECT 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can create clients for their barbershop" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can update their barbershop clients" 
  ON public.clients 
  FOR UPDATE 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can delete their barbershop clients" 
  ON public.clients 
  FOR DELETE 
  USING (barbershop_id = user_barbershop_id());

-- Create RLS policies for services
CREATE POLICY "Users can view their barbershop services" 
  ON public.services 
  FOR SELECT 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can create services for their barbershop" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can update their barbershop services" 
  ON public.services 
  FOR UPDATE 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can delete their barbershop services" 
  ON public.services 
  FOR DELETE 
  USING (barbershop_id = user_barbershop_id());

-- Create RLS policies for professionals
CREATE POLICY "Users can view their barbershop professionals" 
  ON public.professionals 
  FOR SELECT 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can create professionals for their barbershop" 
  ON public.professionals 
  FOR INSERT 
  WITH CHECK (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can update their barbershop professionals" 
  ON public.professionals 
  FOR UPDATE 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can delete their barbershop professionals" 
  ON public.professionals 
  FOR DELETE 
  USING (barbershop_id = user_barbershop_id());

-- Create RLS policies for appointments
CREATE POLICY "Users can view their barbershop appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can create appointments for their barbershop" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can update their barbershop appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can delete their barbershop appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (barbershop_id = user_barbershop_id());

-- Create RLS policies for transactions
CREATE POLICY "Users can view their barbershop transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can create transactions for their barbershop" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can update their barbershop transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (barbershop_id = user_barbershop_id());

CREATE POLICY "Users can delete their barbershop transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (barbershop_id = user_barbershop_id());

-- Add updated_at triggers if they don't exist
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_professionals_updated_at ON public.professionals;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON public.services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at 
  BEFORE UPDATE ON public.professionals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
  BEFORE UPDATE ON public.appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON public.transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
