import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Scissors,
  Users,
  Clock,
  Edit,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface ReviewStepProps {
  onComplete: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onComplete }) => {
  const { data, setCurrentStep, completeOnboarding } = useOnboarding();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsCompleting(true);
    setCompletionError(null);

    try {
      console.log("ReviewStep: Starting onboarding completion");
      await completeOnboarding();
      console.log("ReviewStep: Onboarding completed successfully");
      onComplete();
    } catch (error) {
      console.error("ReviewStep: Error during completion:", error);

      // For demo purposes, show a warning but continue anyway
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao conectar com servidor";

      console.warn("ReviewStep: Continuing despite error for demo");

      // Show brief error message then continue
      setCompletionError(`${errorMessage} - Continuando modo demonstração...`);

      setTimeout(() => {
        setCompletionError(null);
        onComplete();
      }, 2000);
    } finally {
      setIsCompleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatWorkingHours = () => {
    const openDays = data.workingHours.filter((day) => day.isOpen);
    if (openDays.length === 0) return "Nenhum horário configurado";

    const firstDay = openDays[0];
    const allSame = openDays.every(
      (day) =>
        day.openTime === firstDay.openTime &&
        day.closeTime === firstDay.closeTime,
    );

    if (allSame && openDays.length === 7) {
      return `Todos os dias: ${firstDay.openTime} - ${firstDay.closeTime}`;
    } else if (allSame && openDays.length === 6) {
      const closedDay = data.workingHours.find((day) => !day.isOpen);
      return `${firstDay.openTime} - ${firstDay.closeTime} (exceto ${closedDay?.day})`;
    } else {
      return openDays
        .map((day) => `${day.day}: ${day.openTime} - ${day.closeTime}`)
        .join(", ");
    }
  };

  const stepCards = [
    {
      number: 1,
      title: "Informações do Negócio",
      subtitle: "Dados básicos do estabelecimento",
      icon: Building2,
      completed: true,
    },
    {
      number: 2,
      title: "Serviços",
      subtitle: "Adicionar os serviços oferecidos",
      icon: Scissors,
      completed: true,
    },
    {
      number: 3,
      title: "Profissionais",
      subtitle: "Equipe de profissionais",
      icon: Users,
      completed: true,
    },
    {
      number: 4,
      title: "Horários",
      subtitle: "Horários de funcionamento",
      icon: Clock,
      completed: true,
    },
    {
      number: 5,
      title: "Revisão",
      subtitle: "Resumo das configurações",
      icon: CheckCircle,
      completed: false,
      current: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Revisar e Finalizar
        </h2>
        <p className="text-gray-600">
          Verifique todas as informações antes de finalizar o cadastro
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuração Inicial</CardTitle>
          <p className="text-sm text-gray-600">
            Complete as etapas abaixo para configurar seu estabelecimento
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stepCards.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    step.current
                      ? "border-blue-500 bg-blue-50"
                      : step.completed
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        step.current
                          ? "bg-blue-600"
                          : step.completed
                            ? "bg-green-600"
                            : "bg-gray-400"
                      }`}
                    >
                      {step.completed ? "✓" : step.number}
                    </div>
                    <Icon
                      className={`w-5 h-5 ${
                        step.current
                          ? "text-blue-600"
                          : step.completed
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600">{step.subtitle}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Business Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              <CardTitle className="text-lg">
                Dados do Estabelecimento
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Nome:</strong> {data.businessInfo.name}
            </div>
            <div>
              <strong>Email:</strong> {data.businessInfo.email}
            </div>
            <div>
              <strong>Telefone:</strong> {data.businessInfo.phone}
            </div>
            <div>
              <strong>Endereço:</strong> {data.businessInfo.address}
            </div>
            <div>
              <strong>CEP:</strong> {data.businessInfo.cep}
            </div>
            {data.businessInfo.website && (
              <div>
                <strong>🌐 Site:</strong> {data.businessInfo.website}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              <CardTitle className="text-lg">Serviços</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(2)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <strong>{data.services.length} serviço(s) cadastrado(s)</strong>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {data.services.map((service) => (
                <div key={service.id} className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service.name}</span>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  <div className="text-gray-600">
                    {service.duration} min • {formatPrice(service.price)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Professionals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <CardTitle className="text-lg">Profissionais</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(3)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <strong>
                {data.professionals.length} profissional(is) cadastrado(s)
              </strong>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {data.professionals.map((professional) => (
                <div key={professional.id} className="text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: professional.calendarColor }}
                    >
                      {professional.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{professional.name}</div>
                      <div className="text-gray-600">
                        {professional.role} •{" "}
                        {professional.type === "employee"
                          ? "Funcionário"
                          : "Autônomo"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <CardTitle className="text-lg">
                Horários de Funcionamento
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(4)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.workingHours.map((day) => (
                <div key={day.day} className="flex justify-between text-sm">
                  <span className="font-medium">{day.day}:</span>
                  <span
                    className={day.isOpen ? "text-green-600" : "text-gray-500"}
                  >
                    {day.isOpen
                      ? `${day.openTime} - ${day.closeTime}`
                      : "Fechado"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900 mb-2">Tudo Pronto!</h3>
              <p className="text-green-800 text-sm mb-4">
                Todas as informações básicas foram preenchidas. Você pode
                finalizar o processo de configuração. Você poderá ajustar essas
                configurações posteriormente nas configurações do sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {completionError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {completionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrentStep(4)}>
          Voltar
        </Button>

        <div className="space-x-3">
          <Button variant="outline">Pular e terminar depois</Button>
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isCompleting ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Configuração
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
