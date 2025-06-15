import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Phone,
  MessageCircle,
  DollarSign,
  Edit3,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Check,
  AlertTriangle,
  ChevronDown,
  Menu,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  CalendarDays,
  Target,
  UserCheck,
  Ban,
  RefreshCw,
  Download,
  ExternalLink,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";
import { useToast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface BeautifulAppointmentsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  initials: string;
  specialties: string[];
  workingDays: string[];
  workingHours: { start: string; end: string };
  isActive: boolean;
  rating: number;
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  professionalId: string;
  service: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: "confirmado" | "pendente" | "concluido" | "cancelado" | "faltou";
  notes?: string;
  products?: Product[];
  date: Date;
  priority: "high" | "medium" | "low";
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
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
  gradient?: { from: string; to: string };
}

type ViewType = "dia" | "semana" | "mes";

const professionals: Professional[] = [
  {
    id: "james",
    name: "James F.",
    avatar: "/api/placeholder/40/40",
    color: "bg-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    initials: "JF",
    specialties: ["Corte Masculino", "Barba"],
    workingDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    workingHours: { start: "08:00", end: "18:00" },
    isActive: true,
    rating: 4.9,
  },
  {
    id: "jack",
    name: "Jack C.",
    avatar: "/api/placeholder/40/40",
    color: "bg-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    initials: "JC",
    specialties: ["Coloração", "Tratamentos"],
    workingDays: ["Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    workingHours: { start: "09:00", end: "19:00" },
    isActive: true,
    rating: 4.8,
  },
  {
    id: "mike",
    name: "Mike D.",
    avatar: "/api/placeholder/40/40",
    color: "bg-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    initials: "MD",
    specialties: ["Degradê", "Barboterapia"],
    workingDays: ["Segunda", "Quarta", "Quinta", "Sexta", "Sábado"],
    workingHours: { start: "08:30", end: "17:30" },
    isActive: true,
    rating: 4.7,
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Lincoln Steffes",
    clientPhone: "(11) 99999-1234",
    professionalId: "james",
    service: "Corte + Barba Premium",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    price: 150,
    status: "confirmado",
    date: new Date(),
    priority: "high",
  },
  {
    id: "2",
    clientName: "Cameron Williamson",
    clientPhone: "(11) 99999-5678",
    professionalId: "jack",
    service: "Coloração Especial",
    startTime: "14:00",
    endTime: "16:00",
    duration: 120,
    price: 200,
    status: "pendente",
    date: new Date(),
    priority: "medium",
  },
  {
    id: "3",
    clientName: "Andrea McCoy",
    clientPhone: "(11) 99999-9012",
    professionalId: "mike",
    service: "Degradê Premium",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    price: 80,
    status: "concluido",
    date: new Date(Date.now() - 86400000),
    priority: "medium",
  },
  {
    id: "4",
    clientName: "Zain Dias",
    clientPhone: "(11) 99999-3456",
    professionalId: "james",
    service: "Barba Tradicional",
    startTime: "11:30",
    endTime: "12:00",
    duration: 30,
    price: 60,
    status: "confirmado",
    date: new Date(),
    priority: "low",
  },
];

export const BeautifulAppointments: React.FC<BeautifulAppointmentsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("dia");
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [isMobile, setIsMobile] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const today = new Date();
    const todayAppointments = appointments.filter(
      (apt) => apt.date.toDateString() === today.toDateString(),
    );

    const confirmedToday = todayAppointments.filter(
      (apt) => apt.status === "confirmado",
    );
    const confirmationRate =
      todayAppointments.length > 0
        ? (confirmedToday.length / todayAppointments.length) * 100
        : 0;

    const totalRevenue = appointments
      .filter((apt) => apt.status === "concluido")
      .reduce((sum, apt) => sum + apt.price, 0);

    const avgServiceTime =
      appointments.length > 0
        ? appointments.reduce((sum, apt) => sum + apt.duration, 0) /
          appointments.length
        : 0;

    const totalSlots = 20 * professionals.length;
    const occupiedSlots = todayAppointments.length;
    const occupancyRate =
      totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

    const cancelledCount = appointments.filter(
      (apt) => apt.status === "cancelado",
    ).length;
    const cancellationRate = (cancelledCount / appointments.length) * 100;

    return {
      todayAppointments: todayAppointments.length,
      confirmationRate,
      totalRevenue,
      avgServiceTime,
      occupancyRate,
      cancellationRate,
    };
  }, [appointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesProfessional =
        !selectedProfessional || apt.professionalId === selectedProfessional;
      const matchesStatus =
        statusFilter === "todos" || apt.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesProfessional && matchesStatus && matchesSearch;
    });
  }, [appointments, selectedProfessional, statusFilter, searchTerm]);

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
      toast({
        title: "✨ Dados Atualizados",
        description: "Agenda atualizada com sucesso",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "📊 Exportar Dados",
      description: "Preparando relatório personalizado...",
    });
  };

  // Beautiful KPI Card Component
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
    gradient,
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
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
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
                  vs. semana anterior
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (viewType === "dia") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewType === "semana") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1),
      );
    }

    setCurrentDate(newDate);
  };

  const handleNewAppointment = (appointmentData: any) => {
    const newAppointment: Appointment = {
      id: (appointments.length + 1).toString(),
      clientName: appointmentData.client.name,
      clientPhone: appointmentData.client.phone,
      professionalId: appointmentData.professional.id,
      service: appointmentData.service.name,
      startTime: appointmentData.time,
      endTime: appointmentData.time,
      duration: appointmentData.service.duration,
      price: appointmentData.service.price,
      status: "pendente",
      date: appointmentData.date,
      priority: "medium",
    };

    setAppointments([...appointments, newAppointment]);
    setShowNewAppointment(false);
    toast({
      title: "✨ Agendamento Criado",
      description: `Agendamento para ${appointmentData.client.name} criado com sucesso`,
    });
  };

  const BeautifulAppointmentCard: React.FC<{ appointment: Appointment }> = ({
    appointment,
  }) => {
    const professional = professionals.find(
      (p) => p.id === appointment.professionalId,
    );

    const priorityStyles = {
      high: "border-l-red-400 bg-red-50/50 dark:bg-red-900/10",
      medium: "border-l-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10",
      low: "border-l-green-400 bg-green-50/50 dark:bg-green-900/10",
    };

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl cursor-pointer border-l-4",
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900",
          "hover:-translate-y-1 hover:scale-[1.02]",
          priorityStyles[appointment.priority],
        )}
        onClick={() => {
          setSelectedAppointment(appointment);
          setShowSidebar(true);
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-3 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-[#00112F] dark:text-white truncate">
                  {appointment.clientName}
                </h4>
                {appointment.priority === "high" && (
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                {appointment.service}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs border-0 px-2.5 py-1 shadow-sm",
                appointment.status === "confirmado"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                  : appointment.status === "pendente"
                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400"
                    : appointment.status === "concluido"
                      ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400"
                      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400",
              )}
            >
              {appointment.status === "confirmado"
                ? "Confirmado"
                : appointment.status === "pendente"
                  ? "Pendente"
                  : appointment.status === "concluido"
                    ? "Concluído"
                    : appointment.status === "cancelado"
                      ? "Cancelado"
                      : "Faltou"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {appointment.startTime} - {appointment.endTime}
            </span>
            <span className="text-gray-300">•</span>
            <span>{appointment.duration}min</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "relative w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-sm",
                  `bg-gradient-to-br ${professional?.gradientFrom} ${professional?.gradientTo}`,
                )}
              >
                {professional?.initials}
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {professional?.name}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">
                    {professional?.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#00112F] dark:text-white text-sm">
                {formatCurrency(appointment.price)}
              </span>
              <div className="text-xs text-gray-500">
                {appointment.duration}min
              </div>
            </div>
          </div>
        </div>

        {/* Subtle hover glow */}
        <div className="absolute inset-0 border border-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  };

  const BeautifulProfessionalCard: React.FC<{ professional: Professional }> = ({
    professional,
  }) => {
    const todayAppointments = filteredAppointments.filter(
      (apt) =>
        apt.professionalId === professional.id &&
        apt.date.toDateString() === currentDate.toDateString(),
    );

    return (
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div
          className={cn(
            "p-4 bg-gradient-to-br relative",
            `${professional.gradientFrom} ${professional.gradientTo}`,
            "text-white",
          )}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg",
                    "bg-white/20 backdrop-blur-sm border border-white/30",
                  )}
                >
                  {professional.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {professional.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-white/90 text-sm">
                    {professional.workingHours.start} -{" "}
                    {professional.workingHours.end}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    <span className="text-white/90 text-sm font-medium">
                      {professional.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {todayAppointments.length}
              </div>
              <div className="text-white/80 text-xs uppercase tracking-wide">
                Agendamentos
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-2 max-h-80 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <BeautifulAppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium">Nenhum agendamento</p>
              <p className="text-xs mt-1 text-gray-400">
                Dia livre para relaxar ✨
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20">
      <div className="space-y-6 p-6">
        {/* Beautiful Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 p-8 text-white shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Agenda Inteligente
                </h1>
              </div>
              <p className="text-blue-200 text-lg">
                Gerenciamento premium de agendamentos • Atualizado às{" "}
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button
                size="sm"
                onClick={handleExportData}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowNewAppointment(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>

        {/* Beautiful KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-500" />
            Indicadores Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <BeautifulKPICard
              title="Agendamentos Hoje"
              value={metrics.todayAppointments}
              change={7}
              period="Hoje"
              icon={CalendarDays}
              variant="primary"
              onCardClick={() => handleNavigate("appointments")}
              navigateTo="appointments"
            />
            <BeautifulKPICard
              title="Taxa Confirmação"
              value={metrics.confirmationRate}
              change={5}
              period="Percentual"
              icon={UserCheck}
              variant="success"
              format="percentage"
            />
            <BeautifulKPICard
              title="Faturamento"
              value={metrics.totalRevenue}
              change={12}
              target={50000}
              period="Meta: R$ 50.000"
              icon={DollarSign}
              variant="premium"
              format="currency"
              onCardClick={() => handleNavigate("financial")}
              navigateTo="financial"
            />
            <BeautifulKPICard
              title="Taxa Ocupação"
              value={metrics.occupancyRate}
              change={-2}
              period="Slots preenchidos"
              icon={Activity}
              variant="info"
              format="percentage"
            />
            <BeautifulKPICard
              title="Taxa Cancelamento"
              value={metrics.cancellationRate}
              change={-1.5}
              period="Últimos 30 dias"
              icon={Ban}
              variant="warning"
              format="percentage"
            />
            <BeautifulKPICard
              title="Tempo Médio"
              value={Math.round(metrics.avgServiceTime)}
              period="Minutos por serviço"
              icon={Clock}
              variant="info"
            />
          </div>
        </section>

        {/* Beautiful Controls */}
        <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="min-w-0 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                  <h2 className="font-bold text-[#00112F] dark:text-white">
                    {viewType === "mes"
                      ? currentDate.toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      : formatDate(currentDate)}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("next")}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* View Type Selector */}
              <Tabs
                value={viewType}
                onValueChange={(value) => setViewType(value as ViewType)}
              >
                <TabsList className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                  <TabsTrigger value="dia">Dia</TabsTrigger>
                  <TabsTrigger value="semana">Semana</TabsTrigger>
                  <TabsTrigger value="mes">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Beautiful Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 text-[#00112F] dark:text-white placeholder-gray-500"
                />
              </div>

              <select
                value={selectedProfessional || "todos"}
                onChange={(e) =>
                  setSelectedProfessional(
                    e.target.value === "todos" ? null : e.target.value,
                  )
                }
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 text-[#00112F] dark:text-white"
              >
                <option value="todos">Todos os Profissionais</option>
                {professionals.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 text-[#00112F] dark:text-white"
              >
                <option value="todos">Todos os Status</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Beautiful Main Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00112F] dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Visão do Dia
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(selectedProfessional
              ? professionals.filter((p) => p.id === selectedProfessional)
              : professionals
            ).map((professional) => (
              <BeautifulProfessionalCard
                key={professional.id}
                professional={professional}
              />
            ))}
          </div>
        </div>

        {/* New Appointment Modal */}
        <NewAppointmentModal
          isOpen={showNewAppointment}
          onClose={() => setShowNewAppointment(false)}
          onSave={handleNewAppointment}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};
