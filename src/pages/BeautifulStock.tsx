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

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  target?: number;
  period: string;
  icon: React.ElementType;
  variant: "primary" | "success" | "warning" | "danger" | "info" | "premium";
  onCardClick?: () => void;
  navigateTo?: PageType;
  format?: "currency" | "percentage" | "number";
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

  // 🚀 INTEGRAÇÃO SUPABASE - Dados reais do banco
  const {
    data: supabaseProducts,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useSupabaseProducts({
    search: searchTerm,
    category: selectedCategory !== "todas" ? selectedCategory : undefined,
    is_active: true,
  });

  const createProductMutation = useCreateSupabaseProduct();
  const updateProductMutation = useUpdateSupabaseProduct();
  const deleteProductMutation = useDeleteSupabaseProduct();

  // 📊 DADOS REAIS DO SUPABASE - Produtos carregados do banco de dados
  const products: Product[] = (supabaseProducts || []).map((product: any) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand || "Sem marca",
    stock_quantity: product.stock_quantity || 0,
    min_stock: product.min_stock || 0,
    price: product.price || 0,
    cost: product.cost_price || 0,
    supplier: product.supplier || "Não informado",
    last_updated: product.updated_at || new Date().toISOString(),
    status:
      product.stock_quantity <= 0
        ? "esgotado"
        : product.stock_quantity <= product.min_stock
          ? "baixo_estoque"
          : "disponivel",
  }));

  // Filter products usando dados reais do Supabase
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "todas" || product.category === selectedCategory;

      const matchesStatus =
        statusFilter === "todos" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, statusFilter]);

  // Calculate metrics usando dados reais
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter(
      (p) => p.status === "disponivel",
    ).length;
    const lowStockProducts = products.filter(
      (p) => p.status === "baixo_estoque",
    ).length;
    const outOfStockProducts = products.filter(
      (p) => p.status === "esgotado",
    ).length;

    const totalValue = products.reduce(
      (sum, p) => sum + p.stock_quantity * p.price,
      0,
    );

    return {
      totalProducts,
      availableProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      availabilityRate:
        totalProducts > 0 ? (availableProducts / totalProducts) * 100 : 0,
    };
  }, [products]);

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await refetchProducts();
      setLastUpdate(new Date());
      toast({
        title: "✅ Dados atualizados",
        description: "Informações de estoque sincronizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao atualizar",
        description: "Não foi possível sincronizar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 OPERAÇÕES CRUD COM SUPABASE
  const handleCreateProduct = async (productData: any) => {
    try {
      await createProductMutation.mutateAsync(productData);
      toast({
        title: "✅ Produto criado",
        description: "Produto adicionado ao estoque com sucesso.",
      });
      setShowNewProductModal(false);
      await refetchProducts();
    } catch (error) {
      toast({
        title: "❌ Erro ao criar produto",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        ...productData,
      });
      toast({
        title: "✅ Produto atualizado",
        description: "Informações do produto foram salvas.",
      });
      setEditingProduct(null);
      await refetchProducts();
    } catch (error) {
      toast({
        title: "❌ Erro ao atualizar produto",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast({
        title: "✅ Produto removido",
        description: "Produto foi removido do estoque.",
      });
      await refetchProducts();
    } catch (error) {
      toast({
        title: "❌ Erro ao remover produto",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportação iniciada",
      description: "Seus dados de estoque estão sendo preparados...",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todas");
    setStatusFilter("todos");
  };

  const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    change,
    target,
    period,
    icon: Icon,
    variant = "primary",
    onCardClick,
    navigateTo,
    format = "number",
  }) => {
    const isClickable = onCardClick || navigateTo;

    const style = {
      primary: {
        gradient: "from-[#00112F] to-blue-700",
        iconBg: "bg-gradient-to-br from-[#00112F] to-blue-600",
      },
      success: {
        gradient: "from-green-600 to-green-800",
        iconBg: "bg-gradient-to-br from-green-600 to-green-700",
      },
      warning: {
        gradient: "from-yellow-600 to-orange-700",
        iconBg: "bg-gradient-to-br from-yellow-600 to-orange-600",
      },
      danger: {
        gradient: "from-red-600 to-red-800",
        iconBg: "bg-gradient-to-br from-red-600 to-red-700",
      },
      info: {
        gradient: "from-blue-600 to-blue-800",
        iconBg: "bg-gradient-to-br from-blue-600 to-blue-700",
      },
      premium: {
        gradient: "from-purple-600 to-purple-800",
        iconBg: "bg-gradient-to-br from-purple-600 to-purple-700",
      },
    };

    const formatValue = (val: string | number) => {
      if (format === "currency") return formatCurrency(Number(val));
      if (format === "percentage") return `${val}%`;
      return val.toString();
    };

    return (
      <Card
        className={cn(
          "group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
          isClickable && "cursor-pointer",
        )}
        onClick={
          isClickable
            ? () => {
                if (onCardClick) onCardClick();
                if (navigateTo) handleNavigate(navigateTo);
              }
            : undefined
        }
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00112F]/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  style[variant].iconBg,
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {period}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {isClickable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-white/20"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-white/20"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onCardClick}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Target className="w-4 h-4 mr-2" />
                    Configurar meta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] leading-none tracking-tight">
              {formatValue(value)}
            </p>

            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    change >= 0
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
                  )}
                >
                  {change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change)}%
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs. período anterior
                </span>
              </div>
            )}
          </div>

          {target && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  Meta
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {Math.round(
                    (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                      100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                  100
                }
                className="h-2"
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const getStatusBadge = (status: string) => {
      switch (status) {
        case "disponivel":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              Disponível
            </Badge>
          );
        case "baixo_estoque":
          return (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Baixo Estoque
            </Badge>
          );
        case "esgotado":
          return (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Esgotado
            </Badge>
          );
        default:
          return null;
      }
    };

    const profitMargin =
      product.price > 0
        ? ((product.price - product.cost) / product.price) * 100
        : 0;

    return (
      <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00112F]/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

        <div className="relative p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] text-lg leading-tight">
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
                  <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar produto
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Reposição
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteProduct(product.id.toString())}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover produto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stock Info */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {formatCurrency(product.stock_quantity * product.price)}
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

          {/* Stock Progress Bar */}
          {product.min_stock > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Nível de estoque
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {Math.round(
                    (product.stock_quantity / (product.min_stock * 2)) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(product.stock_quantity / (product.min_stock * 2)) * 100}
                className="h-2"
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#00112F] to-blue-600 rounded-xl shadow-xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            Gestão de Estoque
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              🚀 Supabase Integrado
            </Badge>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Controle total dos produtos e estoque com dados em tempo real
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            disabled={isLoading || productsLoading}
            className="bg-white/80 border-gray-200 hover:bg-white/90"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 mr-2",
                (isLoading || productsLoading) && "animate-spin",
              )}
            />
            Atualizar
          </Button>
          <Button
            onClick={() => setShowNewProductModal(true)}
            className="bg-gradient-to-r from-[#00112F] to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total de Produtos"
          value={metrics.totalProducts}
          change={5.2}
          period="Este mês"
          icon={Package}
          variant="primary"
          format="number"
        />
        <KPICard
          title="Valor do Estoque"
          value={metrics.totalValue}
          change={12.3}
          period="Este mês"
          icon={TrendingUp}
          variant="success"
          format="currency"
        />
        <KPICard
          title="Produtos Disponíveis"
          value={metrics.availableProducts}
          change={-2.1}
          period="Este mês"
          icon={CheckCircle}
          variant="info"
          format="number"
        />
        <KPICard
          title="Taxa de Disponibilidade"
          value={metrics.availabilityRate.toFixed(1)}
          target={90}
          period="Este mês"
          icon={Target}
          variant="premium"
          format="percentage"
        />
      </div>

      {/* Filters */}
      <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar produtos, marcas, fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] bg-white/50 border-gray-200">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas categorias</SelectItem>
                <SelectItem value="Cabelo">Cabelo</SelectItem>
                <SelectItem value="Unhas">Unhas</SelectItem>
                <SelectItem value="Barbearia">Barbearia</SelectItem>
                <SelectItem value="Estética">Estética</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-white/50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="baixo_estoque">Baixo estoque</SelectItem>
                <SelectItem value="esgotado">Esgotado</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
              className="bg-white/80 border-gray-200 hover:bg-white/90"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {(productsLoading || isLoading) && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Carregando produtos...
          </p>
        </div>
      )}

      {/* Error State */}
      {productsError && !productsLoading && (
        <Card className="bg-red-50 border-red-200 p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Erro ao carregar produtos</p>
          <p className="text-red-500 text-sm mt-2">{productsError}</p>
          <Button
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </Card>
      )}

      {/* Products Grid */}
      {!productsLoading && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!productsLoading && !isLoading && filteredProducts.length === 0 && (
        <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm ||
            selectedCategory !== "todas" ||
            statusFilter !== "todos"
              ? "Tente ajustar os filtros para ver mais produtos."
              : "Adicione o primeiro produto ao seu estoque para começar."}
          </p>
          <div className="flex gap-3 justify-center">
            {(searchTerm ||
              selectedCategory !== "todas" ||
              statusFilter !== "todos") && (
              <Button onClick={handleClearFilters} variant="outline">
                Limpar filtros
              </Button>
            )}
            <Button
              onClick={() => setShowNewProductModal(true)}
              className="bg-gradient-to-r from-[#00112F] to-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
