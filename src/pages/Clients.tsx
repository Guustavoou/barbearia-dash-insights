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
import { clients, cities } from "@/lib/mockData";
import {
  Client,
  SortField,
  SortOrder,
  ViewMode,
  StatusFilter,
} from "@/lib/types";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";
import { NewClientModal } from "@/components/NewClientModal";

interface ClientsProps {
  darkMode: boolean;
}

export const Clients: React.FC<ClientsProps> = ({ darkMode }) => {
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("todos");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] =
    useState<Client | null>(null);

  const itemsPerPage = 9;

  // Filter and sort clients
  useEffect(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      const matchesCity =
        selectedCity === "all" || client.city === selectedCity;
      const matchesStatus =
        selectedStatus === "todos" ||
        (selectedStatus === "ativos" && client.status === "ativo") ||
        (selectedStatus === "inativos" && client.status === "inativo");
      return matchesSearch && matchesCity && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "lastVisit":
          aValue = a.lastVisit;
          bValue = b.lastVisit;
          break;
        case "totalSpent":
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case "joinDate":
          aValue = a.joinDate;
          bValue = b.joinDate;
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

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedStatus, sortBy, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleClientSelection = (clientId: number) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const getCurrentPageClients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  };

  const openClientDetails = (client: Client) => {
    setSelectedClientForDetails(client);
    setShowClientDetailsModal(true);
  };

  const handleCardClick = (e: React.MouseEvent, clientId: number) => {
    if ((e.target as HTMLElement).closest(".action-button")) return;
    setExpandedClientId(expandedClientId === clientId ? null : clientId);
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const SortButton: React.FC<{
    field: SortField;
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
            Gerenciar Clientes
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {filteredClients.length} clientes encontrados
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div
        className={cn(
          "rounded-xl p-6 border",
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
              placeholder="Buscar por nome, email ou telefone..."
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

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            >
              <option value="all">Todas as cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

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
              <option value="todos">Todos os status</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>

            <button
              onClick={() =>
                setViewMode(viewMode === "cards" ? "list" : "cards")
              }
              className={cn(
                "p-2 rounded-lg border transition-colors",
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50",
              )}
              title={`Alternar para vista em ${viewMode === "cards" ? "lista" : "cards"}`}
            >
              {viewMode === "cards" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setShowNewClientModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo Cliente
            </button>
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
            <SortButton field="lastVisit" label="Última Visita" />
            <SortButton field="totalSpent" label="Total Gasto" />
            <SortButton field="joinDate" label="Data de Cadastro" />
          </div>
        </div>
      </div>

      {/* Client List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentPageClients().map((client) => (
            <div
              key={client.id}
              onClick={(e) => handleCardClick(e, client.id)}
              className={cn(
                "rounded-xl p-6 border cursor-pointer transition-all",
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200 hover:shadow-lg",
                expandedClientId === client.id
                  ? "ring-2 ring-blue-500"
                  : "hover:border-blue-300",
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {getInitials(client.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-semibold truncate",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {client.name}
                  </h3>
                  <p
                    className={cn(
                      "text-sm truncate",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {client.city}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getClientStatusColor(client.status),
                  )}
                >
                  {client.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-300" : "text-gray-600",
                    )}
                  >
                    {client.phone}
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
                    {client.email}
                  </span>
                </div>
              </div>

              {expandedClientId === client.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={cn(
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Última visita:
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatDate(client.lastVisit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={cn(
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Total gasto:
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-green-400" : "text-green-600",
                      )}
                    >
                      {formatCurrency(client.totalSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={cn(
                        darkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      Visitas:
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {client.visits}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openClientDetails(client);
                      }}
                      className="action-button flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      Detalhes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle schedule functionality
                      }}
                      className="action-button flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Calendar className="h-3 w-3" />
                      Agendar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div
          className={cn(
            "rounded-xl border overflow-hidden",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={cn(
                  "border-b",
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedClients.length ===
                        getCurrentPageClients().length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClients(
                            getCurrentPageClients().map((c) => c.id),
                          );
                        } else {
                          setSelectedClients([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Cliente
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Contato
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Última Visita
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Total Gasto
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      darkMode ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y",
                  darkMode ? "divide-gray-700" : "divide-gray-200",
                )}
              >
                {getCurrentPageClients().map((client) => (
                  <tr
                    key={client.id}
                    className={cn(
                      "transition-colors",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
                    )}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => toggleClientSelection(client.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {getInitials(client.name)}
                          </span>
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
                            {client.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-300" : "text-gray-600",
                          )}
                        >
                          {client.phone}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            darkMode ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {client.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-sm",
                          darkMode ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {formatDate(client.lastVisit)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-green-400" : "text-green-600",
                        )}
                      >
                        {formatCurrency(client.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getClientStatusColor(client.status),
                        )}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openClientDetails(client)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                          title="Excluir"
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
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} de{" "}
            {filteredClients.length} clientes
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
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm transition-colors",
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
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
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        darkMode={darkMode}
      />
      <ClientDetailsModal
        client={selectedClientForDetails}
        isOpen={showClientDetailsModal}
        onClose={() => {
          setShowClientDetailsModal(false);
          setSelectedClientForDetails(null);
        }}
        darkMode={darkMode}
      />
    </div>
  );
};
