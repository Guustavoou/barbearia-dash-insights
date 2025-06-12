export interface Transaction {
  id: number;
  type: "receita" | "despesa";
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod:
    | "dinheiro"
    | "cartao-credito"
    | "cartao-debito"
    | "pix"
    | "transferencia";
  status: "pendente" | "confirmado" | "cancelado";
  professionalId?: number;
  serviceId?: number;
  clientId?: number;
  recurring?: boolean;
  tags?: string[];
}

export interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueGrowth: number;
  expenseGrowth: number;
  profitMargin: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface PaymentMethodStats {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface CategoryStats {
  category: string;
  amount: number;
  count: number;
  type: "receita" | "despesa";
}

export type TransactionSortField = "date" | "amount" | "category" | "type";
export type TransactionSortOrder = "asc" | "desc";
export type DateRange =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";
