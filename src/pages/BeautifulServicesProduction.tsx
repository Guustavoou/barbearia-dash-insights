import React, { useState, useMemo, useCallback } from "react";
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  Star,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  MoreHorizontal,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Tag,
  Users,
  Calendar,
  Target,
  Zap,
  Heart,
} from "lucide-react";
import { cn, formatCurrency, formatTime } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useGlobalLoading,
  useGlobalError,
} from "@/hooks/useSupabaseProduction";

interface BeautifulServicesProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  is_active: boolean;
  image_url?: string;
  commission_percentage?: number;
  created_at: string;
  updated_at: string;
}

interface NewServiceForm {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  commission_percentage: string;
}

const CATEGORIES = [
  { value: "corte", label: "Corte", icon: "✂️" },
  { value: "coloracao", label: "Coloração", icon: "🎨" },
  { value: "tratamento", label: "Tratamento", icon: "💆" },
  { value: "escova", label: "Escova", icon: "💨" },
  { value: "barba", label: "Barba", icon: "🧔" },
  { value: "sobrancelha", label: "Sobrancelha", icon: "👁️" },
  { value: "manicure", label: "Manicure", icon: "💅" },
  { value: "depilacao", label: "Depilação", icon: "🪒" },
  { value: "massagem", label: "Massagem", icon: "🤲" },
  { value: "outros", label: "Outros", icon: "🌟" },
];

export const BeautifulServicesProduction: React.FC<BeautifulServicesProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [newServiceForm, setNewServiceForm] = useState<NewServiceForm>({
    name: "",
    description: "",
    price: "",
    duration: "60",
    category: "corte",
    commission_percentage: "10",
  });

  // 🚀 DADOS REAIS DO SUPABASE - SEM MOCKS
  const {
    data: services,
    loading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useServices({
    category: categoryFilter === "all" ? undefined : categoryFilter,
    active: statusFilter === "all" ? undefined : statusFilter === "active",
  });

  // Mutations
  const createServiceMutation = useCreateService({
    onSuccess: () => {
      setIsNewServiceModalOpen(false);
      setNewServiceForm({
        name: "",
        description: "",
        price: "",
        duration: "60",
        category: "corte",
        commission_percentage: "10",
      });
      refetchServices();
    },
  });

  const updateServiceMutation = useUpdateService({
    onSuccess: () => {
      setIsEditModalOpen(false);
      setSelectedService(null);
      refetchServices();
    },
  });

  const deleteServiceMutation = useDeleteService({
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      refetchServices();
    },
  });

  // Global states
  const isLoading = useGlobalLoading(
    { loading: servicesLoading },
    { loading: createServiceMutation.isLoading },
    { loading: updateServiceMutation.isLoading },
    { loading: deleteServiceMutation.isLoading },
  );

  const globalError = useGlobalError({ error: servicesError });

  // Filtered services
  const filteredServices = useMemo(() => {
    if (!services) return [];

    return services.filter((service) => {
      const matchesSearch =
        !searchTerm ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.is_active) ||
        (statusFilter === "inactive" && !service.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const serviceStats = useMemo(() => {
    if (!services) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        averagePrice: 0,
        averageDuration: 0,
      };
    }

    const total = services.length;
    const active = services.filter((s) => s.is_active).length;
    const inactive = total - active;
    const averagePrice =
      total > 0 ? services.reduce((sum, s) => sum + s.price, 0) / total : 0;
    const averageDuration =
      total > 0 ? services.reduce((sum, s) => sum + s.duration, 0) / total : 0;

    return {
      total,
      active,
      inactive,
      averagePrice,
      averageDuration,
    };
  }, [services]);

  // Event handlers
  const handleCreateService = useCallback(async () => {
    if (!newServiceForm.name || !newServiceForm.price) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await createServiceMutation.mutate({
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price),
        duration: parseInt(newServiceForm.duration),
        category: newServiceForm.category,
        commission_percentage: parseFloat(newServiceForm.commission_percentage),
        is_active: true,
      });
    } catch (error) {
      console.error("Error creating service:", error);
    }
  }, [newServiceForm, createServiceMutation, toast]);

  const handleUpdateService = useCallback(
    async (serviceData: Partial<Service>) => {
      if (!selectedService) return;

      try {
        await updateServiceMutation.mutate({
          id: selectedService.id,
          data: serviceData,
        });
      } catch (error) {
        console.error("Error updating service:", error);
      }
    },
    [selectedService, updateServiceMutation],
  );

  const handleDeleteService = useCallback(async () => {
    if (!selectedService) return;

    try {
      await deleteServiceMutation.mutate(selectedService.id);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }, [selectedService, deleteServiceMutation]);

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find((cat) => cat.value === category) || CATEGORIES[0];
  };

  // Error state
  if (globalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar serviços
            </h2>
            <p className="text-gray-600 mb-4">{globalError}</p>
            <Button
              onClick={refetchServices}
              className="bg-purple-600 hover:bg-purple-700"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ✂️ Serviços
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie todos os serviços do seu estabelecimento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={refetchServices}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              Atualizar
            </Button>
            <Button
              onClick={() => setIsNewServiceModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Serviço
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
                    Total de Serviços
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serviceStats.total}
                  </p>
                </div>
                <Scissors className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {serviceStats.active}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {serviceStats.inactive}
                  </p>
                </div>
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Preço Médio
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(serviceStats.averagePrice)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Duração Média
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(serviceStats.averageDuration)}min
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
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
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-md bg-white/70 backdrop-blur-sm"
              >
                <div className="p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </Card>
            ))
          ) : filteredServices.length === 0 ? (
            <Card className="col-span-full border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <div className="p-12 text-center">
                <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ||
                  categoryFilter !== "all" ||
                  statusFilter !== "all"
                    ? "Tente ajustar os filtros para encontrar serviços"
                    : "Comece adicionando seu primeiro serviço"}
                </p>
                <Button
                  onClick={() => setIsNewServiceModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </div>
            </Card>
          ) : (
            filteredServices.map((service) => {
              const categoryInfo = getCategoryInfo(
                service.category || "outros",
              );

              return (
                <Card
                  key={service.id}
                  className="border-0 shadow-md bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{categoryInfo.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {service.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              service.is_active
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200",
                            )}
                          >
                            {service.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <MoreHorizontal className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium text-gray-900">
                          {categoryInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duração:</span>
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration}min
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Preço:</span>
                        <span className="font-bold text-purple-600 text-lg">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                      {service.commission_percentage && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Comissão:</span>
                          <span className="font-medium text-gray-900">
                            {service.commission_percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedService(service);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedService(service);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* New Service Modal */}
      <Dialog
        open={isNewServiceModalOpen}
        onOpenChange={setIsNewServiceModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={newServiceForm.name}
                onChange={(e) =>
                  setNewServiceForm({ ...newServiceForm, name: e.target.value })
                }
                placeholder="Ex: Corte Feminino"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newServiceForm.description}
                onChange={(e) =>
                  setNewServiceForm({
                    ...newServiceForm,
                    description: e.target.value,
                  })
                }
                placeholder="Descrição do serviço..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newServiceForm.price}
                  onChange={(e) =>
                    setNewServiceForm({
                      ...newServiceForm,
                      price: e.target.value,
                    })
                  }
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newServiceForm.duration}
                  onChange={(e) =>
                    setNewServiceForm({
                      ...newServiceForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="60"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newServiceForm.category}
                onValueChange={(value) =>
                  setNewServiceForm({ ...newServiceForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="commission">Comissão (%)</Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                value={newServiceForm.commission_percentage}
                onChange={(e) =>
                  setNewServiceForm({
                    ...newServiceForm,
                    commission_percentage: e.target.value,
                  })
                }
                placeholder="10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsNewServiceModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateService}
              disabled={createServiceMutation.isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {createServiceMutation.isLoading ? (
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
              Tem certeza que deseja excluir o serviço "{selectedService?.name}
              "? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteServiceMutation.isLoading ? (
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

export default BeautifulServicesProduction;
