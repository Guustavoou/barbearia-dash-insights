import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { AppointmentItem, CalendarDay } from "@/lib/appointmentTypes";

interface CalendarViewProps {
  appointments: AppointmentItem[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onNewAppointment: () => void;
  darkMode: boolean;
}

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  selectedDate,
  onDateSelect,
  onNewAppointment,
  darkMode,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        appointments: appointments.filter(
          (apt) =>
            apt.date.getDate() === date.getDate() &&
            apt.date.getMonth() === date.getMonth() &&
            apt.date.getFullYear() === date.getFullYear(),
        ),
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        appointments: appointments.filter(
          (apt) =>
            apt.date.getDate() === date.getDate() &&
            apt.date.getMonth() === date.getMonth() &&
            apt.date.getFullYear() === date.getFullYear(),
        ),
      });
    }

    // Next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        appointments: appointments.filter(
          (apt) =>
            apt.date.getDate() === date.getDate() &&
            apt.date.getMonth() === date.getMonth() &&
            apt.date.getFullYear() === date.getFullYear(),
        ),
      });
    }

    return days;
  }, [currentDate, appointments]);

  const getAppointmentIndicators = (dayAppointments: AppointmentItem[]) => {
    if (dayAppointments.length === 0) return null;

    const statusCounts = dayAppointments.reduce(
      (acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={cn(
              "w-2 h-2 rounded-full",
              status === "agendado" && "bg-blue-500",
              status === "confirmado" && "bg-green-500",
              status === "concluido" && "bg-green-700",
              status === "cancelado" && "bg-red-500",
              status === "faltou" && "bg-gray-500",
            )}
            title={`${count} ${status}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2
            className={cn(
              "text-xl font-semibold capitalize",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={goToNextMonth}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onNewAppointment}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className={cn(
              "p-3 text-center text-sm font-medium",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day.date)}
            className={cn(
              "p-3 text-left border rounded-lg transition-all min-h-[80px] relative",
              day.isCurrentMonth
                ? darkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
                : darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-500"
                  : "bg-gray-50 border-gray-100 text-gray-400",
              day.date.toDateString() === selectedDate.toDateString() &&
                "ring-2 ring-blue-500",
              day.date.toDateString() === new Date().toDateString() &&
                "ring-2 ring-orange-400",
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                day.isCurrentMonth
                  ? darkMode
                    ? "text-white"
                    : "text-gray-900"
                  : darkMode
                    ? "text-gray-500"
                    : "text-gray-400",
              )}
            >
              {day.date.getDate()}
            </span>
            {getAppointmentIndicators(day.appointments)}
            {day.appointments.length > 0 && (
              <div
                className={cn(
                  "absolute top-1 right-1 text-xs px-1 rounded-full",
                  darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600",
                )}
              >
                {day.appointments.length}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Agendado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Confirmado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-700 rounded-full" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Concluído
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Cancelado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full" />
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Faltou
          </span>
        </div>
      </div>
    </div>
  );
};
