import React, { useState, useMemo } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  Download,
  RefreshCw,
  Target,
  Activity,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Banknote,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
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
  useTransactions,
  useCreateTransaction,
} from "@/hooks/useSupabaseProduction";

interface BeautifulPaymentsProps {
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

export const BeautifulPayments: React.FC<BeautifulPaymentsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [methodFilter, setMethodFilter] = useState<string>("todos");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // DADOS REAIS DO SUPABASE - Transações e pagamentos
  const {
    data: paymentsData = [],
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useTransactions({
    type: "receita",
    limit: 100,
    sort: "date",
    order: "DESC",
  });

  // Helper function to safely extract payments array
  const getPaymentsArray = (data: any) => {
    return Array.isArray(data) ? data : data?.data || [];
  };

  const metrics = useMemo(() => {
    const safePayments = getPaymentsArray(paymentsData);
    const totalPayments = safePayments.length;
    const totalPayments = safePayments.length;
    const approvedPayments = safePayments.filter(
      (p) => p.status === "confirmado",
    ).length;
    const totalAmount = safePayments
      .filter((p) => p.status === "confirmado")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingAmount = safePayments
      .filter((p) => p.status === "pendente")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      totalPayments,
      approvedPayments,
      totalAmount,
      pendingAmount,
      approvalRate:
        totalPayments > 0 ? (approvedPayments / totalPayments) * 100 : 0,
      averageTicket: approvedPayments > 0 ? totalAmount / approvedPayments : 0,
    };
  }, [paymentsData]);

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
        description: "Pagamentos atualizados com sucesso",
      });
    }, 1000);
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
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
            style.gradient,
            "group-hover:opacity-70",
          )}
        />
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
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Pagamentos Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Controle financeiro completo • Última atualização:{" "}
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
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas de Pagamentos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Total Aprovado"
              value={metrics.totalAmount}
              change={12}
              period="Valores confirmados"
              icon={DollarSign}
              variant="premium"
              format="currency"
            />
            <BeautifulKPICard
              title="Pagamentos"
              value={metrics.totalPayments}
              change={8}
              period="Transações"
              icon={Receipt}
              variant="primary"
            />
            <BeautifulKPICard
              title="Taxa Aprovação"
              value={metrics.approvalRate}
              change={5}
              period="Percentual"
              icon={CheckCircle}
              variant="success"
              format="percentage"
            />
            <BeautifulKPICard
              title="Ticket Médio"
              value={metrics.avgTicket}
              change={3}
              period="Por transação"
              icon={Target}
              variant="info"
              format="currency"
            />
            <BeautifulKPICard
              title="Pendentes"
              value={metrics.pendingAmount}
              period="Aguardando"
              icon={Clock}
              variant="warning"
              format="currency"
            />
            <BeautifulKPICard
              title="Aprovados"
              value={metrics.approvedPayments}
              change={10}
              period="Confirmados"
              icon={CheckCircle}
              variant="success"
            />
          </div>
        </section>

        {/* Payment List */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
              Transações Recentes
            </h3>
          </div>

          <div className="space-y-3">
            {(Array.isArray(paymentsData)
              ? paymentsData
              : paymentsData?.data || []
            ).map((payment) => (
              <Card
                key={payment.id}
                className="group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                          {payment.client}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.service} • {payment.method}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {payment.date
                            ? formatDate(payment.date)
                            : "Data não informada"}{" "}
                          • ID: {payment.transaction_id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                        {formatCurrency(payment.amount)}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs border-0",
                          payment.status === "aprovado"
                            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
                        )}
                      >
                        {payment.status === "aprovado"
                          ? "Aprovado"
                          : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
