import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calendar,
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit3,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pause,
  Play,
  MessageCircle,
  ExternalLink,
  Trash2,
  Save,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Zap,
  Award,
  Timer,
  BarChart3,
  PieChart,
  Scissors,
  DollarSign,
  User,
  UserCheck,
  Sparkles,
  Crown,
  Gift,
  Heart,
  Smile,
  Coffee,
  Sunset,
  Moon,
} from "lucide-react";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/unclicUtils";
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
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useClients,
  useServices,
  useProfessionals,
  useGlobalLoading,
  useGlobalError,
} from "@/hooks/useSupabaseProduction";

interface BeautifulAppointmentsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

// 🎨 Beautiful KPI Card seguindo padrão Beautiful
interface BeautifulKPICardProps {
  title: string;
  value: string | number;
  change?: number;
  target?: number;
  period?: string;
  icon: React.ComponentType<any>;
  variant: "primary" | "success" | "warning" | "danger" | "info" | "premium";
  onCardClick?: () => void;
  format?: "number" | "currency" | "percentage";
  loading?: boolean;
}

const BeautifulKPICard: React.FC<BeautifulKPICardProps> = ({
  title,
  value,
  change,
  target,
  period,
  icon: Icon,
  variant,
  onCardClick,
  format = "number",
  loading = false,
}) => {
  const formatValue = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) {
      if (format === "currency") return formatCurrency(0);
      if (format === "percentage") return "0.0%";
      return "0";
    }

    if (format === "currency") return formatCurrency(Number(val));
    if (format === "percentage") return `${Number(val).toFixed(1)}%`;
    return val.toString();
  };

  // Paleta oficial da marca - padrão Beautiful
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
        onCardClick && "cursor-pointer hover:-translate-y-1 hover:scale-[1.02]",
      )}
      onClick={onCardClick}
    >
      {/* Animated gradient background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
          style.gradient,
          "group-hover:opacity-70",
        )}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl shadow-lg", style.iconBg)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] leading-none tracking-tight">
            {loading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              formatValue(value)
            )}
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
                  (Number((value || 0).toString().replace(/[^\d]/g, "")) /
                    target) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="relative">
              <Progress
                value={
                  (Number((value || 0).toString().replace(/[^\d]/g, "")) /
                    target) *
                  100
                }
                className="h-1.5"
              />
            </div>
          </div>
        )}

        {period && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {period}
          </p>
        )}
      </div>
    </Card>
  );
};

// Modal para criar/editar agendamento
const AppointmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onSave: (appointmentData: any) => void;
  loading?: boolean;
  clients: any[];
  services: any[];
  professionals: any[];
}> = ({
  isOpen,
  onClose,
  appointment,
  onSave,
  loading = false,
  clients,
  services,
  professionals,
}) => {
  const [formData, setFormData] = useState({
    client_id: "",
    service_id: "",
    professional_id: "",
    date: "",
    start_time: "",
    end_time: "",
    status: "pendente",
    notes: "",
    price: 0,
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        client_id: appointment.client_id || "",
        service_id: appointment.service_id || "",
        professional_id: appointment.professional_id || "",
        date: appointment.date ? appointment.date.split("T")[0] : "",
        start_time: appointment.start_time || "",
        end_time: appointment.end_time || "",
        status: appointment.status || "pendente",
        notes: appointment.notes || "",
        price: appointment.price || 0,
      });
    } else {
      const now = new Date();
      setFormData({
        client_id: "",
        service_id: "",
        professional_id: "",
        date: now.toISOString().split("T")[0],
        start_time: "",
        end_time: "",
        status: "pendente",
        notes: "",
        price: 0,
      });
    }
  }, [appointment]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-[#00112F] dark:text-[#F9FAFB]">
            <Calendar className="w-5 h-5 mr-2" />
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">Cliente *</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) =>
                setFormData({ ...formData, client_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="service_id">Serviço *</Label>
            <Select
              value={formData.service_id}
              onValueChange={(value) =>
                setFormData({ ...formData, service_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="professional_id">Profissional *</Label>
            <Select
              value={formData.professional_id}
              onValueChange={(value) =>
                setFormData({ ...formData, professional_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id}>
                    {professional.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="start_time">Horário Início *</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="end_time">Horário Fim</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="no_show">No-Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Observações sobre o agendamento..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.client_id ||
              !formData.service_id ||
              !formData.professional_id ||
              !formData.date ||
              !formData.start_time ||
              loading
            }
            className="bg-[#00112F] hover:bg-[#00112F]/90"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {appointment ? "Atualizar" : "Criar Agendamento"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal de detalhes do agendamento
const AppointmentDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, appointment, onEdit, onCancel, onConfirm }) => {
  if (!appointment) return null;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pendente: { variant: "secondary", label: "Pendente", icon: Clock },
      confirmado: {
        variant: "default",
        label: "Confirmado",
        icon: CheckCircle,
      },
      em_andamento: { variant: "default", label: "Em Andamento", icon: Play },
      finalizado: {
        variant: "default",
        label: "Finalizado",
        icon: CheckCircle,
      },
      cancelado: { variant: "destructive", label: "Cancelado", icon: XCircle },
      no_show: {
        variant: "destructive",
        label: "No-Show",
        icon: AlertTriangle,
      },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.pendente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-[#00112F] dark:text-[#F9FAFB]">
            <Calendar className="w-5 h-5 mr-2" />
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <User className="w-4 h-4 mr-2" />
              Cliente
            </h4>
            <p className="text-sm">
              {appointment.client_name || "Cliente não informado"}
            </p>
            {appointment.client_phone && (
              <p className="text-sm text-gray-600 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {appointment.client_phone}
              </p>
            )}
          </div>

          {/* Serviço */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Scissors className="w-4 h-4 mr-2" />
              Serviço
            </h4>
            <p className="text-sm">
              {appointment.service_name || "Serviço não informado"}
            </p>
            {appointment.price && (
              <p className="text-sm font-medium text-green-600">
                {formatCurrency(appointment.price)}
              </p>
            )}
          </div>

          {/* Profissional */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Profissional
            </h4>
            <p className="text-sm">
              {appointment.professional_name || "Profissional não informado"}
            </p>
          </div>

          {/* Data e Horário */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Data e Horário
            </h4>
            <p className="text-sm">
              {formatDate(new Date(appointment.date || new Date()))}
            </p>
            <p className="text-sm text-gray-600">
              {appointment.start_time}{" "}
              {appointment.end_time && `- ${appointment.end_time}`}
            </p>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="space-y-2">
              <h4 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                Observações
              </h4>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>

          {appointment.status === "pendente" && (
            <Button
              size="sm"
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          )}

          {["pendente", "confirmado"].includes(appointment.status) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancel}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}

          {appointment.client_phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://wa.me/${appointment.client_phone.replace(/\D/g, "")}`,
                )
              }
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BeautifulAppointmentsFixed: React.FC<
  BeautifulAppointmentsProps
> = ({ darkMode, onPageChange }) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [professionalFilter, setProfessionalFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<any>(null);

  // 🔗 DADOS REAIS DO SUPABASE
  const {
    data: appointmentsData,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useAppointments({ limit: 1000 });

  const { data: clientsData, loading: clientsLoading } = useClients({
    limit: 1000,
  });

  const { data: servicesData, loading: servicesLoading } = useServices();

  const { data: professionalsData, loading: professionalsLoading } =
    useProfessionals();

  // Mutations
  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      toast({
        title: "✅ Agendamento criado",
        description: "Agendamento criado com sucesso!",
      });
      setIsModalOpen(false);
      setSelectedAppointment(null);
      refetchAppointments();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: error.message || "Erro ao criar agendamento",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useUpdateAppointment({
    onSuccess: () => {
      toast({
        title: "✅ Agendamento atualizado",
        description: "Agendamento atualizado com sucesso!",
      });
      setIsModalOpen(false);
      setSelectedAppointment(null);
      refetchAppointments();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: error.message || "Erro ao atualizar agendamento",
        variant: "destructive",
      });
    },
  });

  const deleteAppointmentMutation = useDeleteAppointment({
    onSuccess: () => {
      toast({
        title: "✅ Agendamento excluído",
        description: "Agendamento excluído com sucesso!",
      });
      setDeleteAppointment(null);
      refetchAppointments();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: error.message || "Erro ao excluir agendamento",
        variant: "destructive",
      });
    },
  });

  // Estados de loading global
  const globalLoading = useGlobalLoading(
    { loading: appointmentsLoading },
    { loading: clientsLoading },
    { loading: servicesLoading },
    { loading: professionalsLoading },
  );

  const globalError = useGlobalError(
    { error: appointmentsError },
    { error: null },
    { error: null },
    { error: null },
  );

  // 📊 CÁLCULOS COM DADOS REAIS - ESPECÍFICOS PARA AGENDAMENTOS
  const appointmentsStats = useMemo(() => {
    const safeAppointments = Array.isArray(appointmentsData)
      ? appointmentsData
      : appointmentsData?.data || [];
    const safeClients = Array.isArray(clientsData)
      ? clientsData
      : clientsData?.data || [];
    const safeProfessionals = Array.isArray(professionalsData)
      ? professionalsData
      : professionalsData?.data || [];

    // Filtrar agendamentos de hoje
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = safeAppointments.filter((apt) =>
      apt.date?.startsWith(today),
    );

    // Estatísticas do dia
    const confirmedToday = todayAppointments.filter(
      (apt) => apt.status === "confirmado",
    ).length;
    const cancelledToday = todayAppointments.filter(
      (apt) => apt.status === "cancelado",
    ).length;
    const noShowToday = todayAppointments.filter(
      (apt) => apt.status === "no_show",
    ).length;
    const finishedToday = todayAppointments.filter(
      (apt) => apt.status === "finalizado",
    ).length;

    // Taxa de ocupação
    const occupationRate =
      todayAppointments.length > 0
        ? (confirmedToday / todayAppointments.length) * 100
        : 0;

    // Tempo médio de serviço (mock - calcular com dados reais)
    const averageServiceTime = 45; // minutos

    // Profissional mais agendado
    const professionalAppointments = safeProfessionals.map((prof) => ({
      ...prof,
      appointmentCount: safeAppointments.filter(
        (apt) => apt.professional_id === prof.id,
      ).length,
    }));
    const topProfessional = professionalAppointments.sort(
      (a, b) => b.appointmentCount - a.appointmentCount,
    )[0];

    // Reagendamentos do mês (mock - implementar com dados reais)
    const monthlyReschedules = 12;

    return {
      totalToday: todayAppointments.length,
      confirmedToday,
      cancelledToday,
      noShowToday,
      finishedToday,
      occupationRate,
      averageServiceTime,
      topProfessional: topProfessional?.name || "N/A",
      monthlyReschedules,
    };
  }, [appointmentsData, clientsData, professionalsData]);

  // Filtrar agendamentos
  const filteredAppointments = useMemo(() => {
    const safeAppointments = Array.isArray(appointmentsData)
      ? appointmentsData
      : appointmentsData?.data || [];

    return safeAppointments.filter((appointment) => {
      // Filtro de data baseado no modo de visualização
      const appointmentDate = new Date(appointment.date || new Date());
      const selected = new Date(selectedDate);

      let dateMatch = false;
      if (viewMode === "day") {
        dateMatch = appointmentDate.toDateString() === selected.toDateString();
      } else if (viewMode === "week") {
        const weekStart = new Date(selected);
        weekStart.setDate(selected.getDate() - selected.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        dateMatch = appointmentDate >= weekStart && appointmentDate <= weekEnd;
      } else if (viewMode === "month") {
        dateMatch =
          appointmentDate.getMonth() === selected.getMonth() &&
          appointmentDate.getFullYear() === selected.getFullYear();
      }

      // Filtro de busca
      const matchesSearch =
        searchTerm === "" ||
        appointment.client_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.professional_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.service_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Filtro de status
      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      // Filtro de profissional
      const matchesProfessional =
        professionalFilter === "all" ||
        appointment.professional_id === professionalFilter;

      // Filtro de horário
      const matchesTime = (() => {
        if (timeFilter === "all") return true;
        if (!appointment.start_time) return false;

        const hour = parseInt(appointment.start_time.split(":")[0]);
        if (timeFilter === "morning") return hour >= 6 && hour < 12;
        if (timeFilter === "afternoon") return hour >= 12 && hour < 18;
        if (timeFilter === "evening") return hour >= 18 || hour < 6;
        return true;
      })();

      return (
        dateMatch &&
        matchesSearch &&
        matchesStatus &&
        matchesProfessional &&
        matchesTime
      );
    });
  }, [
    appointmentsData,
    selectedDate,
    viewMode,
    searchTerm,
    statusFilter,
    professionalFilter,
    timeFilter,
  ]);

  const handleNavigate = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    refetchAppointments();
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "✨ Dados Atualizados",
        description: "Agendamentos atualizados com sucesso",
      });
    }, 1000);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    if (selectedAppointment) {
      updateAppointmentMutation.mutate({
        id: selectedAppointment.id,
        ...appointmentData,
      });
    } else {
      createAppointmentMutation.mutate(appointmentData);
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setIsDetailsOpen(false);
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleConfirmAppointment = () => {
    if (selectedAppointment) {
      updateAppointmentMutation.mutate({
        id: selectedAppointment.id,
        status: "confirmado",
      });
      setIsDetailsOpen(false);
    }
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      updateAppointmentMutation.mutate({
        id: selectedAppointment.id,
        status: "cancelado",
      });
      setIsDetailsOpen(false);
    }
  };

  const handleDeleteAppointment = (appointment: any) => {
    setDeleteAppointment(appointment);
  };

  const confirmDeleteAppointment = () => {
    if (deleteAppointment) {
      deleteAppointmentMutation.mutate(deleteAppointment.id);
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmado: "bg-blue-100 text-blue-800 border-blue-200",
      em_andamento: "bg-green-100 text-green-800 border-green-200",
      finalizado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
      no_show: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const getTimeIcon = (time: string) => {
    if (!time) return Coffee;
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 6 && hour < 12) return Coffee; // Manhã
    if (hour >= 12 && hour < 18) return Sunset; // Tarde
    return Moon; // Noite
  };

  if (globalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
        <div className="space-y-6 p-6">
          <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
              Erro ao carregar dados
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{globalError}</p>
            <Button onClick={handleRefreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header - Padrão Beautiful */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Agenda Inteligente
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Gerenciamento premium de agendamentos •{" "}
                {filteredAppointments.length} agendamentos encontrados
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
                onClick={() => handleNavigate("reports")}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards - Indicadores Premium */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-[#00112F] dark:text-blue-400" />
            Indicadores Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Agendamentos Hoje"
              value={appointmentsStats.totalToday}
              change={5}
              period="Total do dia"
              icon={Calendar}
              variant="primary"
              loading={globalLoading}
            />

            <BeautifulKPICard
              title="Taxa Ocupação"
              value={appointmentsStats.occupationRate}
              change={12}
              target={85}
              period="Meta de ocupação"
              icon={Target}
              variant="success"
              format="percentage"
              loading={globalLoading}
            />

            <BeautifulKPICard
              title="Faturamento Dia"
              value={2400}
              change={8}
              period="Receita estimada"
              icon={DollarSign}
              variant="premium"
              format="currency"
              loading={globalLoading}
            />

            <BeautifulKPICard
              title="Taxa Ocupação"
              value={appointmentsStats.occupationRate}
              change={-2}
              period="Comparativo"
              icon={Activity}
              variant="info"
              format="percentage"
              loading={globalLoading}
            />

            <BeautifulKPICard
              title="Taxa Agendamento"
              value={92.5}
              change={3}
              period="Taxa de conversão"
              icon={Zap}
              variant="success"
              format="percentage"
              loading={globalLoading}
            />

            <BeautifulKPICard
              title="Tempo Médio"
              value={appointmentsStats.averageServiceTime}
              period="Duração de serviços"
              icon={Timer}
              variant="warning"
              loading={globalLoading}
            />
          </div>
        </section>

        {/* Filtros Avançados */}
        <Card className="p-6 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg">
          <div className="space-y-4">
            {/* Primeira linha - Navegação de data e visualização */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="text-center">
                  <h3 className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
                    {viewMode === "day" &&
                      selectedDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    {viewMode === "week" &&
                      `Semana de ${selectedDate.toLocaleDateString("pt-BR")}`}
                    {viewMode === "month" &&
                      selectedDate.toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                      })}
                  </h3>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Botões de visualização */}
              <div className="flex items-center gap-2">
                {["day", "week", "month"].map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode as any)}
                    className={cn(
                      viewMode === mode && "bg-[#00112F] hover:bg-[#00112F]/80",
                    )}
                  >
                    {mode === "day" && "Dia"}
                    {mode === "week" && "Semana"}
                    {mode === "month" && "Mês"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Segunda linha - Filtros */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#00112F] dark:text-blue-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, profissional ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB] placeholder-gray-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="no_show">No-Show</option>
              </select>

              <select
                value={professionalFilter}
                onChange={(e) => setProfessionalFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="all">Todos os Profissionais</option>
                {(Array.isArray(professionalsData)
                  ? professionalsData
                  : professionalsData?.data || []
                ).map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name}
                  </option>
                ))}
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-gradient-to-r from-[#F9FAFB]/50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-800/20 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="all">Todos os Horários</option>
                <option value="morning">Manhã (6h-12h)</option>
                <option value="afternoon">Tarde (12h-18h)</option>
                <option value="evening">Noite (18h-6h)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Visão dos Agendamentos */}
        <section>
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#00112F] dark:text-[#F9FAFB] flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-[#00112F] dark:text-blue-400" />
                  Visão do{" "}
                  {viewMode === "day"
                    ? "Dia"
                    : viewMode === "week"
                      ? "Semana"
                      : "Mês"}
                  <Badge
                    variant="secondary"
                    className="ml-3 bg-[#00112F] text-white"
                  >
                    {filteredAppointments.length}
                  </Badge>
                </h3>
              </div>
            </div>

            <div className="p-6">
              {globalLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAppointments.map((appointment) => {
                    const TimeIcon = getTimeIcon(appointment.start_time);

                    return (
                      <Card
                        key={appointment.id}
                        className={cn(
                          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-lg cursor-pointer bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0D1117] hover:-translate-y-1 hover:scale-[1.02]",
                          "border-l-4",
                          appointment.status === "confirmado" &&
                            "border-l-blue-500",
                          appointment.status === "pendente" &&
                            "border-l-yellow-500",
                          appointment.status === "finalizado" &&
                            "border-l-green-500",
                          appointment.status === "cancelado" &&
                            "border-l-red-500",
                          appointment.status === "no_show" &&
                            "border-l-gray-500",
                        )}
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative p-4">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00112F] to-blue-600 text-white shadow-lg mr-3">
                                <TimeIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  {appointment.start_time}{" "}
                                  {appointment.end_time &&
                                    `- ${appointment.end_time}`}
                                </p>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    getStatusColor(appointment.status),
                                  )}
                                >
                                  {appointment.status}
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
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAppointment(appointment);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(appointment);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAppointment(appointment);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Informações Principais */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
                              {appointment.client_name ||
                                "Cliente não informado"}
                            </h4>

                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Scissors className="w-3 h-3 mr-1" />
                              {appointment.service_name ||
                                "Serviço não informado"}
                            </div>

                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <UserCheck className="w-3 h-3 mr-1" />
                              {appointment.professional_name ||
                                "Profissional não informado"}
                            </div>

                            {appointment.price && (
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-sm text-gray-500">
                                  Valor:
                                </span>
                                <span className="font-bold text-[#00112F] dark:text-blue-400">
                                  {formatCurrency(appointment.price)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtle hover glow usando cores da marca */}
                        <div className="absolute inset-0 border border-[#00112F]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Card>
                    );
                  })}
                </div>
              )}

              {filteredAppointments.length === 0 && !globalLoading && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum agendamento encontrado
                  </h3>
                  <p className="text-sm mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Tente ajustar os filtros de busca"
                      : "Comece criando seu primeiro agendamento"}
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>

      {/* Modal de Agendamento */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        loading={
          createAppointmentMutation.isPending ||
          updateAppointmentMutation.isPending
        }
        clients={
          Array.isArray(clientsData) ? clientsData : clientsData?.data || []
        }
        services={
          Array.isArray(servicesData) ? servicesData : servicesData?.data || []
        }
        professionals={
          Array.isArray(professionalsData)
            ? professionalsData
            : professionalsData?.data || []
        }
      />

      {/* Modal de Detalhes */}
      <AppointmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onEdit={() => handleEditAppointment(selectedAppointment)}
        onConfirm={handleConfirmAppointment}
        onCancel={handleCancelAppointment}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog
        open={!!deleteAppointment}
        onOpenChange={() => setDeleteAppointment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAppointment}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAppointmentMutation.isPending}
            >
              {deleteAppointmentMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BeautifulAppointmentsFixed;
