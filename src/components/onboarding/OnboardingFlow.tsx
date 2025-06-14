import React from "react";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { WelcomeStep } from "./WelcomeStep";
import { BusinessInfoStep } from "./BusinessInfoStep";
import { ServicesStep } from "./ServicesStep";
import { ProfessionalsStep } from "./ProfessionalsStep";
import { ScheduleStep } from "./ScheduleStep";
import { ReviewStep } from "./ReviewStep";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const { data, setCurrentStep } = useOnboarding();

  const steps = [
    "Boas-vindas",
    "Informações do Negócio",
    "Serviços",
    "Profissionais",
    "Horários",
    "Revisão",
  ];

  const handleWelcomeOption = (option: "import" | "upload" | "scratch") => {
    if (option === "scratch") {
      setCurrentStep(1);
    }
    // For now, only "scratch" option is implemented
    // "import" and "upload" will be available in future versions
  };

  const renderCurrentStep = () => {
    switch (data.currentStep) {
      case 0:
        return <WelcomeStep onSelectOption={handleWelcomeOption} />;
      case 1:
        return <BusinessInfoStep />;
      case 2:
        return <ServicesStep />;
      case 3:
        return <ProfessionalsStep />;
      case 4:
        return <ScheduleStep />;
      case 5:
        return <ReviewStep onComplete={onComplete} />;
      default:
        return <WelcomeStep onSelectOption={handleWelcomeOption} />;
    }
  };

  const getProgressPercentage = () => {
    if (data.currentStep === 0) return 0;
    return Math.round((data.currentStep / 5) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with progress */}
      {data.currentStep > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Unclic Logo */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center mr-3">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Unclic Manager
                  </h1>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Etapa {data.currentStep} de 5
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {steps[data.currentStep]}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso da configuração</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-between mt-4">
              {steps.slice(1).map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < data.currentStep;
                const isCurrent = stepNumber === data.currentStep;
                const isUpcoming = stepNumber > data.currentStep;

                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          isCompleted
                            ? "bg-green-600 text-white"
                            : isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? "✓" : stepNumber}
                      </div>
                      <div
                        className={`text-xs mt-1 text-center max-w-20 ${
                          isCurrent
                            ? "text-blue-600 font-medium"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                    </div>
                    {index < steps.slice(1).length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          stepNumber < data.currentStep
                            ? "bg-green-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8 px-6">{renderCurrentStep()}</div>

      {/* Footer */}
      <div className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>
                <strong>Dica:</strong> Suas informações são salvas
                automaticamente conforme você preenche
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span>Precisa de ajuda?</span>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Entrar em contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
