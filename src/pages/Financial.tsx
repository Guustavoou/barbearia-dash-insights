import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import {
  transactionsMockData,
  financialStats,
  monthlyData,
  paymentMethodStats,
  revenueCategories,
  expenseCategories,
  transactionCategories,
  paymentMethods,
} from "@/lib/financialMockData";
import {
  Transaction,
  TransactionSortField,
  TransactionSortOrder,
  DateRange,
} from "@/lib/financialTypes";
import {
  useTransactions,
  useFinancialStats,
  useMonthlyRevenue,
} from "@/hooks/useApi";

interface FinancialProps {
  darkMode: boolean;
}

export const Financial: React.FC<FinancialProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [sortBy, setSortBy] = useState<TransactionSortField>("date");
  const [sortOrder, setSortOrder] = useState<TransactionSortOrder>("desc");

  // API integration with automatic fallback
  const { data: apiTransactions, loading, error } = useTransactions();
  const { data: apiStats } = useFinancialStats();
  const { data: apiMonthlyData } = useMonthlyRevenue(12);

  // Use API data or fallback to mock data
  const transactions = apiTransactions?.data || transactionsMockData;
  const stats = apiStats?.data || financialStats;
  const chartData = apiMonthlyData?.data || monthlyData;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction: any) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "date":
          aValue = a.date;
          bValue = b.date;
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });

    return filtered;
  }, [searchTerm, typeFilter, categoryFilter, sortBy, sortOrder]);

  const getTransactionIcon = (type: string) => {
    return type === "receita" ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cartao-credito":
      case "cartao-debito":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Financeiro
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Controle completo das finanças do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50",
            )}
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={cn(
            "rounded-xl p-6 border-l-4 border-green-500",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Receita Total
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(financialStats.totalRevenue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{financialStats.revenueGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border-l-4 border-red-500",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Despesas Totais
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(financialStats.totalExpenses)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">
                  +{financialStats.expenseGrowth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border-l-4 border-blue-500",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Lucro Líquido
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(financialStats.netProfit)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-blue-600 font-medium">
                  Margem: {financialStats.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border-l-4 border-purple-500",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Transações
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {transactionsMockData.length}
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  darkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                Este mês
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Receitas vs Despesas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="month"
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: darkMode ? "#FFFFFF" : "#000000",
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "revenue"
                      ? "Receita"
                      : name === "expenses"
                        ? "Despesas"
                        : "Lucro",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Métodos de Pagamento
          </h3>
          <div className="space-y-4">
            {paymentMethodStats.map((method, index) => (
              <div key={method.method} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      {method.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatCurrency(method.amount)}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-500" : "text-gray-500",
                      )}
                    >
                      {method.count} transações
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: COLORS[index],
                      width: `${method.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div
        className={cn(
          "rounded-xl border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Transações Recentes
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-10 pr-4 py-2 rounded-lg border transition-colors",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  )}
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                )}
              >
                <option value="all">Todos os tipos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={cn(
                "border-b",
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <tr>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Data
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Descrição
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Categoria
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Pagamento
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Valor
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                darkMode ? "divide-gray-700" : "divide-gray-200",
              )}
            >
              {filteredTransactions.slice(0, 10).map((transaction) => (
                <tr
                  key={transaction.id}
                  className={cn(
                    "transition-colors",
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {formatDate(transaction.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span
                        className={cn(
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {transaction.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span
                        className={cn(
                          "text-sm",
                          darkMode ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {
                          paymentMethods.find(
                            (p) => p.id === transaction.paymentMethod,
                          )?.name
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "font-semibold",
                        transaction.type === "receita"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {transaction.type === "receita" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        transaction.status === "confirmado"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : transaction.status === "pendente"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
