import React, { useState, useMemo } from "react";
import { Calendar, List, Plus, BarChart3 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/unclicUtils";
import { CalendarView } from "@/components/CalendarView";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";
import {
  AppointmentWithDetails,
  CalendarViewType,
  AppointmentStatus,
  AppointmentSortField,
  AppointmentSortOrder,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "todos">(
    "todos",
  );
  const [sortBy, setSortBy] = useState<AppointmentSortField>("date");
  const [sortOrder, setSortOrder] = useState<AppointmentSortOrder>("desc");
  const [showNewModal, setShowNewModal] = useState(false);

  // API integration with automatic fallback
  const {
    data: apiResponse,
    loading,
    error,
    refetch,
  } = useAppointments({
    search: searchTerm,
    status: statusFilter !== "todos" ? statusFilter : undefined,
    sort: sortBy,
    order: sortOrder.toUpperCase() as "ASC" | "DESC",
    page: 1,
    limit: 100,
  });

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      refetch();
      setShowNewModal(false);
    },
  });

  const updateAppointmentMutation = useUpdateAppointment({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteAppointmentMutation = useDeleteAppointment({
    onSuccess: () => {
      refetch();
    },
  });

  // Use API data or fallback to empty array
  const appointments = apiResponse?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const agendado = appointments.filter(
      (a: any) => a.status === "agendado",
    ).length;
    const confirmado = appointments.filter(
      (a: any) => a.status === "confirmado",
    ).length;
    const concluido = appointments.filter(
      (a: any) => a.status === "concluido",
    ).length;
    const cancelado = appointments.filter(
      (a: any) => a.status === "cancelado",
    ).length;
    const faltou = appointments.filter(
      (a: any) => a.status === "faltou",
    ).length;

    return {
      total,
      agendado,
      confirmado,
      concluido,
      cancelado,
      faltou,
    };
  }, [appointments]);

  const handleNewAppointment = async (appointmentData: any) => {
    await createAppointmentMutation.mutate(appointmentData);
  };

  const handleUpdateAppointment = async (id: number, appointmentData: any) => {
    await updateAppointmentMutation.mutate({ id, data: appointmentData });
  };

  const handleDeleteAppointment = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      await deleteAppointmentMutation.mutate(id);
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment: any) =>
      appointment.client_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.professional_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const ListView: React.FC = () => (
    <div
      className={cn(
        "rounded-xl border",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      )}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Lista de Agendamentos
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={cn(
              "border-b",
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200",
            )}
          >
            <tr>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Cliente
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Serviço
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Profissional
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Data/Hora
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Status
              </th>
              <th
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  darkMode ? "text-gray-300" : "text-gray-500",
                )}
              >
                Valor
              </th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              darkMode ? "divide-gray-700" : "divide-gray-200",
            )}
          >
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "h-4 rounded animate-pulse",
                        darkMode ? "bg-gray-700" : "bg-gray-300",
                      )}
                    />
                  </td>
                </tr>
              ))
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    Nenhum agendamento encontrado.
                  </p>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment: any) => (
                <tr
                  key={appointment.id}
                  className={cn(
                    "transition-colors",
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {appointment.client_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {appointment.service_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      {appointment.professional_name || "Não definido"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <br />
                      <span
                        className={cn(
                          "text-xs",
                          darkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        {appointment.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        appointment.status === "confirmado"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : appointment.status === "agendado"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : appointment.status === "concluido"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : appointment.status === "cancelado"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                      )}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "font-semibold",
                        darkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {formatCurrency(appointment.price || 0)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            Gerencie todos os agendamentos do seu salão
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {loading ? "..." : stats.total}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Total
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold text-blue-600",
                darkMode ? "text-blue-400" : "text-blue-600",
              )}
            >
              {loading ? "..." : stats.agendado}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Agendado
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold text-green-600",
                darkMode ? "text-green-400" : "text-green-600",
              )}
            >
              {loading ? "..." : stats.confirmado}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Confirmado
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold text-purple-600",
                darkMode ? "text-purple-400" : "text-purple-600",
              )}
            >
              {loading ? "..." : stats.concluido}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Concluído
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold text-red-600",
                darkMode ? "text-red-400" : "text-red-600",
              )}
            >
              {loading ? "..." : stats.cancelado}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Cancelado
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl p-4 border",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-2xl font-bold text-yellow-600",
                darkMode ? "text-yellow-400" : "text-yellow-600",
              )}
            >
              {loading ? "..." : stats.faltou}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Faltou
            </p>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div
        className={cn(
          "rounded-xl p-6 border",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar agendamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-4 pr-4 py-2 w-full rounded-lg border transition-colors",
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                )}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              )}
            >
              <option value="todos">Todos os Status</option>
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
              <option value="faltou">Faltou</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType("calendario")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewType === "calendario"
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Calendar className="w-4 h-4" />
              Calendário
            </button>
            <button
              onClick={() => setViewType("lista")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                viewType === "lista"
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewType === "calendario" ? (
        <CalendarView
          appointments={filteredAppointments}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          darkMode={darkMode}
          onEditAppointment={(id, data) => handleUpdateAppointment(id, data)}
          onDeleteAppointment={handleDeleteAppointment}
        />
      ) : (
        <ListView />
      )}

      {/* New Appointment Modal */}
      {showNewModal && (
        <NewAppointmentModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          onSave={handleNewAppointment}
          darkMode={darkMode}
        />
      )}

      {/* Show errors if any */}
      {error && (
        <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4">
          <p className="text-red-800 dark:text-red-400">
            Erro ao carregar agendamentos: {error}
          </p>
        </div>
      )}
    </div>
  );
};
