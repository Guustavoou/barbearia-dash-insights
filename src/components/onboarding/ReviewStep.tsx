
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Wrench, Clock, Check } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface ReviewStepProps {
  onComplete?: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onComplete }) => {
  const { data, prevStep, submitOnboarding } = useOnboarding();

  const handleSubmit = async () => {
    try {
      await submitOnboarding();
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisar Configurações</h2>
        <p className="text-gray-600">
          Verifique todas as informações antes de finalizar a configuração.
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informações do Negócio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-gray-900">{data.business.name || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{data.business.adminEmail || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Telefone</p>
              <p className="text-gray-900">{data.business.phone || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Endereço</p>
              <p className="text-gray-900">{data.business.address || 'Não informado'}</p>
            </div>
          </div>
          {data.business.description && (
            <div>
              <p className="text-sm font-medium text-gray-500">Descrição</p>
              <p className="text-gray-900">{data.business.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professionals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Profissionais ({data.professionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.professionals.length > 0 ? (
            <div className="space-y-3">
              {data.professionals.map((professional, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{professional.name}</p>
                    <p className="text-sm text-gray-500">{professional.email}</p>
                  </div>
                  <Badge variant={professional.isActive ? 'default' : 'secondary'}>
                    {professional.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum profissional adicionado</p>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Serviços ({data.services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.services.length > 0 ? (
            <div className="space-y-3">
              {data.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {service.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{service.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum serviço adicionado</p>
          )}
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      {data.schedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Configurações de Horário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Duração padrão do agendamento</p>
                <p className="text-gray-900">{data.schedule.appointmentDuration || 60} minutos</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Antecedência máxima</p>
                <p className="text-gray-900">{data.schedule.advanceBookingDays || 30} dias</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Aviso mínimo</p>
                <p className="text-gray-900">{data.schedule.minimumNoticeHours || 2} horas</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Agendamento online</p>
                <Badge variant={data.schedule.allowOnlineBooking ? 'default' : 'secondary'}>
                  {data.schedule.allowOnlineBooking ? 'Permitido' : 'Não permitido'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={prevStep} variant="outline">
          Voltar
        </Button>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-2" />
          Finalizar Configuração
        </Button>
      </div>
    </div>
  );
};
