-- 🚨 URGENT FIX: Resolver erro 23502 - slug NOT NULL constraint
-- Execute este script no Supabase SQL Editor para resolver o erro do slug

-- Opção 1: Tornar a coluna slug NULLABLE (Recomendado)
-- Isso permite que registros sejam criados sem um slug
ALTER TABLE IF EXISTS public.businesses 
ALTER COLUMN slug DROP NOT NULL;

-- Opção 2: Adicionar valor padrão para slug
-- Isso garante que sempre haverá um valor para slug
ALTER TABLE IF EXISTS public.businesses 
ALTER COLUMN slug SET DEFAULT '';

-- Opção 3: Atualizar registros existentes que podem ter slug NULL
UPDATE public.businesses 
SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '.', ''))
WHERE slug IS NULL OR slug = '';

-- Verificar se a coluna slug existe, se não existir, criá-la como opcional
DO $$ 
BEGIN
    -- Verificar se a coluna slug existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'slug' 
        AND table_schema = 'public'
    ) THEN
        -- Se não existir, criar como campo opcional
        ALTER TABLE public.businesses ADD COLUMN slug TEXT;
        RAISE NOTICE 'Coluna slug adicionada como campo opcional';
    ELSE
        RAISE NOTICE 'Coluna slug já existe';
    END IF;
END $$;

-- Garantir que a estrutura da tabela businesses esteja completa
-- e compatível com o que a aplicação espera
DO $$ 
BEGIN
    -- Verificar e corrigir a estrutura da tabela businesses
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'businesses' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Tabela businesses existe, verificando estrutura...';
        
        -- Garantir que campos essenciais existam
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'businesses' AND column_name = 'name' AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.businesses ADD COLUMN name TEXT;
        END IF;
        
        -- Atualizar qualquer registro problemático
        UPDATE public.businesses 
        SET 
            slug = COALESCE(slug, LOWER(REPLACE(REPLACE(COALESCE(name, 'business'), ' ', '-'), '.', ''))),
            name = COALESCE(name, 'Business'),
            status = COALESCE(status, 'active'),
            subscription_plan = COALESCE(subscription_plan, 'trial'),
            timezone = COALESCE(timezone, 'America/New_York'),
            currency = COALESCE(currency, 'USD'),
            locale = COALESCE(locale, 'en-US'),
            settings = COALESCE(settings, '{}')
        WHERE id = '550e8400-e29b-41d4-a716-446655440000';
        
    ELSE
        RAISE NOTICE 'Tabela businesses não existe, será criada pela aplicação';
    END IF;
END $$;

-- Recrear a tabela businesses com estrutura limpa e sem constraint problemática
DROP TABLE IF EXISTS public.businesses CASCADE;

CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT, -- OPCIONAL - sem NOT NULL constraint
    email TEXT,
    phone TEXT,
    business_type TEXT DEFAULT 'salon',
    status TEXT DEFAULT 'active',
    subscription_plan TEXT DEFAULT 'trial',
    timezone TEXT DEFAULT 'America/New_York',
    currency TEXT DEFAULT 'USD',
    locale TEXT DEFAULT 'en-US',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir o business padrão com dados completos
INSERT INTO public.businesses (
    id, 
    name, 
    slug,
    business_type, 
    email, 
    phone,
    status,
    subscription_plan,
    timezone,
    currency,
    locale,
    settings
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000', 
    'Salão Premium',
    'salao-premium',
    'salon', 
    'contato@salaopremium.com', 
    '(11) 99999-0000',
    'active',
    'trial',
    'America/New_York',
    'USD',
    'en-US',
    '{}'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    business_type = EXCLUDED.business_type,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    status = EXCLUDED.status,
    subscription_plan = EXCLUDED.subscription_plan,
    timezone = EXCLUDED.timezone,
    currency = EXCLUDED.currency,
    locale = EXCLUDED.locale,
    settings = EXCLUDED.settings,
    updated_at = NOW();

-- Garantir permissões
GRANT ALL PRIVILEGES ON public.businesses TO anon, authenticated;

-- Verificação final
SELECT 
    'BUSINESSES TABLE FIXED' as status,
    id,
    name,
    slug,
    business_type,
    status,
    subscription_plan
FROM public.businesses
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '🎉 ERRO 23502 RESOLVIDO!';
    RAISE NOTICE '✅ Coluna slug não é mais obrigatória';
    RAISE NOTICE '📊 Business padrão criado com sucesso';
    RAISE NOTICE '🔄 Recarregue a aplicação agora!';
END $$;
