import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulReportsProps {
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
  variant?: "primary" | "success" | "warning" | "danger" | "premium";
}

interface ReportData {
  financial: {
    revenue: number;
    expenses: number;
    profit: number;
    growth: number;
  };
  clients: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  services: {
    total: number;
    popular: string;
    avgDuration: number;
    satisfaction: number;
  };
  professionals: {
    total: number;
    avgRating: number;
    busiest: string;
    utilization: number;
  };
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant = "primary",
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return "from-blue-600 to-blue-800";
      case "warning":
        return "from-slate-600 to-slate-700";
      case "danger":
        return "from-gray-600 to-gray-700";
      case "premium":
        return "from-[#00112F] to-blue-900";
      default:
        return "from-[#00112F] to-blue-700";
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getVariantColors()} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${getVariantColors()} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
              <Badge
                variant={change >= 0 ? "default" : "destructive"}
                className={cn(
                  "text-xs font-medium px-2 py-1",
                  change >= 0
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
                )}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </Badge>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-2xl text-[#00112F] dark:text-[#F9FAFB] group-hover:scale-105 transition-transform duration-300">
            {value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{period}</p>
          {target && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Meta: {target}%</span>
                <span>{Math.round((Number(value) / target) * 100)}%</span>
              </div>
              <Progress
                value={(Number(value) / target) * 100}
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
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
  const [selectedReport, setSelectedReport] = useState<string>("financeiro");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for reports
  const reportData: ReportData = {
    financial: {
      revenue: 45680,
      expenses: 18230,
      profit: 27450,
      growth: 12.5,
    },
    clients: {
      total: 1250,
      active: 890,
      new: 85,
      retention: 78.5,
    },
    services: {
      total: 24,
      popular: "Corte + Barba",
      avgDuration: 45,
      satisfaction: 4.8,
    },
    professionals: {
      total: 8,
      avgRating: 4.7,
      busiest: "João Silva",
      utilization: 85.2,
    },
  };

  const periodOptions = [
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 3 meses" },
    { value: "1y", label: "Último ano" },
  ];

  const reportTypes = [
    { value: "financeiro", label: "Relatório Financeiro", icon: DollarSign },
    { value: "clientes", label: "Relatório de Clientes", icon: Users },
    { value: "servicos", label: "Relatório de Serviços", icon: Activity },
    {
      value: "profissionais",
      label: "Relatório de Profissionais",
      icon: Target,
    },
  ];

  const recentReports = [
    {
      id: "1",
      name: "Relatório Financeiro - Janeiro 2024",
      type: "Financeiro",
      createdAt: "2024-02-01T10:00:00Z",
      size: "2.3 MB",
      status: "concluido" as const,
    },
    {
      id: "2",
      name: "Análise de Clientes - Q4 2023",
      type: "Clientes",
      createdAt: "2024-01-15T14:30:00Z",
      size: "1.8 MB",
      status: "concluido" as const,
    },
    {
      id: "3",
      name: "Performance de Serviços - Dezembro",
      type: "Serviços",
      createdAt: "2024-01-01T09:00:00Z",
      size: "1.2 MB",
      status: "processando" as const,
    },
  ];

  const metrics = useMemo(() => {
    switch (selectedReport) {
      case "financeiro":
        return [
          {
            title: "Receita Total",
            value: formatCurrency(reportData.financial.revenue),
            change: reportData.financial.growth,
            period: "Este mês",
            icon: DollarSign,
            variant: "primary" as const,
          },
          {
            title: "Despesas",
            value: formatCurrency(reportData.financial.expenses),
            change: -5.2,
            period: "Este mês",
            icon: CreditCard,
            variant: "warning" as const,
          },
          {
            title: "Lucro Líquido",
            value: formatCurrency(reportData.financial.profit),
            change: 18.7,
            period: "Este mês",
            icon: TrendingUp,
            variant: "success" as const,
          },
          {
            title: "Margem de Lucro",
            value: `${Math.round((reportData.financial.profit / reportData.financial.revenue) * 100)}%`,
            change: 3.1,
            period: "Este mês",
            icon: Target,
            variant: "premium" as const,
            target: 65,
          },
        ];
      case "clientes":
        return [
          {
            title: "Total de Clientes",
            value: reportData.clients.total,
            change: 15.3,
            period: "Base ativa",
            icon: Users,
            variant: "primary" as const,
          },
          {
            title: "Clientes Ativos",
            value: reportData.clients.active,
            change: 8.7,
            period: "Este mês",
            icon: UserCheck,
            variant: "success" as const,
          },
          {
            title: "Novos Clientes",
            value: reportData.clients.new,
            change: 22.1,
            period: "Este mês",
            icon: Star,
            variant: "premium" as const,
          },
          {
            title: "Taxa de Retenção",
            value: `${reportData.clients.retention}%`,
            change: 5.4,
            period: "Este trimestre",
            icon: Target,
            variant: "warning" as const,
            target: 80,
          },
        ];
      case "servicos":
        return [
          {
            title: "Total de Serviços",
            value: reportData.services.total,
            change: 0,
            period: "Catálogo ativo",
            icon: Activity,
            variant: "primary" as const,
          },
          {
            title: "Duração Média",
            value: `${reportData.services.avgDuration}min`,
            change: -2.1,
            period: "Por atendimento",
            icon: Clock,
            variant: "success" as const,
          },
          {
            title: "Satisfação",
            value: reportData.services.satisfaction.toFixed(1),
            change: 4.2,
            period: "Avaliação média",
            icon: Star,
            variant: "premium" as const,
            target: 5,
          },
          {
            title: "Mais Popular",
            value: reportData.services.popular,
            period: "Este mês",
            icon: TrendingUp,
            variant: "warning" as const,
          },
        ];
      case "profissionais":
        return [
          {
            title: "Total de Profissionais",
            value: reportData.professionals.total,
            change: 12.5,
            period: "Equipe ativa",
            icon: Target,
            variant: "primary" as const,
          },
          {
            title: "Avaliação Média",
            value: reportData.professionals.avgRating.toFixed(1),
            change: 2.1,
            period: "Satisfação geral",
            icon: Star,
            variant: "success" as const,
            target: 5,
          },
          {
            title: "Taxa de Utilização",
            value: `${reportData.professionals.utilization}%`,
            change: 8.3,
            period: "Ocupação média",
            icon: Activity,
            variant: "premium" as const,
            target: 90,
          },
          {
            title: "Mais Solicitado",
            value: reportData.professionals.busiest,
            period: "Este mês",
            icon: UserCheck,
            variant: "warning" as const,
          },
        ];
      default:
        return [];
    }
  }, [selectedReport, reportData]);

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Relatórios atualizados com sucesso",
      });
    }, 1000);
  };

  const handleExportReport = () => {
    toast({
      title: "📊 Exportando Relatório",
      description: `Preparando ${reportTypes.find((r) => r.value === selectedReport)?.label}...`,
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "⬇️ Download Iniciado",
      description: `Baixando ${reportName}...`,
    });
  };

  const handleClearFilters = () => {
    setSelectedPeriod("30d");
    setSelectedReport("financeiro");
    setShowFilters(false);
    toast({
      title: "🔄 Filtros Limpos",
      description: "Filtros resetados para padrão",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "processando":
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

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
                      Relatórios & Análises
                    </h1>
                    <p className="text-blue-100">
                      Insights completos do seu negócio
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

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-wrap gap-3 flex-1">
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
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
                {(selectedPeriod !== "30d" ||
                  selectedReport !== "financeiro") && (
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
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <KPICard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              target={metric.target}
              period={metric.period}
              icon={metric.icon}
              variant={metric.variant}
            />
          ))}
        </div>

        {/* Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Charts Section */}
          <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                Análises Visuais
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-6 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <LineChart className="w-10 h-10 mx-auto mb-3 text-[#00112F] dark:text-blue-400" />
                  <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Tendências Temporais
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Análise de crescimento e sazonalidade
                  </p>
                </div>
                <div className="text-center p-6 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3 text-[#00112F] dark:text-blue-400" />
                  <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Comparações
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Performance vs períodos anteriores
                  </p>
                </div>
                <div className="text-center p-6 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                  <Target className="w-10 h-10 mx-auto mb-3 text-[#00112F] dark:text-blue-400" />
                  <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Metas e Objetivos
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acompanhamento de progresso
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Reports List */}
          <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                Relatórios Recentes
              </h3>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="group p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#00112F] dark:text-[#F9FAFB] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {report.name}
                      </h4>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status === "concluido"
                          ? "Concluído"
                          : "Processando"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {report.type} • {report.size}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span>{formatDate(report.createdAt)}</span>
                        {report.status === "concluido" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
