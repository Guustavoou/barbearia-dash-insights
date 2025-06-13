import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Edit3,
  Eye,
  Calendar,
  Phone,
  Mail,
  Award,
  Clock,
  Crown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Pause,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import {
  professionalsMockData,
  professionalStats,
  workDaysOptions,
} from "@/lib/professionalsMockData";
import { NewProfessionalModal } from "@/components/NewProfessionalModal";
import {
  Professional,
  ProfessionalSortField,
  ProfessionalSortOrder,
  ProfessionalStatus,
} from "@/lib/professionalsTypes";
import { useProfessionals } from "@/hooks/useApi";

interface ProfessionalsProps {
  darkMode: boolean;
}

export const Professionals: React.FC<ProfessionalsProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ProfessionalSortField>("name");
  const [sortOrder, setSortOrder] = useState<ProfessionalSortOrder>("asc");
  const [showNewProfessionalModal, setShowNewProfessionalModal] =
    useState(false);

  // Filter and sort professionals
  const filteredProfessionals = useMemo(() => {
    let filtered = professionalsMockData.filter((professional) => {
      const matchesSearch =
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialties.some((spec) =>
          spec.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || professional.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "totalServices":
          aValue = a.totalServices;
          bValue = b.totalServices;
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "hiredDate":
          aValue = a.hiredDate;
          bValue = b.hiredDate;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: ProfessionalSortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: ProfessionalStatus) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inativo":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "ferias":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: ProfessionalStatus) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="h-3 w-3" />;
      case "inativo":
        return <XCircle className="h-3 w-3" />;
      case "ferias":
        return <Pause className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ProfessionalStatus) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      case "ferias":
        return "F��rias";
      default:
        return status;
    }
  };

  const getWorkDaysText = (workDays: string[]) => {
    return workDays
      .map((day) => workDaysOptions.find((d) => d.id === day)?.short)
      .join(", ");
  };

  const ProfessionalCard: React.FC<{ professional: Professional }> = ({
    professional,
  }) => (
    <div
      className={cn(
        "rounded-xl p-6 border transition-all hover:shadow-lg",
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300",
        professional.status !== "ativo" && "opacity-75",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {professional.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            {professional.isOwner && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  "text-lg font-semibold",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {professional.name}
              </h3>
              {professional.isOwner && (
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                  Proprietária
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                  getStatusColor(professional.status),
                )}
              >
                {getStatusIcon(professional.status)}
                {getStatusText(professional.status)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span
                  className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {professional.rating}
                </span>
              </div>
            </div>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              {professional.experience} anos de experiência
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            )}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className={cn(
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            )}
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            className={cn(
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            {professional.phone}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span
            className={cn(
              "text-sm truncate",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            {professional.email}
          </span>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <h4
          className={cn(
            "text-sm font-medium mb-2",
            darkMode ? "text-gray-300" : "text-gray-700",
          )}
        >
          Especialidades:
        </h4>
        <div className="flex flex-wrap gap-1">
          {professional.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-1 rounded-full text-xs",
                darkMode
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-800",
              )}
            >
              {specialty}
            </span>
          ))}
          {professional.specialties.length > 3 && (
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs",
                darkMode
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-600",
              )}
            >
              +{professional.specialties.length - 3} mais
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div
            className={cn(
              "text-lg font-bold",
              darkMode ? "text-blue-400" : "text-blue-600",
            )}
          >
            {professional.totalServices}
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Serviços
          </div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              "text-lg font-bold",
              darkMode ? "text-green-400" : "text-green-600",
            )}
          >
            {formatCurrency(professional.totalRevenue)}
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Receita
          </div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              "text-lg font-bold",
              darkMode ? "text-purple-400" : "text-purple-600",
            )}
          >
            {professional.commission}%
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Comissão
          </div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              "text-lg font-bold",
              darkMode ? "text-orange-400" : "text-orange-600",
            )}
          >
            {Math.round(
              (professional.completedServices / professional.totalServices) *
                100,
            )}
            %
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Conclusão
          </div>
        </div>
      </div>

      {/* Work Schedule */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className={cn(darkMode ? "text-gray-400" : "text-gray-600")}>
            {getWorkDaysText(professional.workDays)}
          </span>
        </div>
        <span className={cn(darkMode ? "text-gray-400" : "text-gray-600")}>
          {professional.workHours.start} - {professional.workHours.end}
        </span>
      </div>
    </div>
  );

  const SortButton: React.FC<{
    field: ProfessionalSortField;
    label: string;
  }> = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className={cn(
        "px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors",
        sortBy === field
          ? "bg-blue-600 text-white"
          : darkMode
            ? "text-gray-300 hover:bg-gray-700"
            : "text-gray-600 hover:bg-gray-100",
      )}
    >
      {label}
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        ))}
    </button>
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
            Profissionais
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie sua equipe de profissionais
          </p>
        </div>
        <button
          onClick={() => setShowNewProfessionalModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Profissional
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
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
                Total de Profissionais
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {professionalStats.totalProfessionals}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Profissionais Ativos
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {professionalStats.activeProfessionals}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Receita Total
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(professionalStats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Avaliação Média
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <p
                  className={cn(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {professionalStats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div
        className={cn(
          "rounded-xl border p-6",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            />
            <input
              type="text"
              placeholder="Buscar profissionais ou especialidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            )}
          >
            <option value="all">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
            <option value="ferias">Em férias</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span
            className={cn(
              "text-sm font-medium",
              darkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            Ordenar por:
          </span>
          <div className="flex flex-wrap gap-2">
            <SortButton field="name" label="Nome" />
            <SortButton field="rating" label="Avaliação" />
            <SortButton field="totalServices" label="Serviços" />
            <SortButton field="totalRevenue" label="Receita" />
            <SortButton field="hiredDate" label="Data de Contratação" />
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfessionals.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center py-4">
        <p
          className={cn(
            "text-sm",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Mostrando {filteredProfessionals.length} de{" "}
          {professionalStats.totalProfessionals} profissionais
        </p>
      </div>

      {/* New Professional Modal */}
      <NewProfessionalModal
        isOpen={showNewProfessionalModal}
        onClose={() => setShowNewProfessionalModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
};
