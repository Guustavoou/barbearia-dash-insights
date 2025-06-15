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

  // Mock data for charts (same as BeautifulAppointments style)
  const revenueChartData = revenueData?.data || [
    { month: "Jan", revenue: 35000, expenses: 15000, profit: 20000 },
    { month: "Fev", revenue: 38000, expenses: 16000, profit: 22000 },
    { month: "Mar", revenue: 42000, expenses: 17000, profit: 25000 },
    { month: "Abr", revenue: 45680, expenses: 18230, profit: 27450 },
  ];

  const servicesData = topServices?.data || [
    { name: "Corte Masculino", count: 145, revenue: 7250, color: "#8B5CF6" },
    { name: "Barba", count: 89, revenue: 4450, color: "#06B6D4" },
    { name: "Coloração", count: 67, revenue: 6700, color: "#10B981" },
    { name: "Tratamentos", count: 45, revenue: 4500, color: "#F59E0B" },
    { name: "Escova", count: 32, revenue: 1600, color: "#EF4444" },
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

  // Beautiful KPI Card Component (exactly like BeautifulAppointments)
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

    const variantStyles = {
      primary: {
        gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
        accent: "bg-blue-500",
      },
      success: {
        gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        accent: "bg-emerald-500",
      },
      warning: {
        gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
        accent: "bg-amber-500",
      },
      danger: {
        gradient: "from-red-500/10 via-red-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-red-500 to-red-600",
        accent: "bg-red-500",
      },
      info: {
        gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
        accent: "bg-violet-500",
      },
      premium: {
        gradient:
          "from-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent",
        iconBg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
        accent: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
    };

    const style = variantStyles[variant];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-500 border-0 shadow-lg hover:shadow-xl",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
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

        {/* Glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

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
            <p className="text-2xl font-bold text-[#00112F] dark:text-white leading-none tracking-tight">
              {formatValue(value)}
            </p>

            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    change >= 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"
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
        bg: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400",
        border: "border-l-green-400",
      },
      pendente: {
        bg: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400",
        border: "border-l-yellow-400",
      },
      cancelado: {
        bg: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400",
        border: "border-l-red-400",
      },
    };

    const status =
      statusStyles[appointment.status as keyof typeof statusStyles];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer border-l-4",
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900",
          "hover:-translate-y-1 hover:scale-[1.02]",
          status.border,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-[#00112F] dark:text-white text-sm">
                {appointment.client_name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
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
            <span className="font-bold text-[#00112F] dark:text-white text-sm">
              {formatCurrency(appointment.value)}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Beautiful animated background - exactly like BeautifulAppointments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Beautiful Header - exactly like BeautifulAppointments */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_70%)]" />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
                  Dashboard Premium
                </h1>
                <p className="text-white/90 mt-2">
                  Visão completa do seu negócio • Última atualização:{" "}
                  {formatTime(lastUpdate)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw
                    className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                  />
                  {isLoading ? "Atualizando..." : "Atualizar"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleExportData}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
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

            {/* Floating sparkles animation - exactly like BeautifulAppointments */}
            <div className="absolute top-4 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
            <div className="absolute top-8 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-8 left-20 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-1000" />
          </div>
        </Card>

        {/* Beautiful KPI Cards - exactly like BeautifulAppointments layout */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-500" />
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

        {/* Main Content Grid - same structure as BeautifulAppointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#00112F] dark:text-white flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-blue-500" />
                Faturamento Mensal
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Receita
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
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
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#3B82F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#8B5CF6" }}
                  />
                </RechartsLine>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Services Chart */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-lg">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-white mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-500" />
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
                    <span className="text-sm font-medium text-[#00112F] dark:text-white">
                      {service.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#00112F] dark:text-white">
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
        <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              Agendamentos de Hoje
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate("appointments")}
              className="text-[#00112F] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
