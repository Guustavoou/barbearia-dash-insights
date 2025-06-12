import React from "react";
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
import {
  dashboardData,
  revenueData,
  upcomingAppointments,
  birthdays,
  topServices,
} from "@/lib/mockData";
import { PageType } from "@/lib/types";

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
  const metrics = [
    {
      title: "Receita do Mês",
      value: formatCurrency(dashboardData.revenue.current),
      icon: DollarSign,
      change: `+${dashboardData.revenue.growth}%`,
      positive: true,
      bg: "from-green-500 to-emerald-600",
    },
    {
      title: "Agendamentos",
      value: dashboardData.appointments.total.toString(),
      icon: Calendar,
      change: `+${dashboardData.appointments.variation}`,
      positive: true,
      onClick: () => onPageChange("appointments"),
      bg: "from-blue-500 to-cyan-600",
    },
    {
      title: "Clientes Ativos",
      value: dashboardData.clients.active.toString(),
      icon: Users,
      change: `+${dashboardData.clients.new} novos`,
      positive: true,
      onClick: () => onPageChange("clients"),
      bg: "from-purple-500 to-violet-600",
    },
    {
      title: "Satisfação",
      value: dashboardData.satisfaction.toString(),
      icon: Star,
      change: "⭐⭐⭐⭐⭐",
      positive: true,
      bg: "from-yellow-500 to-orange-600",
    },
    {
      title: "Taxa Conclusão",
      value: `${dashboardData.services.completion}%`,
      icon: Check,
      change: `${dashboardData.services.completed} serviços`,
      positive: true,
      bg: "from-teal-500 to-green-600",
    },
    {
      title: "Retenção",
      value: `${dashboardData.clients.retention}%`,
      icon: BarChart3,
      change: "Excelente",
      positive: true,
      bg: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className={cn(
          "rounded-2xl p-6 border",
          darkMode
            ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-gray-700"
            : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={cn(
                "text-xl font-bold mb-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              🌟 Olá, Maria! Bem-vinda ao Studio Bella
            </h1>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Você tem <strong>3 agendamentos</strong> hoje e o negócio está
              crescendo <strong>+15.8%</strong> este mês!
            </p>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              darkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700",
              "transition-colors cursor-pointer",
            )}
          >
            Vamos começar! 🚀
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
            positive={metric.positive}
            bg={metric.bg}
            onClick={metric.onClick}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div
          className={cn(
            "lg:col-span-2 rounded-2xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={cn(
                  "text-lg font-semibold mb-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                📈 Receita dos Últimos 6 Meses
              </h3>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total acumulado:{" "}
                {formatCurrency(dashboardData.revenue.accumulated)}
              </p>
            </div>
            <div
              className={cn(
                "text-right px-3 py-1 rounded-lg text-xs",
                darkMode ? "bg-gray-700" : "bg-gray-100",
              )}
            >
              <span
                className={cn(
                  "text-xs",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Melhor mês
              </span>
              <div
                className={cn(
                  "font-semibold",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(dashboardData.revenue.best)}
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="month"
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
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
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
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {appointment.client}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(appointment.status),
                      )}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {appointment.service} • {appointment.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onPageChange("appointments")}
            className="w-full mt-4 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm font-medium transition-all"
          >
            Ver todos os agendamentos
          </button>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            🎉 Aniversariantes
          </h3>
          <div className="space-y-3">
            {birthdays.map((birthday, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {birthday.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <span
                    className={cn(
                      "font-medium text-sm",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {birthday.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-blue-400" : "text-blue-600",
                  )}
                >
                  {birthday.date}
                </span>
              </div>
            ))}
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
            💡 Insights do Dia
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
                {dashboardData.insights.peakHour}
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
                {dashboardData.insights.cancellations} hoje
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
                {dashboardData.insights.revenueStatus} da média
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
          {topServices.map((service, index) => (
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
                  {formatCurrency(service.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                >
                  {service.count} agendamentos
                </span>
                <span
                  className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                >
                  Média: {formatCurrency(service.revenue / service.count)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
