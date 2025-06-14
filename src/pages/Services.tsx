import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
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
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | "todas"
  >("todas");
  const [sortBy, setSortBy] = useState<ServiceSortField>("name");
  const [sortOrder, setSortOrder] = useState<ServiceSortOrder>("asc");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // API integration
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useServices({
    search: searchTerm,
    category: selectedCategory !== "todas" ? selectedCategory : undefined,
    is_active: showActiveOnly,
    sort: sortBy,
    order: sortOrder.toUpperCase() as "ASC" | "DESC",
    page: 1,
    limit: 50,
  });

  // Use API data or fallback to empty array
  const servicesData = apiResponse?.data || [];

  // Calculate filtered and sorted services
  const filteredServices = useMemo(() => {
    let filtered = servicesData.filter((service: Service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "todas" || service.category === selectedCategory;
      const matchesStatus = !showActiveOnly || service.is_active;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    return filtered;
  }, [
    servicesData,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    showActiveOnly,
  ]);

  // Get unique categories for filter
  const categories = [...new Set(servicesData.map((s: Service) => s.category))];

  // Calculate stats
  const stats = {
    total: servicesData.length,
    active: servicesData.filter((s: Service) => s.is_active).length,
    totalRevenue: servicesData.reduce(
      (sum: number, service: Service) => sum + (service.price || 0),
      0,
    ),
    averagePrice:
      servicesData.length > 0
        ? servicesData.reduce(
            (sum: number, service: Service) => sum + (service.price || 0),
            0,
          ) / servicesData.length
        : 0,
  };

  const handleAddService = async (serviceData: any) => {
    // This will be implemented when we have the mutation hook
    console.log("Adding service:", serviceData);
    setShowNewServiceModal(false);
    refetch();
  };

  const handleEditService = async (serviceData: any) => {
    // This will be implemented when we have the mutation hook
    console.log("Editing service:", serviceData);
    setEditingService(null);
    refetch();
  };

  const handleDeleteService = async (serviceId: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      // This will be implemented when we have the mutation hook
      console.log("Deleting service:", serviceId);
      refetch();
    }
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-xl",
        darkMode
          ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
          : "bg-white border border-gray-200 hover:bg-gray-50",
      )}
    >
      {/* Service Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {service.name}
          </h3>
          <p
            className={cn(
              "text-sm mb-3",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {service.description || "Sem descrição"}
          </p>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              darkMode
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-100 text-blue-800",
            )}
          >
            {service.category}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditingService(service)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
            )}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteService(service.id)}
            className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Preço
            </span>
          </div>
          <p
            className={cn(
              "text-lg font-semibold text-green-600",
              darkMode ? "text-green-400" : "text-green-600",
            )}
          >
            {formatCurrency(service.price)}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Duração
            </span>
          </div>
          <p
            className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {service.duration} min
          </p>
        </div>
      </div>

      {/* Popularity and Rating */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span
            className={cn(
              "text-xs font-medium uppercase tracking-wide",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Popularidade
          </span>
          <p
            className={cn(
              "text-sm font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {service.popularity || 0}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Avaliação
            </span>
          </div>
          <p
            className={cn(
              "text-sm font-semibold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {service.average_rating ? service.average_rating.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4">
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            service.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {service.is_active ? "Ativo" : "Inativo"}
        </span>
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
            Serviços
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie todos os serviços oferecidos
          </p>
        </div>
        <button
          onClick={() => setShowNewServiceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                {loading ? "..." : stats.total}
              </p>
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
                {loading ? "..." : stats.active}
              </p>
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
                  "text-2xl font-bold mt-1 text-green-600",
                  darkMode ? "text-green-400" : "text-green-600",
                )}
              >
                {loading ? "..." : formatCurrency(stats.averagePrice)}
              </p>
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
                Receita Potencial
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1 text-blue-600",
                  darkMode ? "text-blue-400" : "text-blue-600",
                )}
              >
                {loading ? "..." : formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={cn(
          "rounded-xl p-6 border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  darkMode ? "text-gray-400" : "text-gray-500",
                )}
              />
              <input
                type="text"
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 w-full rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                )}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            >
              <option value="todas">Todas as Categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl p-6 border animate-pulse",
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "h-4 rounded mb-4",
                  darkMode ? "bg-gray-700" : "bg-gray-300",
                )}
              />
              <div
                className={cn(
                  "h-3 rounded mb-2",
                  darkMode ? "bg-gray-700" : "bg-gray-300",
                )}
              />
              <div
                className={cn(
                  "h-3 rounded w-2/3",
                  darkMode ? "bg-gray-700" : "bg-gray-300",
                )}
              />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div
          className={cn(
            "rounded-xl p-12 text-center border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div
            className={cn(
              "w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center",
              darkMode ? "bg-gray-700" : "bg-gray-100",
            )}
          >
            <Clock
              className={cn(
                "w-6 h-6",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            />
          </div>
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Nenhum serviço encontrado
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Tente ajustar os filtros ou adicione seu primeiro serviço.
          </p>
          <button
            onClick={() => setShowNewServiceModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar Serviço
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* New Service Modal */}
      {showNewServiceModal && (
        <NewServiceModal
          isOpen={showNewServiceModal}
          onClose={() => setShowNewServiceModal(false)}
          onSave={handleAddService}
          darkMode={darkMode}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <NewServiceModal
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSave={handleEditService}
          service={editingService}
          darkMode={darkMode}
        />
      )}

      {/* Show errors if any */}
      {error && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4">
          <p className="text-red-800 dark:text-red-400">
            Erro ao carregar serviços: {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Services;
