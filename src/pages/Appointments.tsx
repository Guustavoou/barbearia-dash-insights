<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NewAppointmentModal } from '@/components/NewAppointmentModal';
import { useAppointments } from '@/hooks/useAppointments';
import { cn, formatCurrency, formatDate, formatTime } from '@/lib/unclicUtils';
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157

interface AppointmentsProps {
  darkMode: boolean;
}

<<<<<<< HEAD
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
  const appointments =
    apiResponse?.data || fallbackData?.appointments || appointmentsMockData;
  const professionals = fallbackData?.professionals || [];

  // Calculate statistics
  const stats: AppointmentStats = useMemo(() => {
    const total = appointments.length;
    const concluidos = appointments.filter(
      (apt: any) => apt.status === "concluido",
    ).length;
    const agendados = appointments.filter(
      (apt: any) => apt.status === "agendado",
    ).length;
    const cancelados = appointments.filter(
      (apt: any) => apt.status === "cancelado",
    ).length;
    const confirmados = appointments.filter(
      (apt: any) => apt.status === "confirmado",
    ).length;
    const faltou = appointments.filter(
      (apt: any) => apt.status === "faltou",
    ).length;

    return {
      total,
      concluidos,
      agendados,
      cancelados,
      confirmados,
      faltou,
    };
  }, [appointments]);
=======
const Appointments: React.FC<AppointmentsProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const { appointments, loading } = useAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAppointmentTime = (timeString: string) => {
    // timeString is in HH:MM format, convert to Date for formatting
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return formatTime(date);
  };
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157

  const handleNewAppointment = async (appointmentData: any) => {
    // This will be handled by the modal component
    setShowNewModal(false);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.services?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

<<<<<<< HEAD
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
          {appointments.map((appointment: any) => (
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
                    {appointment.date instanceof Date
                      ? appointment.date.toLocaleDateString("pt-BR")
                      : new Date(appointment.date).toLocaleDateString("pt-BR")}
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
=======
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus agendamentos
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

<<<<<<< HEAD
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div
              className={cn(
                "rounded-xl p-6 border",
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Total de Agendamentos
              </h3>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {stats.total}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-6 border",
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Concluídos
              </h3>
              <p className={cn("text-2xl font-bold mt-1 text-green-600")}>
                {stats.concluidos}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-6 border",
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Agendados
              </h3>
              <p className={cn("text-2xl font-bold mt-1 text-blue-600")}>
                {stats.agendados}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-6 border",
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Cancelados
              </h3>
              <p className={cn("text-2xl font-bold mt-1 text-red-600")}>
                {stats.cancelados}
              </p>
            </div>
          </>
        )}
=======
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              agendamentos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.appointment_date === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">
              para hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.status === 'confirmado').length}
            </div>
            <p className="text-xs text-muted-foreground">
              confirmados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.status === 'cancelado').length}
            </div>
            <p className="text-xs text-muted-foreground">
              cancelados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente buscar por outros termos.' : 'Comece criando seu primeiro agendamento.'}
              </p>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "p-6 rounded-lg border transition-colors hover:bg-gray-50",
                    darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className={cn(
                          "text-lg font-semibold",
                          darkMode ? "text-white" : "text-gray-900"
                        )}>
                          {appointment.clients?.name || 'Cliente não encontrado'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(new Date(appointment.appointment_date))}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatAppointmentTime(appointment.appointment_time)}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {appointment.clients?.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={cn(
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900"
                        )}>
                          {appointment.services?.name || 'Serviço não encontrado'}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(Number(appointment.price))}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status || 'agendado')}>
                        {appointment.status || 'agendado'}
                      </Badge>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className={cn(
                        "text-sm",
                        darkMode ? "text-gray-300" : "text-gray-600"
                      )}>
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
<<<<<<< HEAD

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
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onNewAppointment={() => setShowNewAppointmentModal(true)}
            darkMode={darkMode}
          />
        ) : (
          <ListView />
        )}
      </div>
=======
        </CardContent>
      </Card>
>>>>>>> 01ae52e6fe1ca6b9e41b9437e7c3a93ac4d67157

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Appointments;
