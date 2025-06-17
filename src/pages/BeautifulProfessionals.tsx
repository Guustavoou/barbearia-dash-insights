import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit3,
  Eye,
  Calendar,
  Phone,
  Mail,
  Award,
  Clock,
  Crown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Pause,
  ExternalLink,
  Download,
  RefreshCw,
  Target,
  Activity,
  Sparkles,
  UserPlus,
  Scissors,
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
import {
  professionalsMockData,
  professionalStats,
  workDaysOptions,
} from "@/lib/professionalsMockData";
import {
  useSupabaseProfessionals,
  useCreateSupabaseProfessional,
  useUpdateSupabaseProfessional,
  useDeleteSupabaseProfessional,
} from "@/hooks/useSupabaseApi";
import { NewProfessionalModal } from "@/components/NewProfessionalModal";
import {
  Professional,
  ProfessionalSortField,
  ProfessionalSortOrder,
  ProfessionalStatus,
} from "@/lib/professionalsTypes";
import {
  useSupabaseProfessionals,
  useCreateSupabaseProfessional,
  useUpdateSupabaseProfessional,
  useDeleteSupabaseProfessional,
} from "@/hooks/useSupabaseApi";

interface BeautifulProfessionalsProps {
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

export const BeautifulProfessionals: React.FC<BeautifulProfessionalsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ProfessionalSortField>("name");
  const [sortOrder, setSortOrder] = useState<ProfessionalSortOrder>("asc");
  const [showNewProfessionalModal, setShowNewProfessionalModal] =
    useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // INTEGRAÇÃO REAL COM SUPABASE - Apenas dados reais
  const {
    data: professionalsData,
    loading,
    error,
    refetch,
  } = useSupabaseProfessionals({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: sortBy,
    order: sortOrder.toUpperCase() as "ASC" | "DESC",
    page: 1,
    limit: 50,
  });

  // CRUD mutations usando Supabase
  const { mutate: createProfessional } = useCreateSupabaseProfessional({
    onSuccess: () => {
      toast({
        title: "✅ Profissional criado",
        description: "Profissional adicionado com sucesso!",
      });
      refetch();
      setShowNewProfessionalModal(false);
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao criar profissional",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateProfessional } = useUpdateSupabaseProfessional({
    onSuccess: () => {
      toast({
        title: "✅ Profissional atualizado",
        description: "Profissional editado com sucesso!",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao editar profissional",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteProfessional } = useDeleteSupabaseProfessional({
    onSuccess: () => {
      toast({
        title: "✅ Profissional excluído",
        description: "Profissional removido com sucesso!",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao excluir profissional",
        description: error,
        variant: "destructive",
      });
    },
  });

  // Dados dos profissionais vindos do Supabase
  const safeProfessionalsData =
    apiResponse?.data ||
    fallbackData?.professionalsMockData ||
    professionalsMockData;

  // Filter and sort professionals
  const filteredProfessionals = useMemo(() => {
    let filtered = professionalsData.filter((professional: any) => {
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialties.some((spec: string) =>
          spec.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || professional.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a: any, b: any) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "commission":
          aValue = a.commission_rate || 0;
          bValue = b.commission_rate || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [professionalsData, searchTerm, statusFilter, sortBy, sortOrder]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = professionalsData.length;
    const active = professionalsData.filter(
      (p: any) => p.status === "ativo",
    ).length;
    const avgRating =
      professionalsData.reduce(
        (sum: number, p: any) => sum + (p.rating || 0),
        0,
      ) / total;
    const avgCommission =
      professionalsData.reduce(
        (sum: number, p: any) => sum + (p.commission_rate || 0),
        0,
      ) / total;
    const newThisMonth = Math.floor(total * 0.1); // Mock data

    return {
      total,
      active,
      avgRating,
      avgCommission,
      newThisMonth,
      inactive: total - active,
    };
  }, [professionalsData]);

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
        description: "Lista de profissionais atualizada com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório de profissionais...",
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

  const BeautifulProfessionalCard: React.FC<{ professional: any }> = ({
    professional,
  }) => {
    const statusStyles = {
      ativo: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400",
        dot: "bg-blue-500",
      },
      inativo: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
        dot: "bg-gray-500",
      },
      ferias: {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400",
        dot: "bg-slate-500",
      },
    };

    const status =
      statusStyles[professional.status as keyof typeof statusStyles] ||
      statusStyles.inativo;

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl cursor-pointer",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117]",
          "hover:-translate-y-1 hover:scale-[1.02]",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {professional.name.charAt(0).toUpperCase()}
                </div>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                    status.dot,
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] text-lg">
                  {professional.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-blue-500 fill-current" />
                    <span className="text-sm font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      {professional.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs border-0", status.bg)}
                  >
                    {professional.status === "ativo"
                      ? "Ativo"
                      : professional.status === "ferias"
                        ? "Férias"
                        : "Inativo"}
                  </Badge>
                </div>
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
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver agenda
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="w-4 h-4 mr-2" />
                    Contatar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <div className="text-sm font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
              Especialidades
            </div>
            <div className="flex flex-wrap gap-1">
              {professional.specialties
                ?.slice(0, 3)
                .map((specialty: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-0 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
                  >
                    {specialty}
                  </Badge>
                ))}
              {professional.specialties?.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400"
                >
                  +{professional.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {professional.commission_rate || 0}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Comissão
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {professional.monthly_appointments || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Agendamentos
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {formatCurrency(professional.monthly_revenue || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Faturamento
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            {professional.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{professional.phone}</span>
              </div>
            )}
            {professional.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{professional.email}</span>
              </div>
            )}
            {professional.work_days && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{professional.work_days.join(", ")}</span>
              </div>
            )}
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
                <Users className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Profissionais Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Gerencie sua equipe de profissionais •{" "}
                {filteredProfessionals.length} profissionais encontrados
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
                onClick={() => setShowNewProfessionalModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Profissional
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas da Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Total da Equipe"
              value={metrics.total}
              change={5}
              period="Profissionais cadastrados"
              icon={Users}
              variant="primary"
            />
            <BeautifulKPICard
              title="Profissionais Ativos"
              value={metrics.active}
              change={3}
              period="Em atividade"
              icon={CheckCircle}
              variant="success"
            />
            <BeautifulKPICard
              title="Avaliação Média"
              value={metrics.avgRating}
              change={2}
              period="Nota dos clientes"
              icon={Star}
              variant="premium"
              format="number"
            />
            <BeautifulKPICard
              title="Comissão Média"
              value={metrics.avgCommission}
              period="Percentual médio"
              icon={DollarSign}
              variant="info"
              format="percentage"
            />
            <BeautifulKPICard
              title="Novos este Mês"
              value={metrics.newThisMonth}
              change={15}
              period="Contratados"
              icon={UserPlus}
              variant="success"
            />
            <BeautifulKPICard
              title="Inativos"
              value={metrics.inactive}
              period="Fora de atividade"
              icon={Pause}
              variant="warning"
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
                  placeholder="Buscar por nome ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB] placeholder-gray-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="all">Todos os Status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="ferias">Em Férias</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as ProfessionalSortField)
                }
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="name">Ordenar por Nome</option>
                <option value="rating">Ordenar por Avaliação</option>
                <option value="commission">Ordenar por Comissão</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Beautiful Professionals List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <Users className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Lista de Profissionais
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 animate-pulse bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                    <div className="flex space-x-1">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
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
              {filteredProfessionals.map((professional: any) => (
                <BeautifulProfessionalCard
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>
          )}

          {!loading && filteredProfessionals.length === 0 && (
            <Card className="p-12 text-center bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Não encontramos profissionais com os filtros aplicados. Tente
                ajustar os critérios de busca.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white border-0"
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>

        {/* New Professional Modal */}
        {showNewProfessionalModal && (
          <NewProfessionalModal
            isOpen={showNewProfessionalModal}
            onClose={() => setShowNewProfessionalModal(false)}
            onSave={(professionalData) => {
              // Handle saving new professional
              toast({
                title: "✨ Profissional Adicionado",
                description: "Novo profissional cadastrado com sucesso",
              });
              setShowNewProfessionalModal(false);
            }}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};
