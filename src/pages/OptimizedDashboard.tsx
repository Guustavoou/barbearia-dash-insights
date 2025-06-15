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
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import {
  useDashboardStats,
  useRevenueData,
  useTopServices,
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

const SecondaryMetric: React.FC<SecondaryMetricProps> = ({
  label,
  value,
  trend,
  delta,
}) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
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

const SkeletonCard = () => (
  <Card className="p-6 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </Card>
);

export const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({
  darkMode,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showSecondaryMetrics, setShowSecondaryMetrics] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // API hooks
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } =
    useRevenueData(selectedPeriod);
  const { data: topServices, loading: servicesLoading } = useTopServices(5);

  // Memoized data processing
  const processedStats = useMemo(() => {
    if (!stats?.data) return null;
    return {
      revenue: stats.data.month_revenue || 5220,
      profit: stats.data.net_income || 3132,
      bookings: stats.data.today_appointments || 28,
      clients: stats.data.total_clients || 214,
    };
  }, [stats]);

  const chartData = useMemo(
    () => [
      { name: "Jan", receita: 3200, lucro: 1920 },
      { name: "Fev", receita: 3800, lucro: 2280 },
      { name: "Mar", receita: 4100, lucro: 2460 },
      { name: "Abr", receita: 4500, lucro: 2700 },
      { name: "Mai", receita: 5100, lucro: 3060 },
      { name: "Jun", receita: 5220, lucro: 3132 },
    ],
    [],
  );

  const secondaryMetrics = [
    {
      label: "Taxa de Ocupação",
      value: "78%",
      trend: "up" as const,
      delta: "+5%",
    },
    {
      label: "Ticket Médio",
      value: "R$ 85",
      trend: "up" as const,
      delta: "+12%",
    },
    {
      label: "No-Show Rate",
      value: "4.2%",
      trend: "down" as const,
      delta: "-0.8%",
    },
    {
      label: "Satisfação NPS",
      value: "8.7",
      trend: "up" as const,
      delta: "+0.3%",
    },
  ];

  const isLoading = statsLoading || revenueLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
      </div>
    );
  }

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
            value={formatCurrency(processedStats?.revenue || 0)}
            change={15}
            target={6000}
            period="Meta: R$ 6.000"
            icon={DollarSign}
            variant="revenue"
          />
          <PrimaryKPICard
            title="Lucro Líquido"
            value={formatCurrency(processedStats?.profit || 0)}
            change={12}
            target={3500}
            period="Meta: R$ 3.500"
            icon={TrendingUp}
            variant="profit"
          />
          <PrimaryKPICard
            title="Agendamentos"
            value={processedStats?.bookings?.toString() || "0"}
            change={7}
            period="Hoje"
            icon={Calendar}
            variant="bookings"
          />
          <PrimaryKPICard
            title="Clientes Ativos"
            value={processedStats?.clients?.toString() || "0"}
            change={3}
            period="Total"
            icon={Users}
            variant="clients"
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
          <h3
            id="secondary-metrics"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Indicadores Operacionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryMetrics.map((metric, index) => (
              <SecondaryMetric key={index} {...metric} />
            ))}
          </div>
        </section>
      )}

      {/* Revenue Chart */}
      <section aria-labelledby="revenue-chart">
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
                  <DropdownMenuItem onClick={() => setSelectedPeriod("month")}>
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

      {/* Debug Sidebar Test Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={() => {
            console.log(
              "Test button clicked - checking if sidebar exists in DOM",
            );
            const sidebar = document.querySelector(
              '[data-testid="right-sidebar"]',
            );
            console.log("Sidebar element found:", sidebar);
            // Try to find and click the toggle
            const toggleBtn = document.querySelector(
              '[data-testid="sidebar-toggle"]',
            );
            if (toggleBtn) {
              (toggleBtn as HTMLElement).click();
            }
          }}
          className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 text-white shadow-lg"
          title="Test Sidebar"
        >
          🔧
        </Button>
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
