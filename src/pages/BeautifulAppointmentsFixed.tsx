import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Coffee,
  Sunset,
  Moon,
  User,
  Scissors,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Edit3,
  Eye,
  Trash2,
  MoreHorizontal,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Target,
  Zap,
  MessageCircle,
} from "lucide-react";

// Hooks de produção
import {
  useAppointments,
  useClients,
  useServices,
  useProfessionals,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useGlobalLoading,
  useGlobalError,
} from "@/hooks/useSupabaseProduction";

// Tipos para os agendamentos
interface Appointment {
  id: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  service_name?: string;
  professional_name?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  status?: "pendente" | "confirmado" | "finalizado" | "cancelado" | "no_show";
  price?: number;
  notes?: string;
  client_id?: string;
  service_id?: string;
  professional_id?: string;
}

interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface Service {
  id: string;
  name: string;
  price?: number;
  duration?: number;
}

interface Professional {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

// Função para determinar o ícone baseado no horário
const getTimeIcon = (time?: string) => {
  if (!time) return Clock;
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 6 && hour < 12) return Coffee;
  if (hour >= 12 && hour < 18) return Sunset;
  return Moon;
};

// Função para determinar a cor do status
const getStatusColor = (status?: string) => {
  switch (status) {
    case "confirmado":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "pendente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "finalizado":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "cancelado":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "no_show":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// Função para obter a cor da borda baseada no status
const getStatusBorderColor = (status?: string) => {
  switch (status) {
    case "confirmado":
      return "border-l-blue-500";
    case "pendente":
      return "border-l-yellow-500";
    case "finalizado":
      return "border-l-green-500";
    case "cancelado":
      return "border-l-red-500";
    case "no_show":
      return "border-l-gray-500";
    default:
      return "border-l-gray-300";
  }
};

// Componente Modal para detalhes do agendamento
const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
}: {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!appointment) return null;

  const handleWhatsApp = () => {
    if (appointment.client_phone) {
      const phone = appointment.client_phone.replace(/\D/g, "");
      const message = `Olá ${appointment.client_name}, tudo bem? Este é um lembrete do seu agendamento para ${appointment.service_name} no dia ${appointment.date} às ${appointment.start_time}.`;
      window.open(
        `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`,
        "_blank",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#0D1117] border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#00112F] dark:text-[#F9FAFB] text-xl">
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Informações completas do agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Status</Label>
            <Badge
              className={cn("text-xs", getStatusColor(appointment.status))}
            >
              {appointment.status}
            </Badge>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-2" />
              Cliente
            </Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                {appointment.client_name || "Não informado"}
              </p>
              {appointment.client_phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {appointment.client_phone}
                </p>
              )}
              {appointment.client_email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {appointment.client_email}
                </p>
              )}
            </div>
          </div>

          {/* Serviço */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Scissors className="w-4 h-4 mr-2" />
              Serviço
            </Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                {appointment.service_name || "Não informado"}
              </p>
              {appointment.price && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  R$ {appointment.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Profissional */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Profissional
            </Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                {appointment.professional_name || "Não informado"}
              </p>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Data
              </Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horário
              </Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="font-semibold text-[#00112F] dark:text-[#F9FAFB]">
                  {appointment.start_time || "Não informado"}
                  {appointment.end_time && ` - ${appointment.end_time}`}
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Observações</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {appointment.notes}
                </p>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              disabled={!appointment.client_phone}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente Modal para criar/editar agendamento
const AppointmentModal = ({
  appointment,
  isOpen,
  onClose,
  onSave,
  clients,
  services,
  professionals,
}: {
  appointment?: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  clients: Client[];
  services: Service[];
  professionals: Professional[];
}) => {
  const [formData, setFormData] = useState({
    client_id: "",
    service_id: "",
    professional_id: "",
    date: "",
    start_time: "",
    end_time: "",
    status: "pendente" as const,
    price: "",
    notes: "",
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        client_id: appointment.client_id || "",
        service_id: appointment.service_id || "",
        professional_id: appointment.professional_id || "",
        date: appointment.date || "",
        start_time: appointment.start_time || "",
        end_time: appointment.end_time || "",
        status: appointment.status || "pendente",
        price: appointment.price?.toString() || "",
        notes: appointment.notes || "",
      });
    } else {
      setFormData({
        client_id: "",
        service_id: "",
        professional_id: "",
        date: "",
        start_time: "",
        end_time: "",
        status: "pendente",
        price: "",
        notes: "",
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#0D1117] border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#00112F] dark:text-[#F9FAFB]">
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Edite as informações do agendamento"
              : "Preencha os dados para criar um novo agendamento"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente</Label>
            <select
              id="client_id"
              value={formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB]"
              required
            >
              <option value="">Selecione um cliente</option>
              {Array.isArray(clients)
                ? clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))
                : []}
            </select>
          </div>

          {/* Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service_id">Serviço</Label>
            <select
              id="service_id"
              value={formData.service_id}
              onChange={(e) =>
                setFormData({ ...formData, service_id: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB]"
              required
            >
              <option value="">Selecione um serviço</option>
              {Array.isArray(services)
                ? services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                      {service.price && ` - R$ ${service.price.toFixed(2)}`}
                    </option>
                  ))
                : []}
            </select>
          </div>

          {/* Profissional */}
          <div className="space-y-2">
            <Label htmlFor="professional_id">Profissional</Label>
            <select
              id="professional_id"
              value={formData.professional_id}
              onChange={(e) =>
                setFormData({ ...formData, professional_id: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB]"
              required
            >
              <option value="">Selecione um profissional</option>
              {Array.isArray(professionals)
                ? professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name}
                    </option>
                  ))
                : []}
            </select>
          </div>

          {/* Data e Horários */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="start_time">Início</Label>
                <Input
                  type="time"
                  id="start_time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">Fim</Label>
                <Input
                  type="time"
                  id="end_time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Status e Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as any,
                  })
                }
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB]"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                type="number"
                step="0.01"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB] min-h-[80px]"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
            >
              {appointment ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente para visualização semanal
const WeekView = ({
  appointments,
  selectedDate,
  onAppointmentClick,
}: {
  appointments: Appointment[];
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
}) => {
  // Calcular os dias da semana
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Horários de funcionamento (9h às 18h)
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Agrupar appointments por dia e horário
  const getAppointmentsForDayAndTime = (day: Date, timeSlot: string) => {
    const dayStr = day.toISOString().split("T")[0];
    return (appointments || []).filter((apt) => {
      if (!apt.date || !apt.start_time) return false;
      const aptDate = new Date(apt.date).toISOString().split("T")[0];
      const aptHour = apt.start_time.split(":")[0] + ":00";
      return aptDate === dayStr && aptHour === timeSlot;
    });
  };

  return (
    <div className="bg-white dark:bg-[#0D1117] rounded-lg overflow-hidden shadow-lg">
      {/* Header dos dias */}
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 font-medium text-gray-500 dark:text-gray-400 text-center">
          Horário
        </div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="p-4 text-center border-l border-gray-200 dark:border-gray-700"
          >
            <div className="font-medium text-[#00112F] dark:text-[#F9FAFB]">
              {dayNames[index]}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Grid de horários */}
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((timeSlot) => (
          <div
            key={timeSlot}
            className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800 min-h-[80px]"
          >
            <div className="p-4 font-medium text-gray-500 dark:text-gray-400 text-center border-r border-gray-200 dark:border-gray-700">
              {timeSlot}
            </div>
            {weekDays.map((day, dayIndex) => {
              const dayAppointments = getAppointmentsForDayAndTime(
                day,
                timeSlot,
              );
              return (
                <div
                  key={dayIndex}
                  className="p-2 border-l border-gray-100 dark:border-gray-800 relative"
                >
                  {dayAppointments.map((appointment, aptIndex) => (
                    <div
                      key={aptIndex}
                      onClick={() => onAppointmentClick(appointment)}
                      className={cn(
                        "mb-1 p-2 rounded text-xs cursor-pointer transition-all hover:scale-105",
                        getStatusColor(appointment.status),
                        "border-l-2",
                        getStatusBorderColor(appointment.status),
                      )}
                    >
                      <div className="font-medium truncate">
                        {appointment.client_name}
                      </div>
                      <div className="text-xs opacity-80 truncate">
                        {appointment.service_name}
                      </div>
                      {appointment.start_time && appointment.end_time && (
                        <div className="text-xs opacity-60">
                          {appointment.start_time} - {appointment.end_time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para visualização mensal
const MonthView = ({
  appointments,
  selectedDate,
  onAppointmentClick,
  onDateClick,
}: {
  appointments: Appointment[];
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
  onDateClick: (date: Date) => void;
}) => {
  // Calcular os dias do mês
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);

    // Primeiro dia da semana que contém o primeiro dia do mês
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    // Último dia da semana que contém o último dia do mês
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const monthDays = getMonthDays(selectedDate);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Agrupar appointments por dia
  const getAppointmentsForDay = (day: Date) => {
    const dayStr = day.toISOString().split("T")[0];
    return (appointments || []).filter((apt) => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date).toISOString().split("T")[0];
      return aptDate === dayStr;
    });
  };

  // Verificar se o dia está no mês atual
  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === selectedDate.getMonth();
  };

  // Verificar se é hoje
  const isToday = (day: Date) => {
    const today = new Date();
    return day.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white dark:bg-[#0D1117] rounded-lg overflow-hidden shadow-lg">
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="p-4 text-center font-medium text-gray-500 dark:text-gray-400"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Grid dos dias */}
      <div className="grid grid-cols-7">
        {monthDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          const isTodayDay = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
                !isCurrentMonthDay && "bg-gray-50 dark:bg-gray-900 opacity-60",
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium mb-2",
                  isTodayDay
                    ? "bg-[#00112F] text-white rounded-full w-6 h-6 flex items-center justify-center"
                    : "text-gray-700 dark:text-gray-300",
                  !isCurrentMonthDay && "text-gray-400 dark:text-gray-600",
                )}
              >
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((appointment, aptIndex) => (
                  <div
                    key={aptIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appointment);
                    }}
                    className={cn(
                      "text-xs p-1 rounded cursor-pointer transition-all hover:scale-105",
                      getStatusColor(appointment.status),
                      "border-l-2",
                      getStatusBorderColor(appointment.status),
                    )}
                  >
                    <div className="font-medium truncate">
                      {appointment.start_time} {appointment.client_name}
                    </div>
                    <div className="text-xs opacity-80 truncate">
                      {appointment.service_name}
                    </div>
                  </div>
                ))}

                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    +{dayAppointments.length - 3} mais
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

// Componente principal
export default function BeautifulAppointmentsFixed() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Hooks de dados
  const { data: appointmentsData = [], isLoading: appointmentsLoading } =
    useAppointments();
  const { data: clientsData = [] } = useClients();
  const { data: servicesData = [] } = useServices();
  const { data: professionalsData = [] } = useProfessionals();

  // Ensure we always have arrays
  const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
  const clients = Array.isArray(clientsData) ? clientsData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];
  const professionals = Array.isArray(professionalsData)
    ? professionalsData
    : [];
  const globalLoading = useGlobalLoading();
  const globalError = useGlobalError();

  // Hooks de mutação
  const createAppointmentMutation = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  // Filtrar appointments
  const filteredAppointments = (appointments || []).filter((appointment) => {
    // Filtro de data baseado no modo de visualização
    const appointmentDate = appointment.date
      ? new Date(appointment.date)
      : null;
    const selected = selectedDate;

    let dateMatch = false;
    if (viewMode === "day") {
      dateMatch = appointmentDate?.toDateString() === selected.toDateString();
    } else if (viewMode === "week") {
      const weekStart = new Date(selected);
      weekStart.setDate(selected.getDate() - selected.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      dateMatch = appointmentDate
        ? appointmentDate >= weekStart && appointmentDate <= weekEnd
        : false;
    } else if (viewMode === "month") {
      dateMatch = appointmentDate
        ? appointmentDate.getMonth() === selected.getMonth() &&
          appointmentDate.getFullYear() === selected.getFullYear()
        : false;
    }

    // Filtro de busca
    const matchesSearch =
      searchTerm === "" ||
      appointment.client_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.professional_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Filtro de status
    const matchesStatus =
      statusFilter === "" || appointment.status === statusFilter;

    // Filtro de profissional
    const matchesProfessional =
      professionalFilter === "" ||
      appointment.professional_name === professionalFilter;

    // Filtro de período
    const matchesTime = (() => {
      if (timeFilter === "" || !appointment.start_time) return true;
      const hour = parseInt(appointment.start_time.split(":")[0]);
      switch (timeFilter) {
        case "morning":
          return hour >= 6 && hour < 12;
        case "afternoon":
          return hour >= 12 && hour < 18;
        case "evening":
          return hour >= 18 || hour < 6;
        default:
          return true;
      }
    })();

    return (
      dateMatch &&
      matchesSearch &&
      matchesStatus &&
      matchesProfessional &&
      matchesTime
    );
  });

  // Calcular KPIs
  const todayAppointments = (appointments || []).filter((apt) => {
    const today = new Date().toDateString();
    const aptDate = apt.date ? new Date(apt.date).toDateString() : null;
    return aptDate === today;
  });

  const todayRevenue = todayAppointments.reduce(
    (total, apt) => total + (apt.price || 0),
    0,
  );

  const confirmedToday = todayAppointments.filter(
    (apt) => apt.status === "confirmado",
  ).length;

  const totalSlots = 20; // Assumindo 20 slots por dia
  const occupancyRate = (confirmedToday / totalSlots) * 100;

  const completedToday = todayAppointments.filter(
    (apt) => apt.status === "finalizado",
  ).length;

  const schedulingRate = (confirmedToday / todayAppointments.length) * 100 || 0;

  const avgServiceTime = 45; // Assumindo 45 minutos em média

  // Funções de navegação
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

  // Handlers
  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsCreateModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointmentMutation.mutate(appointment.id, {
        onSuccess: () => {
          toast({
            title: "Agendamento excluído",
            description: "O agendamento foi excluído com sucesso.",
          });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Erro ao excluir agendamento.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleSaveAppointment = (data: any) => {
    if (selectedAppointment) {
      // Editar
      updateAppointmentMutation.mutate(
        { id: selectedAppointment.id, ...data },
        {
          onSuccess: () => {
            toast({
              title: "Agendamento atualizado",
              description: "O agendamento foi atualizado com sucesso.",
            });
            setIsEditModalOpen(false);
            setSelectedAppointment(null);
          },
          onError: () => {
            toast({
              title: "Erro",
              description: "Erro ao atualizar agendamento.",
              variant: "destructive",
            });
          },
        },
      );
    } else {
      // Criar
      createAppointmentMutation.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Agendamento criado",
            description: "O agendamento foi criado com sucesso.",
          });
          setIsCreateModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Erro ao criar agendamento.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("day");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-blue-50/30 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-blue-950/20 space-y-6 p-6">
      {/* Beautiful Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00112F] via-blue-900 to-blue-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CalendarDays className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Agenda Inteligente
                  </h1>
                  <p className="text-blue-100">
                    Gestão profissional de agendamentos
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateAppointment}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Agendamentos Hoje
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {todayAppointments.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#00112F] to-blue-600 rounded-xl text-white shadow-lg">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +12% vs ontem
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa Ocupação
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {occupancyRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +5% vs média
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Faturamento Dia
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  R$ {todayRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +18% vs ontem
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa Ocupação
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {occupancyRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Ótima performance
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa Agendamento
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {schedulingRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Excelente
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00112F]/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tempo Médio
                </p>
                <p className="text-2xl font-bold text-[#00112F] dark:text-[#F9FAFB]">
                  {avgServiceTime}min
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Zap className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Eficiente
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Beautiful */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="p-6 space-y-4">
          {/* Primeira linha - Navegação de data e visualização */}
          <div className="flex items-center justify-between">
            {/* Navegação de data */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="hover:bg-[#00112F]/10"
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
                    `Semana de ${selectedDate.toLocaleDateString("pt-BR")} - ${new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar cliente, serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Filtro de Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB] border-gray-200 dark:border-gray-700"
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            {/* Filtro de Profissional */}
            <div>
              <select
                value={professionalFilter}
                onChange={(e) => setProfessionalFilter(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB] border-gray-200 dark:border-gray-700"
              >
                <option value="">Todos profissionais</option>
                {Array.from(
                  new Set(
                    (appointments || [])
                      .map((apt) => apt.professional_name)
                      .filter(Boolean),
                  ),
                ).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Período */}
            <div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 text-[#00112F] dark:text-[#F9FAFB] border-gray-200 dark:border-gray-700"
              >
                <option value="">Todos os períodos</option>
                <option value="morning">Manhã (6h-12h)</option>
                <option value="afternoon">Tarde (12h-18h)</option>
                <option value="evening">Noite (18h-6h)</option>
              </select>
            </div>

            {/* Botão de limpar filtros */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setProfessionalFilter("");
                setTimeFilter("");
              }}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Limpar
            </Button>
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
            ) : viewMode === "week" ? (
              <WeekView
                appointments={filteredAppointments}
                selectedDate={selectedDate}
                onAppointmentClick={handleViewDetails}
              />
            ) : viewMode === "month" ? (
              <MonthView
                appointments={filteredAppointments}
                selectedDate={selectedDate}
                onAppointmentClick={handleViewDetails}
                onDateClick={handleDateClick}
              />
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
                        getStatusBorderColor(appointment.status),
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
                            {appointment.client_name || "Cliente não informado"}
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
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                              <DollarSign className="w-3 h-3 mr-1" />
                              R$ {appointment.price.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Footer do Card */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {appointment.date
                                ? new Date(appointment.date).toLocaleDateString(
                                    "pt-BR",
                                  )
                                : "Data não informada"}
                            </span>
                            {appointment.client_phone && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-[100px]">
                                  {appointment.client_phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {filteredAppointments.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Nenhum agendamento encontrado
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 mb-4">
                      Não há agendamentos para os filtros selecionados.
                    </p>
                    <Button
                      onClick={handleCreateAppointment}
                      className="bg-[#00112F] hover:bg-[#00112F]/80 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Agendamento
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Modais */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveAppointment}
        clients={clients}
        services={services}
        professionals={professionals}
      />

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={handleSaveAppointment}
        clients={clients}
        services={services}
        professionals={professionals}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
