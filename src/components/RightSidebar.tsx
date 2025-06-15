import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Plus,
  Calendar as CalendarIcon,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
  upcomingAppointments?: any[];
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onToggle,
  darkMode,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Junho 2025

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
  };

  const days = getDaysInMonth(currentDate);

  // Agendamentos exatamente como na imagem
  const appointments = [
    {
      id: 1,
      startTime: "10:30",
      endTime: "11:15",
      service: "Barba",
      client: "André Ferreira",
      clientInitial: "A",
      avatarBg: "bg-blue-500",
    },
    {
      id: 2,
      startTime: "13:00",
      endTime: "14:30",
      service: "Coloração",
      client: "Juliana Santos",
      clientInitial: "J",
      avatarBg: "bg-indigo-600",
    },
    {
      id: 3,
      startTime: "15:00",
      endTime: "15:45",
      service: "Corte Masculino",
      client: "Felipe Moreira",
      clientInitial: "F",
      avatarBg: "bg-green-500",
    },
    {
      id: 4,
      startTime: "16:30",
      endTime: "17:15",
      service: "Barba + Corte",
      client: "Bruno Almeida",
      clientInitial: "B",
      avatarBg: "bg-purple-600",
    },
  ];

  return (
    <>
      {/* Floating Calendar Button (when sidebar is closed) */}
      {!isOpen && (
        <div className="fixed top-20 right-4 z-50 hidden lg:block">
          <Button
            onClick={onToggle}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
            title="Mostrar Agenda do Dia"
          >
            <CalendarIcon className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Right Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-xl z-30 transition-all duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700",
          isOpen ? "translate-x-0 w-80" : "translate-x-full w-80",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header - Fundo cinza claro */}
          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Agenda do Dia
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    14 de junho
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <Button
                onClick={onToggle}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                title="Ocultar Agenda"
              >
                <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Calendar - Fundo branco */}
          <div className="px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {formatMonthYear(currentDate)}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                <div
                  key={`day-header-${index}`}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day, index) => {
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday = day.getDate() === 14 && isCurrentMonth;
                const dayNumber = day.getDate();

                return (
                  <button
                    key={`calendar-day-${day.getTime()}`}
                    className={cn(
                      "text-xs h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200",
                      isCurrentMonth
                        ? isToday
                          ? "bg-blue-600 text-white font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        : "text-gray-300 dark:text-gray-600",
                    )}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointments List - Scrollable com scroll visível */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {/* Time and Actions Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                      title={`Ligar para ${appointment.client}`}
                    >
                      <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                      title={`Enviar mensagem para ${appointment.client}`}
                    >
                      <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </div>
                </div>

                {/* Service */}
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {appointment.service}
                </p>

                {/* Client */}
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0",
                      appointment.avatarBg,
                    )}
                  >
                    {appointment.clientInitial}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {appointment.client}
                  </span>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {appointments.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhum agendamento para hoje
                </p>
              </div>
            )}
          </div>

          {/* New Appointment Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
