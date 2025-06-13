
import React, { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/unclicUtils";
import { NewClientModal } from "@/components/NewClientModal";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/lib/types"; // Use our local Client type instead of Database type
import { toast } from "sonner";

interface ClientsProps {
  darkMode: boolean;
}

export const Clients: React.FC<ClientsProps> = ({ darkMode }) => {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'ativo').length,
    inactive: clients.filter(c => c.status === 'inativo').length,
    thisMonth: clients.filter(c => {
      const clientDate = new Date(c.created_at || '');
      const currentMonth = new Date().toISOString().slice(0, 7);
      return c.created_at?.startsWith(currentMonth);
    }).length,
  };

  const handleAddClient = async (clientData: any) => {
    const result = await addClient(clientData);
    if (result) {
      toast.success("Cliente adicionado com sucesso!");
      setShowNewClientModal(false);
    } else {
      toast.error("Erro ao adicionar cliente");
    }
  };

  const handleUpdateClient = async (id: string, updates: any) => {
    const result = await updateClient(id, updates);
    if (result) {
      toast.success("Cliente atualizado com sucesso!");
      setSelectedClient(null);
    } else {
      toast.error("Erro ao atualizar cliente");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const result = await deleteClient(id);
      if (result) {
        toast.success("Cliente excluído com sucesso!");
        setSelectedClient(null);
      } else {
        toast.error("Erro ao excluir cliente");
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
            Clientes
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {loading ? "Carregando..." : `${stats.total} clientes cadastrados`}
          </p>
        </div>
        <button
          onClick={() => setShowNewClientModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
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
                Total de Clientes
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
                Clientes Ativos
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
                Novos Este Mês
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-blue-400" : "text-blue-600",
                )}
              >
                {stats.thisMonth}
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
                Receita Total
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  darkMode ? "text-yellow-400" : "text-yellow-600",
                )}
              >
                {formatCurrency(clients.reduce((sum, client) => sum + (client.total_spent || 0), 0))}
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
              placeholder="Buscar clientes..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border min-w-[150px]",
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900",
            )}
          >
            <option value="all">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* Clients List */}
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
        ) : filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer",
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {client.name}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        client.status === "ativo"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                      )}
                    >
                      {client.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                      }}
                      className={cn(
                        "p-1 rounded",
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200",
                      )}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id);
                      }}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span
                        className={cn(
                          "text-xs",
                          darkMode ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {client.email}
                      </span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span
                        className={cn(
                          "text-xs",
                          darkMode ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {client.phone}
                      </span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span
                        className={cn(
                          "text-xs",
                          darkMode ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {client.city}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between text-xs">
                    <span
                      className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                    >
                      Total gasto
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-green-400" : "text-green-600",
                      )}
                    >
                      {formatCurrency(client.total_spent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span
                      className={cn(darkMode ? "text-gray-400" : "text-gray-600")}
                    >
                      Visitas
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-blue-400" : "text-blue-600",
                      )}
                    >
                      {client.visits || 0}
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
              {searchTerm || statusFilter !== "all"
                ? "Nenhum cliente encontrado"
                : "Nenhum cliente cadastrado"}
            </p>
            <p
              className={cn(
                "text-sm",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              {searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro cliente"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onAddClient={handleAddClient}
        darkMode={darkMode}
      />

      {selectedClient && (
        <ClientDetailsModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};
