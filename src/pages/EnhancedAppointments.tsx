import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
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
  AlertCircle,
  ChevronDown,
  Menu,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  CalendarDays,
  Target,
  Zap,
  UserCheck,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

interface EnhancedAppointmentsProps {
  darkMode: boolean;
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

interface DashboardMetrics {
  todayAppointments: number;
  confirmationRate: number;
  avgServiceTime: number;
  totalRevenue: number;
  weekGrowth: number;
  mostPopularService: string;
  peakHour: string;
  occupancyRate: number;
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
    date: new Date(Date.now() - 86400000), // Yesterday
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
];

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
];

export const EnhancedAppointments: React.FC<EnhancedAppointmentsProps> = ({
  darkMode,
}) => {
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

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate metrics
  const metrics = useMemo((): DashboardMetrics => {
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

    const mostPopularService =
      Object.entries(serviceCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    const hourCount = appointments.reduce(
      (acc, apt) => {
        const hour = apt.startTime.split(":")[0];
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const peakHour =
      Object.entries(hourCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    const totalSlots = timeSlots.length * professionals.length;
    const occupiedSlots = todayAppointments.length;
    const occupancyRate =
      totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

    return {
      todayAppointments: todayAppointments.length,
      confirmationRate,
      avgServiceTime,
      totalRevenue,
      weekGrowth: 12.5, // Mock data
      mostPopularService,
      peakHour: peakHour + ":00",
      occupancyRate,
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
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    format?: "currency" | "percentage" | "number";
  }> = ({ title, value, icon, trend, format = "number" }) => {
    const formatValue = (val: string | number) => {
      if (format === "currency") return `R$ ${Number(val).toFixed(2)}`;
      if (format === "percentage") return `${Number(val).toFixed(1)}%`;
      return val.toString();
    };

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(value)}
              </p>
              {trend !== undefined && (
                <div className="flex items-center mt-1">
                  {trend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      trend >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {Math.abs(trend)}%
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({
    appointment,
  }) => {
    const professional = professionals.find(
      (p) => p.id === appointment.professionalId,
    );

    return (
      <div
        className={cn(
          "p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md bg-white",
          professional?.color.replace("bg-", "border-l-"),
        )}
        onClick={() => {
          setSelectedAppointment(appointment);
          setShowSidebar(true);
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 text-sm">
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
              className="text-xs"
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

          <div className="text-xs text-gray-600">
            <div>{appointment.service}</div>
            <div>
              {appointment.startTime} - {appointment.endTime}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              {professional?.name}
            </span>
            <span className="text-sm font-bold text-gray-900">
              R$ {appointment.price}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const DayView = () => (
    <div className="space-y-4">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {(selectedProfessional
          ? professionals.filter((p) => p.id === selectedProfessional)
          : professionals
        ).map((professional) => (
          <div key={professional.id} className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                      professional.color,
                    )}
                  >
                    {professional.initials}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {professional.workingHours.start} -{" "}
                      {professional.workingHours.end}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
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
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Nenhum agendamento</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-medium text-gray-900 text-sm">
                  {day.toLocaleDateString("pt-BR", { weekday: "short" })}
                </h3>
                <p className="text-xs text-gray-500">
                  {day.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="p-2 space-y-1 h-64 overflow-y-auto">
                {filteredAppointments
                  .filter(
                    (apt) => apt.date.toDateString() === day.toDateString(),
                  )
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-2 rounded border-l-2 border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowSidebar(true);
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900">
                        {appointment.clientName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {appointment.startTime}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MonthView = () => {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-900"
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
                  "bg-white p-2 h-24 border-gray-100 transition-colors hover:bg-gray-50",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday &&
                      "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs",
                  )}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowSidebar(true);
                      }}
                    >
                      {apt.startTime} {apt.clientName}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    if (!selectedAppointment) return null;

    const professional = professionals.find(
      (p) => p.id === selectedAppointment.professionalId,
    );

    return (
      <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 z-50 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
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
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium",
                    professional?.color,
                  )}
                >
                  {professional?.initials}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedAppointment.clientName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAppointment.clientPhone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Serviço:</span>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>
                <div>
                  <span className="text-gray-600">Profissional:</span>
                  <p className="font-medium">{professional?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Data:</span>
                  <p className="font-medium">
                    {selectedAppointment.date.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Horário:</span>
                  <p className="font-medium">
                    {selectedAppointment.startTime} -{" "}
                    {selectedAppointment.endTime}
                  </p>
                </div>
              </div>
            </div>

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

          <div className="p-4 border-t border-gray-200">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Cobrar R$ {selectedAppointment.price.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600">Gerencie todos os agendamentos</p>
          </div>
          <Button
            onClick={() => setShowNewAppointment(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Agendamentos Hoje"
            value={metrics.todayAppointments}
            icon={<CalendarDays className="w-6 h-6 text-blue-600" />}
            trend={metrics.weekGrowth}
          />
          <MetricCard
            title="Taxa de Confirmação"
            value={metrics.confirmationRate}
            icon={<UserCheck className="w-6 h-6 text-green-600" />}
            format="percentage"
          />
          <MetricCard
            title="Faturamento"
            value={metrics.totalRevenue}
            icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
            format="currency"
            trend={metrics.weekGrowth}
          />
          <MetricCard
            title="Taxa de Ocupação"
            value={metrics.occupancyRate}
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            format="percentage"
          />
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
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
                  <h2 className="font-semibold text-gray-900">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedProfessional || "todos"}
                onChange={(e) =>
                  setSelectedProfessional(
                    e.target.value === "todos" ? null : e.target.value,
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </CardContent>
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
