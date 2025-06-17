import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  Filter,
  Plus,
  Search,
  Users,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  useSupabaseAppointments,
  useSupabaseAppointmentMutation,
} from "@/hooks/useSupabaseApiFixed";

const STATUS_COLORS = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmado: "bg-blue-100 text-blue-800 border-blue-200",
  concluido: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS = {
  pendente: AlertCircle,
  confirmado: CalendarDays,
  concluido: CheckCircle,
  cancelado: XCircle,
};

export const BeautifulAppointmentsFixed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Use fixed API hooks
  const {
    data: appointments,
    loading,
    error,
    refetch,
  } = useSupabaseAppointments({
    status: statusFilter === "all" ? undefined : statusFilter,
    date: dateFilter || undefined,
  });

  const {
    updateAppointment,
    deleteAppointment,
    isLoading: mutationLoading,
  } = useSupabaseAppointmentMutation({
    onSuccess: () => {
      refetch(); // Refresh data after mutation
    },
  });

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.filter((appointment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        appointment.clientName?.toLowerCase().includes(searchLower) ||
        appointment.serviceName?.toLowerCase().includes(searchLower) ||
        appointment.professionalName?.toLowerCase().includes(searchLower)
      );
    });
  }, [appointments, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!appointments) {
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    return {
      total: appointments.length,
      confirmed: appointments.filter((apt) => apt.status === "confirmado")
        .length,
      pending: appointments.filter((apt) => apt.status === "pendente").length,
      completed: appointments.filter((apt) => apt.status === "concluido")
        .length,
      cancelled: appointments.filter((apt) => apt.status === "cancelado")
        .length,
    };
  }, [appointments]);

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string,
  ) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await deleteAppointment(appointmentId);
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return time.slice(0, 5); // Remove seconds
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar agendamentos
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={refetch}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📅 Agendamentos
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie todos os agendamentos do seu estabelecimento
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Confirmados
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.confirmed}
                  </p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Concluídos
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Cancelados
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente, serviço ou profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full md:w-48"
              />

              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all" || dateFilter
                    ? "Tente ajustar os filtros para encontrar agendamentos"
                    : "Comece criando seu primeiro agendamento"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => {
              const StatusIcon =
                STATUS_ICONS[appointment.status] || AlertCircle;
              const statusColor =
                STATUS_COLORS[appointment.status] || STATUS_COLORS.pendente;

              return (
                <Card
                  key={appointment.id}
                  className="border-0 shadow-md bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-6">
                        {/* Status Badge */}
                        <div>
                          <Badge
                            className={`${statusColor} px-3 py-1 text-sm font-medium flex items-center gap-2`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-600">Cliente</p>
                          </div>
                        </div>

                        {/* Date and Time */}
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(appointment.date)}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(appointment.startTime)}
                              {appointment.endTime &&
                                ` - ${formatTime(appointment.endTime)}`}
                            </p>
                          </div>
                        </div>

                        {/* Service */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {appointment.serviceName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.professionalName}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-green-600">
                            {formatCurrency(appointment.price)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          value={appointment.status}
                          onValueChange={(newStatus) =>
                            handleStatusChange(appointment.id, newStatus)
                          }
                          disabled={mutationLoading}
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmado">
                              Confirmado
                            </SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          disabled={mutationLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BeautifulAppointmentsFixed;
