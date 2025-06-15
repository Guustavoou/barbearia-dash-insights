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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedDashboardProps {
  darkMode: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  target?: number;
  period?: string;
  icon: React.ElementType;
  variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  description?: string;
  trend?: "up" | "down" | "stable";
  format?: "currency" | "percentage" | "number";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant,
  description,
  trend,
  format = "number",
}) => {
  const variantStyles = {
    primary: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "bg-blue-600",
    },
    secondary: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
      border: "border-gray-200 dark:border-gray-700",
      icon: "text-gray-600 dark:text-gray-400",
      accent: "bg-gray-600",
    },
    success: {
      bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
      accent: "bg-green-600",
    },
    warning: {
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: "text-yellow-600 dark:text-yellow-400",
      accent: "bg-yellow-600",
    },
    danger: {
      bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      border: "border-red-200 dark:border-red-700",
      icon: "text-red-600 dark:text-red-400",
      accent: "bg-red-600",
    },
    info: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      border: "border-purple-200 dark:border-purple-700",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "bg-purple-600",
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

  const progressPercent = target
    ? Math.min((Number(value) / target) * 100, 100)
    : change || 0;

  return (
    <Card
      className={cn(
        "p-4 border hover:shadow-lg transition-all duration-300 group relative overflow-hidden",
        style.bg,
        style.border,
      )}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute -right-2 -top-2 w-16 h-16 rounded-full opacity-10",
          style.accent,
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-white/50 dark:bg-gray-800/50">
              <Icon className={cn("w-4 h-4", style.icon)} />
            </div>
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h3>
          </div>
          {change !== undefined && (
            <Badge
              variant={change >= 0 ? "default" : "destructive"}
              className="text-xs px-1.5 py-0.5"
            >
              {change >= 0 ? (
                <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
              )}
              {Math.abs(change)}%
            </Badge>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Progress Bar (if target exists) */}
        {target && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Meta</span>
              <span className="font-medium">{formatValue(target)}</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}

        {period && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {period}
          </p>
        )}
      </div>
    </Card>
  );
};

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, children, actions }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {actions}
    </div>
    {children}
  </Card>
);

const SkeletonCard = () => (
  <Card className="p-4 animate-pulse">
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  darkMode,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
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

  // Memoized data processing
  const processedStats = useMemo(() => {
    if (!stats?.data) return null;

    const data = stats.data;
    return {
      // Financial Metrics
      revenue: data.month_revenue || 0,
      profit: data.net_income || 0,
      pendingReceivables: data.pending_receivables || 0,
      commissionPaid: data.commission_paid || 0,

      // Operational Metrics
      bookings: data.today_appointments || 0,
      clients: data.total_clients || 0,
      cancellationRate: data.cancellation_rate || 0,
      inactiveClients: data.inactive_clients || 0,
      newClientConversion: data.new_client_conversion || 0,
      averageRating: data.average_rating || 0,

      // Communication & Marketing
      messagesSent: data.messages_sent?.total_messages || 0,
      whatsappMessages: data.messages_sent?.whatsapp_messages || 0,
      emailMessages: data.messages_sent?.email_messages || 0,
      campaignClicks: data.campaign_performance?.total_clicks || 0,
      campaignConversions: data.campaign_performance?.total_conversions || 0,
      onlineUsers: data.online_users?.total_online || 0,

      // Peak Hours & Professional Data
      peakHours: data.peak_hours || [],
      professionalOccupancy: data.professional_occupancy || [],
      paymentMethods: data.payment_methods || [],
    };
  }, [stats]);

  const revenueChartData = useMemo(() => {
    if (!revenueData?.data?.current) return [];

    return revenueData.data.current.map((item: any) => ({
      period: item.period,
      receita: item.revenue,
      despesas: item.expenses,
      lucro: item.profit,
    }));
  }, [revenueData]);

  const peakHoursData = useMemo(() => {
    if (!processedStats?.peakHours) return [];

    return processedStats.peakHours.map((hour: any) => ({
      hora: `${hour.hour}:00`,
      agendamentos: hour.appointment_count,
      receita: hour.revenue,
    }));
  }, [processedStats]);

  const paymentMethodsData = useMemo(() => {
    if (!processedStats?.paymentMethods) return [];

    return processedStats.paymentMethods.map((method: any, index: number) => ({
      name: method.payment_method,
      value: method.total_amount,
      percentage: method.percentage,
      color: COLORS[index % COLORS.length],
    }));
  }, [processedStats]);

  const professionalOccupancyData = useMemo(() => {
    if (!processedStats?.professionalOccupancy) return [];

    return processedStats.professionalOccupancy.map((prof: any) => ({
      name: prof.name,
      ocupacao: prof.occupancy_rate,
      horasTrabalho: prof.worked_hours,
    }));
  }, [processedStats]);

  const isLoading =
    statsLoading || revenueLoading || financialLoading || operationalLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!processedStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Executivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão completa do negócio • Atualizado às{" "}
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
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Indicadores Financeiros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Receita Mensal"
            value={processedStats.revenue}
            change={15}
            target={50000}
            period="Meta: R$ 50.000"
            icon={DollarSign}
            variant="primary"
            format="currency"
          />
          <MetricCard
            title="Lucro Estimado"
            value={processedStats.profit}
            change={12}
            target={25000}
            period="Meta: R$ 25.000"
            icon={TrendingUp}
            variant="success"
            format="currency"
          />
          <MetricCard
            title="Recebimentos Pendentes"
            value={processedStats.pendingReceivables}
            icon={CreditCard}
            variant="warning"
            format="currency"
            description="Agendamentos não pagos"
          />
          <MetricCard
            title="Comissão Paga"
            value={processedStats.commissionPaid}
            change={-5}
            icon={Briefcase}
            variant="info"
            format="currency"
            description="Este mês"
          />
          <MetricCard
            title="Taxa de Cancelamento"
            value={processedStats.cancellationRate}
            change={-2.1}
            icon={AlertTriangle}
            variant="danger"
            format="percentage"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="Avaliação Média"
            value={processedStats.averageRating}
            change={0.3}
            target={5}
            icon={Star}
            variant="success"
            description="Satisfação dos clientes"
          />
        </div>
      </section>

      {/* Operational KPIs */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Indicadores Operacionais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Agendamentos Hoje"
            value={processedStats.bookings}
            change={7}
            icon={Calendar}
            variant="primary"
            description="Confirmados e agendados"
          />
          <MetricCard
            title="Clientes Ativos"
            value={processedStats.clients}
            change={3}
            icon={Users}
            variant="secondary"
            description="Total de clientes"
          />
          <MetricCard
            title="Clientes Inativos"
            value={processedStats.inactiveClients}
            icon={UserX}
            variant="warning"
            description="Sem agendamentos há 90 dias"
          />
          <MetricCard
            title="Conversão Novos Clientes"
            value={processedStats.newClientConversion}
            change={5.2}
            icon={Target}
            variant="success"
            format="percentage"
            description="Taxa de retorno"
          />
          <MetricCard
            title="Mensagens Enviadas"
            value={processedStats.messagesSent}
            change={18}
            icon={MessageSquare}
            variant="info"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="Usuários Online"
            value={processedStats.onlineUsers}
            icon={Activity}
            variant="success"
            description="Ativos agora"
          />
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard
          title="Performance Financeira"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedPeriod === "month"
                    ? "30 dias"
                    : selectedPeriod === "week"
                      ? "7 dias"
                      : "12 meses"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedPeriod("week")}>
                  Últimos 7 dias
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("month")}>
                  Últimos 30 dias
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("year")}>
                  Últimos 12 meses
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="period"
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
                    name === "receita"
                      ? "Receita"
                      : name === "despesas"
                        ? "Despesas"
                        : "Lucro",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Peak Hours Chart */}
        <ChartCard title="Horários de Pico">
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
        </ChartCard>

        {/* Payment Methods Distribution */}
        <ChartCard title="Formas de Pagamento">
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
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Valor",
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Professional Occupancy */}
        <ChartCard title="Ocupação por Profissional">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionalOccupancyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Ocupação"]}
                />
                <Bar dataKey="ocupacao" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Marketing & Communication Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Marketing & Comunicação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="WhatsApp Enviadas"
            value={processedStats.whatsappMessages}
            change={25}
            icon={MessageSquare}
            variant="success"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="E-mails Enviados"
            value={processedStats.emailMessages}
            change={12}
            icon={MessageSquare}
            variant="info"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="Cliques em Campanhas"
            value={processedStats.campaignClicks}
            change={8.5}
            icon={MousePointer}
            variant="primary"
            description="Engajamento"
          />
          <MetricCard
            title="Conversões de Campanha"
            value={processedStats.campaignConversions}
            change={15.2}
            icon={Target}
            variant="success"
            description="Meta atingida"
          />
        </div>
      </section>

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

export default EnhancedDashboard;
