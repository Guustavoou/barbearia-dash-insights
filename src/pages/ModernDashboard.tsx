import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star,
  Activity,
  CreditCard,
  Banknote,
  QrCode,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Upload,
  Maximize2,
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
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import {
  useDashboardStats,
  useRevenueData,
  useTopServices,
  useUpcomingAppointments,
  useBirthdays,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ModernDashboardProps {
  darkMode: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  color: string;
  trend?: number[];
  period?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  trend = [],
  period,
}) => (
  <Card className="p-6 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
            `bg-${color}-100 dark:bg-${color}-900/30`,
          )}
        >
          <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          {period && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{period}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <div className="flex items-center mt-1">
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full flex items-center",
              changeType === "positive"
                ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
            )}
          >
            {changeType === "positive" ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">
            vs mês anterior
          </span>
        </div>
      </div>
      {trend.length > 0 && (
        <div className="h-10 w-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.map((value, index) => ({ value, index }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={`#${color === "blue" ? "3B82F6" : color === "green" ? "10B981" : "8B5CF6"}`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </Card>
);

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  darkMode,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // API data hooks with automatic fallback
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } =
    useRevenueData(selectedPeriod);
  const { data: topServices, loading: servicesLoading } = useTopServices(5);

  const isLoading = statsLoading || revenueLoading || servicesLoading;

  // Mock data for demonstration
  const currentStats = {
    total_clients: 214,
    today_appointments: 28,
    month_revenue: 5220,
    net_income: 3132,
    pending_payments: 1850,
    commissions_paid: 1566,
    appointments_count: 194,
    cancellation_rate: 4.2,
    average_rating: 4.8,
    online_users: 24,
  };

  const revenueChartData = [
    { name: "Jan", revenue: 3200, profit: 1920 },
    { name: "Fev", revenue: 3800, profit: 2280 },
    { name: "Mar", revenue: 4100, profit: 2460 },
    { name: "Abr", revenue: 4500, profit: 2700 },
    { name: "Mai", revenue: 5100, profit: 3060 },
    { name: "Jun", revenue: 5220, profit: 3132 },
  ];

  const topServicesData = [
    { name: "Corte Masculino", count: 62, percentage: 100 },
    { name: "Barba", count: 48, percentage: 77 },
    { name: "Corte Feminino", count: 36, percentage: 58 },
    { name: "Coloração", count: 29, percentage: 47 },
    { name: "Escova", count: 22, percentage: 35 },
  ];

  const professionalData = [
    {
      name: "Lucas Silva",
      specialty: "Barbeiro",
      revenue: 2100,
      percentage: 100,
    },
    {
      name: "Mariana Costa",
      specialty: "Cabeleireira",
      revenue: 1850,
      percentage: 88,
    },
    {
      name: "Gabriel Oliveira",
      specialty: "Barbeiro",
      revenue: 1640,
      percentage: 78,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Última atualização: {new Date().toLocaleString("pt-BR")}
          </span>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita"
          value={formatCurrency(currentStats.month_revenue)}
          change="15%"
          changeType="positive"
          icon={DollarSign}
          color="blue"
          period="este mês"
          trend={[3200, 3800, 4100, 4500, 5100, 5220]}
        />
        <StatCard
          title="Lucro Estimado"
          value={formatCurrency(currentStats.net_income)}
          change="12%"
          changeType="positive"
          icon={TrendingUp}
          color="green"
          trend={[1920, 2280, 2460, 2700, 3060, 3132]}
        />
        <StatCard
          title="Recebimentos Pendentes"
          value={formatCurrency(currentStats.pending_payments)}
          change="8 pendentes"
          changeType="negative"
          icon={Clock}
          color="orange"
          period="para hoje"
        />
        <StatCard
          title="Comissões Pagas"
          value={formatCurrency(currentStats.commissions_paid)}
          change="30%"
          changeType="positive"
          icon={CreditCard}
          color="purple"
          period="da receita"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Agendamentos"
          value={currentStats.appointments_count.toString()}
          change="7%"
          changeType="positive"
          icon={Calendar}
          color="blue"
          period="vs semana anterior"
        />
        <StatCard
          title="Taxa de Cancelamento"
          value={`${currentStats.cancellation_rate}%`}
          change="0.8%"
          changeType="positive"
          icon={Calendar}
          color="red"
          period="vs mês anterior"
        />
        <StatCard
          title="Avaliação Média"
          value={currentStats.average_rating.toString()}
          change="0.2"
          changeType="positive"
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Usuários Online"
          value={currentStats.online_users.toString()}
          change="4"
          changeType="positive"
          icon={UserVoice}
          color="green"
          period="ativos agora"
        />
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            Receita e Lucro
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-xs">
              Últimos 30 dias
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Últimos 6 meses
            </Button>
            <Button
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Último ano
            </Button>
          </div>
        </div>
        <div className="h-80 group relative">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <Button variant="ghost" size="sm" title="Download CSV">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Visualizar em tela cheia">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Formas de Pagamento
            </h3>
            <Button variant="ghost" size="sm" className="text-sm text-blue-600">
              Ver detalhes
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  Cartão de Crédito
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                45%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  Dinheiro
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                30%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  PIX
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                25%
              </span>
            </div>
          </div>
        </Card>

        {/* Peak Hours */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Horários de Pico
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Hoje</div>
          </div>
          <div className="space-y-3">
            {[
              { time: "09:00", percentage: 85 },
              { time: "11:00", percentage: 95 },
              { time: "14:00", percentage: 75 },
              { time: "16:00", percentage: 90 },
              { time: "18:00", percentage: 70 },
            ].map((hour, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-xs text-gray-500 dark:text-gray-400">
                  {hour.time}
                </div>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${hour.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {hour.percentage}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Marketing Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Performance Marketing
            </h3>
            <Button variant="ghost" size="sm" className="text-sm text-blue-600">
              Ver campanhas
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { label: "Mensagens Enviadas", value: 1248, percentage: 85 },
              { label: "Taxa de Abertura", value: "68%", percentage: 68 },
              { label: "Cliques", value: 436, percentage: 45 },
              { label: "Conversões", value: 89, percentage: 25 },
            ].map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metric.value}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Serviços Mais Vendidos
            </h3>
            <Button variant="ghost" size="sm" className="text-sm text-blue-600">
              Ver todos
            </Button>
          </div>
          <div className="space-y-4">
            {topServicesData.map((service, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.count}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Professionals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Profissionais Destaque
            </h3>
            <Button variant="ghost" size="sm" className="text-sm text-blue-600">
              Ver todos
            </Button>
          </div>
          <div className="space-y-4">
            {professionalData.map((professional, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {professional.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {professional.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {professional.specialty}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(professional.revenue)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${professional.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
