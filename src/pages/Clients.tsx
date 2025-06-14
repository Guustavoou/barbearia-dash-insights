<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Grid3X3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import {
  cn,
  formatCurrency,
  formatDate,
  getClientStatusColor,
  getInitials,
} from "@/lib/unclicUtils";
import {
  Client,
  SortField,
  SortOrder,
  ViewMode,
  StatusFilter,
} from "@/lib/types";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";
import { NewClientModal } from "@/components/NewClientModal";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useApi";
=======

import React, { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/unclicUtils";
import { NewClientModal } from "@/components/NewClientModal";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/lib/types"; // Use our local Client type instead of Database type
import { toast } from "sonner";
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157

interface ClientsProps {
  darkMode: boolean;
}

export const Clients: React.FC<ClientsProps> = ({ darkMode }) => {
<<<<<<< HEAD
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("todos");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const itemsPerPage = 12;

  // API integration
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useClients({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sort: sortBy,
    order: sortOrder.toUpperCase(),
    status: selectedStatus === "todos" ? undefined : selectedStatus,
  });

  const createClient = useCreateClient({
    onSuccess: () => {
      setShowNewClientModal(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      alert("Erro ao criar cliente: " + error);
    },
  });

  const updateClient = useUpdateClient({
    onSuccess: () => {
      setSelectedClient(null);
      setShowClientDetails(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error updating client:", error);
      alert("Erro ao atualizar cliente: " + error);
    },
  });

  const deleteClient = useDeleteClient({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      alert("Erro ao excluir cliente: " + error);
    },
  });

  // Fallback to mock data if API fails
  const [fallbackClients, setFallbackClients] = useState<Client[]>([]);

  useEffect(() => {
    if (error) {
      // Load fallback data
      import("@/lib/mockData").then((mockData) => {
        setFallbackClients(mockData.clients);
      });
    }
  }, [error]);

  // Use API data or fallback to mock data
  const clients = apiResponse?.data || fallbackClients;
  const pagination = apiResponse?.pagination;

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, sortOrder, selectedStatus]);

  if (loading && !fallbackClients.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Carregando clientes...
          </p>
        </div>
      </div>
    );
  }

  const handleNewClient = (clientData: any) => {
    createClient.mutate(clientData);
  };

  const handleEditClient = (clientData: any) => {
    if (selectedClient) {
      updateClient.mutate({ id: selectedClient.id, data: clientData });
    }
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClient.mutate(clientId);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
=======
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
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
    } else {
      toast.error("Erro ao adicionar cliente");
    }
  };

<<<<<<< HEAD
  const handleSelectClient = (clientId: number) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((client) => client.id));
    }
  };

  const totalPages =
    pagination?.totalPages || Math.ceil(clients.length / itemsPerPage);
  const totalClients = pagination?.total || clients.length;

  const ClientCard: React.FC<{ client: Client }> = ({ client }) => (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-xl",
        darkMode
          ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
          : "bg-white border border-gray-200 hover:shadow-lg",
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-3 h-3 rounded-full",
          client.status === "ativo" ? "bg-green-500" : "bg-red-500",
        )}
      />

      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
            "bg-gradient-to-br from-blue-500 to-purple-600",
          )}
        >
          {getInitials(client.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-bold text-lg truncate mb-1",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {client.name}
          </h3>
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {client.profession || "Profissão não informada"}
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            {client.phone}
          </span>
        </div>
        {client.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-500" />
            <span
              className={cn(
                "text-sm truncate",
                darkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              {client.email}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-500" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            {client.lastVisit ? formatDate(client.lastVisit) : "Nunca"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p
            className={cn(
              "text-xs",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Total Gasto
          </p>
          <p
            className={cn(
              "font-bold text-lg",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {formatCurrency(client.totalSpent)}
          </p>
        </div>
        <div>
          <p
            className={cn(
              "text-xs",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Visitas
          </p>
          <p
            className={cn(
              "font-bold text-lg",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {client.visits}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedClient(client);
            setShowClientDetails(true);
          }}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Ver Detalhes
        </button>
        <button
          onClick={() => handleDeleteClient(client.id)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            darkMode
              ? "hover:bg-gray-700 text-red-400"
              : "hover:bg-red-50 text-red-600",
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
=======
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
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
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
<<<<<<< HEAD
            Gerencie seus clientes e histórico de atendimentos
=======
            {loading ? "Carregando..." : `${stats.total} clientes cadastrados`}
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
          </p>
        </div>
        <button
          onClick={() => setShowNewClientModal(true)}
<<<<<<< HEAD
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
=======
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
<<<<<<< HEAD
      </div>

      {/* API Error Notice */}
      {error && (
        <div
          className={cn(
            "p-4 rounded-lg border-l-4 border-yellow-500",
            darkMode
              ? "bg-yellow-900/20 text-yellow-200"
              : "bg-yellow-50 text-yellow-800",
          )}
        >
          <p className="text-sm">
            ⚠️ Usando dados offline. Verifique se o servidor backend está
            rodando na porta 3001.
          </p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
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
              "pl-10 pr-4 py-3 w-full rounded-lg border transition-colors",
              darkMode
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 placeholder-gray-500 focus:border-blue-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            )}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
          className={cn(
            "px-4 py-3 rounded-lg border min-w-[140px]",
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900",
          )}
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>

        <div
          className={cn(
            "flex items-center rounded-lg border",
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white",
          )}
        >
          <button
            onClick={() => setViewMode("cards")}
            className={cn(
              "p-3 transition-colors",
              viewMode === "cards"
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-3 transition-colors",
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <List className="h-4 w-4" />
          </button>
=======
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
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
        </div>

<<<<<<< HEAD
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {/* Clients Grid/List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border overflow-hidden",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={cn(
                  "border-b",
                  darkMode
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-gray-50",
                )}
              >
                <tr>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort("name")}
                      className={cn(
                        "flex items-center gap-2 font-medium",
                        darkMode ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Nome
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th
                    className={cn(
                      "text-left p-4 font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Contato
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort("totalSpent")}
                      className={cn(
                        "flex items-center gap-2 font-medium",
                        darkMode ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Total Gasto
                      {sortBy === "totalSpent" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort("lastVisit")}
                      className={cn(
                        "flex items-center gap-2 font-medium",
                        darkMode ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      Última Visita
                      {sortBy === "lastVisit" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th
                    className={cn(
                      "text-left p-4 font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "text-left p-4 font-medium",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className={cn(
                      "border-b transition-colors",
                      darkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                            "bg-gradient-to-br from-blue-500 to-purple-600",
                          )}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              darkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {client.name}
                          </p>
                          <p
                            className={cn(
                              "text-sm",
                              darkMode ? "text-gray-400" : "text-gray-600",
                            )}
                          >
                            {client.profession || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-300" : "text-gray-700",
                          )}
                        >
                          {client.phone}
                        </p>
                        {client.email && (
                          <p
                            className={cn(
                              "text-sm",
                              darkMode ? "text-gray-400" : "text-gray-600",
                            )}
                          >
                            {client.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td
                      className={cn(
                        "p-4 font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatCurrency(client.totalSpent)}
                    </td>
                    <td
                      className={cn(
                        "p-4",
                        darkMode ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      {client.lastVisit
                        ? formatDate(client.lastVisit)
                        : "Nunca"}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          getClientStatusColor(client.status),
                        )}
                      >
                        {client.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientDetails(true);
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            darkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-600",
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            darkMode
                              ? "hover:bg-gray-700 text-red-400"
                              : "hover:bg-gray-100 text-red-600",
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {clients.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3
            className={cn(
              "text-xl font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Nenhum cliente encontrado
          </h3>
          <p className={cn("text-gray-500 dark:text-gray-400 mb-6")}>
            {searchTerm
              ? "Tente ajustar sua busca ou adicione um novo cliente"
              : "Comece adicionando seu primeiro cliente"}
          </p>
          <button
            onClick={() => setShowNewClientModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Adicionar Cliente
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, totalClients)} de{" "}
            {totalClients} clientes
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span
              className={cn(
                "px-4 py-2 text-sm",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600",
=======
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
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
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
<<<<<<< HEAD
      {showClientDetails && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          darkMode={darkMode}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedClient(null);
          }}
          onEdit={handleEditClient}
        />
      )}

      {showNewClientModal && (
        <NewClientModal
          darkMode={darkMode}
          onClose={() => setShowNewClientModal(false)}
          onSave={handleNewClient}
          loading={createClient.loading}
=======
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
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
        />
      )}
    </div>
  );
};
