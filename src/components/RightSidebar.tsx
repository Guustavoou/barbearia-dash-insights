import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Plus,
  X,
  Calendar as CalendarIcon,
  Minimize2,
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
  upcomingAppointments = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
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

  const today = new Date();
  const days = getDaysInMonth(currentDate);

  const mockAppointments = [
    {
      id: 1,
      time: "09:00 - 09:45",
      service: "Corte Masculino",
      client: "Ricardo Mendes",
      status: "confirmed",
    },
    {
      id: 2,
      time: "10:30 - 11:15",
      service: "Barba",
      client: "André Ferreira",
      status: "pending",
    },
    {
      id: 3,
      time: "13:00 - 14:30",
      service: "Coloração",
      client: "Juliana Santos",
      status: "pending",
    },
    {
      id: 4,
      time: "15:00 - 15:45",
      service: "Corte Masculino",
      client: "Felipe Moreira",
      status: "pending",
    },
    {
      id: 5,
      time: "16:30 - 17:15",
      service: "Barba + Corte",
      client: "Bruno Almeida",
      status: "pending",
    },
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <>
      {/* Floating Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <div className="fixed top-4 right-4 z-50 hidden lg:block">
          <Button
            onClick={onToggle}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            variant="ghost"
            title="Mostrar Agenda do Dia"
          >
            <CalendarIcon className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Right Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full bg-white border-l border-gray-200 transform transition-all duration-300 ease-in-out shadow-lg dark:bg-gray-800 dark:border-gray-700 z-30",
          isOpen ? "translate-x-0 w-80" : "translate-x-full w-0",
        )}
      >
        <div className="h-full flex flex-col relative">
          {/* External Toggle Button (when sidebar is open) */}
          <button
            onClick={onToggle}
            className={cn(
              "absolute -left-10 top-4 bg-white border border-gray-200 rounded-l-lg p-2 flex items-center justify-center hover:bg-gray-50 shadow-sm transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 z-40",
              "hidden lg:flex group",
            )}
            title="Ocultar Agenda do Dia"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>

          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Agenda do Dia
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(today)}
                </div>
                {/* Close Button in Header */}
                <Button
                  onClick={onToggle}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                  title="Ocultar Agenda"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {[
                { label: "D", name: "domingo" },
                { label: "S", name: "segunda" },
                { label: "T", name: "terca" },
                { label: "Q", name: "quarta" },
                { label: "Q", name: "quinta" },
                { label: "S", name: "sexta" },
                { label: "S", name: "sabado" },
              ].map((day) => (
                <div
                  key={`day-header-${day.name}`}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {day.label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day, index) => {
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday =
                  day.toDateString() === today.toDateString() && isCurrentMonth;

                return (
                  <button
                    key={`calendar-day-${day.getTime()}`}
                    className={cn(
                      "text-xs h-7 flex items-center justify-center rounded-full transition-all duration-200",
                      isCurrentMonth
                        ? isToday
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        : "text-gray-400 dark:text-gray-600",
                    )}
                    title={`${day.getDate()} de ${day.toLocaleDateString("pt-BR", { month: "long" })}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointments List */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Próximos Agendamentos
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Hoje, {formatDate(today)}
                </span>
              </div>

              {mockAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum agendamento para hoje
                  </p>
                </div>
              ) : (
                mockAppointments.map((appointment, index) => (
                  <div
                    key={`appointment-${appointment.id}-${index}`}
                    className={cn(
                      "rounded-lg p-3 border transition-all duration-200 hover:shadow-md",
                      index === 0
                        ? "bg-blue-50 border-l-4 border-blue-600 dark:bg-blue-900/20 dark:border-blue-400"
                        : "bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.time}
                        </p>
                        <p className="text-sm text-gray-700 mt-1 dark:text-gray-300">
                          {appointment.service}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-600">
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              {appointment.client.charAt(0)}
                            </span>
                          </div>
                          <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                            {appointment.client}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                          title={`Ligar para ${appointment.client}`}
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                          title={`Enviar mensagem para ${appointment.client}`}
                        >
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
