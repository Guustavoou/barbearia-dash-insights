import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Plus,
  Calendar as CalendarIcon,
  EyeOff,
  X,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
  upcomingAppointments?: any[];
  onPageChange?: (page: string) => void;
}

interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
  service: string;
  client: string;
  clientInitial: string;
  avatarBg: string;
  clientPhone?: string;
  notes?: string;
  status: "confirmado" | "agendado" | "concluido";
  date: Date; // Data do agendamento
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onToggle,
  darkMode,
  onPageChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Junho 2025
  const [selectedDay, setSelectedDay] = useState<number | null>(14); // Dia 14 selecionado
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDay(null); // Reset selected day when changing month
  };

  const handleDayClick = (day: Date) => {
    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
    if (isCurrentMonth) {
      setSelectedDay(day.getDate());
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleNewAppointment = () => {
    console.log("Navegando para nova appointment");
    if (onPageChange) {
      onPageChange("appointments");
    }
  };

  const days = getDaysInMonth(currentDate);

  // Agendamentos completos com datas específicas
  const allAppointments: Appointment[] = [
    {
      id: 1,
      startTime: "10:30",
      endTime: "11:15",
      service: "Barba",
      client: "André Ferreira",
      clientInitial: "A",
      avatarBg: "bg-blue-500",
      clientPhone: "(11) 99999-1234",
      notes: "Cliente prefere barba mais baixa",
      status: "confirmado",
      date: new Date(2025, 5, 14), // 14 de junho
    },
    {
      id: 2,
      startTime: "13:00",
      endTime: "14:30",
      service: "Coloração",
      client: "Juliana Santos",
      clientInitial: "J",
      avatarBg: "bg-indigo-600",
      clientPhone: "(11) 99999-5678",
      notes: "Primeira vez fazendo coloração",
      status: "agendado",
      date: new Date(2025, 5, 14), // 14 de junho
    },
    {
      id: 3,
      startTime: "15:00",
      endTime: "15:45",
      service: "Corte Masculino",
      client: "Felipe Moreira",
      clientInitial: "F",
      avatarBg: "bg-green-500",
      clientPhone: "(11) 99999-9012",
      status: "agendado",
      date: new Date(2025, 5, 15), // 15 de junho
    },
    {
      id: 4,
      startTime: "16:30",
      endTime: "17:15",
      service: "Barba + Corte",
      client: "Bruno Almeida",
      clientInitial: "B",
      avatarBg: "bg-purple-600",
      clientPhone: "(11) 99999-3456",
      notes: "Cliente regular, corte habitual",
      status: "agendado",
      date: new Date(2025, 5, 16), // 16 de junho
    },
    {
      id: 5,
      startTime: "09:00",
      endTime: "10:00",
      service: "Corte Feminino",
      client: "Maria Silva",
      clientInitial: "M",
      avatarBg: "bg-pink-500",
      clientPhone: "(11) 99999-7890",
      status: "confirmado",
      date: new Date(2025, 5, 17), // 17 de junho
    },
    {
      id: 6,
      startTime: "14:00",
      endTime: "15:30",
      service: "Escova Progressiva",
      client: "Ana Costa",
      clientInitial: "A",
      avatarBg: "bg-yellow-500",
      clientPhone: "(11) 99999-4567",
      notes: "Cabelo muito cacheado",
      status: "agendado",
      date: new Date(2025, 5, 18), // 18 de junho
    },
  ];

  // Filtrar agendamentos pelo dia selecionado
  const filteredAppointments = selectedDay
    ? allAppointments.filter((appointment) => {
        return (
          appointment.date.getDate() === selectedDay &&
          appointment.date.getMonth() === currentDate.getMonth() &&
          appointment.date.getFullYear() === currentDate.getFullYear()
        );
      })
    : allAppointments.filter((appointment) => {
        // Se nenhum dia selecionado, mostrar agendamentos de hoje (dia 14 por padrão)
        const today = new Date(2025, 5, 14);
        return (
          appointment.date.getDate() === today.getDate() &&
          appointment.date.getMonth() === today.getMonth() &&
          appointment.date.getFullYear() === today.getFullYear()
        );
      });

  const handleCall = (appointment: Appointment) => {
    if (appointment.clientPhone) {
      const phoneNumber = appointment.clientPhone.replace(/\D/g, "");
      window.open(`tel:+55${phoneNumber}`, "_self");
    }
  };

  const handleMessage = (appointment: Appointment) => {
    if (appointment.clientPhone) {
      const phoneNumber = appointment.clientPhone.replace(/\D/g, "");
      const message = `Olá ${appointment.client}! Este é um lembrete do seu agendamento de ${appointment.service} às ${appointment.startTime}. Nos vemos em breve!`;
      const whatsappURL = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    }
  };

  // Count appointments for each day to show dots
  const getAppointmentCountForDay = (day: Date) => {
    return allAppointments.filter((appointment) => {
      return (
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear()
      );
    }).length;
  };

  const handleToggle = () => {
    console.log("🔄 RightSidebar toggle clicked - current isOpen:", isOpen);
    onToggle();
  };

  const sidebarStyle = {
    transform: isOpen ? "translateX(0)" : "translateX(100%)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    visibility: isOpen ? "visible" : "hidden",
    opacity: isOpen ? 1 : 0,
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleToggle}
        />
      )}

      {/* Right Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col shadow-xl",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={sidebarStyle}
      >
        {/* Debug Info - Remove in production */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-60">
          {isOpen ? "OPEN" : "CLOSED"}
        </div>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Agenda do Dia
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggle}
                  className="rounded-full w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  title="Ocultar agenda"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedDay
                ? `${selectedDay} de ${formatMonthYear(currentDate)}`
                : formatMonthYear(currentDate)}
            </p>
          </div>

          {/* Calendar Widget */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {formatMonthYear(currentDate)}
              </h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="p-1 text-gray-500 dark:text-gray-400 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayNumber = day.getDate();
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isSelected = selectedDay === dayNumber && isCurrentMonth;
                const appointmentCount = getAppointmentCountForDay(day);
                const hasAppointments = appointmentCount > 0;

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "relative w-8 h-8 text-sm rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600",
                      isCurrentMonth
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-300 dark:text-gray-600",
                      isSelected &&
                        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                    )}
                  >
                    {dayNumber}
                    {hasAppointments && isCurrentMonth && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointments List - FILTRADA POR DIA */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Dialog key={appointment.id}>
                  <DialogTrigger asChild>
                    <div
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      {/* Time and Actions Row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              appointment.status === "confirmado"
                                ? "bg-green-400"
                                : "bg-yellow-400",
                            )}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        <div
                          className="flex space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                            title={`Ligar para ${appointment.client}`}
                            onClick={() => handleCall(appointment)}
                          >
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                            title={`Enviar mensagem para ${appointment.client}`}
                            onClick={() => handleMessage(appointment)}
                          >
                            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                        </div>
                      </div>

                      {/* Service and Client */}
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold",
                            appointment.avatarBg,
                          )}
                        >
                          {appointment.clientInitial}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {appointment.service}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.client}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>

                  {/* Appointment Details Modal */}
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span>Detalhes do Agendamento</span>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold",
                            appointment.avatarBg,
                          )}
                        >
                          {appointment.clientInitial}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {appointment.client}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appointment.clientPhone}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Serviço:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {appointment.service}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Horário:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Data:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {appointment.date.toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Status:
                          </span>
                          <span
                            className={cn(
                              "text-sm px-2 py-1 rounded-full font-medium",
                              appointment.status === "confirmado"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700",
                            )}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        {appointment.notes && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Observações:
                            </span>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button
                          onClick={() => handleCall(appointment)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                        <Button
                          onClick={() => handleMessage(appointment)}
                          variant="outline"
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Mensagem
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum agendamento para{" "}
                  {selectedDay ? `o dia ${selectedDay}` : "hoje"}
                </p>
              </div>
            )}
          </div>

          {/* New Appointment Button - FUNCIONAL */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Button
              onClick={handleNewAppointment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
