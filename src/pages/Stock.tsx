import React, { useState, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import {
  productsMockData,
  stockStats,
  topSellingProducts,
  stockAlerts,
  lowRotationProducts,
  categories,
} from "@/lib/stockMockData";
import { Product } from "@/lib/stockTypes";
import { useProducts } from "@/hooks/useApi";

interface StockProps {
  darkMode: boolean;
}

export const Stock: React.FC<StockProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // API integration
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useProducts({
    search: searchTerm,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  // Fallback to mock data if API fails
  const [fallbackData, setFallbackData] = useState<any>(null);

  React.useEffect(() => {
    if (error) {
      import("@/lib/stockMockData").then((mockData) => {
        setFallbackData(mockData);
      });
    }
  }, [error]);

  // Use API data or fallback to mock data
  const productsData =
    apiResponse?.data || fallbackData?.productsMockData || productsMockData;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter((product: any) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em-estoque":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "estoque-baixo":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "sem-estoque":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em-estoque":
        return "Em estoque";
      case "estoque-baixo":
        return "Estoque baixo";
      case "sem-estoque":
        return "Sem estoque";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <Home className="h-4 w-4" />
          <span
            className={cn(
              darkMode ? "text-gray-400" : "text-gray-600",
              "hover:text-blue-600 cursor-pointer",
            )}
          >
            Início
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span
          className={cn(
            "font-medium",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Estoque
        </span>
      </div>

      {/* Header */}
      <div>
        <h1
          className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Estoque
        </h1>
        <p
          className={cn(
            "text-sm mt-1",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Visualize e gerencie seu inventário
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
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
                Total de Produtos
              </p>
              <p
                className={cn(
                  "text-3xl font-bold mt-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {stockStats.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div
          className={cn(
            "rounded-xl p-6 border-l-4 border-orange-500",
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
                Estoque Baixo
              </p>
              <p
                className={cn(
                  "text-3xl font-bold mt-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {stockStats.lowStockCount}
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  darkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                Produtos abaixo do mínimo
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Total Value */}
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
                Valor Total
              </p>
              <p
                className={cn(
                  "text-3xl font-bold mt-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(stockStats.totalValue)}
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  darkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                Valor em estoque
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3
              className={cn(
                "font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Produtos Mais Vendidos
            </h3>
          </div>
          <div className="space-y-4">
            {topSellingProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {product.name}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {product.salesCount} vendas
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(product.salesCount / product.maxSales) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className={cn(
                "w-full text-center text-sm flex items-center justify-center gap-1 py-2 mt-4 rounded-lg transition-colors",
                darkMode
                  ? "text-blue-400 hover:bg-gray-700"
                  : "text-blue-600 hover:bg-gray-50",
              )}
            >
              Ver mais 3 produtos
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock Alerts */}
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3
              className={cn(
                "font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Alerta de Reposição
            </h3>
          </div>
          <div className="space-y-4">
            {stockAlerts.map((alert, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {alert.productName}
                  </span>
                  <span className={cn("text-sm font-medium text-orange-600")}>
                    {alert.currentQuantity} unidades
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  Estoque mínimo recomendado: {alert.minQuantity}
                </p>
              </div>
            ))}
            <button
              className={cn(
                "w-full text-center text-sm flex items-center justify-center gap-1 py-2 mt-4 rounded-lg transition-colors",
                darkMode
                  ? "text-blue-400 hover:bg-gray-700"
                  : "text-blue-600 hover:bg-gray-50",
              )}
            >
              Ver mais 1 produtos
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Low Rotation Products */}
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3
              className={cn(
                "font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Produtos com Baixa Rotatividade
            </h3>
          </div>
          <div className="space-y-4">
            {lowRotationProducts.slice(0, 8).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {product.name}
                </span>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-500" : "text-gray-500",
                    )}
                  >
                    Última venda
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {formatDate(product.lastSale)}
                  </div>
                </div>
              </div>
            ))}
            <button
              className={cn(
                "w-full text-center text-sm flex items-center justify-center gap-1 py-2 mt-4 rounded-lg transition-colors",
                darkMode
                  ? "text-blue-400 hover:bg-gray-700"
                  : "text-blue-600 hover:bg-gray-50",
              )}
            >
              Ver mais 8 produtos
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
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
              Produtos em Estoque
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
                  placeholder="Buscar produto..."
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
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50",
                )}
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Novo Produto
              </button>
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
                  Produto ↕
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Categoria ↕
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Preço ↕
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Qtd ↕
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Status
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                darkMode ? "divide-gray-700" : "divide-gray-200",
              )}
            >
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    "transition-colors",
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm text-blue-600 hover:text-blue-800 cursor-pointer",
                      )}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {formatCurrency(product.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(product.status),
                      )}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
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
};
