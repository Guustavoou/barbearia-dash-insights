import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Phone,
  MessageCircle,
  DollarSign,
  Edit3,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Check,
  AlertTriangle,
  ChevronDown,
  Menu,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  CalendarDays,
  Target,
  UserCheck,
  Ban,
  RefreshCw,
  Download,
  ExternalLink,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
  Star,
  Zap,
  Scissors,
  Package,
  CreditCard,
  Receipt,
  Coins,
  Heart,
  Banknote,
  ShoppingCart,
  Calculator,
  TrendingDownIcon,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  useDashboardStats,
  useRevenueData,
  useTopServices,
  useUpcomingAppointments,
  useBirthdays,
} from "@/hooks/useApi";

interface BeautifulDashboardProps {
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
  gradient?: { from: string; to: string };
}

export const BeautifulDashboard: React.FC<BeautifulDashboardProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // API data hooks with automatic fallback
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } =
    useRevenueData(selectedPeriod);
  const { data: topServices, loading: servicesLoading } = useTopServices(5);
  const { data: upcomingAppointments, loading: appointmentsLoading } =
    useUpcomingAppointments(8);
  const { data: birthdays, loading: birthdaysLoading } = useBirthdays();

  const loading =
    statsLoading || revenueLoading || servicesLoading || appointmentsLoading;

  // Fallback data with complete dashboard metrics
  const defaultStats = {
    total_clients: 1250,
    total_professionals: 8,
    today_appointments: 23,
    month_revenue: 45680,
    month_expenses: 18230,
    net_income: 27450,
    profit_margin: 60.1,
    growth_rate: 12.5,
    conversion_rate: 78.3,
    average_ticket: 185.5,
    retention_rate: 89.2,
    occupancy_rate: 75.8,
    cancellation_rate: 8.5,
    average_service_time: 65,
    monthly_goal: 50000,
    weekly_appointments: 145,
    pending_payments: 3450,
    confirmed_today: 18,
  };

  const currentStats = stats?.data || defaultStats;

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    return {
      todayAppointments: currentStats.today_appointments || 23,
      confirmationRate: currentStats.conversion_rate || 78.3,
      totalRevenue: currentStats.month_revenue || 45680,
      avgServiceTime: currentStats.average_service_time || 65,
      occupancyRate: currentStats.occupancy_rate || 75.8,
      cancellationRate: currentStats.cancellation_rate || 8.5,
      totalClients: currentStats.total_clients || 1250,
      averageTicket: currentStats.average_ticket || 185.5,
      retentionRate: currentStats.retention_rate || 89.2,
      netIncome: currentStats.net_income || 27450,
      profitMargin: currentStats.profit_margin || 60.1,
      totalProfessionals: currentStats.total_professionals || 8,
      weeklyAppointments: currentStats.weekly_appointments || 145,
      pendingPayments: currentStats.pending_payments || 3450,
      monthlyGoal: currentStats.monthly_goal || 50000,
      confirmedToday: currentStats.confirmed_today || 18,
    };
  }, [currentStats]);

  // Mock data for charts usando paleta oficial
  const revenueChartData = revenueData?.data || [
    { month: "Jan", revenue: 35000, expenses: 15000, profit: 20000 },
    { month: "Fev", revenue: 38000, expenses: 16000, profit: 22000 },
    { month: "Mar", revenue: 42000, expenses: 17000, profit: 25000 },
    { month: "Abr", revenue: 45680, expenses: 18230, profit: 27450 },
  ];

  const servicesData = topServices?.data || [
    { name: "Corte Masculino", count: 145, revenue: 7250, color: "#00112F" },
    { name: "Barba", count: 89, revenue: 4450, color: "#4B5563" },
    { name: "Coloração", count: 67, revenue: 6700, color: "#6B7280" },
    { name: "Tratamentos", count: 45, revenue: 4500, color: "#9CA3AF" },
    { name: "Escova", count: 32, revenue: 1600, color: "#D1D5DB" },
  ];

  const appointmentsToday = upcomingAppointments?.data || [
    {
      id: "1",
      client_name: "Ana Silva",
      service: "Corte + Escova",
      time: "09:00",
      professional: "Maria",
      status: "confirmado",
      value: 120,
    },
    {
      id: "2",
      client_name: "Carlos Santos",
      service: "Barba",
      time: "10:30",
      professional: "João",
      status: "pendente",
      value: 50,
    },
    {
      id: "3",
      client_name: "Beatriz Costa",
      service: "Coloração",
      time: "14:00",
      professional: "Paula",
      status: "confirmado",
      value: 180,
    },
  ];

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
      toast({
        title: "✨ Dados Atualizados",
        description: "Dashboard atualizado com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório personalizado...",
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
    gradient,
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
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
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
                  vs. semana anterior
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

  const BeautifulAppointmentCard: React.FC<{
    appointment: any;
  }> = ({ appointment }) => {
    const statusStyles = {
      confirmado: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400",
        border: "border-l-blue-500",
      },
      pendente: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
        border: "border-l-gray-500",
      },
      cancelado: {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400",
        border: "border-l-slate-500",
      },
    };

    const status =
      statusStyles[appointment.status as keyof typeof statusStyles];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer border-l-4",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117]",
          "hover:-translate-y-1 hover:scale-[1.02]",
          status.border,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] text-sm">
                {appointment.client_name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-[#00112F] dark:text-blue-400" />
                {appointment.service}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("text-xs border-0", status.bg)}
            >
              {appointment.status === "confirmado"
                ? "Confirmado"
                : appointment.status === "pendente"
                  ? "Pendente"
                  : "Cancelado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{appointment.time}</span>
              <span className="text-gray-300">•</span>
              <span>{appointment.professional}</span>
            </div>
            <span className="font-bold text-[#00112F] dark:text-[#F9FAFB] text-sm">
              {formatCurrency(appointment.value)}
            </span>
          </div>
        </div>
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
                <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Dashboard Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Visão completa do seu negócio • Atualizado às{" "}
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button
                size="sm"
                onClick={handleExportData}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="week" className="text-gray-900">
                  Esta Semana
                </option>
                <option value="month" className="text-gray-900">
                  Este Mês
                </option>
                <option value="year" className="text-gray-900">
                  Este Ano
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Indicadores Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Agendamentos Hoje"
              value={metrics.todayAppointments}
              change={7}
              period="Hoje"
              icon={CalendarDays}
              variant="primary"
              onCardClick={() => handleNavigate("appointments")}
              navigateTo="appointments"
            />
            <BeautifulKPICard
              title="Taxa Confirmação"
              value={metrics.confirmationRate}
              change={5}
              period="Percentual"
              icon={UserCheck}
              variant="success"
              format="percentage"
            />
            <BeautifulKPICard
              title="Faturamento"
              value={metrics.totalRevenue}
              change={12}
              target={metrics.monthlyGoal}
              period="Meta: R$ 50.000"
              icon={DollarSign}
              variant="premium"
              format="currency"
              onCardClick={() => handleNavigate("financial")}
              navigateTo="financial"
            />
            <BeautifulKPICard
              title="Taxa Ocupação"
              value={metrics.occupancyRate}
              change={-2}
              period="Slots preenchidos"
              icon={Activity}
              variant="info"
              format="percentage"
            />
            <BeautifulKPICard
              title="Taxa Cancelamento"
              value={metrics.cancellationRate}
              change={-1.5}
              period="Últimos 30 dias"
              icon={Ban}
              variant="warning"
              format="percentage"
            />
            <BeautifulKPICard
              title="Tempo Médio"
              value={metrics.avgServiceTime}
              period="Minutos por serviço"
              icon={Clock}
              variant="info"
            />
          </div>
        </section>

        {/* Additional KPI Cards Row */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Clientes Ativos"
              value={metrics.totalClients}
              change={15}
              period="Base ativa"
              icon={Users}
              variant="success"
              onCardClick={() => handleNavigate("clients")}
              navigateTo="clients"
            />
            <BeautifulKPICard
              title="Ticket Médio"
              value={metrics.averageTicket}
              change={3}
              period="Por cliente"
              icon={CreditCard}
              variant="info"
              format="currency"
            />
            <BeautifulKPICard
              title="Taxa Retenção"
              value={metrics.retentionRate}
              change={2}
              period="Últimos 6 meses"
              icon={Heart}
              variant="warning"
              format="percentage"
            />
            <BeautifulKPICard
              title="Lucro Líquido"
              value={metrics.netIncome}
              change={18}
              period="Resultado final"
              icon={TrendingUp}
              variant="success"
              format="currency"
            />
            <BeautifulKPICard
              title="Profissionais"
              value={metrics.totalProfessionals}
              period="Equipe ativa"
              icon={Scissors}
              variant="primary"
              onCardClick={() => handleNavigate("professionals")}
              navigateTo="professionals"
            />
            <BeautifulKPICard
              title="Margem de Lucro"
              value={metrics.profitMargin}
              change={4}
              period="Percentual"
              icon={Target}
              variant="premium"
              format="percentage"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                Faturamento Mensal
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-[#00112F] rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Receita
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Lucro
                  </span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLine data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00112F"
                    strokeWidth={3}
                    dot={{ fill: "#00112F", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#00112F" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: "#2563EB", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#2563EB" }}
                  />
                </RechartsLine>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Services Chart */}
          <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
              Serviços Populares
            </h3>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value, name, props) => [
                      `${value} agendamentos`,
                      props.payload.name,
                    ]}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {servicesData.slice(0, 3).map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      {service.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                      {service.count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(service.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Content - Today's Appointments */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
              Agendamentos de Hoje
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate("appointments")}
              className="text-[#00112F] dark:text-[#F9FAFB] hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Ver todos
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointmentsToday.map((appointment) => (
              <BeautifulAppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
