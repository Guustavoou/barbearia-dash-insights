import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Award,
  Target,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import {
  servicesMockData,
  serviceCategories,
  serviceStats,
} from "@/lib/servicesMockData";
import { NewServiceModal } from "@/components/NewServiceModal";
import {
  Service,
  ServiceSortField,
  ServiceSortOrder,
  ServiceCategory,
} from "@/lib/servicesTypes";
import { useServices } from "@/hooks/useApi";

interface ServicesProps {
  darkMode: boolean;
}

export const Services: React.FC<ServicesProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ServiceSortField>("name");
  const [sortOrder, setSortOrder] = useState<ServiceSortOrder>("asc");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);

  // API integration
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useServices({
    search: searchTerm,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    is_active: showActiveOnly ? true : undefined,
  });

  // Fallback to mock data if API fails
  const [fallbackData, setFallbackData] = useState<any>(null);

  React.useEffect(() => {
    if (error) {
      import("@/lib/servicesMockData").then((mockData) => {
        setFallbackData(mockData);
      });
    }
  }, [error]);

  // Use API data or fallback to mock data
  const servicesData =
    apiResponse?.data || fallbackData?.servicesMockData || servicesMockData;

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = servicesData.filter((service: any) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;
      const matchesStatus = !showActiveOnly || service.isActive;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "duration":
          aValue = a.duration;
          bValue = b.duration;
          break;
        case "popularity":
          aValue = a.popularity;
          bValue = b.popularity;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
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
  }, [searchTerm, selectedCategory, sortBy, sortOrder, showActiveOnly]);

  const toggleSort = (field: ServiceSortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = serviceCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = serviceCategories.find((cat) => cat.id === categoryId);
    return category ? category.color : "bg-gray-500";
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div
      className={cn(
        "rounded-xl p-6 border transition-all hover:shadow-lg",
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300",
        !service.isActive && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {service.name}
            </h3>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getCategoryColor(service.category),
                "text-white",
              )}
            >
              {getCategoryName(service.category)}
            </span>
          </div>
          <p
            className={cn(
              "text-sm mb-3",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {service.description}
          </p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div
            className={cn(
              "text-xl font-bold",
              darkMode ? "text-green-400" : "text-green-600",
            )}
          >
            {formatCurrency(service.price)}
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Preço
          </div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              "text-xl font-bold",
              darkMode ? "text-blue-400" : "text-blue-600",
            )}
          >
            {formatDuration(service.duration)}
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Duração
          </div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              "text-xl font-bold",
              darkMode ? "text-purple-400" : "text-purple-600",
            )}
          >
            {service.popularity}
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Agendamentos
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span
              className={cn(
                "text-xl font-bold",
                darkMode ? "text-yellow-400" : "text-yellow-600",
              )}
            >
              {service.averageRating}
            </span>
          </div>
          <div
            className={cn(
              "text-xs",
              darkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Avaliação
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {service.professionals.length} profissionais
          </span>
        </div>
        <div className="flex items-center gap-2">
          {service.isActive ? (
            <div className="flex items-center gap-1 text-green-600">
              <Play className="h-3 w-3" />
              <span className="text-xs font-medium">Ativo</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-500">
              <Pause className="h-3 w-3" />
              <span className="text-xs font-medium">Inativo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SortButton: React.FC<{
    field: ServiceSortField;
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
            Serviços
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie os serviços oferecidos pelo seu negócio
          </p>
        </div>
        <button
          onClick={() => setShowNewServiceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Serviço
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
                Total de Serviços
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {serviceStats.totalServices}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
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
                Serviços Ativos
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {serviceStats.activeServices}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
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
                Preço Médio
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(serviceStats.averagePrice)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
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
                Mais Popular
              </p>
              <p
                className={cn(
                  "text-lg font-bold mt-1 leading-tight",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {serviceStats.mostPopularService}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div
        className={cn(
          "rounded-xl p-6 border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Categorias de Serviços
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? "all" : category.id,
                )
              }
              className={cn(
                "p-4 rounded-lg border transition-all text-left",
                selectedCategory === category.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    category.color.replace("bg-", "bg-"),
                  )}
                />
                <span
                  className={cn(
                    "text-xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {category.services}
                </span>
              </div>
              <h4
                className={cn(
                  "font-medium mb-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {category.name}
              </h4>
              <p
                className={cn(
                  "text-xs",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {category.description}
              </p>
            </button>
          ))}
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
              placeholder="Buscar serviços..."
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

          {/* Controls */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded"
              />
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                Apenas ativos
              </span>
            </label>
          </div>
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
            <SortButton field="price" label="Preço" />
            <SortButton field="duration" label="Duração" />
            <SortButton field="popularity" label="Popularidade" />
            <SortButton field="category" label="Categoria" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
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
          Mostrando {filteredServices.length} de {serviceStats.totalServices}{" "}
          serviços
        </p>
      </div>

      {/* New Service Modal */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
};
