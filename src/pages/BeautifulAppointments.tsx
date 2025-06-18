
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MapPin, Search, Filter, Plus, ChevronDown, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '@/hooks/useApi';
import { NewAppointmentModal } from '@/components/NewAppointmentModal';

interface BeautifulAppointmentsProps {
  darkMode: boolean;
}

const BeautifulAppointments: React.FC<BeautifulAppointmentsProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Use hooks without parameters to match their signatures
  const { data: appointments, loading, error, refetch } = useAppointments();
  const createAppointmentMutation = useCreateAppointment({ onSuccess: () => refetch() });
  const updateAppointmentMutation = useUpdateAppointment({ onSuccess: () => refetch() });
  const deleteAppointmentMutation = useDeleteAppointment({ onSuccess: () => refetch() });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      await createAppointmentMutation.mutate(appointmentData);
      setShowNewAppointment(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleUpdateAppointment = async (id: string, data: any) => {
    try {
      await updateAppointmentMutation.mutate({ id, data });
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointmentMutation.mutate(id);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar agendamentos: {error}</p>
        <Button onClick={refetch} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agendamentos</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie todos os seus agendamentos
            </p>
          </div>
          <Button 
            onClick={() => setShowNewAppointment(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="tomorrow">Amanhã</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="p-6">
        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Comece criando seu primeiro agendamento.
                </p>
                <Button 
                  onClick={() => setShowNewAppointment(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Agendamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment: any) => (
              <Card key={appointment.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{appointment.client_name || 'Cliente'}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.start_time} - {appointment.end_time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {appointment.date}
                          </div>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {appointment.service_name || 'Serviço'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 
                               appointment.status === 'completed' ? 'secondary' : 'outline'}
                      >
                        {appointment.status === 'scheduled' && 'Agendado'}
                        {appointment.status === 'confirmed' && 'Confirmado'}
                        {appointment.status === 'completed' && 'Concluído'}
                        {appointment.status === 'cancelled' && 'Cancelado'}
                      </Badge>
                      
                      <div className="text-right">
                        <p className="font-medium">R$ {appointment.price?.toFixed(2) || '0,00'}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        onSave={handleCreateAppointment}
        darkMode={darkMode}
      />

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Cliente</label>
                <p>{selectedAppointment.client_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Serviço</label>
                <p>{selectedAppointment.service_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Data e Hora</label>
                <p>{selectedAppointment.date} às {selectedAppointment.start_time}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Valor</label>
                <p>R$ {selectedAppointment.price?.toFixed(2) || '0,00'}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateAppointment(selectedAppointment.id, { ...selectedAppointment, status: 'confirmed' })}
                  disabled={updateAppointmentMutation.isLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                  disabled={deleteAppointmentMutation.isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BeautifulAppointments;
