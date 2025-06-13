import React, { useState, useMemo } from "react";
import { Calendar, List, Plus, BarChart3 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { CalendarView } from "@/components/CalendarView";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";
import { appointmentsMockData } from "@/lib/appointmentMockData";
import {
  AppointmentItem,
  AppointmentViewMode,
  CalendarViewType,
  AppointmentStats,
} from "@/lib/appointmentTypes";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/useApi";

interface AppointmentsProps {
  darkMode: boolean;
}

export const Appointments: React.FC<AppointmentsProps> = ({ darkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>("semanal");
  const [viewMode, setViewMode] = useState<AppointmentViewMode>("calendario");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] =
    useState<string>("all");
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("semanal");

  // API integration
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useAppointments({
    search: searchQuery,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    professional_id:
      selectedProfessional === "all"
        ? undefined
        : parseInt(selectedProfessional),
    start_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  });

  const createAppointment = useCreateAppointment({
    onSuccess: () => {
      setShowNewAppointmentModal(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      alert("Erro ao criar agendamento: " + error);
    },
  });

  const updateAppointment = useUpdateAppointment({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteAppointment = useDeleteAppointment({
    onSuccess: () => {
      refetch();
    },
  });

  // Fallback to mock data if API fails
  const [fallbackData, setFallbackData] = useState<any>(null);

  React.useEffect(() => {
    if (error) {
      import("@/lib/appointmentMockData").then((mockData) => {
        setFallbackData(mockData);
      });
    }
  }, [error]);

  // Use API data or fallback to mock data
  const appointments = apiResponse?.data || fallbackData?.appointments || [];
  const appointmentStats = fallbackData?.appointmentStats || {
    total: appointments.length,
    concluidos: appointments.filter((a: any) => a.status === "concluido")
      .length,
    agendados: appointments.filter((a: any) => a.status === "agendado").length,
    cancelados: appointments.filter((a: any) => a.status === "cancelado")
      .length,
    faltou: appointments.filter((a: any) => a.status === "faltou").length,
    confirmados: appointments.filter((a: any) => a.status === "confirmado")
      .length,
  };
  const professionals = fallbackData?.professionals || [];

  // Calculate statistics
  const stats: AppointmentStats = useMemo(() => {
    const total = appointmentsMockData.length;
    const concluidos = appointmentsMockData.filter(
      (apt) => apt.status === "concluido",
    ).length;
    const agendados = appointmentsMockData.filter(
      (apt) => apt.status === "agendado",
    ).length;
    const cancelados = appointmentsMockData.filter(
      (apt) => apt.status === "cancelado",
    ).length;
    const confirmados = appointmentsMockData.filter(
      (apt) => apt.status === "confirmado",
    ).length;
    const faltou = appointmentsMockData.filter(
      (apt) => apt.status === "faltou",
    ).length;

    return {
      total,
      concluidos,
      agendados,
      cancelados,
      confirmados,
      faltou,
    };
  }, []);

  // Skeleton placeholders for top cards
  const SkeletonCard: React.FC = () => (
    <div
      className={cn(
        "rounded-xl p-6 border animate-pulse",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      <div className="space-y-3">
        <div
          className={cn(
            "h-4 rounded w-3/4",
            darkMode ? "bg-gray-700" : "bg-gray-200",
          )}
        />
        <div
          className={cn(
            "h-6 rounded w-1/2",
            darkMode ? "bg-gray-700" : "bg-gray-200",
          )}
        />
        <div
          className={cn(
            "h-3 rounded w-full",
            darkMode ? "bg-gray-700" : "bg-gray-200",
          )}
        />
      </div>
    </div>
  );

  const ListView: React.FC = () => (
    <div
      className={cn(
        "rounded-xl border",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      <div className="p-6">
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Lista de Agendamentos
        </h3>
        <div className="space-y-4">
          {appointmentsMockData.map((appointment) => (
            <div
              key={appointment.id}
              className={cn(
                "p-4 rounded-lg border",
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4
                    className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {appointment.client}
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {appointment.service} • {appointment.time} •{" "}
                    {appointment.date.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      appointment.status === "agendado" &&
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                      appointment.status === "confirmado" &&
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                      appointment.status === "concluido" &&
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                      appointment.status === "cancelado" &&
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      appointment.status === "faltou" &&
                        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                    )}
                  >
                    {appointment.status}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      darkMode ? "text-gray-300" : "text-gray-600",
                    )}
                  >
                    {formatCurrency(appointment.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            Agendamentos
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Gerencie todos os seus agendamentos em um só lugar
          </p>
        </div>
        <button
          onClick={() => setShowNewAppointmentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Stats Cards (Skeleton) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* View Controls */}
      <div
        className={cn(
          "rounded-xl border p-6",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("calendario")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewMode === "calendario"
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendário
            </button>
            <button
              onClick={() => setViewMode("lista")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewMode === "lista"
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <List className="h-4 w-4" />
              Lista
            </button>
          </div>

          {/* Calendar View Controls */}
          {viewMode === "calendario" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarView("mensal")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors",
                  calendarView === "mensal"
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <BarChart3 className="h-3 w-3" />
                Mensal
              </button>
              <button
                onClick={() => setCalendarView("semanal")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors",
                  calendarView === "semanal"
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <Calendar className="h-3 w-3" />
                Semanal
              </button>
            </div>
          )}

          {/* Statistics */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {stats.total} total
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-green-600">
                {stats.concluidos} concluídos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-blue-600">
                {stats.agendados} agendados
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-red-600">
                {stats.cancelados} cancelados
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "calendario" ? (
          <CalendarView
            appointments={appointmentsMockData}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onNewAppointment={() => setShowNewAppointmentModal(true)}
            darkMode={darkMode}
          />
        ) : (
          <ListView />
        )}
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        selectedDate={selectedDate}
        darkMode={darkMode}
      />
    </div>
  );
};
