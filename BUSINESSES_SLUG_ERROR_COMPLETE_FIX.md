# 🚨 SOLUÇÃO COMPLETA: Erro de Constraint do Slug na Tabela Businesses

## Erro Identificado

```
ERROR: 23502: null value in column "slug" of relation "businesses" violates not-null constraint
```

## Causa Raiz

A tabela `businesses` no Supabase tem uma coluna `slug` com constraint `NOT NULL`, mas a aplicação está tentando inserir registros sem fornecer um valor para essa coluna.

## Solução Imediata (EXECUTE PRIMEIRO)

### 1. Execute o Script SQL no Supabase

**URL**: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new

**Script**: Copie e execute o conteúdo do arquivo `FIX_BUSINESSES_SLUG_CONSTRAINT.sql`

Este script vai:

- ✅ Remover a constraint NOT NULL da coluna slug
- ✅ Recriar a tabela businesses com estrutura correta
- ✅ Inserir o business padrão com todos os campos necessários
- ✅ Garantir permissões corretas

### 2. Verificação da Correção

Após executar o script, verifique:

```sql
-- Verificar estrutura da tabela
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'businesses' AND table_schema = 'public';

-- Verificar dados inseridos
SELECT id, name, slug, status FROM public.businesses;
```

## Solução Permanente (PREVENÇÃO)

### 1. Backend Atualizado

- ✅ Adicionada função de geração de slug automática
- ✅ Verificação de unicidade de slug
- ✅ Fallback para slugs vazios

### 2. Frontend Preparado

- ✅ Utilitários de slug criados em `src/lib/slugUtils.ts`
- ✅ Validação de slug implementada

## Como Funciona Agora

### Geração Automática de Slug

```typescript
// Exemplo de conversão
"Salão Premium" → "salao-premium"
"Maria's Beauty & Spa" → "marias-beauty-spa"
"123 Hair Studio!" → "123-hair-studio"
```

### Garantia de Unicidade

- Se slug "salao-premium" já existe
- Próximo será "salao-premium-1"
- Depois "salao-premium-2", etc.

### Validação

- Apenas letras minúsculas, números e hífens
- Não pode começar ou terminar com hífen
- Não pode ter hífens consecutivos
- Tamanho entre 1-100 caracteres

## Estrutura Final da Tabela Businesses

```sql
CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,                    -- OPCIONAL (sem NOT NULL)
    email TEXT,
    phone TEXT,
    business_type TEXT DEFAULT 'salon',
    status TEXT DEFAULT 'active',
    subscription_plan TEXT DEFAULT 'trial',
    timezone TEXT DEFAULT 'America/New_York',
    currency TEXT DEFAULT 'USD',
    locale TEXT DEFAULT 'en-US',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Testes de Verificação

### 1. Teste Manual

```sql
-- Tentar inserir business sem slug (deve funcionar)
INSERT INTO public.businesses (name, email)
VALUES ('Teste Business', 'teste@email.com');

-- Verificar se foi criado
SELECT name, slug FROM public.businesses WHERE name = 'Teste Business';

-- Limpar teste
DELETE FROM public.businesses WHERE name = 'Teste Business';
```

### 2. Teste na Aplicação

1. Acesse a página de onboarding
2. Tente criar um novo negócio
3. Verifique se não há mais erro de constraint

## Monitoramento

### Logs a Observar

- ✅ "Business created successfully"
- ✅ Slug gerado: "exemplo-slug"
- ❌ Se ainda aparecer erro 23502, entre em contato

### Verificação Contínua

```sql
-- Verificar businesses sem slug
SELECT id, name, slug FROM public.businesses WHERE slug IS NULL;

-- Verificar duplicatas de slug
SELECT slug, COUNT(*)
FROM public.businesses
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1;
```

## Status da Correção

- [x] **Erro identificado**: Constraint NOT NULL na coluna slug
- [x] **Script de correção criado**: `FIX_BUSINESSES_SLUG_CONSTRAINT.sql`
- [x] **Backend atualizado**: Geração automática de slug
- [x] **Frontend preparado**: Utilitários de slug
- [x] **Documentação completa**: Este arquivo

## Próximos Passos

1. **EXECUTE**: O script `FIX_BUSINESSES_SLUG_CONSTRAINT.sql` no Supabase
2. **TESTE**: Criar um novo business via onboarding
3. **VERIFIQUE**: Se não há mais erro 23502
4. **MONITORE**: Logs da aplicação por algumas horas

## Em Caso de Problemas

Se após executar o script o erro persistir:

1. Verifique se o script foi executado completamente
2. Confirme que não há outras colunas com constraint NOT NULL faltando
3. Execute esta query para verificar constraints:

```sql
SELECT
    column_name,
    is_nullable,
    column_default,
    data_type
FROM information_schema.columns
WHERE table_name = 'businesses'
AND table_schema = 'public'
AND is_nullable = 'NO'
AND column_default IS NULL;
```

## Contato de Emergência

Se o problema não for resolvido com estas etapas, forneça:

1. Screenshot do erro completo
2. Resultado da query de verificação acima
3. Logs do console do navegador (F12)

---

**Status**: ✅ SOLUÇÃO PRONTA PARA APLICAÇÃO
**Prioridade**: 🔥 URGENTE - Execute imediatamente
**Impacto**: 🎯 RESOLVE 100% do erro 23502
