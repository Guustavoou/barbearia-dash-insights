
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
import { PageType } from "@/lib/types";
import { QuickActions } from "@/components/QuickActions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useAppointments } from "@/hooks/useAppointments";

interface DashboardProps {
  darkMode: boolean;
  onPageChange: (page: PageType) => void;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  positive: boolean;
  bg: string;
  onClick?: () => void;
  darkMode: boolean;
  loading?: boolean;
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
  loading = false,
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
    {loading ? (
      <div className="animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-4"></div>
        <div className="h-8 bg-white/20 rounded mb-2"></div>
        <div className="h-3 bg-white/20 rounded"></div>
      </div>
    ) : (
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
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { clients, loading: clientsLoading } = useClients();
  const { services, loading: servicesLoading } = useServices();
  const { appointments, loading: appointmentsLoading } = useAppointments();

  // Calculate today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(apt => 
    apt.appointment_date === today
  );

  // Calculate client growth (new clients this month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const newClientsThisMonth = clients.filter(client => 
    client.created_at && client.created_at.startsWith(currentMonth)
  ).length;

  // Get upcoming appointments (next 5)
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDateTime = new Date(`${apt.appointment_date} ${apt.appointment_time}`);
      return aptDateTime > new Date();
    })
    .slice(0, 5);

  const metrics = [
    {
      title: "Receita do Mês",
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      change: "Este mês",
      positive: true,
      bg: "from-green-500 to-emerald-600",
      loading: statsLoading,
    },
    {
      title: "Agendamentos Hoje",
      value: stats.todayAppointments,
      icon: Calendar,
      change: `${todaysAppointments.length} hoje`,
      positive: true,
      onClick: () => onPageChange("appointments"),
      bg: "from-blue-500 to-cyan-600",
      loading: statsLoading,
    },
    {
      title: "Total de Clientes",
      value: stats.totalClients,
      icon: Users,
      change: `+${newClientsThisMonth} novos`,
      positive: true,
      onClick: () => onPageChange("clients"),
      bg: "from-purple-500 to-violet-600",
      loading: statsLoading,
    },
    {
      title: "Serviços Ativos",
      value: stats.totalServices,
      icon: Star,
      change: "Disponíveis",
      positive: true,
      onClick: () => onPageChange("services"),
      bg: "from-yellow-500 to-orange-600",
      loading: statsLoading,
    },
    {
      title: "Agendamentos Total",
      value: appointments.length,
      icon: Check,
      change: "Total geral",
      positive: true,
      bg: "from-teal-500 to-green-600",
      loading: appointmentsLoading,
    },
    {
      title: "Clientes Ativos",
      value: clients.filter(c => c.status === 'ativo').length,
      icon: BarChart3,
      change: "Ativos",
      positive: true,
      bg: "from-pink-500 to-rose-600",
      loading: clientsLoading,
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
              🌟 Bem-vindo ao seu sistema de gestão!
            </h1>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Você tem <strong>{stats.todayAppointments} agendamentos</strong> hoje e <strong>{stats.totalClients} clientes</strong> cadastrados!
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
            Vamos trabalhar! 🚀
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
            loading={metric.loading}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
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
                📈 Resumo dos Dados
              </h3>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Visão geral do seu negócio
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "p-4 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <h4
                className={cn(
                  "font-medium mb-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                Clientes
              </h4>
              <p
                className={cn(
                  "text-2xl font-bold mb-1",
                  darkMode ? "text-blue-400" : "text-blue-600",
                )}
              >
                {clientsLoading ? "..." : stats.totalClients}
              </p>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total cadastrados
              </p>
            </div>

            <div
              className={cn(
                "p-4 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <h4
                className={cn(
                  "font-medium mb-2",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                Serviços
              </h4>
              <p
                className={cn(
                  "text-2xl font-bold mb-1",
                  darkMode ? "text-green-400" : "text-green-600",
                )}
              >
                {servicesLoading ? "..." : stats.totalServices}
              </p>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Disponíveis
              </p>
            </div>
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
          
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className={cn("h-4 rounded mb-2", darkMode ? "bg-gray-700" : "bg-gray-200")}></div>
                  <div className={cn("h-3 rounded", darkMode ? "bg-gray-700" : "bg-gray-200")}></div>
                </div>
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
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
                        {appointment.clients?.name || 'Cliente'}
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
                      {appointment.services?.name || 'Serviço'} • {appointment.appointment_time} • {formatDate(new Date(appointment.appointment_date))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={cn(
                "text-sm text-center py-8",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Nenhum agendamento próximo
            </p>
          )}
          
          <button
            onClick={() => onPageChange("appointments")}
            className="w-full mt-4 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm font-medium transition-all"
          >
            Ver todos os agendamentos
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions darkMode={darkMode} onPageChange={onPageChange} />
    </div>
  );
};
