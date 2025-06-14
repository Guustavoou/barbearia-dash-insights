<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======

import React from "react";
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  Scissors,
  Package,
} from "lucide-react";
<<<<<<< HEAD
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  cn,
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/unclicUtils";
import { PageType } from "@/lib/types";
import { QuickActions } from "@/components/QuickActions";
import {
  useDashboardStats,
  useRevenueData,
  useTopServices,
  useUpcomingAppointments,
  useBirthdays,
} from "@/hooks/useApi";
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAppointments } from "@/hooks/useAppointments";
import { useTransactions } from "@/hooks/useTransactions";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/unclicUtils";
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157

interface DashboardProps {
  darkMode: boolean;
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const loading = statsLoading || appointmentsLoading || transactionsLoading;

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointment_date === today);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAppointmentTime = (timeString: string) => {
    // timeString is in HH:MM format, convert to Date for formatting
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return formatTime(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
<<<<<<< HEAD
      <div className="text-white">
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-white/90 text-sm font-medium">{title}</p>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  darkMode,
  onPageChange,
}) => {
  // Use custom hooks for API data
  const {
    data: dashboardData,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } = useRevenueData();
  const { data: topServices, loading: servicesLoading } = useTopServices(4);
  const { data: upcomingAppointments, loading: appointmentsLoading } =
    useUpcomingAppointments(5);
  const { data: birthdays, loading: birthdaysLoading } = useBirthdays();

  // Fallback to mock data if API fails
  const [fallbackData, setFallbackData] = useState<any>(null);

  useEffect(() => {
    if (statsError) {
      // Load fallback data
      import("@/lib/mockData").then((mockData) => {
        setFallbackData(mockData);
      });
    }
  }, [statsError]);

  const isLoading =
    statsLoading ||
    revenueLoading ||
    servicesLoading ||
    appointmentsLoading ||
    birthdaysLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Carregando dados do dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Use fallback data if API failed
  const finalDashboardData = dashboardData || fallbackData?.dashboardData;
  const finalRevenueData = revenueData || fallbackData?.revenueData || [];
  const finalTopServices = topServices || fallbackData?.topServices || [];
  const finalUpcomingAppointments =
    upcomingAppointments || fallbackData?.upcomingAppointments || [];
  const finalBirthdays = birthdays || fallbackData?.birthdays || [];

  if (!finalDashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p
            className={cn("text-lg", darkMode ? "text-white" : "text-gray-900")}
          >
            Erro ao carregar dados do dashboard
          </p>
          {statsError && (
            <p
              className={cn(
                "text-sm mt-2",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Verifique se o servidor backend está rodando na porta 3001
            </p>
          )}
        </div>
      </div>
=======
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
    );
  }

  return (
    <div className="space-y-8">
<<<<<<< HEAD
      {/* Welcome Banner */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-8",
          "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800",
        )}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo ao seu Dashboard! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Aqui está um resumo do seu salão hoje, {formatDate(new Date())}
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Receita do Mês"
          value={formatCurrency(finalDashboardData.revenue?.current || 0)}
          icon={DollarSign}
          change={`${finalDashboardData.revenue?.growth >= 0 ? "+" : ""}${finalDashboardData.revenue?.growth || 0}%`}
          positive={finalDashboardData.revenue?.growth >= 0}
          bg="from-green-500 to-emerald-600"
          onClick={() => onPageChange("financial")}
          darkMode={darkMode}
        />

        <MetricCard
          title="Agendamentos"
          value={finalDashboardData.appointments?.total?.toString() || "0"}
          icon={Calendar}
          change={`${finalDashboardData.appointments?.variation >= 0 ? "+" : ""}${finalDashboardData.appointments?.variation || 0}%`}
          positive={finalDashboardData.appointments?.variation >= 0}
          bg="from-blue-500 to-cyan-600"
          onClick={() => onPageChange("appointments")}
          darkMode={darkMode}
        />

        <MetricCard
          title="Clientes Ativos"
          value={finalDashboardData.clients?.active?.toString() || "0"}
          icon={Users}
          change={`${finalDashboardData.clients?.new || 0} novos`}
          positive={true}
          bg="from-purple-500 to-pink-600"
          onClick={() => onPageChange("clients")}
          darkMode={darkMode}
        />

        <MetricCard
          title="Receita Acumulada"
          value={formatCurrency(finalDashboardData.revenue?.accumulated || 0)}
          icon={BarChart3}
          change="Este ano"
          positive={true}
          bg="from-orange-500 to-red-600"
          onClick={() => onPageChange("financial")}
          darkMode={darkMode}
        />

        <MetricCard
          title="Satisfação"
          value={`${finalDashboardData.satisfaction || 0}/5 ⭐`}
          icon={Star}
          change="Avaliação média"
          positive={true}
          bg="from-yellow-500 to-orange-600"
          darkMode={darkMode}
        />

        <MetricCard
          title="Serviços Concluídos"
          value={finalDashboardData.services?.completed?.toString() || "0"}
          icon={Check}
          change={`${finalDashboardData.services?.completion || 0}% conclusão`}
          positive={true}
          bg="from-teal-500 to-green-600"
          onClick={() => onPageChange("services")}
          darkMode={darkMode}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div
          className={cn(
            "rounded-2xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            📈 Receita dos Últimos Meses
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalRevenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => [formatCurrency(value), "Receita"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div
          className={cn(
            "rounded-2xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            📅 Próximos Agendamentos
          </h3>
          <div className="space-y-3">
            {finalUpcomingAppointments.length > 0 ? (
              finalUpcomingAppointments.map(
                (appointment: any, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      darkMode ? "bg-gray-700" : "bg-gray-50",
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {appointment.client}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          darkMode ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {appointment.service}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {appointment.time}
                      </p>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getStatusColor(appointment.status),
                        )}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p
                className={cn(
                  "text-center py-8",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Nenhum agendamento próximo
              </p>
            )}
          </div>
        </div>

        {/* Birthdays */}
        <div
          className={cn(
            "rounded-2xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            🎂 Aniversariantes do Mês
          </h3>
          <div className="space-y-3">
            {finalBirthdays.length > 0 ? (
              finalBirthdays.map((birthday: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    darkMode ? "bg-gray-700" : "bg-gray-50",
                  )}
                >
                  <p
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {birthday.name}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {birthday.date}
                  </p>
                </div>
              ))
            ) : (
              <p
                className={cn(
                  "text-center py-8",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Nenhum aniversário este mês
              </p>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div
          className={cn(
            "rounded-2xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            💡 Insights Rápidos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Horário de pico
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {finalDashboardData.insights?.peakHour || "14:00"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Cancelamentos
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {finalDashboardData.insights?.cancellations || 0} hoje
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Receita está
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-green-400" : "text-green-600",
                )}
              >
                {finalDashboardData.insights?.revenueStatus || "acima"} da média
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div
        className={cn(
          "rounded-2xl p-6 border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          🏆 Serviços Mais Populares
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {finalTopServices.map((service: any, index: number) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "font-medium text-sm",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {service.name}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-green-400" : "text-green-600",
                  )}
                >
                  {formatCurrency(service.revenue || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                >
                  {service.count || 0} agendamentos
                </span>
                <span
                  className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                >
                  Média:{" "}
                  {service.count > 0
                    ? formatCurrency((service.revenue || 0) / service.count)
                    : "R$ 0,00"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions darkMode={darkMode} onPageChange={onPageChange} />
=======
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              clientes cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              agendamentos para hoje
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              faturamento do mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              serviços disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Appointments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendamentos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Nenhum agendamento para hoje</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className={cn(
                          "font-medium text-sm",
                          darkMode ? "text-white" : "text-gray-900"
                        )}>
                          {appointment.clients?.name || 'Cliente não encontrado'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatAppointmentTime(appointment.appointment_time)}
                          </span>
                          <span>•</span>
                          <span>{appointment.services?.name || 'Serviço não encontrado'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status || 'agendado')}>
                        {appointment.status || 'agendado'}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(Number(appointment.price))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-6">
                <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Nenhuma transação recente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className={cn(
                        "font-medium text-sm",
                        darkMode ? "text-white" : "text-gray-900"
                      )}>
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(transaction.transaction_date))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-medium",
                        transaction.type === 'receita' 
                          ? "text-green-600" 
                          : "text-red-600"
                      )}>
                        {transaction.type === 'receita' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
    </div>
  );
};

export default Dashboard;
