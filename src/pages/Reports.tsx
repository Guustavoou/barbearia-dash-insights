import React, { useState, useMemo } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Filter,
  Eye,
  BarChart3,
  PieChart,
  FileText,
  Printer,
  Share,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import {
  useBusinessReports,
  useSalesPerformance,
  useProfessionalReports,
  useClientAnalysis,
  useAppointmentTrends,
  useFinancialAnalysis,
  useInventoryReport,
} from "@/hooks/useApi";

interface ReportsProps {
  darkMode: boolean;
}

// Mock data para relatórios
const salesByServiceData = [
  { name: "Corte Feminino", value: 145, revenue: 8700 },
  { name: "Manicure", value: 189, revenue: 4725 },
  { name: "Barba", value: 203, revenue: 5075 },
  { name: "Coloração", value: 112, revenue: 8960 },
  { name: "Hidratação", value: 134, revenue: 6700 },
  { name: "Pedicure", value: 156, revenue: 4680 },
];

const salesByProfessionalData = [
  { name: "Maria Silva", services: 298, revenue: 18650 },
  { name: "João Santos", services: 245, revenue: 12250 },
  { name: "Ana Costa", services: 267, revenue: 9345 },
  { name: "Carla Souza", services: 189, revenue: 8820 },
];

const hourlyDistributionData = [
  { hour: "8h", appointments: 12 },
  { hour: "9h", appointments: 18 },
  { hour: "10h", appointments: 25 },
  { hour: "11h", appointments: 22 },
  { hour: "12h", appointments: 15 },
  { hour: "13h", appointments: 10 },
  { hour: "14h", appointments: 28 },
  { hour: "15h", appointments: 32 },
  { hour: "16h", appointments: 30 },
  { hour: "17h", appointments: 25 },
  { hour: "18h", appointments: 18 },
];

const clientRetentionData = [
  { name: "Novos Clientes", value: 25, color: "#3B82F6" },
  { name: "Clientes Recorrentes", value: 65, color: "#10B981" },
  { name: "Clientes Inativos", value: 10, color: "#EF4444" },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export const Reports: React.FC<ReportsProps> = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // API data hooks
  const { data: businessData, loading: businessLoading } =
    useBusinessReports(selectedPeriod);
  const { data: salesData, loading: salesLoading } = useSalesPerformance(
    selectedPeriod,
    10,
  );
  const { data: professionalData, loading: professionalLoading } =
    useProfessionalReports(selectedPeriod);
  const { data: clientData, loading: clientLoading } =
    useClientAnalysis(selectedPeriod);
  const { data: appointmentData, loading: appointmentLoading } =
    useAppointmentTrends(selectedPeriod);
  const { data: financialData, loading: financialLoading } =
    useFinancialAnalysis(selectedPeriod);
  const { data: inventoryData, loading: inventoryLoading } =
    useInventoryReport();

  const isLoading =
    businessLoading || salesLoading || professionalLoading || clientLoading;

  const reportSections = [
    { id: "overview", name: "Visão Geral", icon: BarChart3 },
    { id: "sales", name: "Vendas", icon: TrendingUp },
    { id: "clients", name: "Clientes", icon: Users },
    { id: "professionals", name: "Profissionais", icon: Award },
    { id: "financial", name: "Financeiro", icon: DollarSign },
  ];

  const ReportCard: React.FC<{
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    positive?: boolean;
    loading?: boolean;
  }> = ({
    title,
    value,
    change,
    icon: Icon,
    positive = true,
    loading = false,
  }) => (
    <div
      className={cn(
        "rounded-xl p-6 border",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-2xl font-bold mt-1",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {loading ? "..." : value}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp
              className={cn(
                "h-3 w-3",
                positive ? "text-green-600" : "text-red-600",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                positive ? "text-green-600" : "text-red-600",
              )}
            >
              {loading ? "..." : change}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            positive
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30",
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              positive ? "text-green-600" : "text-red-600",
            )}
          />
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
            Relatórios
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Análise completa da performance do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            )}
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50",
            )}
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div
        className={cn(
          "rounded-xl border p-6",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {reportSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedReport(section.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                selectedReport === section.id
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <section.icon className="h-4 w-4" />
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {selectedReport === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard
              title="Receita Total"
              value={formatCurrency(
                businessData?.overview?.current_revenue || 0,
              )}
              change={`${businessData?.overview?.revenue_growth >= 0 ? "+" : ""}${businessData?.overview?.revenue_growth || 0}%`}
              icon={DollarSign}
              positive={businessData?.overview?.revenue_growth >= 0}
              loading={businessLoading}
            />
            <ReportCard
              title="Agendamentos"
              value={
                businessData?.overview?.current_appointments?.toString() || "0"
              }
              change={`${businessData?.overview?.appointment_growth >= 0 ? "+" : ""}${businessData?.overview?.appointment_growth || 0}%`}
              icon={Calendar}
              positive={businessData?.overview?.appointment_growth >= 0}
              loading={businessLoading}
            />
            <ReportCard
              title="Clientes Únicos"
              value={
                businessData?.overview?.current_unique_clients?.toString() ||
                "0"
              }
              change={`${clientData?.overview?.total_clients || 0} total`}
              icon={Users}
              positive={true}
              loading={businessLoading || clientLoading}
            />
            <ReportCard
              title="Margem Lucro"
              value={`${financialData?.revenue_breakdown?.[0]?.percentage || 0}%`}
              change="Este período"
              icon={TrendingUp}
              positive={true}
              loading={financialLoading}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Services Performance */}
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
                Performance por Serviço
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData || salesByServiceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#E5E7EB"}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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
                      formatter={(value: number, name: string) => [
                        name === "value" ? `${value} agendamentos` : value,
                        name === "value" ? "Quantidade" : "Receita",
                      ]}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Distribution */}
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
                Distribuição por Horário
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      appointmentData?.hourly_distribution ||
                      hourlyDistributionData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#E5E7EB"}
                    />
                    <XAxis
                      dataKey="hour"
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
                        `${value} agendamentos`,
                        "Quantidade",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance by Professional */}
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
              Performance por Profissional
            </h3>
            <div className="space-y-4">
              {(professionalData || salesByProfessionalData).map(
                (professional, index) => (
                  <div
                    key={professional.name}
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
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {professional.name}
                      </span>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-semibold",
                            darkMode ? "text-green-400" : "text-green-600",
                          )}
                        >
                          {formatCurrency(
                            professional.total_revenue || professional.revenue,
                          )}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            darkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {professional.total_appointments ||
                            professional.services}{" "}
                          serviços
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((professional.total_appointments || professional.services) / 300) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}

      {/* Sales Section */}
      {selectedReport === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              Vendas por Serviço
            </h3>
            <div className="space-y-4">
              {(salesData || salesByServiceData).map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {service.service_name || service.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "font-semibold",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {service.total_appointments || service.value}
                    </div>
                    <div
                      className={cn(
                        "text-sm",
                        darkMode ? "text-green-400" : "text-green-600",
                      )}
                    >
                      {formatCurrency(service.total_revenue || service.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              Retenção de Clientes
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: darkMode ? "#FFFFFF" : "#000000",
                    }}
                    formatter={(value: number) => [`${value}%`, "Percentual"]}
                  />
                  <pie
                    dataKey="value"
                    data={clientRetentionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {clientRetentionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other report sections */}
      {!["overview", "sales"].includes(selectedReport) && (
        <div
          className={cn(
            "rounded-xl p-12 border text-center",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="max-w-md mx-auto">
            <BarChart3
              className={cn(
                "h-12 w-12 mx-auto mb-4",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            />
            <h3
              className={cn(
                "text-lg font-semibold mb-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Relatório em Desenvolvimento
            </h3>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Esta seção de relatório está sendo desenvolvida e estará
              disponível em breve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
