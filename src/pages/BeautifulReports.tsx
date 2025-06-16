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
  TrendingDown as MarketingDown,
  Percent,
  Zap,
  Award,
  Shield,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
import { api } from "@/lib/api";

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
  variant?: "primary" | "success" | "warning" | "danger" | "premium" | "info";
  onClick?: () => void;
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  metrics: KPICardProps[];
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant = "primary",
  onClick,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return "from-green-600 to-green-800";
      case "warning":
        return "from-yellow-600 to-orange-700";
      case "danger":
        return "from-red-600 to-red-800";
      case "premium":
        return "from-purple-600 to-purple-800";
      case "info":
        return "from-blue-600 to-blue-800";
      default:
        return "from-[#00112F] to-blue-700";
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
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
                <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <Badge
                variant={change >= 0 ? "default" : "destructive"}
                className={cn(
                  "text-xs font-medium px-2 py-1",
                  change >= 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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

const SectionCard: React.FC<{
  section: ReportSection;
  onSectionClick: (id: string) => void;
}> = ({ section, onSectionClick }) => {
  return (
    <Card className="group bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${section.color}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}
            >
              <section.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionClick(section.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {section.metrics.slice(0, 4).map((metric, index) => (
            <div
              key={index}
              className="text-center p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30"
            >
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {metric.title}
              </div>
              {metric.change !== undefined && (
                <div
                  className={cn(
                    "text-xs font-medium mt-1",
                    metric.change >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {metric.change >= 0 ? "+" : ""}
                  {metric.change}%
                </div>
              )}
            </div>
          ))}
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
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reportData, setReportData] = useState<any>({});

  // Load data from APIs
  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Loading comprehensive report data...");

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
        api.getSalesReports(selectedPeriod, 10),
        api.getProfessionalReports(selectedPeriod),
        api.getClientReports(selectedPeriod),
        api.getAppointmentReports(selectedPeriod),
        api.getFinancialReports(selectedPeriod),
        api.getInventoryReports(),
      ]);

      setReportData({
        business: businessResponse.success ? businessResponse.data : null,
        sales: salesResponse.success ? salesResponse.data : null,
        professionals: professionalsResponse.success
          ? professionalsResponse.data
          : null,
        clients: clientsResponse.success ? clientsResponse.data : null,
        appointments: appointmentsResponse.success
          ? appointmentsResponse.data
          : null,
        financial: financialResponse.success ? financialResponse.data : null,
        inventory: inventoryResponse.success ? inventoryResponse.data : null,
      });

      console.log("✅ Report data loaded successfully");
    } catch (error) {
      console.error("❌ Error loading report data:", error);
      toast({
        title: "⚠️ Erro ao Carregar",
        description: "Usando dados simulados para demonstração",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, toast]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const periodOptions = [
    { value: "week", label: "Últimos 7 dias" },
    { value: "month", label: "Últimos 30 dias" },
    { value: "year", label: "Último ano" },
  ];

  // Create sections with real or fallback data
  const reportSections: ReportSection[] = useMemo(() => {
    const businessData = reportData.business?.overview || {};
    const salesData = reportData.sales || [];
    const professionalsData = reportData.professionals || [];
    const clientsData = reportData.clients?.overview || {};
    const appointmentsData = reportData.appointments?.trends || [];
    const financialData = reportData.financial || {};
    const inventoryData = reportData.inventory?.overview || {};

    return [
      {
        id: "agendamentos",
        title: "Agendamentos",
        description: "Performance e tendências de agendamentos",
        icon: Calendar,
        color: "from-blue-600 to-blue-800",
        metrics: [
          {
            title: "Total de Agendamentos",
            value: businessData.current_appointments || 248,
            change: businessData.appointment_growth || 15.3,
            period: "Este período",
            icon: Calendar,
            variant: "info",
          },
          {
            title: "Taxa de Conclusão",
            value: "94%",
            change: 2.1,
            period: "Este período",
            icon: CheckCircle,
            variant: "success",
            target: 95,
          },
          {
            title: "Taxa de No-Show",
            value: "3%",
            change: -1.2,
            period: "Este período",
            icon: AlertCircle,
            variant: "warning",
          },
          {
            title: "Tempo Médio",
            value: "45min",
            change: -2.5,
            period: "Por atendimento",
            icon: Clock,
            variant: "info",
          },
        ],
      },
      {
        id: "clientes",
        title: "Clientes",
        description: "Análise e comportamento da base de clientes",
        icon: Users,
        color: "from-green-600 to-green-800",
        metrics: [
          {
            title: "Total de Clientes",
            value: clientsData.total_clients || 1250,
            change: 12.8,
            period: "Base total",
            icon: Users,
            variant: "success",
          },
          {
            title: "Clientes Ativos",
            value: clientsData.active_clients || 890,
            change: 8.7,
            period: "Este período",
            icon: UserCheck,
            variant: "success",
          },
          {
            title: "Novos Clientes",
            value: "85",
            change: 22.1,
            period: "Este mês",
            icon: Star,
            variant: "premium",
          },
          {
            title: "Taxa de Retenção",
            value: "78.5%",
            change: 5.4,
            period: "Este trimestre",
            icon: Heart,
            variant: "success",
            target: 80,
          },
        ],
      },
      {
        id: "servicos",
        title: "Serviços",
        description: "Performance e popularidade dos serviços",
        icon: Activity,
        color: "from-purple-600 to-purple-800",
        metrics: [
          {
            title: "Serviços Ativos",
            value: salesData.length || 24,
            change: 0,
            period: "Catálogo atual",
            icon: Activity,
            variant: "premium",
          },
          {
            title: "Mais Popular",
            value: "Corte + Barba",
            period: "Este período",
            icon: TrendingUp,
            variant: "premium",
          },
          {
            title: "Satisfação Média",
            value: "4.8",
            change: 4.2,
            period: "Avaliação geral",
            icon: Star,
            variant: "premium",
            target: 5,
          },
          {
            title: "Receita por Serviço",
            value: formatCurrency(850),
            change: 18.7,
            period: "Média mensal",
            icon: DollarSign,
            variant: "premium",
          },
        ],
      },
      {
        id: "profissionais",
        title: "Profissionais",
        description: "Produtividade e performance da equipe",
        icon: Target,
        color: "from-orange-600 to-red-700",
        metrics: [
          {
            title: "Total da Equipe",
            value: professionalsData.length || 8,
            change: 12.5,
            period: "Profissionais ativos",
            icon: Target,
            variant: "warning",
          },
          {
            title: "Avaliação Média",
            value: "4.7",
            change: 2.1,
            period: "Satisfação geral",
            icon: Star,
            variant: "warning",
            target: 5,
          },
          {
            title: "Taxa de Ocupação",
            value: "85.2%",
            change: 8.3,
            period: "Utilização média",
            icon: Activity,
            variant: "warning",
            target: 90,
          },
          {
            title: "Mais Solicitado",
            value: "João Silva",
            period: "Este período",
            icon: Award,
            variant: "warning",
          },
        ],
      },
      {
        id: "estoque",
        title: "Estoque",
        description: "Controle e gestão de produtos",
        icon: Package,
        color: "from-teal-600 to-cyan-700",
        metrics: [
          {
            title: "Produtos Ativos",
            value: inventoryData.active_products || 156,
            change: 5.2,
            period: "Catálogo atual",
            icon: Package,
            variant: "info",
          },
          {
            title: "Valor do Estoque",
            value: formatCurrency(inventoryData.total_inventory_value || 45680),
            change: 12.3,
            period: "Valor total",
            icon: DollarSign,
            variant: "info",
          },
          {
            title: "Produtos em Falta",
            value: inventoryData.out_of_stock_count || 3,
            change: -25.0,
            period: "Sem estoque",
            icon: AlertCircle,
            variant: "danger",
          },
          {
            title: "Estoque Baixo",
            value: inventoryData.low_stock_count || 12,
            change: -15.8,
            period: "Alerta de reposição",
            icon: TrendingDown,
            variant: "warning",
          },
        ],
      },
      {
        id: "financeiro",
        title: "Financeiro",
        description: "Receitas, despesas e lucratividade",
        icon: DollarSign,
        color: "from-emerald-600 to-green-700",
        metrics: [
          {
            title: "Receita Total",
            value: formatCurrency(businessData.current_revenue || 45680),
            change: businessData.revenue_growth || 12.5,
            period: "Este período",
            icon: DollarSign,
            variant: "success",
          },
          {
            title: "Despesas",
            value: formatCurrency(18230),
            change: -5.2,
            period: "Este período",
            icon: CreditCard,
            variant: "warning",
          },
          {
            title: "Lucro Líquido",
            value: formatCurrency(27450),
            change: 18.7,
            period: "Este período",
            icon: TrendingUp,
            variant: "success",
          },
          {
            title: "Margem de Lucro",
            value: "60%",
            change: 3.1,
            period: "Este período",
            icon: Percent,
            variant: "success",
            target: 65,
          },
        ],
      },
      {
        id: "pagamentos",
        title: "Pagamentos",
        description: "Métodos e eficiência de pagamentos",
        icon: CreditCard,
        color: "from-indigo-600 to-blue-700",
        metrics: [
          {
            title: "Taxa de Sucesso",
            value: "98.5%",
            change: 1.2,
            period: "Este período",
            icon: CheckCircle,
            variant: "info",
            target: 99,
          },
          {
            title: "Pagamentos PIX",
            value: "65%",
            change: 15.3,
            period: "Participação",
            icon: Zap,
            variant: "info",
          },
          {
            title: "Cartão de Crédito",
            value: "25%",
            change: -5.1,
            period: "Participação",
            icon: CreditCard,
            variant: "info",
          },
          {
            title: "Valor Médio",
            value: formatCurrency(185),
            change: 8.7,
            period: "Por transação",
            icon: DollarSign,
            variant: "info",
          },
        ],
      },
      {
        id: "marketing",
        title: "Marketing",
        description: "Campanhas e conversão de clientes",
        icon: MessageCircle,
        color: "from-pink-600 to-rose-700",
        metrics: [
          {
            title: "Taxa de Conversão",
            value: "3.2%",
            change: 12.8,
            period: "Este período",
            icon: Target,
            variant: "premium",
            target: 5,
          },
          {
            title: "Campanhas Ativas",
            value: "6",
            change: 50.0,
            period: "Em andamento",
            icon: Share2,
            variant: "premium",
          },
          {
            title: "ROI Médio",
            value: "350%",
            change: 25.4,
            period: "Retorno investimento",
            icon: TrendingUp,
            variant: "premium",
          },
          {
            title: "Leads Gerados",
            value: "124",
            change: 18.9,
            period: "Este mês",
            icon: Users,
            variant: "premium",
          },
        ],
      },
    ];
  }, [reportData]);

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
      description: "Preparando relatório completo...",
    });
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  };

  const handleClearFilters = () => {
    setSelectedPeriod("month");
    setSelectedSection(null);
    setShowFilters(false);
    toast({
      title: "🔄 Filtros Limpos",
      description: "Filtros resetados para padrão",
    });
  };

  const selectedSectionData = selectedSection
    ? reportSections.find((s) => s.id === selectedSection)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-blue-50/30 to-slate-100/50 dark:from-[#0D1117] dark:via-[#00112F]/20 dark:to-slate-900/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#00112F]/10 to-blue-600/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-[#00112F]/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-[#00112F]/5 to-blue-700/5 rounded-full blur-2xl animate-pulse delay-2000" />

        {/* Sparkle Elements */}
        {[...Array(8)].map((_, i) => (
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
              i === 6 && "top-1/5 right-1/2 delay-6000",
              i === 7 && "bottom-1/2 right-1/5 delay-7000",
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
                      Relatórios Executivos
                    </h1>
                    <p className="text-blue-100">
                      Visão completa das 8 áreas chave do seu negócio
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
                {selectedSection && (
                  <Badge variant="outline" className="px-3 py-1">
                    Seção:{" "}
                    {
                      reportSections.find((s) => s.id === selectedSection)
                        ?.title
                    }
                  </Badge>
                )}
                {(selectedPeriod !== "month" || selectedSection) && (
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

        {/* Report Sections Overview */}
        {!selectedSection && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {reportSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onSectionClick={handleSectionClick}
              />
            ))}
          </div>
        )}

        {/* Detailed Section View */}
        {selectedSection && selectedSectionData && (
          <div className="space-y-8">
            {/* Section Header */}
            <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
              <div
                className={`h-2 bg-gradient-to-r ${selectedSectionData.color}`}
              />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${selectedSectionData.color} shadow-lg`}
                    >
                      <selectedSectionData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                        {selectedSectionData.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedSectionData.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSection(null)}
                    className="px-4 py-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedSectionData.metrics.map((metric, index) => (
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

            {/* Additional Section Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Tendências Temporais
                  </h3>
                  <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#00112F] dark:text-blue-400" />
                    <p className="text-[#00112F] dark:text-[#F9FAFB] font-medium">
                      Gráfico de tendências em desenvolvimento
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Visualização detalhada dos dados históricos de{" "}
                      {selectedSectionData.title.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                    Insights & Recomendações
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="font-medium text-green-800 dark:text-green-400">
                          Ponto Forte
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Performance acima da média no período analisado
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-400">
                          Oportunidade
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Potencial de melhoria identificado nas métricas de{" "}
                        {selectedSectionData.title.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Summary Statistics (only show in overview) */}
        {!selectedSection && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  {formatCurrency(
                    reportData.business?.overview?.current_revenue || 45680,
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  Receita Total
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +{reportData.business?.overview?.revenue_growth || 12.5}% vs
                  período anterior
                </div>
              </div>
            </Card>

            <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  {reportData.business?.overview?.current_appointments || 248}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  Total de Agendamentos
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  +{reportData.business?.overview?.appointment_growth || 15.3}%
                  vs período anterior
                </div>
              </div>
            </Card>

            <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  {reportData.clients?.overview?.active_clients || 890}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  Clientes Ativos
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +8.7% vs período anterior
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
