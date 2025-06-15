import React, { useState, useMemo } from "react";
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
  TrendingDown,
  Clock,
  Heart,
  Gift,
  MessageCircle,
  ExternalLink,
  Download,
  Sparkles,
  Target,
  Activity,
  UserCheck,
  Ban,
  RefreshCw,
  Eye,
  Zap,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/unclicUtils";
import { Client, ClientSortField, ClientSortOrder } from "@/lib/types";
import { clients as clientsMockData } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useApi";

interface BeautifulClientsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  target?: number;
  period: string;
  icon: React.ElementType;
  variant: "primary" | "success" | "warning" | "danger" | "info" | "premium";
  onCardClick?: () => void;
  navigateTo?: PageType;
  format?: "currency" | "percentage" | "number";
}

type StatusFilter = "todos" | "ativo" | "inativo";
type SortField = "name" | "email" | "createdAt" | "lastVisit";
type SortOrder = "asc" | "desc";

export const BeautifulClients: React.FC<BeautifulClientsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("todos");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
      toast({
        title: "✨ Cliente Criado",
        description: "Novo cliente adicionado com sucesso",
      });
    },
  });

  const updateClientMutation = useUpdateClient({
    onSuccess: () => {
      refetch();
      setEditingClient(null);
      toast({
        title: "✅ Cliente Atualizado",
        description: "Informações atualizadas com sucesso",
      });
    },
  });

  const deleteClientMutation = useDeleteClient({
    onSuccess: () => {
      refetch();
      toast({
        title: "🗑️ Cliente Removido",
        description: "Cliente removido com sucesso",
      });
    },
  });

  // Use API data or fallback to mock data
  const clients = apiResponse?.data || clientsMockData;
  const pagination = apiResponse?.pagination;

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(
      (c: any) => c.status === "ativo",
    ).length;
    const newThisMonth = clients.filter((c: any) => {
      const created = new Date(c.createdAt);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;

    const totalValue = clients.reduce(
      (sum: number, c: any) => sum + (c.totalSpent || 0),
      0,
    );
    const avgTicket = totalClients > 0 ? totalValue / totalClients : 0;
    const retentionRate =
      totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

    return {
      totalClients,
      activeClients,
      newThisMonth,
      avgTicket,
      retentionRate,
      totalValue,
    };
  }, [clients]);

  // Filter and sort clients
  const filteredClients = useMemo(() => {
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
    filtered.sort((a: Client, b: Client) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "lastVisit":
          aValue = a.lastVisit ? new Date(a.lastVisit) : new Date(0);
          bValue = b.lastVisit ? new Date(b.lastVisit) : new Date(0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, selectedStatus, sortBy, sortOrder]);

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
      toast({
        title: "Navegando",
        description: `Direcionando para ${page}`,
      });
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      refetch();
      toast({
        title: "✨ Dados Atualizados",
        description: "Lista de clientes atualizada com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório de clientes...",
    });
  };

  // Beautiful KPI Card Component usando paleta oficial
  const BeautifulKPICard: React.FC<KPICardProps> = ({
    title,
    value,
    change,
    target,
    period,
    icon: Icon,
    variant,
    onCardClick,
    navigateTo,
    format = "number",
  }) => {
    const isClickable = onCardClick || navigateTo;

    const formatValue = (val: string | number) => {
      if (format === "currency") return formatCurrency(Number(val));
      if (format === "percentage") return `${Number(val).toFixed(1)}%`;
      return val.toString();
    };

    // Paleta oficial da marca - apenas tons de azul e cinza
    const variantStyles = {
      primary: {
        gradient: "from-[#00112F]/10 via-[#00112F]/5 to-transparent",
        iconBg: "bg-gradient-to-br from-[#00112F] to-blue-800",
        accent: "bg-[#00112F]",
      },
      success: {
        gradient: "from-blue-600/10 via-blue-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-600 to-blue-700",
        accent: "bg-blue-600",
      },
      warning: {
        gradient: "from-gray-600/10 via-gray-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-gray-600 to-gray-700",
        accent: "bg-gray-600",
      },
      danger: {
        gradient: "from-slate-600/10 via-slate-600/5 to-transparent",
        iconBg: "bg-gradient-to-br from-slate-600 to-slate-700",
        accent: "bg-slate-600",
      },
      info: {
        gradient: "from-blue-700/10 via-blue-700/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-700 to-blue-800",
        accent: "bg-blue-700",
      },
      premium: {
        gradient: "from-[#00112F]/20 via-[#0D1117]/10 to-transparent",
        iconBg: "bg-gradient-to-br from-[#00112F] via-blue-900 to-[#0D1117]",
        accent: "bg-gradient-to-r from-[#00112F] to-blue-900",
      },
    };

    const style = variantStyles[variant];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-500 border-0 shadow-lg hover:shadow-xl",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl",
          isClickable &&
            "cursor-pointer hover:-translate-y-1 hover:scale-[1.02]",
        )}
        onClick={() => {
          if (onCardClick) onCardClick();
          if (navigateTo) handleNavigate(navigateTo);
        }}
      >
        {/* Animated gradient background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
            style.gradient,
            "group-hover:opacity-70",
          )}
        />

        {/* Glow effect on hover usando cores da marca */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00112F]/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  style.iconBg,
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {period}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {isClickable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-white/20"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-white/20"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onCardClick}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Target className="w-4 h-4 mr-2" />
                    Configurar meta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] leading-none tracking-tight">
              {formatValue(value)}
            </p>

            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    change >= 0
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
                  )}
                >
                  {change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change)}%
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs. período anterior
                </span>
              </div>
            )}
          </div>

          {target && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  Meta
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {Math.round(
                    (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={
                    (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                    100
                  }
                  className="h-1.5"
                />
                <div
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[#00112F] to-blue-600 rounded-full opacity-20 animate-pulse"
                  style={{
                    width: `${(Number(value.toString().replace(/[^\d]/g, "")) / target) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const BeautifulClientCard: React.FC<{ client: Client }> = ({ client }) => {
    const isExpanded = expandedClientId === client.id;
    const daysSinceLastVisit = client.lastVisit
      ? Math.floor(
          (new Date().getTime() - new Date(client.lastVisit).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    const statusStyles = {
      ativo: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400",
        border: "border-l-blue-500",
        dot: "bg-blue-500",
      },
      inativo: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400",
        border: "border-l-gray-500",
        dot: "bg-gray-500",
      },
    };

    const status = statusStyles[client.status as keyof typeof statusStyles];

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl cursor-pointer border-l-4",
          "bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117]",
          "hover:-translate-y-1 hover:scale-[1.02]",
          status.border,
        )}
        onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00112F] to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                    status.dot,
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {client.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {client.email}
                </p>
                {client.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {client.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn("text-xs border-0", status.bg)}
              >
                {client.status === "ativo" ? "Ativo" : "Inativo"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {client.appointmentHistory?.length || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Agendamentos
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {formatCurrency(client.totalSpent || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total gasto
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {daysSinceLastVisit !== null ? `${daysSinceLastVisit}d` : "N/A"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Última visita
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
              </Button>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingClient(client);
                }}
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo agendamento
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover cliente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Informações de Contato
                  </div>
                  {client.address && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-start">
                      <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                      {client.address}
                    </p>
                  )}
                  {client.birthDate && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Gift className="w-3 h-3 mr-1" />
                      {formatDate(client.birthDate)}
                    </p>
                  )}
                </div>
                <div>
                  <div className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Histórico
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cliente desde {formatDate(client.createdAt)}
                  </p>
                  {client.lastVisit && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Última visita: {formatDate(client.lastVisit)}
                    </p>
                  )}
                </div>
              </div>

              {client.notes && (
                <div>
                  <div className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-1">
                    Observações
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subtle hover glow usando cores da marca */}
        <div className="absolute inset-0 border border-[#00112F]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header - cores da marca */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Clientes Premium
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Gerencie sua base de clientes • {filteredClients.length}{" "}
                clientes encontrados
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowNewClientModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas de Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Total de Clientes"
              value={metrics.totalClients}
              change={15}
              period="Base ativa"
              icon={Users}
              variant="primary"
              onCardClick={() => handleNavigate("clients")}
              navigateTo="clients"
            />
            <BeautifulKPICard
              title="Clientes Ativos"
              value={metrics.activeClients}
              change={8}
              period="Status ativo"
              icon={UserCheck}
              variant="success"
            />
            <BeautifulKPICard
              title="Novos este Mês"
              value={metrics.newThisMonth}
              change={25}
              period="Clientes novos"
              icon={TrendingUp}
              variant="info"
            />
            <BeautifulKPICard
              title="Ticket Médio"
              value={metrics.avgTicket}
              change={5}
              period="Por cliente"
              icon={Target}
              variant="premium"
              format="currency"
            />
            <BeautifulKPICard
              title="Taxa Retenção"
              value={metrics.retentionRate}
              change={3}
              period="Últimos 6 meses"
              icon={Heart}
              variant="warning"
              format="percentage"
            />
            <BeautifulKPICard
              title="Valor Total"
              value={metrics.totalValue}
              change={12}
              period="Lifetime value"
              icon={Zap}
              variant="success"
              format="currency"
            />
          </div>
        </section>

        {/* Beautiful Filters */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#00112F] dark:text-blue-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB] placeholder-gray-500"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as StatusFilter)
                }
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="name">Ordenar por Nome</option>
                <option value="email">Ordenar por Email</option>
                <option value="createdAt">Ordenar por Data de Criação</option>
                <option value="lastVisit">Ordenar por Última Visita</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Beautiful Client List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <Users className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Lista de Clientes
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 animate-pulse bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="text-center">
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client: Client) => (
                <BeautifulClientCard key={client.id} client={client} />
              ))}
            </div>
          )}

          {!loading && filteredClients.length === 0 && (
            <Card className="p-12 text-center bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Não encontramos clientes com os filtros aplicados. Tente ajustar
                os critérios de busca.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("todos");
                }}
                className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white border-0"
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
