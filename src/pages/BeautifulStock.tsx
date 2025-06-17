import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit2,
  Eye,
  Trash2,
  ShoppingCart,
  BarChart3,
  Package2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Download,
  RefreshCw,
  Target,
  Activity,
  Sparkles,
  PackagePlus,
  Boxes,
  DollarSign,
  Calendar,
  Tag,
  X,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    brand: product.brand || 'Sem marca',
    stock_quantity: product.stock_quantity || 0,
    min_stock: product.min_stock || 0,
    price: product.price || 0,
    cost: product.cost || 0,
    supplier: product.supplier || 'Não informado',
    last_updated: product.updated_at || new Date().toISOString(),
    status: product.stock_quantity <= 0 ? 'esgotado' :
            product.stock_quantity <= product.min_stock ? 'baixo_estoque' : 'disponivel'
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
    const totalValue = mockProducts.reduce(
      (sum, p) => sum + p.stock_quantity * p.price,
      0,
    );
    const totalCost = mockProducts.reduce(
      (sum, p) => sum + p.stock_quantity * p.cost,
      0,
    );

    return {
      totalProducts,
      availableProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      totalCost,
      profitMargin:
        totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0,
    };
  }, [mockProducts]);

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
      toast({
        title: "Navegando",
        description: `Direcionando para ${page}`,
      });
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
      await updateProductMutation.mutateAsync({ id: productId, ...productData });
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
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório de estoque...",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todas");
    setStatusFilter("todos");
    toast({
      title: "🔄 Filtros Limpos",
      description: "Todos os filtros foram removidos",
    });
  };

  // Beautiful KPI Card Component usando paleta oficial
  const BeautifulKPICard: React.FC<KPICardProps> = ({
    title,
    value,
    change,
    target,
    period,
    icon: Icon,
    variant,
    onCardClick,
    navigateTo,
    format = "number",
  }) => {
    const isClickable = onCardClick || navigateTo;

    const formatValue = (val: string | number) => {
      if (format === "currency") return formatCurrency(Number(val));
      if (format === "percentage") return `${Number(val).toFixed(1)}%`;
      return val.toString();
    };

    // Paleta oficial da marca - apenas tons de azul e cinza
    const variantStyles = {
      primary: {
        gradient: "from-[#00112F]/10 via-[#00112F]/5 to-transparent",
        iconBg: "bg-gradient-to-br from-[#00112F] to-blue-800",
        accent: "bg-[#00112F]",
      },
      success: {
        gradient: "from-blue-600/10 via-blue-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-600 to-blue-700",
        accent: "bg-blue-600",
      },
      warning: {
        gradient: "from-gray-600/10 via-gray-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-gray-600 to-gray-700",
        accent: "bg-gray-600",
      },
      danger: {
        gradient: "from-slate-600/10 via-slate-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-slate-600 to-slate-700",
        accent: "bg-slate-600",
      },
      info: {
        gradient: "from-blue-700/10 via-blue-700/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-700 to-blue-800",
        accent: "bg-blue-700",
      },
      premium: {
        gradient: "from-[#00112F]/20 via-[#0D1117]/10 to-transparent",
        iconBg: "bg-gradient-to-br from-[#00112F] via-blue-900 to-[#0D1117]",
        accent: "bg-gradient-to-r from-[#00112F] to-blue-900",
      },
    };

    const style = variantStyles[variant];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-500 border-0 shadow-lg hover:shadow-xl",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl",
          isClickable &&
            "cursor-pointer hover:-translate-y-1 hover:scale-[1.02]",
        )}
        onClick={() => {
          if (onCardClick) onCardClick();
          if (navigateTo) handleNavigate(navigateTo);
        }}
      >
        {/* Animated gradient background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
            style.gradient,
            "group-hover:opacity-70",
          )}
        />

        {/* Glow effect on hover usando cores da marca */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00112F]/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  style.iconBg,
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
              <div className="relative">
                <Progress
                  value={
                    (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                    100
                  }
                  className="h-1.5"
                />
                <div
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[#00112F] to-blue-600 rounded-full opacity-20 animate-pulse"
                  style={{
                    width: `${(Number(value.toString().replace(/[^\d]/g, "")) / target) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const BeautifulProductCard: React.FC<{ product: Product }> = ({
    product,
  }) => {
    const statusStyles = {
      disponivel: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400",
        border: "border-l-blue-500",
        icon: CheckCircle,
      },
      baixo_estoque: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
        border: "border-l-gray-500",
        icon: AlertTriangle,
      },
      esgotado: {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400",
        border: "border-l-slate-500",
        icon: AlertCircle,
      },
    };

    const status = statusStyles[product.status];
    const StatusIcon = status.icon;

    const profitMargin = ((product.price - product.cost) / product.price) * 100;

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl cursor-pointer border-l-4",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117]",
          "hover:-translate-y-1 hover:scale-[1.02]",
          status.border,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.brand} • {product.category}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Fornecedor: {product.supplier}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn("text-xs border-0 flex items-center", status.bg)}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {product.status === "disponivel"
                  ? "Disponível"
                  : product.status === "baixo_estoque"
                    ? "Baixo Estoque"
                    : "Esgotado"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
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
                  <DropdownMenuItem className="text-gray-600">
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

        {/* Subtle hover glow usando cores da marca */}
        <div className="absolute inset-0 border border-[#00112F]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header - cores da marca */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Package className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Estoque Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Controle total do seu inventário • {filteredProducts.length}{" "}
                produtos encontrados
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowNewProductModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <PackagePlus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas do Estoque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            <BeautifulKPICard
              title="Total de Produtos"
              value={metrics.totalProducts}
              change={3}
              period="Itens cadastrados"
              icon={Package}
              variant="primary"
            />
            <BeautifulKPICard
              title="Disponíveis"
              value={metrics.availableProducts}
              change={5}
              period="Em estoque"
              icon={CheckCircle}
              variant="success"
            />
            <BeautifulKPICard
              title="Baixo Estoque"
              value={metrics.lowStockProducts}
              period="Necessita reposição"
              icon={AlertTriangle}
              variant="warning"
            />
            <BeautifulKPICard
              title="Esgotados"
              value={metrics.outOfStockProducts}
              period="Sem estoque"
              icon={AlertCircle}
              variant="danger"
            />
            <BeautifulKPICard
              title="Valor Total"
              value={metrics.totalValue}
              change={8}
              period="Inventário completo"
              icon={DollarSign}
              variant="premium"
              format="currency"
            />
            <BeautifulKPICard
              title="Custo Total"
              value={metrics.totalCost}
              period="Investimento"
              icon={Tag}
              variant="info"
              format="currency"
            />
            <BeautifulKPICard
              title="Margem Média"
              value={metrics.profitMargin}
              change={2}
              period="Lucratividade"
              icon={Target}
              variant="success"
              format="percentage"
            />
          </div>
        </section>

        {/* Beautiful Filters */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#00112F] dark:text-blue-400" />
                <input
                  type="text"
                  placeholder="Buscar por produto, marca ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB] placeholder-gray-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="todas">Todas as Categorias</option>
                <option value="Cabelo">Cabelo</option>
                <option value="Barbearia">Barbearia</option>
                <option value="Manicure">Manicure</option>
                <option value="Estética">Estética</option>
                <option value="Limpeza">Limpeza</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="todos">Todos os Status</option>
                <option value="disponivel">Disponível</option>
                <option value="baixo_estoque">Baixo Estoque</option>
                <option value="esgotado">Esgotado</option>
              </select>

              {(searchTerm ||
                selectedCategory !== "todas" ||
                statusFilter !== "todos") && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Beautiful Products List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <Boxes className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Inventário de Produtos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product: Product) => (
              <BeautifulProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="p-12 text-center bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Não encontramos produtos com os filtros aplicados. Tente ajustar
                os critérios de busca.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("todas");
                  setStatusFilter("todos");
                }}
                className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white border-0"
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};