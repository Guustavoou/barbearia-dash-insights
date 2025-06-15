import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Plus,
  X,
  Calendar as CalendarIcon,
  Eye,
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

  const handleToggle = () => {
    console.log("RightSidebar toggle clicked, current state:", isOpen);
    onToggle();
  };

  return (
    <>
      {/* Floating Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <div className="fixed top-20 right-4 z-50 hidden lg:block">
          <Button
            onClick={handleToggle}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
            title="Mostrar Agenda do Dia"
          >
            <div className="relative">
              <CalendarIcon className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </Button>
        </div>
      )}

      {/* Right Sidebar */}
      <aside
        data-testid="right-sidebar"
        className={cn(
          "fixed top-0 right-0 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-30 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0 w-80" : "translate-x-full w-80",
        )}
        style={{
          display: "block", // Garantir que sempre seja exibida
        }}
      >
        <div className="h-full flex flex-col relative">
          {/* External Toggle Button (when sidebar is open) - CENTRO VERTICAL */}
          <button
            onClick={handleToggle}
            className={cn(
              "absolute -left-12 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 rounded-l-xl p-3 flex items-center justify-center shadow-xl transition-all duration-300 z-50 group",
              "hidden lg:flex hover:scale-110 active:scale-95 hover:shadow-2xl",
            )}
            title="Ocultar Agenda do Dia"
          >
            <ChevronRight className="w-7 h-7 group-hover:text-white transition-all duration-200" />
          </button>

          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Agenda do Dia
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(today)}
                  </p>
                </div>
              </div>

              {/* Toggle Buttons in Header */}
              <div className="flex items-center space-x-2">
                {/* Desktop toggle button */}
                <Button
                  onClick={handleToggle}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-800/50 hidden sm:flex"
                  title="Ocultar Agenda"
                >
                  <EyeOff className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </Button>

                {/* Mobile close button */}
                <Button
                  onClick={handleToggle}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-800/50 sm:hidden"
                  title="Fechar Agenda"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
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
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
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
                          ? "bg-blue-600 text-white shadow-md font-medium"
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
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Próximos Agendamentos
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {mockAppointments.length} hoje
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
                      "rounded-xl p-4 border transition-all duration-200 hover:shadow-md cursor-pointer",
                      index === 0
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-400"
                        : "bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              index === 0 ? "bg-green-400" : "bg-yellow-400",
                            )}
                          />
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {appointment.time}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 dark:text-gray-300">
                          {appointment.service}
                        </p>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                            {appointment.client.charAt(0)}
                          </div>
                          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {appointment.client}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-full"
                          title={`Ligar para ${appointment.client}`}
                        >
                          <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full"
                          title={`Enviar mensagem para ${appointment.client}`}
                        >
                          <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 hover:shadow-lg"
              size="lg"
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
