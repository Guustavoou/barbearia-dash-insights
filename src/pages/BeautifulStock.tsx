import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ShoppingCart,
  Sparkles,
  Download,
  Target,
  ExternalLink,
  MoreHorizontal,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
import {
  useSupabaseProducts,
  useSupabaseStock,
  useCreateSupabaseProduct,
  useUpdateSupabaseProduct,
  useDeleteSupabaseProduct,
} from "@/hooks/useSupabaseApi";

interface BeautifulStockProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock_quantity: number;
  min_stock: number;
  price: number;
  cost: number;
  supplier: string;
  last_updated: string;
  status: "disponivel" | "baixo_estoque" | "esgotado";
}

export const BeautifulStock: React.FC<BeautifulStockProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const stockData = [
    {
      id: 1,
      name: "Shampoo Professional",
      category: "Higiene",
      brand: "L'Oréal",
      stock_quantity: 25,
      min_stock: 10,
      price: 89.9,
      cost: 45.0,
      supplier: "Distribuidora Premium",
      last_updated: "2024-01-15T10:30:00Z",
      status: "disponivel" as const,
    },
    {
      id: 2,
      name: "Condicionador Repair",
      category: "Tratamento",
      brand: "Schwarzkopf",
      stock_quantity: 8,
      min_stock: 15,
      price: 65.5,
      cost: 32.75,
      supplier: "Beauty Supply",
      last_updated: "2024-01-14T15:45:00Z",
      status: "baixo_estoque" as const,
    },
    {
      id: 3,
      name: "Máscara Hidratante",
      category: "Tratamento",
      brand: "Kerastase",
      stock_quantity: 0,
      min_stock: 5,
      price: 120.0,
      cost: 60.0,
      supplier: "Premium Beauty",
      last_updated: "2024-01-13T09:20:00Z",
      status: "esgotado" as const,
    },
  ];

  const filteredProducts = useMemo(() => {
    return stockData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "todas" || product.category === selectedCategory;
      const matchesStatus =
        statusFilter === "todos" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, statusFilter, stockData]);

  const totalValue = stockData.reduce(
    (sum, product) => sum + product.stock_quantity * product.price,
    0,
  );
  const lowStockProducts = stockData.filter(
    (p) => p.status === "baixo_estoque",
  ).length;
  const outOfStockProducts = stockData.filter(
    (p) => p.status === "esgotado",
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponível
          </Badge>
        );
      case "baixo_estoque":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Baixo Estoque
          </Badge>
        );
      case "esgotado":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <Package className="w-3 h-3 mr-1" />
            Esgotado
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    toast({
      title: "Produto removido",
      description: "O produto foi removido do estoque.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
      {/* Beautiful Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Estoque Inteligente
                  </h1>
                  <p className="text-blue-100">
                    Gestão completa de produtos e inventário
                  </p>
                </div>
              </div>
            </div>

            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#00112F] to-blue-600 rounded-xl text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +8% vs mês anterior
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Produtos Totais
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {stockData.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#00112F] to-blue-700 rounded-xl text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Sparkles className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Inventário ativo
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Baixo Estoque
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {lowStockProducts}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                Requer atenção
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Esgotados
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <RefreshCw className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600 dark:text-red-400">
                Necessita reposição
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="Higiene">Higiene</SelectItem>
                <SelectItem value="Tratamento">Tratamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="baixo_estoque">Baixo Estoque</SelectItem>
                <SelectItem value="esgotado">Esgotado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Mais Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Produtos */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Produtos em Estoque
              <Badge
                variant="secondary"
                className="ml-3 bg-[#00112F] text-white"
              >
                {filteredProducts.length}
              </Badge>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const profitMargin =
                product.price > 0
                  ? ((product.price - product.cost) / product.price) * 100
                  : 0;

              return (
                <Card
                  key={product.id}
                  className="group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.brand} • {product.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(product.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar produto
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Reposição
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteProduct(product.id.toString())
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover produto
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Informações de Estoque */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Estoque Atual
                        </div>
                        <div className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {product.stock_quantity}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Mín: {product.min_stock}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Valor Unitário
                        </div>
                        <div className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Custo: {formatCurrency(product.cost)}
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {formatCurrency(
                            product.stock_quantity * product.price,
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Valor Total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {profitMargin.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Margem
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {product.last_updated
                            ? formatDate(product.last_updated).split(" ")[0]
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Atualizado
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso do Estoque */}
                    {product.min_stock > 0 && (
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            Nível de estoque
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {Math.round(
                              (product.stock_quantity /
                                (product.min_stock * 2)) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            (product.stock_quantity / (product.min_stock * 2)) *
                              100,
                            100,
                          )}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                Não há produtos que correspondam aos filtros aplicados.
              </p>
              <Button className="bg-[#00112F] hover:bg-[#00112F]/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
