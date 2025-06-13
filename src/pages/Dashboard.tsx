import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Users,
  Star,
  Check,
  BarChart3,
  TrendingUp,
  Clock,
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

interface DashboardProps {
  darkMode: boolean;
  onPageChange: (page: PageType) => void;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  positive: boolean;
  bg: string;
  onClick?: () => void;
  darkMode: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  positive,
  bg,
  onClick,
  darkMode,
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
      "bg-gradient-to-br shadow-lg hover:shadow-xl",
      bg,
      onClick && "cursor-pointer hover:scale-105",
    )}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-white/80 text-sm font-medium">{change}</div>
      </div>
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
    );
  }

  return (
    <div className="space-y-8">
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
    </div>
  );
};
