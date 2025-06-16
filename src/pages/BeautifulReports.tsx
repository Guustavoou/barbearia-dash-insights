import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  FileText,
  Users,
  DollarSign,
  Clock,
  Activity,
  Target,
  Sparkles,
  ExternalLink,
  Eye,
  CreditCard,
  UserCheck,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  X,
  ShoppingCart,
  Briefcase,
  Heart,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Percent,
  Zap,
  Award,
  Shield,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
import { api } from "@/lib/api";

interface BeautifulReportsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  color?: string;
  description?: string;
}

interface ChartSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color = "from-[#00112F] to-blue-700",
  description,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center space-x-1", getTrendColor())}>
              {getTrendIcon()}
              <Badge
                variant={change >= 0 ? "default" : "destructive"}
                className={cn(
                  "text-xs font-medium px-2 py-1",
                  change >= 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </Badge>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] group-hover:scale-105 transition-transform duration-300">
            {value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </Card>
  );
};

const ChartPlaceholder: React.FC<{
  type: "area" | "line" | "donut" | "bar";
  title: string;
  height?: string;
}> = ({ type, title, height = "h-64" }) => {
  const getIcon = () => {
    switch (type) {
      case "area":
        return (
          <BarChart3 className="w-12 h-12 text-[#00112F] dark:text-blue-400" />
        );
      case "line":
        return (
          <LineChart className="w-12 h-12 text-[#00112F] dark:text-blue-400" />
        );
      case "donut":
        return (
          <PieChart className="w-12 h-12 text-[#00112F] dark:text-blue-400" />
        );
      case "bar":
        return (
          <BarChart3 className="w-12 h-12 text-[#00112F] dark:text-blue-400" />
        );
      default:
        return (
          <BarChart3 className="w-12 h-12 text-[#00112F] dark:text-blue-400" />
        );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-[#F9FAFB]/80 via-blue-50/40 to-slate-100/30 dark:from-[#0D1117]/50 dark:via-[#00112F]/30 dark:to-slate-900/40 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600",
        height,
      )}
    >
      {getIcon()}
      <p className="text-[#00112F] dark:text-[#F9FAFB] font-medium mt-3">
        {title}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Gráfico em desenvolvimento
      </p>
    </div>
  );
};

export const BeautifulReports: React.FC<BeautifulReportsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [reportData, setReportData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from APIs
  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Carregando dados dos relatórios...");

      const [
        businessResponse,
        salesResponse,
        professionalsResponse,
        clientsResponse,
        appointmentsResponse,
        financialResponse,
        inventoryResponse,
      ] = await Promise.all([
        api.getBusinessReports(selectedPeriod),
        api.getSalesPerformance(selectedPeriod, 10),
        api.getProfessionalReports(selectedPeriod),
        api.getClientAnalysis(selectedPeriod),
        api.getAppointmentTrends(selectedPeriod),
        api.getFinancialAnalysis(selectedPeriod),
        api.getInventoryReport(),
      ]);

      setReportData({
        business: businessResponse.success ? businessResponse.data : {},
        sales: salesResponse.success ? salesResponse.data : [],
        professionals: professionalsResponse.success
          ? professionalsResponse.data
          : [],
        clients: clientsResponse.success ? clientsResponse.data : {},
        appointments: appointmentsResponse.success
          ? appointmentsResponse.data
          : {},
        financial: financialResponse.success ? financialResponse.data : {},
        inventory: inventoryResponse.success ? inventoryResponse.data : {},
      });

      console.log("✅ Dados dos relatórios carregados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao carregar dados dos relatórios:", error);
      toast({
        title: "⚠️ Dados de Demonstração",
        description: "Usando dados simulados para visualização",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, toast]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const periodOptions = [
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 3 meses" },
    { value: "1y", label: "Último ano" },
  ];

  const handleRefreshData = () => {
    setLastUpdate(new Date());
    loadReportData();
    toast({
      title: "✨ Dados Atualizados",
      description: "Relatórios atualizados com sucesso",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "📊 Exportando Relatório",
      description: "Preparando arquivo para download...",
    });
  };

  // Extract data with fallbacks
  const businessData = reportData.business?.overview || {};
  const clientsData = reportData.clients?.overview || {};
  const professionalsData = reportData.professionals || [];
  const salesData = reportData.sales || [];
  const financialData = reportData.financial || {};
  const inventoryData = reportData.inventory?.overview || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-blue-50/30 to-slate-100/50 dark:from-[#0D1117] dark:via-[#00112F]/20 dark:to-slate-900/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#00112F]/10 to-blue-600/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-[#00112F]/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-[#00112F]/5 to-blue-700/5 rounded-full blur-2xl animate-pulse delay-2000" />

        {/* Sparkle Elements */}
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={cn(
              "absolute w-6 h-6 text-[#00112F]/20 dark:text-blue-400/20 animate-pulse",
              i === 0 && "top-1/4 left-1/4 delay-0",
              i === 1 && "top-3/4 right-1/4 delay-1000",
              i === 2 && "top-1/2 left-3/4 delay-2000",
              i === 3 && "bottom-1/4 left-1/2 delay-3000",
              i === 4 && "top-1/3 right-1/3 delay-4000",
              i === 5 && "bottom-1/3 left-1/5 delay-5000",
            )}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border-0 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00112F] via-blue-900 to-blue-800 opacity-95" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Análise de Dados
                    </h1>
                    <p className="text-blue-100">
                      Relatórios detalhados do seu negócio •{" "}
                      {lastUpdate.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 mr-2",
                        isLoading && "animate-spin",
                      )}
                    />
                    Atualizar
                  </Button>
                  <Button
                    onClick={handleExportReport}
                    className="bg-white hover:bg-blue-50 text-[#00112F] shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
              <div className="text-sm text-blue-100">
                Última atualização: {formatDate(lastUpdate)} às{" "}
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-wrap gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-[#0D1117]/50 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  {periodOptions.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="financeiro" className="space-y-8">
          <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
            <div className="p-2">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="financeiro"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Financeiro
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="servicos"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Serviços
                </TabsTrigger>
                <TabsTrigger
                  value="profissionais"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Profissionais
                </TabsTrigger>
                <TabsTrigger
                  value="agendamentos"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Agendamentos
                </TabsTrigger>
                <TabsTrigger
                  value="estoque"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Estoque
                </TabsTrigger>
                <TabsTrigger
                  value="pagamentos"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Pagamentos
                </TabsTrigger>
                <TabsTrigger
                  value="marketing"
                  className="data-[state=active]:bg-[#00112F] data-[state=active]:text-white transition-all duration-300"
                >
                  Marketing
                </TabsTrigger>
              </TabsList>
            </div>
          </Card>

          {/* Financeiro Tab */}
          <TabsContent value="financeiro" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas Financeiras
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Dados consolidados da sua base de receitas
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Receita Total"
                  value={formatCurrency(businessData.current_revenue || 45680)}
                  change={businessData.revenue_growth || 12.5}
                  trend="up"
                  icon={DollarSign}
                  color="from-green-600 to-green-800"
                  description="Este período"
                />
                <StatCard
                  title="Despesas"
                  value={formatCurrency(18230)}
                  change={-5.2}
                  trend="down"
                  icon={CreditCard}
                  color="from-red-600 to-red-800"
                  description="Este período"
                />
                <StatCard
                  title="Lucro Líquido"
                  value={formatCurrency(27450)}
                  change={18.7}
                  trend="up"
                  icon={TrendingUp}
                  color="from-blue-600 to-blue-800"
                  description="Este período"
                />
                <StatCard
                  title="Margem de Lucro"
                  value="60%"
                  change={3.1}
                  trend="up"
                  icon={Percent}
                  color="from-purple-600 to-purple-800"
                  description="Este período"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Evolução da Receita"
                  subtitle="Receita mensal dos últimos 6 meses"
                >
                  <ChartPlaceholder type="area" title="Gráfico de Receita" />
                </ChartSection>

                <ChartSection
                  title="Distribuição de Despesas"
                  subtitle="Principais categorias de gastos"
                >
                  <ChartPlaceholder
                    type="donut"
                    title="Gráfico de Despesas por Categoria"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Clientes Tab */}
          <TabsContent value="clientes" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Clientes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Dados consolidados da sua base de clientes
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total de Clientes"
                  value={clientsData.total_clients || 1250}
                  change={12.8}
                  trend="up"
                  icon={Users}
                  color="from-blue-600 to-blue-800"
                  description="Base total"
                />
                <StatCard
                  title="Novos Clientes (30d)"
                  value={85}
                  change={22.1}
                  trend="up"
                  icon={UserCheck}
                  color="from-green-600 to-green-800"
                  description="Este mês"
                />
                <StatCard
                  title="Taxa de Retenção"
                  value="78.5%"
                  change={5.4}
                  trend="up"
                  icon={Heart}
                  color="from-purple-600 to-purple-800"
                  description="Este trimestre"
                />
                <StatCard
                  title="Frequência Média"
                  value="18 dias"
                  change={-2.1}
                  trend="down"
                  icon={Clock}
                  color="from-orange-600 to-orange-800"
                  description="Intervalo entre visitas"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartSection
                  title="Aquisição de Clientes"
                  subtitle="Novos clientes por mês"
                >
                  <ChartPlaceholder
                    type="area"
                    title="Gráfico de Aquisição de Clientes"
                  />
                </ChartSection>

                <ChartSection
                  title="Retenção de Clientes"
                  subtitle="Taxa de retorno dos clientes"
                >
                  <ChartPlaceholder
                    type="line"
                    title="Gráfico de Retenção de Clientes"
                  />
                </ChartSection>
              </div>

              <ChartSection
                title="Categorias de Clientes"
                subtitle="Segmentação do perfil de consumo"
              >
                <ChartPlaceholder
                  type="donut"
                  title="Gráfico de Categorias de Clientes"
                />
              </ChartSection>
            </div>
          </TabsContent>

          {/* Serviços Tab */}
          <TabsContent value="servicos" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Serviços
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Performance e popularidade dos serviços oferecidos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Serviços Ativos"
                  value={24}
                  change={0}
                  trend="neutral"
                  icon={Activity}
                  color="from-blue-600 to-blue-800"
                  description="Catálogo atual"
                />
                <StatCard
                  title="Serviço Mais Popular"
                  value="Corte + Barba"
                  icon={Star}
                  color="from-yellow-600 to-yellow-800"
                  description="Este período"
                />
                <StatCard
                  title="Satisfação Média"
                  value="4.8"
                  change={4.2}
                  trend="up"
                  icon={Star}
                  color="from-green-600 to-green-800"
                  description="Avaliação geral"
                />
                <StatCard
                  title="Receita Média/Serviço"
                  value={formatCurrency(850)}
                  change={18.7}
                  trend="up"
                  icon={DollarSign}
                  color="from-purple-600 to-purple-800"
                  description="Média mensal"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Performance por Serviço"
                  subtitle="Receita gerada por cada serviço"
                >
                  <ChartPlaceholder
                    type="bar"
                    title="Gráfico de Performance por Serviço"
                  />
                </ChartSection>

                <ChartSection
                  title="Popularidade dos Serviços"
                  subtitle="Distribuição de agendamentos por serviço"
                >
                  <ChartPlaceholder
                    type="donut"
                    title="Gráfico de Popularidade dos Serviços"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Profissionais Tab */}
          <TabsContent value="profissionais" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Profissionais
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Produtividade e performance da equipe
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total da Equipe"
                  value={8}
                  change={12.5}
                  trend="up"
                  icon={Target}
                  color="from-blue-600 to-blue-800"
                  description="Profissionais ativos"
                />
                <StatCard
                  title="Avaliação Média"
                  value="4.7"
                  change={2.1}
                  trend="up"
                  icon={Star}
                  color="from-green-600 to-green-800"
                  description="Satisfação geral"
                />
                <StatCard
                  title="Taxa de Ocupação"
                  value="85.2%"
                  change={8.3}
                  trend="up"
                  icon={Activity}
                  color="from-purple-600 to-purple-800"
                  description="Utilização média"
                />
                <StatCard
                  title="Mais Solicitado"
                  value="João Silva"
                  icon={Award}
                  color="from-orange-600 to-orange-800"
                  description="Este período"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Produtividade por Profissional"
                  subtitle="Atendimentos realizados por mês"
                >
                  <ChartPlaceholder
                    type="bar"
                    title="Gráfico de Produtividade"
                  />
                </ChartSection>

                <ChartSection
                  title="Distribuição de Agendamentos"
                  subtitle="Porcentagem de agendamentos por profissional"
                >
                  <ChartPlaceholder
                    type="donut"
                    title="Gráfico de Distribuição de Agendamentos"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Agendamentos Tab */}
          <TabsContent value="agendamentos" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Agendamentos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Performance e tendências de agendamentos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total de Agendamentos"
                  value={businessData.current_appointments || 248}
                  change={businessData.appointment_growth || 15.3}
                  trend="up"
                  icon={Calendar}
                  color="from-blue-600 to-blue-800"
                  description="Este período"
                />
                <StatCard
                  title="Taxa de Conclusão"
                  value="94%"
                  change={2.1}
                  trend="up"
                  icon={CheckCircle}
                  color="from-green-600 to-green-800"
                  description="Este período"
                />
                <StatCard
                  title="Taxa de No-Show"
                  value="3%"
                  change={-1.2}
                  trend="down"
                  icon={AlertCircle}
                  color="from-red-600 to-red-800"
                  description="Este período"
                />
                <StatCard
                  title="Tempo Médio"
                  value="45min"
                  change={-2.5}
                  trend="down"
                  icon={Clock}
                  color="from-purple-600 to-purple-800"
                  description="Por atendimento"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Agendamentos por Dia"
                  subtitle="Volume de agendamentos nos últimos 30 dias"
                >
                  <ChartPlaceholder
                    type="line"
                    title="Gráfico de Agendamentos Diários"
                  />
                </ChartSection>

                <ChartSection
                  title="Distribuição por Horário"
                  subtitle="Horários mais procurados"
                >
                  <ChartPlaceholder
                    type="bar"
                    title="Gráfico de Distribuição por Horário"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Estoque Tab */}
          <TabsContent value="estoque" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Estoque
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Controle e gestão de produtos em estoque
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Produtos Ativos"
                  value={inventoryData.active_products || 156}
                  change={5.2}
                  trend="up"
                  icon={Package}
                  color="from-blue-600 to-blue-800"
                  description="Catálogo atual"
                />
                <StatCard
                  title="Valor do Estoque"
                  value={formatCurrency(
                    inventoryData.total_inventory_value || 45680,
                  )}
                  change={12.3}
                  trend="up"
                  icon={DollarSign}
                  color="from-green-600 to-green-800"
                  description="Valor total"
                />
                <StatCard
                  title="Produtos em Falta"
                  value={inventoryData.out_of_stock_count || 3}
                  change={-25.0}
                  trend="down"
                  icon={AlertCircle}
                  color="from-red-600 to-red-800"
                  description="Sem estoque"
                />
                <StatCard
                  title="Estoque Baixo"
                  value={inventoryData.low_stock_count || 12}
                  change={-15.8}
                  trend="down"
                  icon={TrendingDown}
                  color="from-orange-600 to-orange-800"
                  description="Alerta de reposição"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Valor por Categoria"
                  subtitle="Distribuição do valor do estoque por categoria"
                >
                  <ChartPlaceholder
                    type="donut"
                    title="Gráfico de Valor por Categoria"
                  />
                </ChartSection>

                <ChartSection
                  title="Produtos Mais Utilizados"
                  subtitle="Produtos com maior saída"
                >
                  <ChartPlaceholder
                    type="bar"
                    title="Gráfico de Produtos Mais Utilizados"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Pagamentos Tab */}
          <TabsContent value="pagamentos" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Pagamentos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Métodos e eficiência de pagamentos
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Taxa de Sucesso"
                  value="98.5%"
                  change={1.2}
                  trend="up"
                  icon={CheckCircle}
                  color="from-green-600 to-green-800"
                  description="Este período"
                />
                <StatCard
                  title="Pagamentos PIX"
                  value="65%"
                  change={15.3}
                  trend="up"
                  icon={Zap}
                  color="from-blue-600 to-blue-800"
                  description="Participação"
                />
                <StatCard
                  title="Cartão de Crédito"
                  value="25%"
                  change={-5.1}
                  trend="down"
                  icon={CreditCard}
                  color="from-purple-600 to-purple-800"
                  description="Participação"
                />
                <StatCard
                  title="Valor Médio"
                  value={formatCurrency(185)}
                  change={8.7}
                  trend="up"
                  icon={DollarSign}
                  color="from-orange-600 to-orange-800"
                  description="Por transação"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Métodos de Pagamento"
                  subtitle="Distribuição dos métodos de pagamento"
                >
                  <ChartPlaceholder
                    type="donut"
                    title="Gráfico de Métodos de Pagamento"
                  />
                </ChartSection>

                <ChartSection
                  title="Volume de Transações"
                  subtitle="Quantidade de transações por dia"
                >
                  <ChartPlaceholder
                    type="line"
                    title="Gráfico de Volume de Transações"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Estatísticas de Marketing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Campanhas e conversão de clientes
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Taxa de Conversão"
                  value="3.2%"
                  change={12.8}
                  trend="up"
                  icon={Target}
                  color="from-green-600 to-green-800"
                  description="Este período"
                />
                <StatCard
                  title="Campanhas Ativas"
                  value="6"
                  change={50.0}
                  trend="up"
                  icon={Share2}
                  color="from-blue-600 to-blue-800"
                  description="Em andamento"
                />
                <StatCard
                  title="ROI Médio"
                  value="350%"
                  change={25.4}
                  trend="up"
                  icon={TrendingUp}
                  color="from-purple-600 to-purple-800"
                  description="Retorno investimento"
                />
                <StatCard
                  title="Leads Gerados"
                  value="124"
                  change={18.9}
                  trend="up"
                  icon={Users}
                  color="from-orange-600 to-orange-800"
                  description="Este mês"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                  title="Conversão por Canal"
                  subtitle="Taxa de conversão por canal de marketing"
                >
                  <ChartPlaceholder
                    type="bar"
                    title="Gráfico de Conversão por Canal"
                  />
                </ChartSection>

                <ChartSection
                  title="ROI por Campanha"
                  subtitle="Retorno sobre investimento das campanhas"
                >
                  <ChartPlaceholder
                    type="line"
                    title="Gráfico de ROI por Campanha"
                  />
                </ChartSection>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
