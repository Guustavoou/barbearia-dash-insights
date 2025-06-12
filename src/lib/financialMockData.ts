import {
  Transaction,
  FinancialStats,
  MonthlyData,
  PaymentMethodStats,
  CategoryStats,
} from "./financialTypes";

export const transactionsMockData: Transaction[] = [
  // Receitas
  {
    id: 1,
    type: "receita",
    category: "Serviços",
    description: "Corte + Escova - Ana Silva",
    amount: 85.0,
    date: new Date(2024, 0, 25),
    paymentMethod: "cartao-credito",
    status: "confirmado",
    professionalId: 1,
    serviceId: 1,
    clientId: 1,
  },
  {
    id: 2,
    type: "receita",
    category: "Serviços",
    description: "Manicure - Mariana Costa",
    amount: 45.0,
    date: new Date(2024, 0, 25),
    paymentMethod: "pix",
    status: "confirmado",
    professionalId: 3,
    serviceId: 4,
    clientId: 3,
  },
  {
    id: 3,
    type: "receita",
    category: "Produtos",
    description: "Venda de Shampoo Premium",
    amount: 45.9,
    date: new Date(2024, 0, 24),
    paymentMethod: "dinheiro",
    status: "confirmado",
  },
  {
    id: 4,
    type: "receita",
    category: "Serviços",
    description: "Barba - Carlos Lima",
    amount: 35.0,
    date: new Date(2024, 0, 24),
    paymentMethod: "cartao-debito",
    status: "confirmado",
    professionalId: 2,
    serviceId: 9,
    clientId: 2,
  },
  {
    id: 5,
    type: "receita",
    category: "Serviços",
    description: "Coloração - Julia Fernandes",
    amount: 120.0,
    date: new Date(2024, 0, 23),
    paymentMethod: "pix",
    status: "confirmado",
    professionalId: 1,
    serviceId: 8,
    clientId: 5,
  },

  // Despesas
  {
    id: 6,
    type: "despesa",
    category: "Produtos",
    description: "Compra de materiais - Fornecedor A",
    amount: 450.0,
    date: new Date(2024, 0, 22),
    paymentMethod: "transferencia",
    status: "confirmado",
    recurring: true,
  },
  {
    id: 7,
    type: "despesa",
    category: "Aluguel",
    description: "Aluguel do salão - Janeiro 2024",
    amount: 2500.0,
    date: new Date(2024, 0, 5),
    paymentMethod: "transferencia",
    status: "confirmado",
    recurring: true,
  },
  {
    id: 8,
    type: "despesa",
    category: "Funcionários",
    description: "Comissão Maria Silva",
    amount: 1200.0,
    date: new Date(2024, 0, 20),
    paymentMethod: "transferencia",
    status: "confirmado",
    professionalId: 1,
  },
  {
    id: 9,
    type: "despesa",
    category: "Funcionários",
    description: "Comissão João Santos",
    amount: 800.0,
    date: new Date(2024, 0, 20),
    paymentMethod: "transferencia",
    status: "confirmado",
    professionalId: 2,
  },
  {
    id: 10,
    type: "despesa",
    category: "Utilidades",
    description: "Conta de energia elétrica",
    amount: 380.0,
    date: new Date(2024, 0, 15),
    paymentMethod: "cartao-debito",
    status: "confirmado",
    recurring: true,
  },
  {
    id: 11,
    type: "despesa",
    category: "Marketing",
    description: "Facebook Ads - Janeiro",
    amount: 150.0,
    date: new Date(2024, 0, 10),
    paymentMethod: "cartao-credito",
    status: "confirmado",
    recurring: true,
  },
  {
    id: 12,
    type: "despesa",
    category: "Equipamentos",
    description: "Manutenção cadeira hidráulica",
    amount: 200.0,
    date: new Date(2024, 0, 8),
    paymentMethod: "dinheiro",
    status: "confirmado",
  },
  {
    id: 13,
    type: "receita",
    category: "Serviços",
    description: "Hidratação - Roberto Almeida",
    amount: 65.0,
    date: new Date(2024, 0, 26),
    paymentMethod: "pix",
    status: "pendente",
    professionalId: 1,
    serviceId: 7,
    clientId: 6,
  },
];

export const financialStats: FinancialStats = {
  totalRevenue: transactionsMockData
    .filter((t) => t.type === "receita" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.amount, 0),
  totalExpenses: transactionsMockData
    .filter((t) => t.type === "despesa" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.amount, 0),
  netProfit: 0, // Will be calculated
  revenueGrowth: 15.8,
  expenseGrowth: 8.2,
  profitMargin: 0, // Will be calculated
};

// Calculate net profit and margin
financialStats.netProfit =
  financialStats.totalRevenue - financialStats.totalExpenses;
financialStats.profitMargin =
  (financialStats.netProfit / financialStats.totalRevenue) * 100;

export const monthlyData: MonthlyData[] = [
  { month: "Jul", revenue: 12500, expenses: 8200, profit: 4300 },
  { month: "Ago", revenue: 14200, expenses: 8800, profit: 5400 },
  { month: "Set", revenue: 13800, expenses: 9100, profit: 4700 },
  { month: "Out", revenue: 15600, expenses: 9500, profit: 6100 },
  { month: "Nov", revenue: 16200, expenses: 9800, profit: 6400 },
  { month: "Dez", revenue: 18500, expenses: 10200, profit: 8300 },
  { month: "Jan", revenue: 19200, expenses: 10800, profit: 8400 },
];

export const paymentMethodStats: PaymentMethodStats[] = [
  { method: "PIX", amount: 8250, count: 45, percentage: 35 },
  { method: "Cartão de Crédito", amount: 6800, count: 32, percentage: 29 },
  { method: "Cartão de Débito", amount: 4200, count: 28, percentage: 18 },
  { method: "Dinheiro", amount: 3150, count: 22, percentage: 13 },
  { method: "Transferência", amount: 1200, count: 8, percentage: 5 },
];

export const revenueCategories: CategoryStats[] = [
  { category: "Serviços", amount: 18500, count: 89, type: "receita" },
  { category: "Produtos", amount: 2800, count: 34, type: "receita" },
  { category: "Outros", amount: 650, count: 12, type: "receita" },
];

export const expenseCategories: CategoryStats[] = [
  { category: "Aluguel", amount: 2500, count: 1, type: "despesa" },
  { category: "Funcionários", amount: 2000, count: 2, type: "despesa" },
  { category: "Produtos", amount: 450, count: 1, type: "despesa" },
  { category: "Utilidades", amount: 380, count: 1, type: "despesa" },
  { category: "Equipamentos", amount: 200, count: 1, type: "despesa" },
  { category: "Marketing", amount: 150, count: 1, type: "despesa" },
];

export const transactionCategories = {
  receita: ["Serviços", "Produtos", "Outros"],
  despesa: [
    "Aluguel",
    "Funcionários",
    "Produtos",
    "Utilidades",
    "Equipamentos",
    "Marketing",
    "Impostos",
    "Manutenção",
    "Transporte",
  ],
};

export const paymentMethods = [
  { id: "dinheiro", name: "Dinheiro" },
  { id: "cartao-credito", name: "Cartão de Crédito" },
  { id: "cartao-debito", name: "Cartão de Débito" },
  { id: "pix", name: "PIX" },
  { id: "transferencia", name: "Transferência" },
];
