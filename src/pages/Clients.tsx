import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Star,
  UserPlus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Client, ClientSortField, ClientSortOrder } from "@/lib/types";
import { clients as clientsMockData } from "@/lib/mockData";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useApi";

interface ClientsProps {
  darkMode: boolean;
}

type StatusFilter = "todos" | "ativo" | "inativo";
type SortField = "name" | "email" | "createdAt" | "lastVisit";
type SortOrder = "asc" | "desc";

export const Clients: React.FC<ClientsProps> = ({ darkMode }) => {
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("todos");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // API integration with automatic fallback
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useClients({
    search: searchTerm,
    status: selectedStatus !== "todos" ? selectedStatus : undefined,
    sort: sortBy,
    order: sortOrder.toUpperCase() as "ASC" | "DESC",
    page: 1,
    limit: 50,
  });

  const createClientMutation = useCreateClient({
    onSuccess: () => {
      refetch();
      setShowNewClientModal(false);
    },
  });

  const updateClientMutation = useUpdateClient({
    onSuccess: () => {
      refetch();
      setEditingClient(null);
    },
  });

  const deleteClientMutation = useDeleteClient({
    onSuccess: () => {
      refetch();
    },
  });

  // Use API data or fallback to mock data
  const clients = apiResponse?.data || clientsMockData;
  const pagination = apiResponse?.pagination;

  // Filter and sort clients
  const filteredClients = React.useMemo(() => {
    let filtered = clients.filter((client: Client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm);

      const matchesStatus =
        selectedStatus === "todos" || client.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case "lastVisit":
          aValue = new Date(a.lastVisit || 0);
          bValue = new Date(b.lastVisit || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [clients, searchTerm, selectedStatus, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSelectClient = (clientId: number) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map((client) => client.id));
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteClientMutation.mutate(clientId);
    }
  };

  const handleNewClient = async (clientData: any) => {
    await createClientMutation.mutate(clientData);
  };

  const handleUpdateClient = async (clientData: any) => {
    if (editingClient) {
      await updateClientMutation.mutate({
        id: editingClient.id,
        data: clientData,
      });
    }
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c: Client) => c.status === "ativo").length;
    const thisMonth = clients.filter(
      (c: Client) =>
        new Date(c.createdAt || 0).getMonth() === new Date().getMonth(),
    ).length;

    return { total, active, thisMonth };
  }, [clients]);

  const totalClients = pagination?.total || clients.length;

  const ClientCard: React.FC<{ client: Client }> = ({ client }) => (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-xl",
        darkMode
          ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
          : "bg-white border border-gray-200 hover:bg-gray-50",
        selectedClients.includes(client.id) &&
          "ring-2 ring-blue-500 ring-opacity-50",
      )}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={selectedClients.includes(client.id)}
          onChange={() => handleSelectClient(client.id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Client Info */}
      <div className="ml-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className={cn(
                "text-lg font-semibold mb-1",
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
              {client.email}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditingClient(client)}
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
              onClick={() => handleDeleteClient(client.id)}
              className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span
              className={cn(
                "text-sm",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              {client.phone || "Não informado"}
            </span>
          </div>
          {client.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-300" : "text-gray-600",
                )}
              >
                {client.address}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Agendamentos
            </p>
            <p
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {client.totalAppointments || 0}
            </p>
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Gasto Total
            </p>
            <p
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {formatCurrency(client.totalSpent || 0)}
            </p>
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Última Visita
            </p>
            <p
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {client.lastVisit ? formatDate(client.lastVisit) : "Nunca"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              client.status === "ativo"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {client.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
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
            Clientes
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie seus clientes e relacionamentos
          </p>
        </div>
        <button
          onClick={() => setShowNewClientModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Total de Clientes
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {loading ? "..." : totalClients}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
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
                Clientes Ativos
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
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
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
                Novos Este Mês
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {loading ? "..." : stats.thisMonth}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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
                placeholder="Buscar clientes..."
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
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as StatusFilter)
              }
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedClients.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {selectedClients.length} selecionado(s)
              </span>
              <button
                onClick={() => setSelectedClients([])}
                className={cn(
                  "px-3 py-1 rounded text-xs",
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className={cn(
              "text-sm font-medium",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Ordenar por:
          </span>
          {["name", "email", "createdAt", "lastVisit"].map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field as SortField)}
              className={cn(
                "px-3 py-1 rounded-lg text-sm transition-colors",
                sortBy === field
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {field === "name"
                ? "Nome"
                : field === "email"
                  ? "Email"
                  : field === "createdAt"
                    ? "Data de Criação"
                    : "Última Visita"}
              {sortBy === field && (
                <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
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
      ) : filteredClients.length === 0 ? (
        <div
          className={cn(
            "rounded-xl p-12 text-center border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <Users
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              darkMode ? "text-gray-400" : "text-gray-500",
            )}
          />
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Nenhum cliente encontrado
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Tente ajustar os filtros ou adicione seu primeiro cliente.
          </p>
          <button
            onClick={() => setShowNewClientModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Show errors if any */}
      {error && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4">
          <p className="text-red-800 dark:text-red-400">
            Erro ao carregar clientes: {error}
          </p>
        </div>
      )}
    </div>
  );
};
