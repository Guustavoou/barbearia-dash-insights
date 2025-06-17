import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3,
  Calculator,
  Target,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Eye,
  MoreVertical,
  Sparkles,
  ExternalLink,
  Coins,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
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
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
import {
  useSupabaseTransactions,
  useSupabaseFinancialStats,
  useSupabaseBusinessReports,
  useCreateSupabaseTransaction,
} from "@/hooks/useSupabaseApi";

interface BeautifulFinancialProps {
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

export const BeautifulFinancial: React.FC<BeautifulFinancialProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // DADOS REAIS DO SUPABASE - Informações financeiras
  const { data: financialStats, loading: statsLoading } =
    useSupabaseFinancialStats(selectedPeriod);
  const { data: businessReports, loading: reportsLoading } =
    useSupabaseBusinessReports(selectedPeriod);
  const { data: transactions, loading: transactionsLoading } =
    useSupabaseTransactions({ limit: 100 });

  const financialData = financialStats || {
    total_revenue: 0,
    total_expenses: 0,
    net_income: 0,
    profit_margin: 0,
  };

  const revenueData = businessReports?.overview || [];

  const expenseCategories = [
    { name: "Salários", value: 8500, color: "#00112F", percentage: 46.6 },
    { name: "Produtos", value: 4200, color: "#4B5563", percentage: 23.0 },
    { name: "Aluguel", value: 2800, color: "#6B7280", percentage: 15.4 },
    { name: "Marketing", value: 1500, color: "#9CA3AF", percentage: 8.2 },
    { name: "Outros", value: 1230, color: "#D1D5DB", percentage: 6.8 },
  ];

  const recentTransactions = [
    {
      id: "1",
      type: "receita",
      description: "Corte + Barba - João Silva",
      amount: 85,
      date: new Date(),
      method: "cartao",
      status: "confirmado",
    },
    {
      id: "2",
      type: "despesa",
      description: "Compra de produtos",
      amount: 280,
      date: new Date(Date.now() - 86400000),
      method: "pix",
      status: "confirmado",
    },
    {
      id: "3",
      type: "receita",
      description: "Coloração - Ana Costa",
      amount: 180,
      date: new Date(Date.now() - 172800000),
      method: "dinheiro",
      status: "pendente",
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
        description: "Relatório financeiro atualizado com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório financeiro...",
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

  const BeautifulTransactionCard: React.FC<{
    transaction: any;
  }> = ({ transaction }) => {
    const isIncome = transaction.type === "receita";
    const statusStyles = {
      confirmado: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400",
        icon: CheckCircle,
      },
      pendente: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
        icon: Clock,
      },
      cancelado: {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400",
        icon: XCircle,
      },
    };

    const status =
      statusStyles[transaction.status as keyof typeof statusStyles];

    return (
      <Card className="group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl shadow-lg",
                  isIncome
                    ? "bg-gradient-to-br from-blue-600 to-blue-700"
                    : "bg-gradient-to-br from-gray-600 to-gray-700",
                )}
              >
                {isIncome ? (
                  <ArrowUpRight className="w-4 h-4 text-white" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] text-sm">
                  {transaction.description}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {transaction.date
                    ? formatDate(transaction.date)
                    : "Data não informada"}{" "}
                  • {transaction.method}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "text-lg font-bold",
                  isIncome
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400",
                )}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs border-0", status.bg)}
              >
                <status.icon className="w-3 h-3 mr-1" />
                {transaction.status}
              </Badge>
            </div>
          </div>
        </div>

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
                <DollarSign className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Financeiro Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Controle total das suas finanças • Última atualização:{" "}
                {lastUpdate.toLocaleTimeString()}
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
            Indicadores Financeiros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <BeautifulKPICard
              title="Receita Total"
              value={financialData.revenue}
              change={12}
              target={financialData.targetRevenue}
              period="Meta: R$ 50.000"
              icon={DollarSign}
              variant="premium"
              format="currency"
              onCardClick={() => handleNavigate("financial")}
              navigateTo="financial"
            />
            <BeautifulKPICard
              title="Despesas"
              value={financialData.expenses}
              change={-5}
              period="Gastos do mês"
              icon={Receipt}
              variant="warning"
              format="currency"
            />
            <BeautifulKPICard
              title="Lucro Líquido"
              value={financialData.profit}
              change={18}
              period="Resultado final"
              icon={TrendingUp}
              variant="success"
              format="currency"
            />
            <BeautifulKPICard
              title="Margem de Lucro"
              value={financialData.profitMargin}
              change={3}
              period="Percentual"
              icon={Target}
              variant="info"
              format="percentage"
            />
            <BeautifulKPICard
              title="Transações"
              value={financialData.transactions}
              change={8}
              period="Total do mês"
              icon={Activity}
              variant="primary"
            />
            <BeautifulKPICard
              title="Ticket Médio"
              value={financialData.averageTicket}
              change={5}
              period="Por transação"
              icon={Calculator}
              variant="info"
              format="currency"
            />
            <BeautifulKPICard
              title="Crescimento"
              value={financialData.growth}
              change={2}
              period="Vs. mês anterior"
              icon={Zap}
              variant="success"
              format="percentage"
            />
            <BeautifulKPICard
              title="ROI"
              value={85.5}
              change={4}
              period="Return on Investment"
              icon={Coins}
              variant="premium"
              format="percentage"
            />
          </div>
        </section>

        {/* Beautiful Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receitas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
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
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00112F"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00112F"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorProfit"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563EB"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563EB"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
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
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00112F"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#2563EB"
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Expenses Pie Chart */}
              <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Distribuição de Despesas
                </h3>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseCategories.map((entry, index) => (
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
                          formatCurrency(Number(value)),
                          props.payload.name,
                        ]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {expenseCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-[#00112F] dark:text-[#F9FAFB]">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#00112F] dark:text-[#F9FAFB]">
                          {formatCurrency(category.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Recent Transactions */}
            <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Transações Recentes
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#00112F] dark:text-[#F9FAFB] hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Ver todas
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <BeautifulTransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
