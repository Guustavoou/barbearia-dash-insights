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

export default function BeautifulServicesProduction({
  darkMode,
  onPageChange,
}: BeautifulServicesProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newServiceForm, setNewServiceForm] = useState<NewServiceForm>({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    commission_percentage: "",
  });

  // 🚀 PRODUCTION HOOKS - DADOS REAIS DO SUPABASE
  const {
    data: servicesData,
    isLoading,
    error,
    refetch: refetchServices,
  } = useServices();
  const globalLoading = useGlobalLoading();
  const globalError = useGlobalError();

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // Ensure we always have an array
  const services = Array.isArray(servicesData) ? servicesData : [];

  // Calculate statistics
  const serviceStats = useMemo(() => {
    const total = services.length;
    const active = services.filter((service) => service.is_active).length;
    const inactive = total - active;
    const averagePrice =
      services.length > 0
        ? services.reduce((sum, service) => sum + (service.price || 0), 0) /
          services.length
        : 0;
    const totalRevenue = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0,
    );

    return {
      total,
      active,
      inactive,
      averagePrice,
      totalRevenue,
    };
  }, [services]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = services.filter((service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case "duration":
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [services, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = services.map((service) => service.category).filter(Boolean);
    return [...new Set(cats)];
  }, [services]);

  const handleCreateService = useCallback(async () => {
    if (!newServiceForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do serviço é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await createServiceMutation.mutate({
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price) || 0,
        duration: parseInt(newServiceForm.duration) || 0,
        category: newServiceForm.category,
        commission_percentage:
          parseFloat(newServiceForm.commission_percentage) || 0,
        is_active: true,
      });

      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso!",
      });

      setIsNewServiceModalOpen(false);
      setNewServiceForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        commission_percentage: "",
      });
      refetchServices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar serviço",
        variant: "destructive",
      });
    }
  }, [newServiceForm, createServiceMutation, toast, refetchServices]);

  const handleEditService = useCallback(async (service: Service) => {
    setSelectedService(service);
    setNewServiceForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price?.toString() || "",
      duration: service.duration?.toString() || "",
      category: service.category || "",
      commission_percentage: service.commission_percentage?.toString() || "",
    });
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateService = useCallback(async () => {
    if (!selectedService) return;

    try {
      await updateServiceMutation.mutate({
        id: selectedService.id,
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price) || 0,
        duration: parseInt(newServiceForm.duration) || 0,
        category: newServiceForm.category,
        commission_percentage:
          parseFloat(newServiceForm.commission_percentage) || 0,
      });

      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!",
      });

      setIsEditModalOpen(false);
      setSelectedService(null);
      refetchServices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviço",
        variant: "destructive",
      });
    }
  }, [
    selectedService,
    newServiceForm,
    updateServiceMutation,
    toast,
    refetchServices,
  ]);

  const handleDeleteService = useCallback(async () => {
    if (!selectedService) return;

    try {
      await deleteServiceMutation.mutate(selectedService.id);

      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });

      setIsDeleteModalOpen(false);
      setSelectedService(null);
      refetchServices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir serviço",
        variant: "destructive",
      });
    }
  }, [selectedService, deleteServiceMutation, toast, refetchServices]);

  if (globalLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
      {/* Beautiful Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Scissors className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Serviços Premium
                  </h1>
                  <p className="text-blue-100">
                    Gerencie todos os serviços do seu estabelecimento
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={refetchServices}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                Atualizar
              </Button>
              <Button
                onClick={() => setIsNewServiceModalOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Serviços
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {serviceStats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#00112F] to-blue-600 rounded-xl text-white shadow-lg">
                <Scissors className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Catálogo completo
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Serviços Ativos
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {serviceStats.active}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Disponíveis
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Preço Médio
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {formatCurrency(serviceStats.averagePrice)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl text-white shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Target className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Por serviço
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {formatCurrency(serviceStats.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl text-white shadow-lg">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Sparkles className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Potencial
              </span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categorias
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {categories.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-800 to-[#00112F] rounded-xl text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Tag className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Organizadas
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="duration">Duração</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Mais Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Serviços */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              Catálogo de Serviços
              <Badge
                variant="secondary"
                className="ml-3 bg-[#00112F] text-white"
              >
                {filteredServices.length}
              </Badge>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-4">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {service.description || "Sem descrição"}
                      </p>
                      {service.category && (
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          service.is_active
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }
                      >
                        {service.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>

                  {/* Informações do Serviço */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Preço
                      </div>
                      <div className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                        {formatCurrency(service.price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Duração
                      </div>
                      <div className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                        {service.duration}min
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service)}
                      className="flex-1"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                Não há serviços que correspondam aos filtros aplicados.
              </p>
              <Button
                onClick={() => setIsNewServiceModalOpen(true)}
                className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* New Service Modal */}
      <Dialog
        open={isNewServiceModalOpen}
        onOpenChange={setIsNewServiceModalOpen}
      >
        <DialogContent className="max-w-md bg-white dark:bg-[#0D1117] border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#00112F] dark:text-[#F9FAFB]">
              Novo Serviço
            </DialogTitle>
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
                placeholder="Ex: Corte masculino"
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço</Label>
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
                <Label htmlFor="duration">Duração (min)</Label>
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
                  placeholder="30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={newServiceForm.category}
                onChange={(e) =>
                  setNewServiceForm({
                    ...newServiceForm,
                    category: e.target.value,
                  })
                }
                placeholder="Ex: Cabelo"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewServiceModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateService}
                className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
                disabled={createServiceMutation.isLoading}
              >
                {createServiceMutation.isLoading
                  ? "Criando..."
                  : "Criar Serviço"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#0D1117] border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#00112F] dark:text-[#F9FAFB]">
              Editar Serviço
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Serviço *</Label>
              <Input
                id="edit-name"
                value={newServiceForm.name}
                onChange={(e) =>
                  setNewServiceForm({ ...newServiceForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={newServiceForm.description}
                onChange={(e) =>
                  setNewServiceForm({
                    ...newServiceForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Preço</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={newServiceForm.price}
                  onChange={(e) =>
                    setNewServiceForm({
                      ...newServiceForm,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duração (min)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={newServiceForm.duration}
                  onChange={(e) =>
                    setNewServiceForm({
                      ...newServiceForm,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category">Categoria</Label>
              <Input
                id="edit-category"
                value={newServiceForm.category}
                onChange={(e) =>
                  setNewServiceForm({
                    ...newServiceForm,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateService}
                className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
                disabled={updateServiceMutation.isLoading}
              >
                {updateServiceMutation.isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#0D1117] border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#00112F] dark:text-[#F9FAFB]">
              Confirmar Exclusão
            </AlertDialogTitle>
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
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
