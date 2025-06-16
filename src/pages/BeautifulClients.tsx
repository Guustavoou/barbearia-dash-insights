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

interface BeautifulClientsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  createdAt: string;
  lastVisit?: string;
  status: "ativo" | "inativo";
  totalSpent: number;
  visitCount: number;
  avgInterval: number;
  notes?: string;
  visits: Visit[];
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
  address: string;
  birthDate: string;
  notes: string;
  status: "ativo" | "inativo";
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  period: string;
  icon: React.ElementType;
  variant?: "primary" | "success" | "warning" | "danger";
  onCardClick?: () => void;
}

type SortField = "name" | "email" | "createdAt" | "lastVisit" | "totalSpent";

// Initial mock data
const initialClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123",
    birthDate: "1985-03-15",
    createdAt: "2023-01-15T10:00:00Z",
    lastVisit: "2024-01-10T14:30:00Z",
    status: "ativo",
    totalSpent: 1250,
    visitCount: 8,
    avgInterval: 15,
    notes: "Cliente preferencial",
    visits: [
      {
        id: "v1",
        date: "2024-01-10T14:30:00Z",
        service: "Corte + Barba",
        amount: 85,
        professional: "Carlos",
        rating: 5,
      },
      {
        id: "v2",
        date: "2023-12-20T16:00:00Z",
        service: "Corte",
        amount: 60,
        professional: "Ana",
        rating: 4,
      },
    ],
  },
  {
    id: "2",
    name: "Maria Costa",
    email: "maria.costa@email.com",
    phone: "(11) 88888-8888",
    address: "Av. Principal, 456",
    birthDate: "1990-07-22",
    createdAt: "2023-02-10T11:00:00Z",
    lastVisit: "2023-10-15T10:00:00Z",
    status: "inativo",
    totalSpent: 780,
    visitCount: 5,
    avgInterval: 30,
    visits: [
      {
        id: "v3",
        date: "2023-10-15T10:00:00Z",
        service: "Escova + Corte",
        amount: 120,
        professional: "Ana",
        rating: 5,
      },
    ],
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 77777-7777",
    createdAt: "2023-03-05T09:00:00Z",
    lastVisit: "2024-01-05T11:30:00Z",
    status: "ativo",
    totalSpent: 420,
    visitCount: 3,
    avgInterval: 45,
    visits: [],
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    phone: "(11) 66666-6666",
    address: "Rua do Sol, 789",
    birthDate: "1988-12-03",
    createdAt: "2023-04-20T15:00:00Z",
    lastVisit: "2024-01-08T13:00:00Z",
    status: "ativo",
    totalSpent: 950,
    visitCount: 6,
    avgInterval: 20,
    visits: [
      {
        id: "v4",
        date: "2024-01-08T13:00:00Z",
        service: "Manicure + Pedicure",
        amount: 80,
        professional: "Lucia",
        rating: 4,
      },
    ],
  },
];

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  period,
  icon: Icon,
  variant = "primary",
  onCardClick,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return "from-blue-600 to-blue-800";
      case "warning":
        return "from-slate-600 to-slate-700";
      case "danger":
        return "from-gray-600 to-gray-700";
      default:
        return "from-[#00112F] to-blue-700";
    }
  };

  return (
    <Card
      className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
      onClick={onCardClick}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getVariantColors()} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${getVariantColors()} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <Badge
              variant={change >= 0 ? "default" : "destructive"}
              className={cn(
                "text-xs font-medium px-2 py-1",
                change >= 0
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
              )}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-2xl text-[#00112F] dark:text-[#F9FAFB] group-hover:scale-105 transition-transform duration-300">
            {value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{period}</p>
        </div>
      </div>
    </Card>
  );
};

const ClientCard: React.FC<{
  client: Client;
  onUpdate: (client: Client) => void;
  onDelete: (clientId: string) => void;
}> = ({ client, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handlePhoneCall = useCallback(() => {
    const cleanPhone = client.phone.replace(/\D/g, "");
    window.open(`tel:+55${cleanPhone}`, "_self");
    toast({
      title: "📞 Ligação Iniciada",
      description: `Ligando para ${client.name}`,
    });
  }, [client.phone, client.name, toast]);

  const handleEmail = useCallback(() => {
    window.open(`mailto:${client.email}`, "_self");
    toast({
      title: "📧 Email Aberto",
      description: `Enviando email para ${client.name}`,
    });
  }, [client.email, client.name, toast]);

  const handleWhatsApp = useCallback(() => {
    const cleanPhone = client.phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Olá ${client.name}, aqui é da Unclic! Como posso ajudá-lo hoje?`;
    window.open(whatsappUrl, "_blank");
    toast({
      title: "💬 WhatsApp Aberto",
      description: `Conversando com ${client.name}`,
    });
  }, [client.phone, client.name, toast]);

  const handleDelete = useCallback(() => {
    onDelete(client.id);
    setShowDeleteDialog(false);
    toast({
      title: "🗑️ Cliente Removido",
      description: `${client.name} foi removido com sucesso`,
    });
  }, [client.id, client.name, onDelete, toast]);

  const daysSinceLastVisit = client.lastVisit
    ? Math.floor(
        (new Date().getTime() - new Date(client.lastVisit).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const getStatusColor = (status: string) => {
    return status === "ativo"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <>
      <Card className="group bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00112F] to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB] text-lg mb-1">
                  {client.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {client.email}
                </p>
                <Badge className={getStatusColor(client.status)}>
                  {client.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePhoneCall}>
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWhatsApp}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePhoneCall}
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Phone className="w-3 h-3 mr-1" />
              Ligar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              WhatsApp
            </Button>
          </div>

          {/* Métricas do Cliente */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {client.visitCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Visitas
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {formatCurrency(client.totalSpent)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Gasto Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB]">
                {daysSinceLastVisit !== null ? `${daysSinceLastVisit}d` : "N/A"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Última Visita
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {client.phone}
                </p>
                {client.address && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center">
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Cliente desde{" "}
                  {client.createdAt
                    ? formatDate(client.createdAt)
                    : "Data não informada"}
                </p>
                {client.lastVisit && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Última visita: {formatDate(client.lastVisit)}
                  </p>
                )}
              </div>
            </div>

            {/* Botão Expandir/Recolher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Menos detalhes
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Ver histórico
                </>
              )}
            </Button>

            {/* Seção Expandida */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                  Histórico de Visitas
                </h4>
                {client.visits && client.visits.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {client.visits.slice(0, 5).map((visit) => (
                      <div
                        key={visit.id}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm text-[#00112F] dark:text-[#F9FAFB]">
                            {visit.service}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(visit.date)} • {visit.professional}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                            {formatCurrency(visit.amount)}
                          </p>
                          {visit.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">
                                {visit.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Nenhuma visita registrada
                  </p>
                )}

                {/* Insights do Cliente */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <h5 className="font-medium text-[#00112F] dark:text-[#F9FAFB] mb-2">
                    📊 Insights
                  </h5>
                  <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <p>Frequência média: a cada {client.avgInterval} dias</p>
                    <p>
                      Ticket médio:{" "}
                      {formatCurrency(
                        client.totalSpent / (client.visitCount || 1),
                      )}
                    </p>
                    {daysSinceLastVisit !== null && daysSinceLastVisit > 90 && (
                      <p className="text-orange-600 dark:text-orange-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Cliente inativo (90+ dias sem visita)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de Edição */}
      {showEditModal && (
        <EditClientModal
          client={client}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente{" "}
              <strong>{client.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const NewClientModal: React.FC<{
  onClose: () => void;
  onSuccess: (client: Client) => void;
}> = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewClientForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    notes: "",
    status: "ativo",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      toast({
        title: "❌ Erro de Validação",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "❌ Erro de Validação",
        description: "Email válido é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "❌ Erro de Validação",
        description: "Telefone é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Criar novo cliente
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        birthDate: formData.birthDate || undefined,
        notes: formData.notes || undefined,
        createdAt: new Date().toISOString(),
        status: formData.status,
        totalSpent: 0,
        visitCount: 0,
        avgInterval: 0,
        visits: [],
      };

      onSuccess(newClient);
      onClose();

      toast({
        title: "✅ Cliente Cadastrado",
        description: `${formData.name} foi adicionado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Cadastrar",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Novo Cliente</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Ex: joao@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Ex: (11) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notas internas sobre o cliente..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "ativo" | "inativo",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-700 hover:to-[#00112F]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Cliente
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditClientModal: React.FC<{
  client: Client;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}> = ({ client, onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address || "",
    birthDate: client.birthDate || "",
    notes: client.notes || "",
    status: client.status,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedClient: Client = {
        ...client,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        birthDate: formData.birthDate || undefined,
        notes: formData.notes || undefined,
        status: formData.status,
      };

      onUpdate(updatedClient);
      onClose();

      toast({
        title: "✅ Cliente Atualizado",
        description: `${formData.name} foi atualizado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao Atualizar",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Editar Cliente: {client.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ativo" | "inativo",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#00112F] to-blue-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const BeautifulClients: React.FC<BeautifulClientsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  // Initialize clients from localStorage or use initialClients as fallback
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const savedClients = localStorage.getItem("unclic-clients");
      if (savedClients) {
        const parsedClients = JSON.parse(savedClients);
        console.log(
          "✅ Loaded clients from localStorage:",
          parsedClients.length,
          "clients",
        );
        return parsedClients;
      }
    } catch (error) {
      console.error("❌ Error loading clients from localStorage:", error);
    }
    console.log("ℹ️ Using initial clients:", initialClients.length, "clients");
    return initialClients;
  });

  // Track component mounting/unmounting
  useEffect(() => {
    console.log("🚀 BeautifulClients component mounted");

    return () => {
      console.log("💥 BeautifulClients component unmounted");
    };
  }, []);

  // Persist clients to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem("unclic-clients", JSON.stringify(clients));
      console.log(
        "✅ Clients saved to localStorage:",
        clients.length,
        "clients",
      );
    } catch (error) {
      console.error("❌ Error saving clients to localStorage:", error);
    }
  }, [clients]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Callbacks for CRUD operations
  const handleAddClient = useCallback((newClient: Client) => {
    console.log("➕ Adding new client:", newClient.name, newClient.id);
    setClients((prev) => {
      const updated = [newClient, ...prev];
      console.log("📊 Updated clients list:", updated.length, "clients");
      return updated;
    });
  }, []);

  const handleUpdateClient = useCallback((updatedClient: Client) => {
    console.log("✏️ Updating client:", updatedClient.name, updatedClient.id);
    setClients((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id ? updatedClient : client,
      ),
    );
  }, []);

  const handleDeleteClient = useCallback((clientId: string) => {
    console.log("🗑️ Deleting client:", clientId);
    setClients((prev) => prev.filter((client) => client.id !== clientId));
  }, []);

  // Calculate metrics with lógica de retenção real
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === "ativo").length;

    // Clientes novos nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = clients.filter((c) => {
      const created = new Date(c.createdAt);
      return created >= thirtyDaysAgo;
    }).length;

    // Taxa de retenção real: clientes com 2+ visitas nos últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const clientsWithMultipleVisits = clients.filter((c) => {
      const recentVisits = (c.visits || []).filter(
        (visit) => new Date(visit.date) >= sixMonthsAgo,
      );
      return recentVisits.length >= 2;
    }).length;

    const retentionRate =
      activeClients > 0
        ? Math.round((clientsWithMultipleVisits / activeClients) * 100)
        : 0;

    const totalRevenue = clients.reduce(
      (sum, c) => sum + (c.totalSpent || 0),
      0,
    );
    const avgTicket = totalClients > 0 ? totalRevenue / totalClients : 0;

    return {
      totalClients,
      activeClients,
      newThisMonth,
      retentionRate,
      totalRevenue,
      avgTicket,
    };
  }, [clients]);

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "todos" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "lastVisit":
          aValue = a.lastVisit ? new Date(a.lastVisit) : new Date(0);
          bValue = b.lastVisit ? new Date(b.lastVisit) : new Date(0);
          break;
        case "totalSpent":
          aValue = a.totalSpent || 0;
          bValue = b.totalSpent || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, statusFilter, sortField, sortDirection]);

  const handleRefreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Lista de clientes atualizada com sucesso",
      });
    }, 1000);
  }, [toast]);

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    toast({
      title: "📊 Preparando Exportação",
      description: "Gerando relatório de clientes...",
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const csvData = [
        ["Nome", "Email", "Telefone", "Status", "Total Gasto", "Última Visita"],
        ...filteredClients.map((client) => [
          client.name,
          client.email,
          client.phone,
          client.status,
          client.totalSpent.toString(),
          client.lastVisit ? formatDate(client.lastVisit) : "Nunca",
        ]),
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `clientes_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Exportação Concluída",
        description: `${filteredClients.length} clientes exportados com sucesso`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro na Exportação",
        description: "Erro ao gerar arquivo de exportação",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredClients, toast]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("todos");
    setSortField("name");
    setSortDirection("asc");
    toast({
      title: "🔄 Filtros Limpos",
      description: "Todos os filtros foram removidos",
    });
  }, [toast]);

  const handleResetData = useCallback(() => {
    setClients(initialClients);
    toast({
      title: "�� Dados Resetados",
      description: "Base de clientes restaurada para o estado inicial",
    });
  }, [toast]);

  const handleAddTestClient = useCallback(() => {
    const testClient: Client = {
      id: `test-${Date.now()}`,
      name: `Cliente Teste ${new Date().toLocaleTimeString()}`,
      email: `teste${Date.now()}@email.com`,
      phone: "(11) 99999-0000",
      address: "Rua de Teste, 123",
      createdAt: new Date().toISOString(),
      status: "ativo",
      totalSpent: 100,
      visitCount: 1,
      avgInterval: 30,
      visits: [],
    };
    handleAddClient(testClient);
    toast({
      title: "🧪 Cliente de Teste Adicionado",
      description: `${testClient.name} foi criado para teste`,
    });
  }, [handleAddClient, toast]);

  const handleDebugLocalStorage = useCallback(() => {
    try {
      const savedClients = localStorage.getItem("unclic-clients");
      console.log("🔍 LocalStorage Debug:");
      console.log("- Raw data:", savedClients);
      if (savedClients) {
        const parsed = JSON.parse(savedClients);
        console.log("- Parsed clients:", parsed);
        console.log("- Count:", parsed.length);
      } else {
        console.log("- No data found in localStorage");
      }
      console.log("- Current clients state:", clients);
      console.log("- Current clients count:", clients.length);
    } catch (error) {
      console.error("❌ Debug error:", error);
    }
  }, [clients]);

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-blue-50/30 to-slate-100/50 dark:from-[#0D1117] dark:via-[#00112F]/20 dark:to-slate-900/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#00112F]/10 to-blue-600/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-[#00112F]/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-[#00112F]/5 to-blue-700/5 rounded-full blur-2xl animate-pulse delay-2000" />

        {/* Sparkle Elements */}
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={cn(
              "absolute w-6 h-6 text-[#00112F]/20 dark:text-blue-400/20 animate-pulse",
              i === 0 && "top-1/4 left-1/4 delay-0",
              i === 1 && "top-3/4 right-1/4 delay-1000",
              i === 2 && "top-1/2 left-3/4 delay-2000",
              i === 3 && "bottom-1/4 left-1/2 delay-3000",
              i === 4 && "top-1/3 right-1/3 delay-4000",
              i === 5 && "bottom-1/3 left-1/5 delay-5000",
            )}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl rounded-2xl border-0 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00112F] via-blue-900 to-blue-800 opacity-95" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Clientes&nbsp;
                    </h1>
                    <p className="text-blue-100">
                      Gerencie sua base de clientes • {filteredClients.length}{" "}
                      clientes encontrados
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 mr-2",
                        isLoading && "animate-spin",
                      )}
                    />
                    Atualizar
                  </Button>
                  <Button
                    onClick={handleAddTestClient}
                    className="bg-green-500/20 hover:bg-green-500/30 text-white border-green-400/20 backdrop-blur-sm transition-all duration-300"
                    title="Adicionar cliente de teste"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Teste
                  </Button>
                  <Button
                    onClick={handleResetData}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
                    title="Resetar dados para o estado inicial"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <Download
                      className={cn(
                        "w-4 h-4 mr-2",
                        isExporting && "animate-spin",
                      )}
                    />
                    {isExporting ? "Exportando..." : "Exportar"}
                  </Button>
                  <Button
                    onClick={() => setShowNewClientModal(true)}
                    className="bg-white hover:bg-blue-50 text-[#00112F] shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </div>
              </div>
              <div className="text-sm text-blue-100">
                Última atualização: {formatDate(lastUpdate)} às{" "}
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Métricas de Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <KPICard
              title="Total de Clientes"
              value={metrics.totalClients}
              change={15}
              period="Base ativa"
              icon={Users}
              variant="primary"
              onCardClick={() => handleNavigate("clients")}
            />
            <KPICard
              title="Clientes Ativos"
              value={metrics.activeClients}
              change={8}
              period="Este mês"
              icon={UserCheck}
              variant="success"
            />
            <KPICard
              title="Novos Clientes"
              value={metrics.newThisMonth}
              change={22}
              period="Últimos 30 dias"
              icon={TrendingUp}
              variant="primary"
            />
            <KPICard
              title="Taxa de Retenção"
              value={`${metrics.retentionRate}%`}
              change={5}
              period="Últimos 6 meses"
              icon={Target}
              variant="warning"
            />
            <KPICard
              title="Receita Total"
              value={formatCurrency(metrics.totalRevenue)}
              change={12}
              period="Acumulado"
              icon={DollarSign}
              variant="success"
            />
            <KPICard
              title="Ticket Médio"
              value={formatCurrency(metrics.avgTicket)}
              change={-3}
              period="Por cliente"
              icon={CreditCard}
              variant="danger"
            />
          </div>
        </section>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-[#0D1117]/50 border-gray-200 dark:border-gray-700 focus:border-[#00112F] dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-[#0D1117]/50 border border-gray-200 dark:border-gray-700 text-[#00112F] dark:text-[#F9FAFB] focus:outline-none focus:border-[#00112F] dark:focus:border-blue-400"
                >
                  <option value="name">Ordenar por Nome</option>
                  <option value="email">Ordenar por Email</option>
                  <option value="createdAt">Ordenar por Data de Criação</option>
                  <option value="lastVisit">Ordenar por Última Visita</option>
                  <option value="totalSpent">Ordenar por Gasto Total</option>
                </select>
                {(searchTerm ||
                  statusFilter !== "todos" ||
                  sortField !== "name") && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Client List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
            <Users className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Lista de Clientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onUpdate={handleUpdateClient}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <Card className="bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-xl">
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB] mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || statusFilter !== "todos"
                    ? "Ajuste os filtros ou cadastre um novo cliente"
                    : "Cadastre seu primeiro cliente para começar"}
                </p>
                <Button
                  onClick={() => setShowNewClientModal(true)}
                  className="bg-gradient-to-r from-[#00112F] to-blue-700 hover:from-blue-700 hover:to-[#00112F] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {clients.length === 0
                    ? "Cadastrar Primeiro Cliente"
                    : "Novo Cliente"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Novo Cliente */}
      {showNewClientModal && (
        <NewClientModal
          onClose={() => setShowNewClientModal(false)}
          onSuccess={handleAddClient}
        />
      )}
    </div>
  );
};
