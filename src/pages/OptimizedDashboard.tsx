import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Maximize2,
  Plus,
  Filter,
  RefreshCw,
  CreditCard,
  UserX,
  Clock,
  MessageSquare,
  MousePointer,
  Eye,
  Star,
  Briefcase,
  AlertTriangle,
  Target,
  PieChart,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import {
  useDashboardStats,
  useRevenueData,
  useTopServices,
  useFinancialMetrics,
  useOperationalMetrics,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface OptimizedDashboardProps {
  darkMode: boolean;
}

interface PrimaryKPICardProps {
  title: string;
  value: string;
  change: number;
  target?: number;
  period: string;
  icon: React.ElementType;
  variant: "revenue" | "profit" | "bookings" | "clients";
}

interface SecondaryMetricProps {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  delta: string;
  icon?: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger";
}

interface NewKPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  variant: "default" | "success" | "warning" | "danger" | "info";
  description?: string;
  format?: "currency" | "percentage" | "number";
}

const PrimaryKPICard: React.FC<PrimaryKPICardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant,
}) => {
  const variantStyles = {
    revenue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "bg-blue-600",
    },
    profit: {
      bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
      accent: "bg-green-600",
    },
    bookings: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      border: "border-purple-200 dark:border-purple-700",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "bg-purple-600",
    },
    clients: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      border: "border-orange-200 dark:border-orange-700",
      icon: "text-orange-600 dark:text-orange-400",
      accent: "bg-orange-600",
    },
  };

  const style = variantStyles[variant];
  const progressPercent = target
    ? Math.min(
        (parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) / target) *
          100,
        100,
      )
    : change;

  return (
    <Card
      className={cn(
        "p-6 border-2 hover:shadow-lg transition-all duration-300 group relative overflow-hidden",
        style.bg,
        style.border,
      )}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10",
          style.accent,
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Icon className={cn("w-6 h-6", style.icon)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {period}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem>Exportar dados</DropdownMenuItem>
              <DropdownMenuItem>Configurar meta</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          <div className="flex items-center space-x-2">
            <Badge
              variant={change >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {change >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>

        {/* Progress Bar (if target exists) */}
        {target && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Meta mensal
              </span>
              <span className="font-medium">{formatCurrency(target)}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  style.accent,
                )}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const NewKPICard: React.FC<NewKPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant,
  description,
  format = "number",
}) => {
  const variantStyles = {
    default: {
      bg: "bg-white dark:bg-gray-800",
      border: "border-gray-200 dark:border-gray-700",
      icon: "text-gray-600 dark:text-gray-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/10",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/10",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: "text-yellow-600 dark:text-yellow-400",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-900/10",
      border: "border-red-200 dark:border-red-700",
      icon: "text-red-600 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
    },
  };

  const style = variantStyles[variant];

  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return formatCurrency(Number(val));
    } else if (format === "percentage") {
      return `${val}%`;
    }
    return val.toString();
  };

  return (
    <Card
      className={cn(
        "p-4 border hover:shadow-md transition-all duration-200",
        style.bg,
        style.border,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
            <Icon className={cn("w-5 h-5", style.icon)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            {description && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <Badge
            variant={change >= 0 ? "default" : "destructive"}
            className="text-xs"
          >
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>
    </Card>
  );
};

const SecondaryMetric: React.FC<SecondaryMetricProps> = ({
  label,
  value,
  trend,
  delta,
  icon: Icon,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    success:
      "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-700",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700",
    danger: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border",
        variantStyles[variant],
      )}
    >
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="p-1.5 rounded-md bg-white/50 dark:bg-gray-700/50">
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
      <div
        className={cn("flex items-center text-xs font-medium", {
          "text-green-600": trend === "up",
          "text-red-600": trend === "down",
          "text-gray-500": trend === "stable",
        })}
      >
        {trend === "up" && <ArrowUpRight className="w-3 h-3 mr-1" />}
        {trend === "down" && <ArrowDownRight className="w-3 h-3 mr-1" />}
        {delta}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <Card className="p-6 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </Card>
);

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({
  darkMode,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showSecondaryMetrics, setShowSecondaryMetrics] = useState(true);
  const [showNewKPIs, setShowNewKPIs] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // API hooks
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } = useRevenueData(
    selectedPeriod,
    true,
  );
  const { data: topServices, loading: servicesLoading } = useTopServices(5);
  const { data: financialMetrics, loading: financialLoading } =
    useFinancialMetrics(selectedPeriod);
  const { data: operationalMetrics, loading: operationalLoading } =
    useOperationalMetrics();

  // Debug logs
  useEffect(() => {
    console.log("Dashboard Debug - Stats:", { stats, loading: statsLoading });
    console.log("Dashboard Debug - Revenue:", {
      revenueData,
      loading: revenueLoading,
    });
  }, [stats, statsLoading, revenueData, revenueLoading]);

  // Memoized data processing
  const processedStats = useMemo(() => {
    // Use data from API or fallback to default values
    const data = stats?.data || {};

    return {
      // Basic metrics
      revenue: data.month_revenue || 45890.5,
      profit: data.net_income || 30640.5,
      bookings: data.today_appointments || 23,
      clients: data.total_clients || 214,

      // New advanced metrics
      pendingReceivables: data.pending_receivables || 8450.0,
      commissionPaid: data.commission_paid || 12250.0,
      cancellationRate: data.cancellation_rate || 4.2,
      inactiveClients: data.inactive_clients || 45,
      newClientConversion: data.new_client_conversion || 73.5,
      averageRating: data.average_rating || 4.7,
      messagesSent: data.messages_sent?.total_messages || 156,
      whatsappMessages: data.messages_sent?.whatsapp_messages || 89,
      emailMessages: data.messages_sent?.email_messages || 67,
      campaignClicks: data.campaign_performance?.total_clicks || 342,
      campaignConversions: data.campaign_performance?.total_conversions || 28,
      onlineUsers: data.online_users?.total_online || 12,
      peakHours: data.peak_hours || [
        { hour: 9, appointment_count: 8, revenue: 640 },
        { hour: 10, appointment_count: 12, revenue: 960 },
        { hour: 14, appointment_count: 15, revenue: 1200 },
        { hour: 15, appointment_count: 18, revenue: 1440 },
        { hour: 16, appointment_count: 14, revenue: 1120 },
        { hour: 17, appointment_count: 10, revenue: 800 },
      ],
      professionalOccupancy: data.professional_occupancy || [
        {
          id: 1,
          name: "Isabella Martins",
          worked_hours: 34,
          weekly_available_hours: 40,
          occupancy_rate: 85,
        },
        {
          id: 2,
          name: "Sofia Rodrigues",
          worked_hours: 29,
          weekly_available_hours: 40,
          occupancy_rate: 72.5,
        },
        {
          id: 3,
          name: "Valentina Costa",
          worked_hours: 27,
          weekly_available_hours: 40,
          occupancy_rate: 67.5,
        },
        {
          id: 4,
          name: "Helena Santos",
          worked_hours: 32,
          weekly_available_hours: 40,
          occupancy_rate: 80,
        },
        {
          id: 5,
          name: "Aurora Lima",
          worked_hours: 25,
          weekly_available_hours: 40,
          occupancy_rate: 62.5,
        },
      ],
      paymentMethods: data.payment_methods || [
        {
          payment_method: "PIX",
          count: 45,
          total_amount: 15680.0,
          percentage: 45.2,
        },
        {
          payment_method: "Cartão de Crédito",
          count: 32,
          total_amount: 12450.0,
          percentage: 30.8,
        },
        {
          payment_method: "Cartão de Débito",
          count: 18,
          total_amount: 8920.0,
          percentage: 15.1,
        },
        {
          payment_method: "Dinheiro",
          count: 12,
          total_amount: 4560.0,
          percentage: 8.9,
        },
      ],
    };
  }, [stats]);

  const chartData = useMemo(() => {
    if (revenueData?.data?.current) {
      return revenueData.data.current.map((item: any) => ({
        name: item.period,
        receita: item.revenue,
        lucro: item.profit || item.revenue - item.expenses,
        despesas: item.expenses,
      }));
    }

    // Fallback data
    return [
      { name: "Jan", receita: 3200, lucro: 1920, despesas: 1280 },
      { name: "Fev", receita: 3800, lucro: 2280, despesas: 1520 },
      { name: "Mar", receita: 4100, lucro: 2460, despesas: 1640 },
      { name: "Abr", receita: 4500, lucro: 2700, despesas: 1800 },
      { name: "Mai", receita: 5100, lucro: 3060, despesas: 2040 },
      { name: "Jun", receita: 5220, lucro: 3132, despesas: 2088 },
    ];
  }, [revenueData]);

  const peakHoursData = useMemo(() => {
    if (processedStats?.peakHours?.length) {
      return processedStats.peakHours.slice(0, 6).map((hour: any) => ({
        hora: `${hour.hour}:00`,
        agendamentos: hour.appointment_count,
      }));
    }

    return [
      { hora: "09:00", agendamentos: 8 },
      { hora: "10:00", agendamentos: 12 },
      { hora: "14:00", agendamentos: 15 },
      { hora: "15:00", agendamentos: 18 },
      { hora: "16:00", agendamentos: 14 },
      { hora: "17:00", agendamentos: 10 },
    ];
  }, [processedStats]);

  const paymentMethodsData = useMemo(() => {
    if (processedStats?.paymentMethods?.length) {
      return processedStats.paymentMethods.map(
        (method: any, index: number) => ({
          name: method.payment_method,
          value: method.percentage,
          color: COLORS[index % COLORS.length],
        }),
      );
    }

    return [
      { name: "PIX", value: 45, color: COLORS[0] },
      { name: "Cartão Crédito", value: 30, color: COLORS[1] },
      { name: "Cartão Débito", value: 15, color: COLORS[2] },
      { name: "Dinheiro", value: 10, color: COLORS[3] },
    ];
  }, [processedStats]);

  const secondaryMetrics = [
    {
      label: "Taxa de Ocupação",
      value: "78%",
      trend: "up" as const,
      delta: "+5%",
      icon: BarChart3,
      variant: "success" as const,
    },
    {
      label: "Ticket Médio",
      value: "R$ 85",
      trend: "up" as const,
      delta: "+12%",
      icon: DollarSign,
      variant: "success" as const,
    },
    {
      label: "No-Show Rate",
      value: "4.2%",
      trend: "down" as const,
      delta: "-0.8%",
      icon: AlertTriangle,
      variant: "success" as const,
    },
    {
      label: "Satisfação NPS",
      value: "8.7",
      trend: "up" as const,
      delta: "+0.3%",
      icon: Star,
      variant: "success" as const,
    },
  ];

  // Always show dashboard with loading states in individual components
  const isLoading = statsLoading || revenueLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Visão Geral
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Dashboard executivo • Atualizado às{" "}
            {lastUpdate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdate(new Date())}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <section aria-labelledby="primary-kpis">
        <h2 id="primary-kpis" className="sr-only">
          Indicadores Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PrimaryKPICard
            title="Receita Mensal"
            value={formatCurrency(processedStats.revenue)}
            change={15}
            target={6000}
            period="Meta: R$ 6.000"
            icon={DollarSign}
            variant="revenue"
          />
          <PrimaryKPICard
            title="Lucro Estimado"
            value={formatCurrency(processedStats.profit)}
            change={12}
            target={3500}
            period="Meta: R$ 3.500"
            icon={TrendingUp}
            variant="profit"
          />
          <PrimaryKPICard
            title="Agendamentos"
            value={processedStats.bookings.toString()}
            change={7}
            period="Hoje"
            icon={Calendar}
            variant="bookings"
          />
          <PrimaryKPICard
            title="Clientes Ativos"
            value={processedStats.clients.toString()}
            change={3}
            period="Total"
            icon={Users}
            variant="clients"
          />
        </div>
      </section>

      {/* New KPIs Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Novos Indicadores
          </h2>
          <Button
            variant="ghost"
            onClick={() => setShowNewKPIs(!showNewKPIs)}
            className="text-sm font-medium"
          >
            <ChevronDown
              className={cn("w-4 h-4 ml-2 transition-transform", {
                "rotate-180": showNewKPIs,
              })}
            />
          </Button>
        </div>

        {showNewKPIs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <NewKPICard
              title="Recebimentos Pendentes"
              value={processedStats.pendingReceivables}
              icon={CreditCard}
              variant="warning"
              format="currency"
              description="Agendamentos não pagos"
            />
            <NewKPICard
              title="Comissão Paga"
              value={processedStats.commissionPaid}
              change={-5}
              icon={Briefcase}
              variant="info"
              format="currency"
              description="Este mês"
            />
            <NewKPICard
              title="Taxa de Cancelamento"
              value={processedStats.cancellationRate}
              change={-2.1}
              icon={AlertTriangle}
              variant="danger"
              format="percentage"
              description="Últimos 30 dias"
            />
            <NewKPICard
              title="Clientes Inativos"
              value={processedStats.inactiveClients}
              icon={UserX}
              variant="warning"
              description="Sem agendamentos há 90 dias"
            />
            <NewKPICard
              title="Conversão Novos Clientes"
              value={processedStats.newClientConversion}
              change={5.2}
              icon={Target}
              variant="success"
              format="percentage"
              description="Taxa de retorno"
            />
            <NewKPICard
              title="Avaliação Média"
              value={processedStats.averageRating}
              change={0.3}
              icon={Star}
              variant="success"
              description="Satisfação dos clientes"
            />
            <NewKPICard
              title="Mensagens Enviadas"
              value={processedStats.messagesSent}
              change={18}
              icon={MessageSquare}
              variant="info"
              description="Últimos 30 dias"
            />
            <NewKPICard
              title="Usuários Online"
              value={processedStats.onlineUsers}
              icon={Activity}
              variant="success"
              description="Ativos agora"
            />
          </div>
        )}
      </section>

      {/* Communication & Marketing Metrics */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Marketing & Comunicação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NewKPICard
            title="WhatsApp Enviadas"
            value={processedStats.whatsappMessages}
            change={25}
            icon={MessageSquare}
            variant="success"
            description="Últimos 30 dias"
          />
          <NewKPICard
            title="E-mails Enviados"
            value={processedStats.emailMessages}
            change={12}
            icon={MessageSquare}
            variant="info"
            description="Últimos 30 dias"
          />
          <NewKPICard
            title="Cliques em Campanhas"
            value={processedStats.campaignClicks}
            change={8.5}
            icon={MousePointer}
            variant="default"
            description="Engajamento"
          />
          <NewKPICard
            title="Conversões de Campanha"
            value={processedStats.campaignConversions}
            change={15.2}
            icon={Target}
            variant="success"
            description="Meta atingida"
          />
        </div>
      </section>

      {/* Secondary Metrics Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowSecondaryMetrics(!showSecondaryMetrics)}
          className="text-sm font-medium"
        >
          Métricas Operacionais
          <ChevronDown
            className={cn("w-4 h-4 ml-2 transition-transform", {
              "rotate-180": showSecondaryMetrics,
            })}
          />
        </Button>
      </div>

      {/* Secondary Metrics */}
      {showSecondaryMetrics && (
        <section aria-labelledby="secondary-metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryMetrics.map((metric, index) => (
              <SecondaryMetric key={index} {...metric} />
            ))}
          </div>
        </section>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <section aria-labelledby="revenue-chart" className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  id="revenue-chart"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  Performance Financeira
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receita vs Lucro - Últimos 6 meses
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {selectedPeriod === "month" ? "6 meses" : "12 meses"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedPeriod("month")}
                    >
                      Últimos 6 meses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPeriod("year")}>
                      Últimos 12 meses
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "receita" ? "Receita" : "Lucro",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Peak Hours Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Horários de Pico
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hora"
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="agendamentos"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Payment Methods & Professional Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Formas de Pagamento
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Porcentagem"]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Professional Occupancy */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ocupação por Profissional
          </h3>
          <div className="space-y-4">
            {processedStats.professionalOccupancy
              .slice(0, 5)
              .map((prof: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prof.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {prof.occupancy_rate}%
                    </span>
                  </div>
                  <Progress value={prof.occupancy_rate} className="h-2" />
                </div>
              ))}
            {processedStats.professionalOccupancy.length === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Isabella Martins
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      85%
                    </span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Sofia Rodrigues
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      72%
                    </span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Valentina Costa
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      68%
                    </span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
