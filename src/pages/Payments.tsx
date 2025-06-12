import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Settings,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface PaymentsProps {
  darkMode: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "pix" | "cash" | "bank_transfer";
  isActive: boolean;
  percentage: number;
  totalAmount: number;
  transactionCount: number;
  icon: string;
  description: string;
}

interface Transaction {
  id: string;
  date: string;
  client: string;
  service: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Cartão de Crédito",
    type: "card",
    isActive: true,
    percentage: 45.2,
    totalAmount: 12580.0,
    transactionCount: 156,
    icon: "💳",
    description: "Visa, Mastercard, Elo",
  },
  {
    id: "2",
    name: "PIX",
    type: "pix",
    isActive: true,
    percentage: 35.8,
    totalAmount: 9940.0,
    transactionCount: 203,
    icon: "🔄",
    description: "Transferência instantânea",
  },
  {
    id: "3",
    name: "Dinheiro",
    type: "cash",
    isActive: true,
    percentage: 15.3,
    totalAmount: 4250.0,
    transactionCount: 89,
    icon: "💵",
    description: "Pagamento à vista",
  },
  {
    id: "4",
    name: "Cartão de Débito",
    type: "card",
    isActive: true,
    percentage: 3.7,
    totalAmount: 1030.0,
    transactionCount: 23,
    icon: "💳",
    description: "Débito em conta",
  },
];

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-16",
    client: "Maria Silva",
    service: "Corte + Escova",
    amount: 85.0,
    method: "PIX",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-01-16",
    client: "João Santos",
    service: "Barba + Bigode",
    amount: 45.0,
    method: "Cartão de Crédito",
    status: "completed",
  },
  {
    id: "3",
    date: "2024-01-15",
    client: "Ana Costa",
    service: "Manicure",
    amount: 35.0,
    method: "Dinheiro",
    status: "completed",
  },
  {
    id: "4",
    date: "2024-01-15",
    client: "Carlos Oliveira",
    service: "Coloração",
    amount: 150.0,
    method: "PIX",
    status: "pending",
  },
  {
    id: "5",
    date: "2024-01-14",
    client: "Beatriz Lima",
    service: "Tratamento Capilar",
    amount: 120.0,
    method: "Cartão de Crédito",
    status: "failed",
  },
];

export const Payments: React.FC<PaymentsProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "methods" | "transactions" | "settings"
  >("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
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
                {formatCurrency(27800)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+12.5%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
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
                471
              </p>
            </div>
            <CreditCard className="h-10 w-10 text-blue-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+8.2%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
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
                Ticket Médio
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(59.02)}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+3.8%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={cn(
            "p-6 rounded-lg border",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
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
                Taxa de Sucesso
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                97.8%
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+0.5%</span>
            <span
              className={cn(
                "text-sm ml-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              vs mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Distribuição por Método de Pagamento
        </h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {method.name}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {method.transactionCount} transações
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {formatCurrency(method.totalAmount)}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {method.percentage}%
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMethods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Métodos de Pagamento
        </h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Método
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "p-6 rounded-lg border",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{method.icon}</span>
                <div>
                  <h4
                    className={cn(
                      "font-semibold",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {method.name}
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {method.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "p-2 rounded-lg",
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600",
                  )}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-lg",
                    darkMode
                      ? "hover:bg-gray-700 text-red-400"
                      : "hover:bg-gray-100 text-red-600",
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Receita Total
                </p>
                <p
                  className={cn(
                    "font-semibold text-lg",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {formatCurrency(method.totalAmount)}
                </p>
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Participação
                </p>
                <p
                  className={cn(
                    "font-semibold text-lg",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {method.percentage}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  method.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                {method.isActive ? "Ativo" : "Inativo"}
              </span>
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {method.transactionCount} transações
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Transações Recentes
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={cn(
            "px-3 py-2 rounded-lg border",
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900",
          )}
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
        </select>
      </div>

      <div
        className={cn(
          "rounded-lg border overflow-hidden",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={cn(
                "border-b",
                darkMode
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <tr>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Data
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Cliente
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Serviço
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Valor
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Método
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Status
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={cn(
                    "border-b transition-colors",
                    darkMode
                      ? "border-gray-700 hover:bg-gray-750"
                      : "border-gray-200 hover:bg-gray-50",
                  )}
                >
                  <td
                    className={cn(
                      "p-4",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td
                    className={cn(
                      "p-4 font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {transaction.client}
                  </td>
                  <td
                    className={cn(
                      "p-4",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {transaction.service}
                  </td>
                  <td
                    className={cn(
                      "p-4 font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td
                    className={cn(
                      "p-4",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {transaction.method}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full border",
                        getStatusColor(transaction.status),
                      )}
                    >
                      {transaction.status === "completed"
                        ? "Concluído"
                        : transaction.status === "pending"
                          ? "Pendente"
                          : "Falhado"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className={cn(
                        "p-2 rounded-lg",
                        darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600",
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Gestão de Pagamentos
        </h1>
        <p
          className={cn(
            "text-sm mt-1",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Gerencie métodos de pagamento e acompanhe transações
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        className={cn(
          "flex items-center p-1 rounded-lg border",
          darkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-300 bg-gray-100",
        )}
      >
        {(
          [
            { key: "overview", label: "Visão Geral", icon: TrendingUp },
            { key: "methods", label: "Métodos", icon: CreditCard },
            { key: "transactions", label: "Transações", icon: DollarSign },
            { key: "settings", label: "Configurações", icon: Settings },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === key
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "methods" && renderMethods()}
      {activeTab === "transactions" && renderTransactions()}
      {activeTab === "settings" && (
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3
            className={cn(
              "text-xl font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Configurações de Pagamento
          </h3>
          <p className={cn("text-gray-500 dark:text-gray-400")}>
            Configure taxas, limites e integrações com gateways de pagamento
          </p>
        </div>
      )}
    </div>
  );
};
