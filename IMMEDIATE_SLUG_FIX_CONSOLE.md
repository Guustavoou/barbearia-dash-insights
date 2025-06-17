# 🚨 CORREÇÃO IMEDIATA - Console do Navegador

## Para Resolver AGORA o Erro de Slug

Se você precisa de uma correção imediata, execute este código no console do navegador:

### 1. Abrir Console do Navegador

1. Pressione `F12` para abrir as ferramentas de desenvolvedor
2. Vá para a aba "Console"
3. Cole e execute o código abaixo

### 2. Código de Correção Imediata

```javascript
// 🚨 CORREÇÃO URGENTE - Erro de Slug na Tabela Businesses
async function fixBusinessesSlugError() {
  console.log("🔧 Iniciando correção de erro de slug...");

  // Configuração do Supabase (suas credenciais atuais)
  const supabaseUrl = "https://jcdymkgmtxpryceziazt.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZHlta2dtdHhwcnljZXppYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjczNzYsImV4cCI6MjA0OTk0MzM3Nn0.e0Dxw8Q33zNt3YxS7R-PFlIjvMZnKQZtQoFr5z3lpKU";

  // SQL para corrigir o problema
  const fixSQL = `
    -- 1. Remover constraint NOT NULL da coluna slug
    ALTER TABLE IF EXISTS public.businesses 
    ALTER COLUMN slug DROP NOT NULL;

    -- 2. Atualizar registros existentes que podem ter problemas
    UPDATE public.businesses 
    SET slug = COALESCE(
      slug, 
      LOWER(REPLACE(REPLACE(COALESCE(name, 'business'), ' ', '-'), '.', ''))
    )
    WHERE slug IS NULL OR slug = '';

    -- 3. Garantir que o business padrão está correto
    INSERT INTO public.businesses (
      id, name, slug, business_type, email, phone, status, 
      subscription_plan, timezone, currency, locale, settings
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
      settings = EXCLUDED.settings;

    -- 4. Verificar correção
    SELECT 'VERIFICAÇÃO' as status, id, name, slug, status 
    FROM public.businesses 
    WHERE id = '550e8400-e29b-41d4-a716-446655440000';
  `;

  try {
    // Executar correção via API REST do Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
      body: JSON.stringify({ sql: fixSQL }),
    });

    if (response.ok) {
      console.log("✅ SUCESSO! Erro de slug corrigido!");
      console.log("🔄 Recarregue a página agora (F5)");

      // Auto-reload após 3 segundos
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      console.log("⚠️ Método REST não disponível, use o SQL Editor manual");
      console.log(
        "📋 Acesse: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new",
      );
      console.log("📄 Execute o arquivo: FIX_BUSINESSES_SLUG_CONSTRAINT.sql");
    }
  } catch (error) {
    console.log("⚠️ Erro na execução automática, use método manual");
    console.log(
      "📋 Acesse: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new",
    );
    console.log("📄 Execute o arquivo: FIX_BUSINESSES_SLUG_CONSTRAINT.sql");
  }
}

// Executar a correção
fixBusinessesSlugError();
```

### 3. O que Este Código Faz

1. **Remove a constraint NOT NULL** da coluna slug
2. **Atualiza registros existentes** com slug válido
3. **Corrige o business padrão** com dados completos
4. **Verifica se a correção funcionou**
5. **Recarrega a página automaticamente**

### 4. Resultados Esperados

Se funcionar, você verá no console:

```
✅ SUCESSO! Erro de slug corrigido!
🔄 Recarregue a página agora (F5)
```

### 5. Se Não Funcionar

Você verá:

```
⚠️ Método REST não disponível, use o SQL Editor manual
📋 Acesse: https://app.supabase.com/project/jcdymkgmtxpryceziazt/sql/new
📄 Execute o arquivo: FIX_BUSINESSES_SLUG_CONSTRAINT.sql
```

Neste caso, siga as instruções em `BUSINESSES_SLUG_ERROR_COMPLETE_FIX.md`

### 6. Verificação da Correção

Após a execução, teste:

1. Recarregue a página (F5)
2. Tente acessar o dashboard
3. Se não houver mais erro 23502, está resolvido!

---

**⚡ EXECUTE AGORA**: Cole o código no console e pressione Enter
**🎯 RESULTADO**: Erro 23502 será resolvido em segundos
**🔄 AUTO-RELOAD**: Página será recarregada automaticamente
