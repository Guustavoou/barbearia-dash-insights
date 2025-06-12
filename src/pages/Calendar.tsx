import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Clock,
  User,
  Scissors,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface CalendarProps {
  darkMode: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: "appointment" | "break" | "blocked";
  start: string;
  end: string;
  client?: string;
  service?: string;
  professional?: string;
  status: "confirmed" | "pending" | "cancelled";
  color: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Corte + Barba",
    type: "appointment",
    start: "09:00",
    end: "10:00",
    client: "João Silva",
    service: "Corte + Barba",
    professional: "Carlos Santos",
    status: "confirmed",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Manicure",
    type: "appointment",
    start: "10:30",
    end: "11:30",
    client: "Maria Oliveira",
    service: "Manicure",
    professional: "Ana Costa",
    status: "confirmed",
    color: "bg-pink-500",
  },
  {
    id: "3",
    title: "Almoço",
    type: "break",
    start: "12:00",
    end: "13:00",
    status: "confirmed",
    color: "bg-gray-400",
  },
  {
    id: "4",
    title: "Coloração",
    type: "appointment",
    start: "14:00",
    end: "16:00",
    client: "Laura Santos",
    service: "Coloração Completa",
    professional: "Beatriz Lima",
    status: "pending",
    color: "bg-purple-500",
  },
  {
    id: "5",
    title: "Corte Feminino",
    type: "appointment",
    start: "16:30",
    end: "17:30",
    client: "Carla Mendes",
    service: "Corte Feminino",
    professional: "Ana Costa",
    status: "confirmed",
    color: "bg-green-500",
  },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const Calendar: React.FC<CalendarProps> = ({ darkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedProfessional, setSelectedProfessional] = useState("all");

  const professionals = [
    "all",
    "Carlos Santos",
    "Ana Costa",
    "Beatriz Lima",
    "Roberto Silva",
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getCurrentWeek = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getEventsForTimeSlot = (time: string, dayIndex?: number) => {
    return mockEvents.filter((event) => {
      const eventStart = event.start;
      const eventEnd = event.end;
      return time >= eventStart && time < eventEnd;
    });
  };

  const renderTimeSlot = (time: string, dayIndex?: number) => {
    const events = getEventsForTimeSlot(time, dayIndex);

    return (
      <div
        key={`${time}-${dayIndex}`}
        className={cn(
          "min-h-[60px] border-b border-r relative",
          darkMode ? "border-gray-700" : "border-gray-200",
        )}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              "absolute left-1 right-1 top-1 rounded px-2 py-1 text-xs text-white z-10 cursor-pointer hover:shadow-lg transition-shadow",
              event.color,
              event.status === "pending" &&
                "opacity-70 border-2 border-dashed border-white",
              event.status === "cancelled" && "opacity-50 line-through",
            )}
            style={{
              height: `${
                ((parseFloat(event.end.split(":")[0]) * 60 +
                  parseFloat(event.end.split(":")[1]) -
                  (parseFloat(event.start.split(":")[0]) * 60 +
                    parseFloat(event.start.split(":")[1]))) /
                  60) *
                  60 -
                2
              }px`,
              top: `${index * 2 + 2}px`,
            }}
          >
            <div className="font-medium truncate">{event.title}</div>
            {event.client && (
              <div className="text-xs opacity-90 truncate">{event.client}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getCurrentWeek();

    return (
      <div className="flex-1 overflow-hidden">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div
            className={cn(
              "p-4 text-center font-medium",
              darkMode
                ? "border-gray-700 text-gray-300"
                : "border-gray-200 text-gray-700",
            )}
          >
            Horário
          </div>
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={cn(
                "p-4 text-center border-l",
                darkMode ? "border-gray-700" : "border-gray-200",
              )}
            >
              <div
                className={cn(
                  "font-medium",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {weekDays[index]}
              </div>
              <div
                className={cn(
                  "text-sm mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                  date.toDateString() === new Date().toDateString()
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "text-gray-400"
                      : "text-gray-600",
                )}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {timeSlots.slice(8, 20).map((time) => (
            <div key={time} className="grid grid-cols-8">
              <div
                className={cn(
                  "p-2 text-sm text-right font-medium border-b border-r",
                  darkMode
                    ? "border-gray-700 text-gray-400 bg-gray-800"
                    : "border-gray-200 text-gray-600 bg-gray-50",
                )}
              >
                {time}
              </div>
              {weekDates.map((_, dayIndex) => renderTimeSlot(time, dayIndex))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            Calendário
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie sua agenda e visualize todos os agendamentos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            )}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate("prev")}
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
                "text-lg font-semibold min-w-[200px] text-center",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {formatDate(currentDate)}
            </h2>

            <button
              onClick={() => navigateDate("next")}
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

          {/* View Toggle */}
          <div
            className={cn(
              "flex items-center rounded-lg border",
              darkMode
                ? "border-gray-600 bg-gray-800"
                : "border-gray-300 bg-white",
            )}
          >
            {(["day", "week", "month"] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  view === viewType
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {viewType === "day"
                  ? "Dia"
                  : viewType === "week"
                    ? "Semana"
                    : "Mês"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProfessional}
            onChange={(e) => setSelectedProfessional(e.target.value)}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm",
              darkMode
                ? "border-gray-600 bg-gray-800 text-white"
                : "border-gray-300 bg-white text-gray-900",
            )}
          >
            <option value="all">Todos os profissionais</option>
            {professionals.slice(1).map((professional) => (
              <option key={professional} value={professional}>
                {professional}
              </option>
            ))}
          </select>

          <button
            className={cn(
              "p-2 rounded-lg border transition-colors",
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div
        className={cn(
          "rounded-lg border overflow-hidden",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        {view === "week" && renderWeekView()}

        {view === "day" && (
          <div className="p-6 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p
              className={cn(
                "text-lg",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Visualização de dia em desenvolvimento
            </p>
          </div>
        )}

        {view === "month" && (
          <div className="p-6 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p
              className={cn(
                "text-lg",
                darkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Visualização de mês em desenvolvimento
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className={cn(
          "flex items-center gap-6 p-4 rounded-lg",
          darkMode ? "bg-gray-800" : "bg-gray-50",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
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
          <div className="w-3 h-3 bg-yellow-500 rounded border-2 border-dashed border-gray-400"></div>
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Pendente
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Pausa/Bloqueado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded opacity-50"></div>
          <span
            className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Cancelado
          </span>
        </div>
      </div>
    </div>
  );
};
