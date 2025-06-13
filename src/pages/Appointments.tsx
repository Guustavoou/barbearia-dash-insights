
import React, { useState } from "react";
import { Calendar, Clock, User, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";
import { useAppointments } from "@/hooks/useAppointments";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useProfessionals } from "@/hooks/useProfessionals";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/unclicUtils";

const Appointments = () => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [darkMode] = useState(false);

  const { appointments, loading: appointmentsLoading, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { clients, loading: clientsLoading } = useClients();
  const { services, loading: servicesLoading } = useServices();
  const { professionals, loading: professionalsLoading } = useProfessionals();

  const loading = appointmentsLoading || clientsLoading || servicesLoading || professionalsLoading;

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

  const handleNewAppointment = async (appointmentData: any) => {
    const result = await addAppointment(appointmentData);
    if (result) {
      setShowNewModal(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    await updateAppointment(appointmentId, { status: newStatus });
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteAppointment(appointmentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">
            Gerencie todos os agendamentos da sua barbearia
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.appointment_date === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">agendamentos para hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.status === 'confirmado').length}
            </div>
            <p className="text-xs text-muted-foreground">agendamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.status === 'agendado').length}
            </div>
            <p className="text-xs text-muted-foreground">aguardando confirmação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Prevista</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                appointments
                  .filter(apt => apt.status !== 'cancelado')
                  .reduce((sum, apt) => sum + Number(apt.price), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">dos agendamentos ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando um novo agendamento para seus clientes.
              </p>
              <Button onClick={() => setShowNewModal(true)}>
                Criar Primeiro Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors",
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        darkMode ? "text-white" : "text-gray-900"
                      )}>
                        {appointment.clients?.name || 'Cliente não encontrado'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          {appointment.clients?.phone || 'Sem telefone'}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">
                          {appointment.services?.name || 'Serviço não encontrado'}
                        </span>
                        {appointment.professionals?.name && (
                          <span> • {appointment.professionals.name}</span>
                        )}
                        <span> • {formatCurrency(Number(appointment.price))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status || 'agendado')}>
                      {appointment.status || 'agendado'}
                    </Badge>
                    <div className="flex space-x-2">
                      {appointment.status === 'agendado' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmado')}
                        >
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === 'confirmado' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment.id, 'finalizado')}
                        >
                          Finalizar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
