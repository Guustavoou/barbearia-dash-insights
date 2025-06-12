
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Filter,
  BarChart3,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface ReportsProps {
  darkMode: boolean;
}

export const Reports: React.FC<ReportsProps> = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("revenue");

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 4500, appointments: 85 },
    { month: "Fev", revenue: 5200, appointments: 92 },
    { month: "Mar", revenue: 4800, appointments: 88 },
    { month: "Abr", revenue: 6100, appointments: 105 },
    { month: "Mai", revenue: 5800, appointments: 98 },
    { month: "Jun", revenue: 6500, appointments: 115 },
  ];

  const serviceData = [
    { name: "Corte Masculino", value: 45, color: "#3B82F6" },
    { name: "Barba", value: 25, color: "#10B981" },
    { name: "Corte + Barba", value: 20, color: "#F59E0B" },
    { name: "Outros", value: 10, color: "#EF4444" },
  ];

  const professionalData = [
    { name: "João Silva", services: 45, revenue: 2250 },
    { name: "Pedro Santos", services: 38, revenue: 1900 },
    { name: "Carlos Lima", services: 32, revenue: 1600 },
    { name: "Rafael Costa", services: 28, revenue: 1400 },
  ];

  const clientData = [
    { month: "Jan", new: 12, returning: 73 },
    { month: "Fev", new: 15, returning: 77 },
    { month: "Mar", new: 10, returning: 78 },
    { month: "Abr", new: 18, returning: 87 },
    { month: "Mai", new: 14, returning: 84 },
    { month: "Jun", new: 22, returning: 93 },
  ];

  const kpiCards = [
    {
      title: "Receita Total",
      value: "R$ 32.850",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Agendamentos",
      value: "583",
      change: "+8%",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Novos Clientes",
      value: "91",
      change: "+15%",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Taxa de Ocupação",
      value: "85%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  const reportTypes = [
    { value: "revenue", label: "Receita", icon: DollarSign },
    { value: "services", label: "Serviços", icon: BarChart3 },
    { value: "professionals", label: "Profissionais", icon: Users },
    { value: "clients", label: "Clientes", icon: Users },
  ];

  const periods = [
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "quarter", label: "Trimestre" },
    { value: "year", label: "Ano" },
  ];

  const renderChart = () => {
    switch (selectedReport) {
      case "revenue":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "services":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "professionals":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionalData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "clients":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="returning" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            Relatórios
          </h1>
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            Análise detalhada do desempenho da sua barbearia
          </p>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-xl border",
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {kpi.title}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold mt-1",
                    darkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {kpi.value}
                </p>
                <p className={cn("text-sm mt-1", kpi.color)}>
                  {kpi.change} vs mês anterior
                </p>
              </div>
              <div
                className={cn(
                  "p-3 rounded-lg",
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                )}
              >
                <kpi.icon
                  className={cn("h-6 w-6", kpi.color)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div
        className={cn(
          "p-6 rounded-xl border",
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex gap-2 mb-4 sm:mb-0">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedReport(type.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedReport === type.value
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedPeriod === period.value
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {renderChart()}
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div
          className={cn(
            "p-6 rounded-xl border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            Serviços Mais Populares
          </h3>
          <div className="space-y-3">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {service.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    darkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {service.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Professionals */}
        <div
          className={cn(
            "p-6 rounded-xl border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            Top Profissionais
          </h3>
          <div className="space-y-3">
            {professionalData.map((professional, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {professional.name}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-500" : "text-gray-500"
                    )}
                  >
                    {professional.services} serviços
                  </p>
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    darkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  R$ {professional.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
