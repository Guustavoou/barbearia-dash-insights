import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gift,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Heart,
  Clock,
  DollarSign,
  Star,
  UserCheck,
  UserX,
  MoreHorizontal,
  X,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  CreditCard,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
// 🚀 INTEGRAÇÃO PRODUCTION SUPABASE - 100% DADOS REAIS
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useAppointments,
  useGlobalLoading,
  useGlobalError,
} from "@/hooks/useSupabaseProduction";

interface BeautifulClientsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  status: string;
  total_spent?: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  birth_date?: string;
  last_visit?: string;
}

interface Visit {
  id: string;
  date: string;
  service: string;
  amount: number;
  professional: string;
  rating?: number;
}

interface NewClientForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  birth_date: string;
}

export const BeautifulClientsProduction: React.FC<BeautifulClientsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Modal states
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [newClientForm, setNewClientForm] = useState<NewClientForm>({
    name: "",
    email: "",
    phone: "",
    city: "",
    notes: "",
    birth_date: "",
  });

  // 🚀 DADOS REAIS DO SUPABASE - SEM MOCKS
  const {
    data: clientsResponse,
    loading: clientsLoading,
    error: clientsError,
    refetch: refetchClients,
  } = useClients({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: sortBy,
    order: sortOrder,
  });

  const {
    data: clientAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments({
    // We'll load this when a client is selected
    limit: 10,
  });

  // Mutations
  const createClientMutation = useCreateClient({
    onSuccess: () => {
      setIsNewClientModalOpen(false);
      setNewClientForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        notes: "",
        birth_date: "",
      });
      refetchClients();
    },
  });

  const updateClientMutation = useUpdateClient({
    onSuccess: () => {
      setIsEditModalOpen(false);
      setSelectedClient(null);
      refetchClients();
    },
  });

  const deleteClientMutation = useDeleteClient({
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      refetchClients();
    },
  });

  // Global states
  const isLoading = useGlobalLoading(
    { loading: clientsLoading },
    { loading: appointmentsLoading },
    { loading: createClientMutation.isLoading },
    { loading: updateClientMutation.isLoading },
    { loading: deleteClientMutation.isLoading },
  );

  const globalError = useGlobalError(
    { error: clientsError },
    { error: appointmentsError },
  );

  // Processed data
  const clients = useMemo(() => {
    return clientsResponse?.data || [];
  }, [clientsResponse]);

  const pagination = useMemo(() => {
    return (
      clientsResponse?.pagination || {
        page: 1,
        limit: pageSize,
        total: 0,
        totalPages: 0,
      }
    );
  }, [clientsResponse]);

  // Statistics
  const clientStats = useMemo(() => {
    const totalClients = pagination.total;
    const activeClients = clients.filter(
      (client) => client.status === "ativo",
    ).length;
    const newThisMonth = clients.filter((client) => {
      const createdDate = new Date(client.created_at);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;
    const totalSpent = clients.reduce(
      (sum, client) => sum + (client.total_spent || 0),
      0,
    );

    return {
      total: totalClients,
      active: activeClients,
      inactive: totalClients - activeClients,
      newThisMonth,
      averageSpent: totalClients > 0 ? totalSpent / totalClients : 0,
    };
  }, [clients, pagination.total]);

  // Event handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
      } else {
        setSortBy(field);
        setSortOrder("ASC");
      }
      setCurrentPage(1);
    },
    [sortBy, sortOrder],
  );

  const handleCreateClient = useCallback(async () => {
    if (!newClientForm.name || !newClientForm.email || !newClientForm.phone) {
      toast({
        title: "Erro",
        description: "Nome, email e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createClientMutation.mutate({
        name: newClientForm.name,
        email: newClientForm.email,
        phone: newClientForm.phone,
        city: newClientForm.city,
        notes: newClientForm.notes,
        birth_date: newClientForm.birth_date || null,
        status: "ativo",
      });
    } catch (error) {
      console.error("Error creating client:", error);
    }
  }, [newClientForm, createClientMutation, toast]);

  const handleUpdateClient = useCallback(
    async (clientData: Partial<Client>) => {
      if (!selectedClient) return;

      try {
        await updateClientMutation.mutate({
          id: selectedClient.id,
          data: clientData,
        });
      } catch (error) {
        console.error("Error updating client:", error);
      }
    },
    [selectedClient, updateClientMutation],
  );

  const handleDeleteClient = useCallback(async () => {
    if (!selectedClient) return;

    try {
      await deleteClientMutation.mutate(selectedClient.id);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  }, [selectedClient, deleteClientMutation]);

  // Error state
  if (globalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar clientes
            </h2>
            <p className="text-gray-600 mb-4">{globalError}</p>
            <Button
              onClick={refetchClients}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              👥 Clientes
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie seus clientes com dados em tempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={refetchClients}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              Atualizar
            </Button>
            <Button
              onClick={() => setIsNewClientModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Clientes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clientStats.total}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {clientStats.active}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {clientStats.inactive}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Novos Este Mês
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {clientStats.newThisMonth}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ticket Médio
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(clientStats.averageSpent)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </Card>

        {/* Clients List */}
        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Tente ajustar os filtros para encontrar clientes"
                    : "Comece adicionando seu primeiro cliente"}
                </p>
                <Button
                  onClick={() => setIsNewClientModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-gray-700">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-left hover:text-gray-900"
                  >
                    Nome
                    {sortBy === "name" &&
                      (sortOrder === "ASC" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                  <span>Contato</span>
                  <span>Localização</span>
                  <span>Status</span>
                  <button
                    onClick={() => handleSort("total_spent")}
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    Total Gasto
                    {sortBy === "total_spent" &&
                      (sortOrder === "ASC" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                  <span>Ações</span>
                </div>

                {/* Client Rows */}
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cliente desde {formatDate(client.created_at)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-900">{client.email}</p>
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-900">
                        {client.city || "Não informado"}
                      </p>
                    </div>

                    <div>
                      <Badge
                        variant={
                          client.status === "ativo" ? "default" : "secondary"
                        }
                        className={
                          client.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {client.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(client.total_spent || 0)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {client.last_visit
                          ? `Último: ${formatDate(client.last_visit)}`
                          : "Primeira visita"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              de {pagination.total} clientes
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="px-4 py-2 text-sm">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Client Modal */}
      <Dialog
        open={isNewClientModalOpen}
        onOpenChange={setIsNewClientModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={newClientForm.name}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, name: e.target.value })
                }
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newClientForm.email}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, email: e.target.value })
                }
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newClientForm.phone}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={newClientForm.city}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, city: e.target.value })
                }
                placeholder="São Paulo"
              />
            </div>
            <div>
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={newClientForm.birth_date}
                onChange={(e) =>
                  setNewClientForm({
                    ...newClientForm,
                    birth_date: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={newClientForm.notes}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, notes: e.target.value })
                }
                placeholder="Anotações sobre o cliente..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsNewClientModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateClient}
              disabled={createClientMutation.isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createClientMutation.isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{selectedClient?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteClientMutation.isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BeautifulClientsProduction;
