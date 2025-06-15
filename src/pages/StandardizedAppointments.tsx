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

interface StandardizedAppointmentsProps {
  darkMode: boolean;
  onPageChange?: (page: PageType) => void;
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  color: string;
  initials: string;
  specialties: string[];
  workingDays: string[];
  workingHours: { start: string; end: string };
  isActive: boolean;
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
  variant: "primary" | "success" | "warning" | "danger" | "info";
  onCardClick?: () => void;
  navigateTo?: PageType;
  format?: "currency" | "percentage" | "number";
}

type ViewType = "dia" | "semana" | "mes";

const professionals: Professional[] = [
  {
    id: "james",
    name: "James F.",
    avatar: "/api/placeholder/40/40",
    color: "bg-blue-500",
    initials: "JF",
    specialties: ["Corte Masculino", "Barba"],
    workingDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    workingHours: { start: "08:00", end: "18:00" },
    isActive: true,
  },
  {
    id: "jack",
    name: "Jack C.",
    avatar: "/api/placeholder/40/40",
    color: "bg-purple-500",
    initials: "JC",
    specialties: ["Coloração", "Tratamentos"],
    workingDays: ["Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    workingHours: { start: "09:00", end: "19:00" },
    isActive: true,
  },
  {
    id: "mike",
    name: "Mike D.",
    avatar: "/api/placeholder/40/40",
    color: "bg-green-500",
    initials: "MD",
    specialties: ["Degradê", "Barboterapia"],
    workingDays: ["Segunda", "Quarta", "Quinta", "Sexta", "Sábado"],
    workingHours: { start: "08:30", end: "17:30" },
    isActive: true,
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Lincoln Steffes",
    clientPhone: "(11) 99999-1234",
    professionalId: "james",
    service: "Corte + Barba",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    price: 150,
    status: "confirmado",
    date: new Date(),
  },
  {
    id: "2",
    clientName: "Cameron Williamson",
    clientPhone: "(11) 99999-5678",
    professionalId: "jack",
    service: "Coloração",
    startTime: "14:00",
    endTime: "16:00",
    duration: 120,
    price: 200,
    status: "pendente",
    date: new Date(),
  },
  {
    id: "3",
    clientName: "Andrea McCoy",
    clientPhone: "(11) 99999-9012",
    professionalId: "mike",
    service: "Degradê",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    price: 80,
    status: "concluido",
    date: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    clientName: "Zain Dias",
    clientPhone: "(11) 99999-3456",
    professionalId: "james",
    service: "Barba",
    startTime: "11:30",
    endTime: "12:00",
    duration: 30,
    price: 60,
    status: "confirmado",
    date: new Date(),
  },
  {
    id: "5",
    clientName: "Maria Silva",
    clientPhone: "(11) 99999-7890",
    professionalId: "jack",
    service: "Escova",
    startTime: "15:00",
    endTime: "16:30",
    duration: 90,
    price: 120,
    status: "pendente",
    date: new Date(Date.now() + 86400000), // Tomorrow
  },
];

export const StandardizedAppointments: React.FC<
  StandardizedAppointmentsProps
> = ({ darkMode, onPageChange }) => {
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

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate metrics using same pattern as dashboard
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

    const serviceCount = appointments.reduce(
      (acc, apt) => {
        acc[apt.service] = (acc[apt.service] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalSlots = 20 * professionals.length; // 20 slots per professional
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

  // Navigation handlers (same pattern as dashboard)
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
    setLastUpdate(new Date());
    toast({
      title: "Dados Atualizados",
      description: "Agenda atualizada com sucesso",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportar Dados",
      description: "Função de exportação será implementada",
    });
  };

  // KPI Card Component (same style as dashboard)
  const KPICard: React.FC<KPICardProps> = ({
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
    const variantStyles = {
      primary: {
        bg: "bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D1117] dark:to-[#00112F]/50",
        border: "border-[#00112F]/10 dark:border-[#F9FAFB]/20",
        icon: "text-[#00112F] dark:text-[#F9FAFB]",
        accent: "bg-[#00112F]",
        iconBg: "bg-[#00112F]/5 dark:bg-[#F9FAFB]/10",
      },
      success: {
        bg: "bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D1117] dark:to-[#00112F]/50",
        border: "border-[#00112F]/15 dark:border-[#F9FAFB]/25",
        icon: "text-[#00112F] dark:text-[#F9FAFB]",
        accent: "bg-[#00112F]",
        iconBg: "bg-[#00112F]/8 dark:bg-[#F9FAFB]/15",
      },
      warning: {
        bg: "bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D1117] dark:to-[#00112F]/50",
        border: "border-[#00112F]/12 dark:border-[#F9FAFB]/22",
        icon: "text-[#00112F]/80 dark:text-[#F9FAFB]/90",
        accent: "bg-[#00112F]/80",
        iconBg: "bg-[#00112F]/6 dark:bg-[#F9FAFB]/12",
      },
      danger: {
        bg: "bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D1117] dark:to-[#00112F]/50",
        border: "border-[#00112F]/18 dark:border-[#F9FAFB]/28",
        icon: "text-[#00112F]/90 dark:text-[#F9FAFB]/95",
        accent: "bg-[#00112F]/90",
        iconBg: "bg-[#00112F]/10 dark:bg-[#F9FAFB]/18",
      },
      info: {
        bg: "bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D1117] dark:to-[#00112F]/50",
        border: "border-[#00112F]/8 dark:border-[#F9FAFB]/18",
        icon: "text-[#00112F]/70 dark:text-[#F9FAFB]/80",
        accent: "bg-[#00112F]/70",
        iconBg: "bg-[#00112F]/4 dark:bg-[#F9FAFB]/8",
      },
    };

    const style = variantStyles[variant];
    const isClickable = onCardClick || navigateTo;

    const formatValue = (val: string | number) => {
      if (format === "currency") return formatCurrency(Number(val));
      if (format === "percentage") return `${Number(val).toFixed(1)}%`;
      return val.toString();
    };

    return (
      <Card
        className={cn(
          "p-6 border-2 transition-all duration-300 group relative overflow-hidden",
          style.bg,
          style.border,
          isClickable
            ? "hover:shadow-lg cursor-pointer hover:scale-105"
            : "hover:shadow-md",
        )}
        onClick={onCardClick}
      >
        <div
          className={cn(
            "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 dark:opacity-10",
            style.accent,
          )}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", style.iconBg)}>
                <Icon className={cn("w-6 h-6", style.icon)} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                  {title}
                </h3>
                <p className="text-xs text-[#00112F]/50 dark:text-[#F9FAFB]/60">
                  {period}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isClickable && (
                <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
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
                  <DropdownMenuItem onClick={onCardClick}>
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>Exportar dados</DropdownMenuItem>
                  <DropdownMenuItem>Configurar meta</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB] mb-1">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <Badge
                  variant={change >= 0 ? "default" : "destructive"}
                  className={cn(
                    "text-xs",
                    change >= 0
                      ? "bg-[#00112F]/10 text-[#00112F] dark:bg-[#F9FAFB]/20 dark:text-[#F9FAFB]"
                      : "bg-[#00112F]/15 text-[#00112F] dark:bg-[#F9FAFB]/25 dark:text-[#F9FAFB]",
                  )}
                >
                  {change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change)}%
                </Badge>
                <span className="text-xs text-[#00112F]/50 dark:text-[#F9FAFB]/60">
                  vs. semana anterior
                </span>
              </div>
            )}
          </div>

          {target && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#00112F]/60 dark:text-[#F9FAFB]/70">
                <span>Progresso</span>
                <span>
                  {Math.round(
                    (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                      100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (Number(value.toString().replace(/[^\d]/g, "")) / target) *
                  100
                }
                className="h-2"
              />
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
    };

    setAppointments([...appointments, newAppointment]);
    setShowNewAppointment(false);
    toast({
      title: "Agendamento Criado",
      description: `Agendamento para ${appointmentData.client.name} criado com sucesso`,
    });
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({
    appointment,
  }) => {
    const professional = professionals.find(
      (p) => p.id === appointment.professionalId,
    );

    return (
      <Card
        className="p-4 transition-all duration-300 hover:shadow-md cursor-pointer border-l-4 border-l-[#00112F] group bg-white dark:bg-[#0D1117] border-[#00112F]/10 dark:border-[#F9FAFB]/20"
        onClick={() => {
          setSelectedAppointment(appointment);
          setShowSidebar(true);
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
              {appointment.clientName}
            </span>
            <Badge
              variant={
                appointment.status === "confirmado"
                  ? "default"
                  : appointment.status === "pendente"
                    ? "secondary"
                    : appointment.status === "concluido"
                      ? "outline"
                      : "destructive"
              }
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

          <div className="text-sm text-[#00112F]/70 dark:text-[#F9FAFB]/80">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4" />
              <span>
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>
            <div>{appointment.service}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium",
                  professional?.color,
                )}
              >
                {professional?.initials}
              </div>
              <span className="text-sm text-[#00112F]/60 dark:text-[#F9FAFB]/70">
                {professional?.name}
              </span>
            </div>
            <span className="font-bold text-[#00112F] dark:text-[#F9FAFB]">
              {formatCurrency(appointment.price)}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  const DayView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(selectedProfessional
          ? professionals.filter((p) => p.id === selectedProfessional)
          : professionals
        ).map((professional) => (
          <Card key={professional.id} className="overflow-hidden">
            <div className="p-4 bg-[#F9FAFB] dark:bg-[#0D1117] border-b border-[#00112F]/10 dark:border-[#F9FAFB]/20">
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium",
                    professional.color,
                  )}
                >
                  {professional.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                    {professional.name}
                  </h3>
                  <p className="text-sm text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    {professional.workingHours.start} -{" "}
                    {professional.workingHours.end}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {filteredAppointments
                .filter((apt) => apt.professionalId === professional.id)
                .filter(
                  (apt) =>
                    apt.date.toDateString() === currentDate.toDateString(),
                )
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}

              {filteredAppointments
                .filter((apt) => apt.professionalId === professional.id)
                .filter(
                  (apt) =>
                    apt.date.toDateString() === currentDate.toDateString(),
                ).length === 0 && (
                <div className="text-center py-8 text-[#00112F]/60 dark:text-[#F9FAFB]/70">
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 text-[#00112F]/40 dark:text-[#F9FAFB]/50" />
                  <p className="text-sm">Nenhum agendamento</p>
                  <p className="text-xs mt-1">
                    Clique em "Novo Agendamento" para adicionar
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const WeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card key={day.toISOString()} className="overflow-hidden">
            <div className="p-3 bg-[#F9FAFB] dark:bg-[#0D1117] border-b border-[#00112F]/10 dark:border-[#F9FAFB]/20">
              <h3 className="font-medium text-[#00112F] dark:text-[#F9FAFB] text-sm">
                {day.toLocaleDateString("pt-BR", { weekday: "short" })}
              </h3>
              <p className="text-xs text-[#00112F]/60 dark:text-[#F9FAFB]/70">
                {day.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <div className="p-2 space-y-1 h-64 overflow-y-auto">
              {filteredAppointments
                .filter((apt) => apt.date.toDateString() === day.toDateString())
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-2 rounded border-l-2 border-[#00112F] bg-[#00112F]/5 dark:bg-[#F9FAFB]/10 cursor-pointer hover:bg-[#00112F]/10 dark:hover:bg-[#F9FAFB]/20 transition-colors"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowSidebar(true);
                    }}
                  >
                    <div className="text-xs font-medium text-[#00112F] dark:text-[#F9FAFB]">
                      {appointment.clientName}
                    </div>
                    <div className="text-xs text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                      {appointment.startTime}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const MonthView = () => {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    const days = [];
    let day = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return (
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-[#00112F]/20 dark:bg-[#F9FAFB]/30">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="bg-[#F9FAFB] dark:bg-[#0D1117] p-3 text-center text-sm font-medium text-[#00112F] dark:text-[#F9FAFB]"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const dayAppointments = filteredAppointments.filter(
              (apt) => apt.date.toDateString() === day.toDateString(),
            );
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={cn(
                  "bg-white dark:bg-[#0D1117] p-2 h-24 transition-colors hover:bg-[#F9FAFB] dark:hover:bg-[#00112F]/20",
                  !isCurrentMonth &&
                    "bg-[#F9FAFB] dark:bg-[#00112F]/10 text-[#00112F]/40 dark:text-[#F9FAFB]/50",
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday &&
                      "bg-[#00112F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs",
                  )}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 rounded bg-[#00112F]/10 dark:bg-[#F9FAFB]/20 text-[#00112F] dark:text-[#F9FAFB] truncate cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowSidebar(true);
                      }}
                    >
                      {apt.startTime} {apt.clientName}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-[#00112F]/60 dark:text-[#F9FAFB]/70">
                      +{dayAppointments.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const Sidebar = () => {
    if (!selectedAppointment) return null;

    const professional = professionals.find(
      (p) => p.id === selectedAppointment.professionalId,
    );

    return (
      <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-[#0D1117] border-l border-[#00112F]/20 dark:border-[#F9FAFB]/30 z-50 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#00112F]/20 dark:border-[#F9FAFB]/30">
            <h2 className="text-lg font-semibold text-[#00112F] dark:text-[#F9FAFB]">
              Detalhes do Agendamento
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium",
                    professional?.color,
                  )}
                >
                  {professional?.initials}
                </div>
                <div>
                  <h3 className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                    {selectedAppointment.clientName}
                  </h3>
                  <p className="text-sm text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    {selectedAppointment.clientPhone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    Serviço:
                  </span>
                  <p className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                    {selectedAppointment.service}
                  </p>
                </div>
                <div>
                  <span className="text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    Profissional:
                  </span>
                  <p className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                    {professional?.name}
                  </p>
                </div>
                <div>
                  <span className="text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    Data:
                  </span>
                  <p className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                    {selectedAppointment.date.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <span className="text-[#00112F]/70 dark:text-[#F9FAFB]/80">
                    Horário:
                  </span>
                  <p className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
                    {selectedAppointment.startTime} -{" "}
                    {selectedAppointment.endTime}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex space-x-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="p-4 border-t border-[#00112F]/20 dark:border-[#F9FAFB]/30">
            <Button className="w-full bg-[#00112F] hover:bg-[#00112F]/90 text-white">
              Cobrar {formatCurrency(selectedAppointment.price)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with same style as dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
            Agenda
          </h1>
          <p className="text-[#00112F]/70 dark:text-[#F9FAFB]/80 mt-1">
            Gerenciamento de agendamentos • Atualizado às{" "}
            {lastUpdate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            size="sm"
            className="bg-[#00112F] hover:bg-[#00112F]/90 text-white"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={() => setShowNewAppointment(true)}
            className="bg-[#00112F] hover:bg-[#00112F]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* KPI Cards with same style as dashboard */}
      <section>
        <h2 className="sr-only">Indicadores de Agendamentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <KPICard
            title="Agendamentos Hoje"
            value={metrics.todayAppointments}
            change={7}
            period="Hoje"
            icon={CalendarDays}
            variant="primary"
            onCardClick={() => handleNavigate("appointments")}
            navigateTo="appointments"
          />
          <KPICard
            title="Taxa Confirmação"
            value={metrics.confirmationRate}
            change={5}
            period="Percentual"
            icon={UserCheck}
            variant="success"
            format="percentage"
          />
          <KPICard
            title="Faturamento"
            value={metrics.totalRevenue}
            change={12}
            target={50000}
            period="Meta: R$ 50.000"
            icon={DollarSign}
            variant="success"
            format="currency"
            onCardClick={() => handleNavigate("financial")}
            navigateTo="financial"
          />
          <KPICard
            title="Taxa Ocupação"
            value={metrics.occupancyRate}
            change={-2}
            period="Slots preenchidos"
            icon={Activity}
            variant="info"
            format="percentage"
          />
          <KPICard
            title="Taxa Cancelamento"
            value={metrics.cancellationRate}
            change={-1.5}
            period="Últimos 30 dias"
            icon={Ban}
            variant="warning"
            format="percentage"
          />
          <KPICard
            title="Tempo Médio"
            value={Math.round(metrics.avgServiceTime)}
            period="Minutos por serviço"
            icon={Clock}
            variant="info"
          />
        </div>
      </section>

      {/* Filters and Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0">
                <h2 className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
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
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* View Type Selector */}
            <Tabs
              value={viewType}
              onValueChange={(value) => setViewType(value as ViewType)}
            >
              <TabsList>
                <TabsTrigger value="dia">Dia</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
                <TabsTrigger value="mes">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-[#00112F]/20 dark:border-[#F9FAFB]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-white dark:bg-[#0D1117] text-[#00112F] dark:text-[#F9FAFB]"
              />
            </div>

            <select
              value={selectedProfessional || "todos"}
              onChange={(e) =>
                setSelectedProfessional(
                  e.target.value === "todos" ? null : e.target.value,
                )
              }
              className="px-4 py-2 border border-[#00112F]/20 dark:border-[#F9FAFB]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00112F]/50 bg-white dark:bg-[#0D1117] text-[#00112F] dark:text-[#F9FAFB]"
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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

      {/* Main Content */}
      <Tabs value={viewType} className="space-y-4">
        <TabsContent value="dia">
          <DayView />
        </TabsContent>
        <TabsContent value="semana">
          <WeekView />
        </TabsContent>
        <TabsContent value="mes">
          <MonthView />
        </TabsContent>
      </Tabs>

      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        onSave={handleNewAppointment}
        darkMode={darkMode}
      />

      {/* Mobile backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};
