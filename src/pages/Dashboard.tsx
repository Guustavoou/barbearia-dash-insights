import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Scissors,
  Package,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/unclicUtils";
import {
  useDashboardStats,
  useRevenueData,
  useTopServices,
  useUpcomingAppointments,
  useBirthdays,
} from "@/hooks/useApi";

interface DashboardProps {
  darkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // API data hooks with automatic fallback
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } =
    useRevenueData(selectedPeriod);
  const { data: topServices, loading: servicesLoading } = useTopServices(5);
  const { data: upcomingAppointments, loading: appointmentsLoading } =
    useUpcomingAppointments(8);
  const { data: birthdays, loading: birthdaysLoading } = useBirthdays();

  const isLoading =
    statsLoading || revenueLoading || servicesLoading || appointmentsLoading;

  // Fallback data for when API is not available
  const defaultStats = {
    total_clients: 0,
    total_professionals: 0,
    today_appointments: 0,
    month_revenue: 0,
    month_expenses: 0,
    net_income: 0,
    profit_margin: 0,
  };

  const currentStats = stats?.data || defaultStats;

  // Dashboard cards configuration
  const dashboardCards = [
    {
      title: "Clientes Ativos",
      value: currentStats.total_clients?.toString() || "0",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Agendamentos Hoje",
      value: currentStats.today_appointments?.toString() || "0",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(currentStats.month_revenue || 0),
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Lucro Líquido",
      value: formatCurrency(currentStats.net_income || 0),
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    textColor: string;
    bgColor: string;
  }> = ({ title, value, icon: Icon, color, textColor, bgColor }) => (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 border transition-all duration-300 hover:shadow-lg group",
        darkMode
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
          : "bg-white border-gray-200 hover:bg-gray-50",
      )}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium mb-2",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {title}
          </p>
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-1">
              {isLoading ? "..." : value}
            </h3>
            <p className="text-white/90 text-sm font-medium">{title}</p>
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-lg transition-transform group-hover:scale-110",
            bgColor,
          )}
        >
          <Icon className={cn("h-6 w-6", textColor)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Dashboard
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            )}
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div
          className={cn(
            "rounded-xl p-6 border",
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
            Receita ao Longo do Tempo
          </h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Carregando dados...
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData?.data || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="period"
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: darkMode ? "#FFFFFF" : "#000000",
                    }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Receita",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Services */}
        <div
          className={cn(
            "rounded-xl p-6 border",
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
            Serviços Mais Populares
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div
                    className={cn(
                      "h-4 bg-gray-300 rounded w-32 animate-pulse",
                      darkMode ? "bg-gray-600" : "bg-gray-300",
                    )}
                  />
                  <div
                    className={cn(
                      "h-4 bg-gray-300 rounded w-16 animate-pulse",
                      darkMode ? "bg-gray-600" : "bg-gray-300",
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(topServices?.data || [])
                .slice(0, 5)
                .map((service: any, index: number) => (
                  <div
                    key={service.id || index}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {service.name}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {service.recent_bookings || service.popularity || 0}{" "}
                      agendamentos
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Appointments and Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div
          className={cn(
            "rounded-xl p-6 border",
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
            Próximos Agendamentos
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div
                    className={cn(
                      "h-4 bg-gray-300 rounded w-48 animate-pulse",
                      darkMode ? "bg-gray-600" : "bg-gray-300",
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(upcomingAppointments?.data || [])
                .slice(0, 6)
                .map((appointment: any, index: number) => (
                  <div
                    key={appointment.id || index}
                    className={cn(
                      "p-3 rounded-lg border",
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            darkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {appointment.client_name}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {appointment.service_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            darkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {formatDate(appointment.date)}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Birthdays */}
        <div
          className={cn(
            "rounded-xl p-6 border",
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
            Aniversários Este Mês
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div
                    className={cn(
                      "h-4 bg-gray-300 rounded w-32 animate-pulse",
                      darkMode ? "bg-gray-600" : "bg-gray-300",
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(birthdays?.data || [])
                .slice(0, 5)
                .map((birthday: any, index: number) => (
                  <div
                    key={birthday.id || index}
                    className={cn(
                      "p-3 rounded-lg border flex items-center justify-between",
                      birthday.is_today
                        ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-600"
                        : darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <p
                      className={cn(
                        "font-medium",
                        birthday.is_today
                          ? "text-yellow-800 dark:text-yellow-200"
                          : darkMode
                            ? "text-white"
                            : "text-gray-900",
                      )}
                    >
                      {birthday.name}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        birthday.is_today
                          ? "text-yellow-600 dark:text-yellow-300"
                          : darkMode
                            ? "text-gray-400"
                            : "text-gray-600",
                      )}
                    >
                      {birthday.is_today
                        ? "Hoje!"
                        : `Dia ${birthday.birthday_day}`}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
