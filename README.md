# 💄 Unclic - Sistema Completo de Gestão para Salões de Beleza

Um sistema completo e moderno para gestão de salões de beleza, desenvolvido com React, TypeScript, TailwindCSS e componentes da UI mais modernos.

## ✨ Funcionalidades Principais

### 🏠 Dashboard Inteligente

- **Visão Geral Completa**: Métricas em tempo real de receita, agendamentos, clientes e satisfação
- **Gráficos Interativos**: Visualização de dados com Recharts para análise de tendências
- **Ações Rápidas**: Widget com atalhos para as principais funcionalidades
- **Insights Automáticos**: Horário de pico, cancelamentos e status da receita

### 📅 Gestão de Agendamentos

- **Calendário Interativo**: Visualização semanal com navegação fluida
- **Status Visuais**: Cores diferenciadas para confirmado, pendente e cancelado
- **Filtros Avançados**: Por profissional, serviço e período
- **Legendas Claras**: Identificação rápida do status dos agendamentos

### 👥 Gestão de Clientes

- **Perfis Completos**: Informações detalhadas, histórico e estatísticas
- **Busca e Filtros**: Localização rápida por nome, status ou dados
- **Visualizações Múltiplas**: Cards visuais ou tabela detalhada
- **Aniversariantes**: Alertas para datas especiais dos clientes

### 🛍️ Controle de Estoque

- **Inventário Completo**: Produtos com categoria, status e localização
- **Alertas Inteligentes**: Notificação de estoque baixo e produtos em falta
- **Analytics de Vendas**: Top produtos e análise de rotatividade
- **Gestão de Fornecedores**: Controle de compras e reposição

### ✂️ Catálogo de Serviços

- **Serviços Organizados**: Categorização por tipo (corte, coloração, etc.)
- **Precificação Flexível**: Definição de preços, duração e comissões
- **Avaliações**: Sistema de rating e feedback dos clientes
- **Gestão de Profissionais**: Atribuição de serviços por especialidade

### 👨‍💼 Gestão de Equipe

- **Perfis Profissionais**: Informações completas da equipe
- **Especialidades**: Definição de habilidades e serviços por profissional
- **Horários de Trabalho**: Configuração de disponibilidade e folgas
- **Performance**: Métricas de produtividade e avaliações

### 💰 Controle Financeiro

- **Dashboard Financeiro**: Receitas, despesas e lucro em tempo real
- **Análise de Métodos de Pagamento**: Distribuição por PIX, cartão, dinheiro
- **Relatórios Detalhados**: Exportação de dados financeiros
- **Metas e Projeções**: Acompanhamento de objetivos mensais

### 📊 Relatórios e Analytics

- **Business Intelligence**: Análises avançadas de performance
- **Gráficos Interativos**: Visualização de dados por período
- **Exportação**: Relatórios em PDF e Excel
- **KPIs Personalizados**: Métricas específicas do negócio

### 💳 Gestão de Pagamentos

- **Múltiplos Métodos**: PIX, cartão, dinheiro, transferência
- **Análise de Transações**: Histórico completo e filtros avançados
- **Taxas de Sucesso**: Monitoramento de aprovação de pagamentos
- **Integração Gateway**: Preparado para integrações de pagamento

### 📢 Marketing e Campanhas

- **Campanhas Automáticas**: Email, SMS, WhatsApp
- **Promoções**: Sistema de descontos e ofertas especiais
- **Analytics de Marketing**: ROI, conversão e engajamento
- **Programa de Fidelidade**: Gestão de pontos e recompensas

### 📁 Gestão Documental

- **Organização Inteligente**: Pastas por categoria (RH, Financeiro, etc.)
- **Upload e Download**: Interface drag-and-drop para arquivos
- **Busca Avançada**: Por nome, categoria ou tags
- **Controle de Versões**: Histórico de modificações

### 🔍 Busca Global Avançada

- **Busca Unificada**: Encontre qualquer informação rapidamente
- **Atalhos de Teclado**: `Ctrl+K` para acesso rápido
- **Resultados Categorizados**: Clientes, agendamentos, serviços, documentos
- **Navegação por Teclado**: Setas e Enter para seleção

### 🔔 Sistema de Notificações

- **Central de Notificações**: Todas as informações importantes em um lugar
- **Tipos Variados**: Agendamentos, pagamentos, alertas, sucessos
- **Priorização**: Alta, média e baixa prioridade com cores distintivas
- **Ações Rápidas**: Marcar como lido, remover, responder

### ⚙️ Configurações Avançadas

- **Perfil da Empresa**: Informações, logo e dados de contato
- **Preferências**: Tema (claro/escuro), idioma, formato de data
- **Configurações de Negócio**: Horários, regras, políticas
- **Segurança**: Gestão de senhas e autenticação

### 🆘 Central de Ajuda

- **FAQ Interativo**: Perguntas frequentes por categoria
- **Múltiplos Canais**: Telefone, email, chat online
- **Sistema de Tickets**: Acompanhamento de solicitações
- **Base de Conhecimento**: Tutoriais e documentação

## 🎨 Características Técnicas

### Design System Moderno

- **Dark/Light Mode**: Alternância completa entre temas
- **Responsivo**: Adaptação perfeita para mobile, tablet e desktop
- **Gradientes**: Design moderno com efeitos visuais atraentes
- **Micro-interações**: Animações sutis para melhor UX

### Componentes Reutilizáveis

- **Modais Inteligentes**: Formulários complexos com validação
- **Tabelas Avançadas**: Ordenação, filtros e paginação
- **Cards Informativos**: Layouts flexíveis e informativos
- **Navegação Fluida**: Sidebar colapsável e breadcrumbs

### Performance e Acessibilidade

- **TypeScript**: Tipagem completa para maior confiabilidade
- **Lazy Loading**: Carregamento otimizado de componentes
- **SEO Friendly**: Estrutura semântica e metadados
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **TailwindCSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **React Router DOM** - Navegação SPA
- **React Hook Form** - Formulários performáticos

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (Radix UI)
│   ├── CalendarView.tsx # Calendário de agendamentos
│   ├── GlobalSearch.tsx # Busca global avançada
│   ├── Header.tsx       # Cabeçalho da aplicação
│   ├── NotificationCenter.tsx # Central de notificações
│   ├── QuickActions.tsx # Ações rápidas
│   ├── Sidebar.tsx      # Menu lateral
│   └── modals/          # Modais para CRUD
├── pages/               # Páginas principais
│   ├── Appointments.tsx # Gestão de agendamentos
│   ├── Calendar.tsx     # Calendário avançado
│   ├── Clients.tsx      # Gestão de clientes
│   ├── Dashboard.tsx    # Painel principal
│   ├── Documents.tsx    # Gestão documental
│   ├── Financial.tsx    # Controle financeiro
│   ├── Help.tsx         # Central de ajuda
│   ├── Marketing.tsx    # Marketing e campanhas
│   ├── Payments.tsx     # Gestão de pagamentos
│   ├── Professionals.tsx # Gestão de equipe
│   ├── Reports.tsx      # Relatórios e analytics
│   ├── Services.tsx     # Catálogo de serviços
│   ├── Settings.tsx     # Configurações
│   └── Stock.tsx        # Controle de estoque
├── lib/                 # Utilities e tipos
│   ├── types.ts         # Interfaces TypeScript
│   ├── utils.ts         # Funções utilitárias
│   └── mockData.ts      # Dados de demonstração
└── hooks/               # Custom hooks
    ├── use-mobile.tsx   # Hook para detecção mobile
    └── use-toast.ts     # Hook para notificações
```

## 🎯 Casos de Uso

### Para Proprietários de Salão

- Monitoramento completo do negócio em tempo real
- Análise de performance e lucratividade
- Gestão de equipe e definição de metas
- Controle financeiro e planejamento estratégico

### Para Gerentes

- Acompanhamento de métricas operacionais
- Gestão de agendamentos e clientes
- Controle de estoque e fornecedores
- Relatórios de produtividade da equipe

### Para Recepcionistas

- Agendamento rápido e eficiente
- Consulta de disponibilidade em tempo real
- Gestão de lista de espera
- Comunicação com clientes

### Para Profissionais

- Visualização da própria agenda
- Acompanhamento de comissões
- Gestão de clientes fiéis
- Performance individual

## 🔧 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos TypeScript
npm run typecheck

# Executar testes
npm run test
```

## 📱 Compatibilidade

- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (90+)

## 🎮 Atalhos de Teclado

- `Ctrl + K` - Busca global
- `Ctrl + N` - Novo agendamento
- `Ctrl + U` - Novo cliente
- `Ctrl + S` - Novo serviço
- `Escape` - Fechar modais/menus
- `↑/↓` - Navegar em listas
- `Enter` - Selecionar item

## 🔄 Atualizações Futuras

### Versão 2.0 (Planejada)

- [ ] Integração com WhatsApp Business API
- [ ] Sistema de agendamento online para clientes
- [ ] App mobile nativo (React Native)
- [ ] Integração com gateways de pagamento
- [ ] Backup automático na nuvem

### Versão 2.1 (Planejada)

- [ ] Inteligência artificial para recomendações
- [ ] Sistema de delivery para produtos
- [ ] Programa de afiliados
- [ ] API pública para integrações

## 📞 Suporte

Para dúvidas, sugestões ou suporte técnico:

- 📧 Email: suporte@unclic.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: www.unclic.com
- 📚 Documentação: docs.unclic.com

---

**Desenvolvido com ❤️ para revolucionar a gestão de salões de beleza no Brasil**

_Versão atual: 1.0.0 | Última atualização: Janeiro 2024_
