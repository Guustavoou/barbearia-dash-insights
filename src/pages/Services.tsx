
import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Clock, DollarSign, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { NewServiceModal } from "@/components/NewServiceModal";
import { useServices } from "@/hooks/useServices";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Service = Database['public']['Tables']['services']['Row'];

interface ServicesProps {
  darkMode: boolean;
}

export const Services: React.FC<ServicesProps> = ({ darkMode }) => {
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const { services, loading, addService, updateService, deleteService } = useServices();

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(services.map(s => s.category))];

  // Calculate stats
  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    totalRevenue: services.reduce((sum, service) => sum + (service.price || 0), 0),
    averagePrice: services.length > 0 ? services.reduce((sum, service) => sum + (service.price || 0), 0) / services.length : 0,
  };

  const handleAddService = async (serviceData: any) => {
    const result = await addService(serviceData);
    if (result) {
      toast.success("Serviço adicionado com sucesso!");
      setShowNewServiceModal(false);
    } else {
      toast.error("Erro ao adicionar serviço");
    }
  };

  const handleUpdateService = async (id: string, updates: any) => {
    const result = await updateService(id, updates);
    if (result) {
      toast.success("Serviço atualizado com sucesso!");
      setSelectedService(null);
    } else {
      toast.error("Erro ao atualizar serviço");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      const result = await deleteService(id);
      if (result) {
        toast.success("Serviço excluído com sucesso!");
        setSelectedService(null);
      } else {
        toast.error("Erro ao excluir serviço");
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className={cn("h-4 rounded mb-2", darkMode ? "bg-gray-700" : "bg-gray-200")}></div>
      <div className={cn("h-3 rounded mb-4", darkMode ? "bg-gray-700" : "bg-gray-200")}></div>
      <div className={cn("h-20 rounded", darkMode ? "bg-gray-700" : "bg-gray-200")}></div>
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
            {loading ? "Carregando..." : `${stats.total} serviços cadastrados`}
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
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total de Serviços
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {stats.total}
              </p>
            </>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Serviços Ativos
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-green-400" : "text-green-600",
                )}
              >
                {stats.active}
              </p>
            </>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Preço Médio
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-blue-400" : "text-blue-600",
                )}
              >
                {formatCurrency(stats.averagePrice)}
              </p>
            </>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl p-6 border",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Valor Total
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-yellow-400" : "text-yellow-600",
                )}
              >
                {formatCurrency(stats.totalRevenue)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className={cn(
          "rounded-xl p-6 border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
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
                "w-full pl-10 pr-4 py-2 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border min-w-[150px]",
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900",
            )}
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-lg border animate-pulse",
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <div className={cn("h-4 rounded mb-3", darkMode ? "bg-gray-600" : "bg-gray-300")}></div>
                <div className={cn("h-3 rounded mb-2", darkMode ? "bg-gray-600" : "bg-gray-300")}></div>
                <div className={cn("h-3 rounded", darkMode ? "bg-gray-600" : "bg-gray-300")}></div>
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-medium mb-1",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {service.name}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        service.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                      )}
                    >
                      {service.category}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedService(service)}
                      className={cn(
                        "p-1 rounded",
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200",
                      )}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                {service.description && (
                  <p
                    className={cn(
                      "text-sm mb-3",
                      darkMode ? "text-gray-300" : "text-gray-600",
                    )}
                  >
                    {service.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-green-400" : "text-green-600",
                        )}
                      >
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span
                        className={cn(
                          "text-sm",
                          darkMode ? "text-blue-400" : "text-blue-600",
                        )}
                      >
                        {service.duration}min
                      </span>
                    </div>
                  </div>

                  {service.average_rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span
                        className={cn(
                          "text-sm",
                          darkMode ? "text-yellow-400" : "text-yellow-600",
                        )}
                      >
                        {service.average_rating.toFixed(1)} ({service.popularity} avaliações)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between text-xs">
                    <span
                      className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                    >
                      Status
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        service.is_active
                          ? darkMode ? "text-green-400" : "text-green-600"
                          : darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {service.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p
              className={cn(
                "text-lg font-medium mb-2",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              {searchTerm || categoryFilter !== "all"
                ? "Nenhum serviço encontrado"
                : "Nenhum serviço cadastrado"}
            </p>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              {searchTerm || categoryFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro serviço"}
            </p>
          </div>
        )}
      </div>

      {/* New Service Modal */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        onAddService={handleAddService}
        darkMode={darkMode}
      />
    </div>
  );
};
