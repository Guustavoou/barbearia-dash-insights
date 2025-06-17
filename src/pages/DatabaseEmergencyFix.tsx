import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Database,
  ExternalLink,
  Copy,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DatabaseEmergencyFixProps {
  onComplete?: () => void;
}

export const DatabaseEmergencyFix: React.FC<DatabaseEmergencyFixProps> = ({
  onComplete,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const projectId = supabaseUrl ? supabaseUrl.split("//")[1].split(".")[0] : "";
  const sqlEditorUrl = `https://app.supabase.com/project/${projectId}/sql/new`;

  const sqlScript = `-- URGENT FIX: Create Missing Tables for Appointments
-- Execute this complete script in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create professionals table
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialties TEXT[] DEFAULT '{}',
  commission NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  working_days TEXT[] DEFAULT '{}',
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration INTEGER DEFAULT 60,
  category TEXT DEFAULT 'geral',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appointments table (FIXES THE ERROR!)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
  price NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  cost_price NUMERIC DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  supplier TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  payment_method TEXT,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON public.clients(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON public.appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_business_id ON public.professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON public.transactions(business_id);

-- Insert sample businesses
INSERT INTO public.businesses (id, name, business_type, email, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Salão Premium', 'salon', 'contato@salaopremium.com', '(11) 99999-0000'),
('550e8400-e29b-41d4-a716-446655440001', 'Barbearia Elite', 'barbershop', 'contato@barbearia.com', '(11) 99999-0001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for testing
INSERT INTO public.clients (business_id, name, email, phone, city) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva', 'ana@email.com', '(11) 99999-1111', 'São Paulo'),
('550e8400-e29b-41d4-a716-446655440000', 'Carlos Santos', 'carlos@email.com', '(11) 99999-2222', 'São Paulo'),
('550e8400-e29b-41d4-a716-446655440001', 'João Oliveira', 'joao@email.com', '(11) 99999-3333', 'Rio de Janeiro')
ON CONFLICT DO NOTHING;

INSERT INTO public.professionals (business_id, name, email, specialties) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Maria Santos', 'maria@salon.com', ARRAY['Corte', 'Coloração']),
('550e8400-e29b-41d4-a716-446655440000', 'Paula Costa', 'paula@salon.com', ARRAY['Escova', 'Tratamentos']),
('550e8400-e29b-41d4-a716-446655440001', 'Roberto Silva', 'roberto@barber.com', ARRAY['Corte Masculino', 'Barba'])
ON CONFLICT DO NOTHING;

INSERT INTO public.services (business_id, name, price, duration, category) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Corte Feminino', 80.00, 60, 'corte'),
('550e8400-e29b-41d4-a716-446655440000', 'Coloração', 150.00, 120, 'coloracao'),
('550e8400-e29b-41d4-a716-446655440001', 'Corte Masculino', 50.00, 30, 'corte'),
('550e8400-e29b-41d4-a716-446655440001', 'Barba', 30.00, 20, 'barba')
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully! All tables created.' as result;`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      toast({
        title: "✅ Script Copiado!",
        description: "O script SQL foi copiado para a área de transferência",
      });
      setStep(2);
    } catch (error) {
      toast({
        title: "❌ Erro ao copiar",
        description: "Copie manualmente o script abaixo",
        variant: "destructive",
      });
    }
  };

  const openSQLEditor = () => {
    window.open(sqlEditorUrl, "_blank");
    setStep(3);
  };

  const verifyDatabase = async () => {
    setIsVerifying(true);

    try {
      const { error } = await supabase
        .from("appointments")
        .select("*")
        .limit(1);

      if (!error) {
        setIsFixed(true);
        toast({
          title: "🎉 Banco Configurado!",
          description: "As tabelas foram criadas com sucesso",
        });

        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: "⚠️ Ainda não funcionou",
          description: "Verifique se o script foi executado completamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro na verificação",
        description: "Tente novamente em alguns segundos",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isFixed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800 dark:text-green-400">
              🎉 Problema Resolvido!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-700 dark:text-green-300">
              As tabelas foram criadas com sucesso! A aplicação agora está
              funcionando com dados reais do Supabase.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Recarregar Aplicação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-900 flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800 dark:text-red-400">
                🚨 Erro Crítico: Tabelas do Banco Não Existem
              </CardTitle>
              <p className="text-red-600 dark:text-red-400 text-sm">
                A tabela "appointments" não foi encontrada no Supabase
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Emergency Fix Steps */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="font-bold text-red-800 dark:text-red-400 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Correção Emergencial (3 passos - 2 minutos)
            </h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div
                className={`flex items-start space-x-4 p-4 rounded-lg ${step >= 1 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : "bg-gray-50 dark:bg-gray-800"}`}
              >
                <Badge className={step >= 1 ? "bg-blue-600" : "bg-gray-400"}>
                  1
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Copiar Script SQL</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Clique para copiar o script que cria todas as tabelas
                    necessárias.
                  </p>
                  <Button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={step > 1}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {step > 1 ? "Script Copiado ✓" : "Copiar Script SQL"}
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`flex items-start space-x-4 p-4 rounded-lg ${step >= 2 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : "bg-gray-50 dark:bg-gray-800"}`}
              >
                <Badge className={step >= 2 ? "bg-blue-600" : "bg-gray-400"}>
                  2
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    Abrir SQL Editor do Supabase
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Abra o editor SQL do seu projeto Supabase em uma nova aba.
                  </p>
                  <Button
                    onClick={openSQLEditor}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={step < 1}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir SQL Editor
                  </Button>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`flex items-start space-x-4 p-4 rounded-lg ${step >= 3 ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800"}`}
              >
                <Badge className={step >= 3 ? "bg-green-600" : "bg-gray-400"}>
                  3
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Executar e Verificar</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Cole o script no editor, clique em "Run", depois verifique
                    aqui.
                  </p>
                  <Button
                    onClick={verifyDatabase}
                    disabled={step < 2 || isVerifying}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isVerifying ? (
                      <>
                        <Database className="w-4 h-4 mr-2 animate-pulse" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verificar se Funcionou
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Script Preview */}
          {step >= 1 && (
            <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Script SQL (Cole no Supabase)
              </h4>
              <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto max-h-40">
                {sqlScript.substring(0, 500)}...
                <br />
                <span className="text-blue-600 font-semibold">
                  {sqlScript.length - 500} caracteres restantes - Script
                  completo copiado!
                </span>
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
              📋 Instruções Detalhadas:
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Clique em "Copiar Script SQL" acima</li>
              <li>Clique em "Abrir SQL Editor" (abre nova aba)</li>
              <li>Cole o script no editor (Ctrl+V)</li>
              <li>Clique no botão "Run" do Supabase</li>
              <li>Volte aqui e clique em "Verificar se Funcionou"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
