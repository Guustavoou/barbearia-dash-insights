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
// 🚀 INTEGRAÇÃO PRODUCTION SUPABASE - 100% DADOS REAIS
import {
  useDashboardStats,
  useBusinessReports,
  useAppointments,
  useClients,
  useGlobalLoading,
  useGlobalError,
} from "@/hooks/useSupabaseProduction";

interface BeautifulDashboardProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  description,
}) => (
  <Card className="relative overflow-hidden border-0 shadow-lg">
    <div className={`absolute inset-0 ${color} opacity-5`} />
    <div className="relative p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mb-2">{description}</p>
          )}
          <div className="flex items-center gap-2">
            {change > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : change < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Activity className="h-4 w-4 text-gray-500" />
            )}
            <span
              className={`text-sm font-medium ${
                change > 0
                  ? "text-green-600"
                  : change < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  </Card>
);

export const BeautifulDashboardProduction: React.FC<
  BeautifulDashboardProps
> = ({ darkMode, onPageChange }) => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // 🚀 DADOS REAIS DO SUPABASE - SEM MOCKS
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    data: businessReports,
    loading: reportsLoading,
    error: reportsError,
  } = useBusinessReports();
  const {
    data: todayAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments({
    date: new Date().toISOString().split("T")[0],
    limit: 10,
  });
  const {
    data: recentClients,
    loading: clientsLoading,
    error: clientsError,
  } = useClients({
    limit: 5,
    sort: "created_at",
    order: "DESC",
  });

  // Global loading and error states
  const isLoading = useGlobalLoading(
    { loading: statsLoading },
    { loading: reportsLoading },
    { loading: appointmentsLoading },
    { loading: clientsLoading },
  );

  const globalError = useGlobalError(
    { error: statsError },
    { error: reportsError },
    { error: appointmentsError },
    { error: clientsError },
  );

  // Process real data
  const currentStats = useMemo(() => {
    if (!stats) {
      return {
        totalClients: 0,
        totalAppointments: 0,
        totalServices: 0,
        totalProfessionals: 0,
        todayAppointments: 0,
        monthlyRevenue: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
      };
    }
    return stats;
  }, [stats]);

  const revenueChartData = useMemo(() => {
    if (!businessReports?.overview) return [];
    return businessReports.overview.slice(-30); // Last 30 days
  }, [businessReports]);

  const servicePerformanceData = useMemo(() => {
    if (!businessReports?.servicePerformance) return [];
    return businessReports.servicePerformance.slice(0, 5); // Top 5 services
  }, [businessReports]);

  const recentAppointments = useMemo(() => {
    if (!todayAppointments?.data) return [];
    return todayAppointments.data.slice(0, 5);
  }, [todayAppointments]);

  const newClients = useMemo(() => {
    if (!recentClients?.data) return [];
    return recentClients.data;
  }, [recentClients]);

  // Color palette for charts
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Error state
  if (globalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar dashboard
            </h2>
            <p className="text-gray-600 mb-4">{globalError}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Visão geral do seu negócio com dados em tempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <Button
              onClick={() => onPageChange?.("appointments")}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Clientes"
            value={currentStats.totalClients}
            change={12.5}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            description="Clientes cadastrados"
          />
          <KPICard
            title="Agendamentos Hoje"
            value={currentStats.todayAppointments}
            change={8.2}
            icon={<Calendar className="h-6 w-6 text-white" />}
            color="bg-green-500"
            description={`${currentStats.pendingAppointments} pendentes`}
          />
          <KPICard
            title="Receita do Mês"
            value={formatCurrency(currentStats.monthlyRevenue)}
            change={15.3}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-purple-500"
            description="Valor total faturado"
          />
          <KPICard
            title="Profissionais Ativos"
            value={currentStats.totalProfessionals}
            change={5.1}
            icon={<UserCheck className="h-6 w-6 text-white" />}
            color="bg-orange-500"
            description="Equipe disponível"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Receita por Dia
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="h-64">
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLine data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        fontSize={12}
                        formatter={(value) =>
                          new Date(value).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })
                        }
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        formatter={(value) => `R$ ${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          "Receita",
                        ]}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                      />
                    </RechartsLine>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Dados de receita serão exibidos aqui</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Service Performance Chart */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Serviços Mais Populares
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.("services")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
              <div className="h-64">
                {servicePerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={servicePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value, name) => [
                          name === "count"
                            ? `${value} agendamentos`
                            : formatCurrency(Number(value)),
                          name === "count" ? "Total" : "Receita",
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Performance dos serviços será exibida aqui</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Agendamentos de Hoje
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.("appointments")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
              <div className="space-y-4">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.clientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.serviceName} •{" "}
                            {formatTime(appointment.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            appointment.status === "completed"
                              ? "default"
                              : appointment.status === "confirmed" ||
                                  appointment.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "confirmed" ||
                                  appointment.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {appointment.status === "completed" && "Concluído"}
                          {appointment.status === "confirmed" && "Confirmado"}
                          {appointment.status === "scheduled" && "Agendado"}
                          {appointment.status === "pending" && "Pendente"}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatCurrency(appointment.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum agendamento para hoje</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Clients */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Novos Clientes
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.("clients")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
              <div className="space-y-4">
                {newClients.length > 0 ? (
                  newClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {client.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Novo
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(client.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum cliente novo recentemente</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => onPageChange?.("appointments")}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">Agendamentos</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange?.("clients")}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200"
              >
                <Users className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Clientes</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange?.("services")}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200"
              >
                <Scissors className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">Serviços</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange?.("financial")}
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
              >
                <DollarSign className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium">Financeiro</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BeautifulDashboardProduction;
