import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw,
  CreditCard,
  UserX,
  MessageSquare,
  MousePointer,
  Star,
  Briefcase,
  AlertTriangle,
  Target,
  Activity,
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
  Cell,
  Pie,
} from "recharts";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface SimpleDashboardProps {
  darkMode: boolean;
}

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  target?: number;
  period: string;
  icon: React.ElementType;
  variant: "revenue" | "profit" | "bookings" | "clients";
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  variant: "default" | "success" | "warning" | "danger" | "info";
  description?: string;
  format?: "currency" | "percentage" | "number";
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant,
}) => {
  const variantStyles = {
    revenue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "bg-blue-600",
    },
    profit: {
      bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
      accent: "bg-green-600",
    },
    bookings: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      border: "border-purple-200 dark:border-purple-700",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "bg-purple-600",
    },
    clients: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      border: "border-orange-200 dark:border-orange-700",
      icon: "text-orange-600 dark:text-orange-400",
      accent: "bg-orange-600",
    },
  };

  const style = variantStyles[variant];
  const progressPercent = target
    ? Math.min(
        (parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) / target) *
          100,
        100,
      )
    : change;

  return (
    <Card
      className={cn(
        "p-6 border-2 hover:shadow-lg transition-all duration-300 group relative overflow-hidden",
        style.bg,
        style.border,
      )}
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10",
          style.accent,
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Icon className={cn("w-6 h-6", style.icon)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {period}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          <div className="flex items-center space-x-2">
            <Badge
              variant={change >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {change >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>

        {target && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Meta mensal
              </span>
              <span className="font-medium">{formatCurrency(target)}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  style.accent,
                )}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant,
  description,
  format = "number",
}) => {
  const variantStyles = {
    default: {
      bg: "bg-white dark:bg-gray-800",
      border: "border-gray-200 dark:border-gray-700",
      icon: "text-gray-600 dark:text-gray-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/10",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/10",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: "text-yellow-600 dark:text-yellow-400",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-900/10",
      border: "border-red-200 dark:border-red-700",
      icon: "text-red-600 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
    },
  };

  const style = variantStyles[variant];

  const formatValue = (val: string | number) => {
    if (format === "currency") return formatCurrency(Number(val));
    if (format === "percentage") return `${val}%`;
    return val.toString();
  };

  return (
    <Card
      className={cn(
        "p-4 border hover:shadow-md transition-all duration-200",
        style.bg,
        style.border,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
            <Icon className={cn("w-5 h-5", style.icon)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            {description && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <Badge
            variant={change >= 0 ? "default" : "destructive"}
            className="text-xs"
          >
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>
    </Card>
  );
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  darkMode,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showNewKPIs, setShowNewKPIs] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Static data that always works
  const stats = {
    revenue: 45890.5,
    profit: 30640.5,
    bookings: 23,
    clients: 214,
    pendingReceivables: 8450.0,
    commissionPaid: 12250.0,
    cancellationRate: 4.2,
    inactiveClients: 45,
    newClientConversion: 73.5,
    averageRating: 4.7,
    messagesSent: 156,
    whatsappMessages: 89,
    emailMessages: 67,
    campaignClicks: 342,
    campaignConversions: 28,
    onlineUsers: 12,
  };

  const chartData = [
    { name: "Jan", receita: 32000, lucro: 19200, despesas: 12800 },
    { name: "Fev", receita: 38000, lucro: 22800, despesas: 15200 },
    { name: "Mar", receita: 41000, lucro: 24600, despesas: 16400 },
    { name: "Abr", receita: 45000, lucro: 27000, despesas: 18000 },
    { name: "Mai", receita: 51000, lucro: 30600, despesas: 20400 },
    { name: "Jun", receita: 45890, lucro: 30640, despesas: 15250 },
  ];

  const peakHoursData = [
    { hora: "09:00", agendamentos: 8 },
    { hora: "10:00", agendamentos: 12 },
    { hora: "14:00", agendamentos: 15 },
    { hora: "15:00", agendamentos: 18 },
    { hora: "16:00", agendamentos: 14 },
    { hora: "17:00", agendamentos: 10 },
  ];

  const paymentMethodsData = [
    { name: "PIX", value: 45, color: COLORS[0] },
    { name: "Cartão Crédito", value: 30, color: COLORS[1] },
    { name: "Cartão Débito", value: 15, color: COLORS[2] },
    { name: "Dinheiro", value: 10, color: COLORS[3] },
  ];

  const professionalOccupancy = [
    { name: "Isabella Martins", occupancy_rate: 85 },
    { name: "Sofia Rodrigues", occupancy_rate: 72 },
    { name: "Valentina Costa", occupancy_rate: 68 },
    { name: "Helena Santos", occupancy_rate: 80 },
    { name: "Aurora Lima", occupancy_rate: 63 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Visão Geral
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Dashboard executivo • Atualizado às{" "}
            {lastUpdate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdate(new Date())}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <section>
        <h2 className="sr-only">Indicadores Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Receita Mensal"
            value={formatCurrency(stats.revenue)}
            change={15}
            target={60000}
            period="Meta: R$ 60.000"
            icon={DollarSign}
            variant="revenue"
          />
          <KPICard
            title="Lucro Estimado"
            value={formatCurrency(stats.profit)}
            change={12}
            target={35000}
            period="Meta: R$ 35.000"
            icon={TrendingUp}
            variant="profit"
          />
          <KPICard
            title="Agendamentos"
            value={stats.bookings.toString()}
            change={7}
            period="Hoje"
            icon={Calendar}
            variant="bookings"
          />
          <KPICard
            title="Clientes Ativos"
            value={stats.clients.toString()}
            change={3}
            period="Total"
            icon={Users}
            variant="clients"
          />
        </div>
      </section>

      {/* New KPIs Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Novos Indicadores
          </h2>
          <Button
            variant="ghost"
            onClick={() => setShowNewKPIs(!showNewKPIs)}
            className="text-sm font-medium"
          >
            <ChevronDown
              className={cn("w-4 h-4 ml-2 transition-transform", {
                "rotate-180": showNewKPIs,
              })}
            />
          </Button>
        </div>

        {showNewKPIs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Recebimentos Pendentes"
              value={stats.pendingReceivables}
              icon={CreditCard}
              variant="warning"
              format="currency"
              description="Agendamentos não pagos"
            />
            <MetricCard
              title="Comissão Paga"
              value={stats.commissionPaid}
              change={-5}
              icon={Briefcase}
              variant="info"
              format="currency"
              description="Este mês"
            />
            <MetricCard
              title="Taxa de Cancelamento"
              value={stats.cancellationRate}
              change={-2.1}
              icon={AlertTriangle}
              variant="danger"
              format="percentage"
              description="Últimos 30 dias"
            />
            <MetricCard
              title="Clientes Inativos"
              value={stats.inactiveClients}
              icon={UserX}
              variant="warning"
              description="Sem agendamentos há 90 dias"
            />
            <MetricCard
              title="Conversão Novos Clientes"
              value={stats.newClientConversion}
              change={5.2}
              icon={Target}
              variant="success"
              format="percentage"
              description="Taxa de retorno"
            />
            <MetricCard
              title="Avaliação Média"
              value={stats.averageRating}
              change={0.3}
              icon={Star}
              variant="success"
              description="Satisfação dos clientes"
            />
            <MetricCard
              title="Mensagens Enviadas"
              value={stats.messagesSent}
              change={18}
              icon={MessageSquare}
              variant="info"
              description="Últimos 30 dias"
            />
            <MetricCard
              title="Usuários Online"
              value={stats.onlineUsers}
              icon={Activity}
              variant="success"
              description="Ativos agora"
            />
          </div>
        )}
      </section>

      {/* Communication & Marketing */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Marketing & Comunicação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="WhatsApp Enviadas"
            value={stats.whatsappMessages}
            change={25}
            icon={MessageSquare}
            variant="success"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="E-mails Enviados"
            value={stats.emailMessages}
            change={12}
            icon={MessageSquare}
            variant="info"
            description="Últimos 30 dias"
          />
          <MetricCard
            title="Cliques em Campanhas"
            value={stats.campaignClicks}
            change={8.5}
            icon={MousePointer}
            variant="default"
            description="Engajamento"
          />
          <MetricCard
            title="Conversões de Campanha"
            value={stats.campaignConversions}
            change={15.2}
            icon={Target}
            variant="success"
            description="Meta atingida"
          />
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <section className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Financeira
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receita vs Lucro - Últimos 6 meses
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    6 meses <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Últimos 6 meses</DropdownMenuItem>
                  <DropdownMenuItem>Últimos 12 meses</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "receita" ? "Receita" : "Lucro",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Peak Hours Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Horários de Pico
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hora"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="agendamentos"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Payment Methods & Professional Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Formas de Pagamento
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Porcentagem"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ocupação por Profissional
          </h3>
          <div className="space-y-4">
            {professionalOccupancy.map((prof, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {prof.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {prof.occupancy_rate}%
                  </span>
                </div>
                <Progress value={prof.occupancy_rate} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimpleDashboard;
