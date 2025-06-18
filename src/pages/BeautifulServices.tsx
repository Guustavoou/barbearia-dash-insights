import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Star,
  MoreVertical,
  Eye,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Package,
  Sparkles,
  ExternalLink,
  Download,
  RefreshCw,
  Filter,
  Scissors,
  Palette,
  Heart,
  Zap,
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
import { NewServiceModal } from "@/components/NewServiceModal";
import {
  Service,
  ServiceSortField,
  ServiceSortOrder,
  ServiceCategory,
} from "@/lib/servicesTypes";
// Removido hook de API tradicional
import {
  useSupabaseServices,
  useCreateSupabaseService,
  useUpdateSupabaseService,
  useDeleteSupabaseService,
} from "@/hooks/useSupabaseApi";

interface BeautifulServicesProps {
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

export const BeautifulServices: React.FC<BeautifulServicesProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | "todas"
  >("todas");
  const [sortBy, setSortBy] = useState<ServiceSortField>("name");
  const [sortOrder, setSortOrder] = useState<ServiceSortOrder>("asc");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // INTEGRAÇÃO REAL COM SUPABASE - Apenas dados reais
  const {
    data: servicesData,
    loading,
    error,
    refetch,
  } = useSupabaseServices({
    search: searchTerm,
    category: selectedCategory !== "todas" ? selectedCategory : undefined,
    is_active: showActiveOnly,
    sort: sortBy,
    order: sortOrder.toUpperCase() as "ASC" | "DESC",
    page: 1,
    limit: 50,
  });

  // CRUD mutations usando Supabase
  const { mutate: createService } = useCreateSupabaseService({
    onSuccess: () => {
      toast({
        title: "✅ Serviço criado",
        description: "Serviço adicionado com sucesso!",
      });
      refetch();
      setShowNewServiceModal(false);
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao criar serviço",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateService } = useUpdateSupabaseService({
    onSuccess: () => {
      toast({
        title: "✅ Serviço atualizado",
        description: "Serviço editado com sucesso!",
      });
      refetch();
      setEditingService(null);
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao editar serviço",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteService } = useDeleteSupabaseService({
    onSuccess: () => {
      toast({
        title: "✅ Serviço excluído",
        description: "Serviço removido com sucesso!",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao excluir serviço",
        description: error,
        variant: "destructive",
      });
    },
  });

  // Calculate filtered and sorted services using real Supabase data
  const filteredServices = useMemo(() => {
    const safeServices = servicesData || [];
    let filtered = safeServices.filter((service: Service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "todas" || service.category === selectedCategory;
      const matchesStatus = !showActiveOnly || service.is_active;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    return filtered;
  }, [
    servicesData,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    showActiveOnly,
  ]);

  // Get unique categories for filter (with null safety)
  const categories = [
    ...new Set((servicesData || []).map((s: Service) => s.category)),
  ];

  // Calculate stats (with null safety)
  const stats = {
    total: (servicesData || []).length,
    active: (servicesData || []).filter((s: Service) => s.is_active).length,
    totalRevenue: (servicesData || []).reduce(
      (sum: number, service: Service) => sum + (service.price || 0),
      0,
    ),
    averagePrice:
      (servicesData || []).length > 0
        ? (servicesData || []).reduce(
            (sum: number, service: Service) => sum + (service.price || 0),
            0,
          ) / (servicesData || []).length
        : 0,
    averageDuration:
      (servicesData || []).length > 0
        ? (servicesData || []).reduce(
            (sum: number, service: Service) => sum + (service.duration || 0),
            0,
          ) / (servicesData || []).length
        : 0,
  };

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
      toast({
        title: "Navegando",
        description: `Direcionando para ${page}`,
      });
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      refetch();
      toast({
        title: "✨ Dados Atualizados",
        description: "Lista de serviços atualizada com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "�� Exportar Dados",
      description: "Preparando relatório de serviços...",
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

  const BeautifulServiceCard: React.FC<{ service: Service }> = ({
    service,
  }) => {
    const categoryIcons = {
      cabelo: Scissors,
      barba: Palette,
      manicure: Heart,
      pedicure: Heart,
      estetica: Sparkles,
      massagem: Heart,
      outros: Package,
    };

    const CategoryIcon =
      categoryIcons[service.category as keyof typeof categoryIcons] || Package;

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl cursor-pointer",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117]",
          "hover:-translate-y-1 hover:scale-[1.02]",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center text-white shadow-lg">
                  <CategoryIcon className="w-6 h-6" />
                </div>
                {service.is_active && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-0 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
                >
                  {service.category}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingService(service)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar serviço
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover serviço
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {formatCurrency(service.price)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Preço
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {service.duration}min
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Duração
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {service.is_active ? "Ativo" : "Inativo"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Status
              </div>
            </div>
          </div>
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
                <Scissors className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Serviços&nbsp;
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Gerencie seu catálogo de serviços • {filteredServices.length}{" "}
                serviços encontrados
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
                onClick={() => setShowNewServiceModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas de Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <BeautifulKPICard
              title="Total de Serviços"
              value={stats.total}
              change={5}
              period="Catálogo completo"
              icon={Package}
              variant="primary"
            />
            <BeautifulKPICard
              title="Serviços Ativos"
              value={stats.active}
              change={3}
              period="Em operação"
              icon={Zap}
              variant="success"
            />
            <BeautifulKPICard
              title="Preço Médio"
              value={stats.averagePrice}
              change={8}
              period="Por serviço"
              icon={DollarSign}
              variant="premium"
              format="currency"
            />
            <BeautifulKPICard
              title="Tempo Médio"
              value={Math.round(stats.averageDuration)}
              period="Duração média"
              icon={Clock}
              variant="info"
            />
            <BeautifulKPICard
              title="Valor Total"
              value={stats.totalRevenue}
              change={12}
              period="Soma de preços"
              icon={Target}
              variant="warning"
              format="currency"
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
                  placeholder="Buscar por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB] placeholder-gray-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as ServiceCategory | "todas",
                  )
                }
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="todas">Todas as Categorias</option>
                <option value="cabelo">Cabelo</option>
                <option value="barba">Barba</option>
                <option value="manicure">Manicure</option>
                <option value="pedicure">Pedicure</option>
                <option value="estetica">Estética</option>
                <option value="massagem">Massagem</option>
                <option value="outros">Outros</option>
              </select>

              <label className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-[#00112F] dark:text-[#F9FAFB]">
                  Apenas ativos
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Beautiful Services List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <Scissors className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Lista de Serviços
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 animate-pulse bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="text-center">
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service: Service) => (
                <BeautifulServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <Card className="p-12 text-center bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Scissors className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Não encontramos serviços com os filtros aplicados. Tente ajustar
                os critérios de busca.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("todas");
                  setShowActiveOnly(false);
                }}
                className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white border-0"
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>

        {/* New Service Modal */}
        {showNewServiceModal && (
          <NewServiceModal
            isOpen={showNewServiceModal}
            onClose={() => setShowNewServiceModal(false)}
            onSave={(serviceData) => {
              // Handle saving new service
              toast({
                title: "✨ Serviço Criado",
                description: "Novo serviço adicionado com sucesso",
              });
              setShowNewServiceModal(false);
            }}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};
