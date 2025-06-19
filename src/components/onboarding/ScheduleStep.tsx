
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, Copy, Coffee } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { WorkingHours, defaultWorkingHours } from "@/lib/onboardingTypes";

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export const ScheduleStep: React.FC = () => {
  const { data, updateWorkingHours, nextStep, prevStep } = useOnboarding();

  const [localHours, setLocalHours] = useState<WorkingHours>(
    data.workingHours || defaultWorkingHours
  );
  const [showLunchBreak, setShowLunchBreak] = useState<{
    [key: string]: boolean;
  }>({});

  const handleNextStep = () => {
    console.log("ScheduleStep: Tentando avançar para próxima etapa");
    console.log("Current step:", data.currentStep);
    console.log("Working hours:", localHours);

    // Ensure working hours are saved
    updateWorkingHours(localHours);

    // Force advance to next step
    nextStep();
  };

  const updateDayHours = (dayKey: string, updates: Partial<{ isOpen: boolean; start: string; end: string; breaks: Array<{ start: string; end: string; }> }>) => {
    const newHours = {
      ...localHours,
      [dayKey]: { ...localHours[dayKey], ...updates }
    };
    setLocalHours(newHours);
    updateWorkingHours(newHours);
  };

  const copyToAllDays = (sourceDay: { isOpen: boolean; start: string; end: string; breaks: Array<{ start: string; end: string; }> }) => {
    const newHours = { ...localHours };
    DAYS_OF_WEEK.forEach(day => {
      newHours[day.key] = {
        ...newHours[day.key],
        isOpen: sourceDay.isOpen,
        start: sourceDay.start,
        end: sourceDay.end,
        breaks: sourceDay.breaks,
      };
    });
    setLocalHours(newHours);
    updateWorkingHours(newHours);
  };

  const handleLunchBreakToggle = (dayKey: string, enabled: boolean) => {
    setShowLunchBreak((prev) => ({ ...prev, [dayKey]: enabled }));

    if (enabled) {
      updateDayHours(dayKey, {
        breaks: [{ start: "12:00", end: "13:00" }],
      });
    } else {
      updateDayHours(dayKey, {
        breaks: [],
      });
    }
  };

  const formatTimeDisplay = (time: string) => {
    return time || "00:00";
  };

  const getWorkingHoursSummary = () => {
    const openDays = DAYS_OF_WEEK.filter(day => localHours[day.key]?.isOpen);
    if (openDays.length === 0) return "Nenhum dia configurado";

    const firstDay = localHours[openDays[0].key];
    const allSame = openDays.every(
      day =>
        localHours[day.key].start === firstDay.start &&
        localHours[day.key].end === firstDay.end,
    );

    if (allSame && openDays.length === 7) {
      return `Todos os dias: ${formatTimeDisplay(firstDay.start)} - ${formatTimeDisplay(firstDay.end)}`;
    } else if (allSame && openDays.length === 6) {
      const closedDay = DAYS_OF_WEEK.find(day => !localHours[day.key]?.isOpen);
      return `${formatTimeDisplay(firstDay.start)} - ${formatTimeDisplay(firstDay.end)} (exceto ${closedDay?.label})`;
    } else {
      return `${openDays.length} dias configurados`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Horários de Funcionamento
        </h2>
        <p className="text-gray-600">
          Configure os horários de funcionamento do seu estabelecimento
        </p>
      </div>

      <div className="space-y-6">
        {/* Quick Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Configuração Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Configure um dia e copie para todos os outros dias da semana
            </p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(
                day =>
                  localHours[day.key]?.isOpen && (
                    <Button
                      key={day.key}
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(localHours[day.key])}
                      className="flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar {day.label}
                    </Button>
                  ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = localHours[day.key];
                return (
                  <div
                    key={day.key}
                    className={`p-4 border rounded-lg ${
                      dayData?.isOpen
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{day.label}</h3>
                        <Switch
                          checked={dayData?.isOpen || false}
                          onCheckedChange={(checked) =>
                            updateDayHours(day.key, { isOpen: checked })
                          }
                        />
                        <span className="text-sm text-gray-600">
                          {dayData?.isOpen ? "Aberto" : "Fechado"}
                        </span>
                      </div>

                      {dayData?.isOpen && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToAllDays(dayData)}
                          className="flex items-center"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copiar para todos
                        </Button>
                      )}
                    </div>

                    {dayData?.isOpen && (
                      <div className="space-y-4">
                        {/* Working Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`open-${day.key}`}>
                              Horário de Abertura
                            </Label>
                            <Input
                              id={`open-${day.key}`}
                              type="time"
                              value={dayData.start || '09:00'}
                              onChange={(e) =>
                                updateDayHours(day.key, {
                                  start: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`close-${day.key}`}>
                              Horário de Fechamento
                            </Label>
                            <Input
                              id={`close-${day.key}`}
                              type="time"
                              value={dayData.end || '18:00'}
                              onChange={(e) =>
                                updateDayHours(day.key, {
                                  end: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Lunch Break Toggle */}
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={showLunchBreak[day.key] || (dayData.breaks && dayData.breaks.length > 0)}
                            onCheckedChange={(checked) =>
                              handleLunchBreakToggle(day.key, checked)
                            }
                          />
                          <div className="flex items-center">
                            <Coffee className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">
                              Pausa para almoço
                            </span>
                          </div>
                        </div>

                        {/* Lunch Break Hours */}
                        {(showLunchBreak[day.key] || (dayData.breaks && dayData.breaks.length > 0)) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-orange-200">
                            <div>
                              <Label htmlFor={`lunch-start-${day.key}`}>
                                Início do Almoço
                              </Label>
                              <Input
                                id={`lunch-start-${day.key}`}
                                type="time"
                                value={dayData.breaks?.[0]?.start || "12:00"}
                                onChange={(e) =>
                                  updateDayHours(day.key, {
                                    breaks: [{
                                      start: e.target.value,
                                      end: dayData.breaks?.[0]?.end || "13:00",
                                    }],
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`lunch-end-${day.key}`}>
                                Fim do Almoço
                              </Label>
                              <Input
                                id={`lunch-end-${day.key}`}
                                type="time"
                                value={dayData.breaks?.[0]?.end || "13:00"}
                                onChange={(e) =>
                                  updateDayHours(day.key, {
                                    breaks: [{
                                      start: dayData.breaks?.[0]?.start || "12:00",
                                      end: e.target.value,
                                    }],
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* Hours Summary */}
                        <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                          <strong>Resumo:</strong>{" "}
                          {formatTimeDisplay(dayData.start)} às{" "}
                          {formatTimeDisplay(dayData.end)}
                          {dayData.breaks && dayData.breaks.length > 0 && (
                            <span>
                              {" "}
                              (pausa: {formatTimeDisplay(
                                dayData.breaks[0].start,
                              )} às {formatTimeDisplay(dayData.breaks[0].end)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo dos Horários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {getWorkingHoursSummary()}
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Dias abertos:</strong>{" "}
                  {DAYS_OF_WEEK.filter(day => localHours[day.key]?.isOpen).length} de 7 dias
                </p>
                {DAYS_OF_WEEK.some(day => localHours[day.key]?.breaks && localHours[day.key]?.breaks.length > 0) && (
                  <p>
                    <strong>Dias com pausa para almoço:</strong>{" "}
                    {DAYS_OF_WEEK.filter(day => localHours[day.key]?.breaks && localHours[day.key]?.breaks.length > 0).length} dias
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  Dicas importantes:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Você pode alterar estes horários a qualquer momento nas
                    configurações
                  </li>
                  <li>
                    • Os horários de pausa são importantes para não agendar
                    serviços durante o almoço
                  </li>
                  <li>
                    • Profissionais podem ter horários específicos diferentes do
                    estabelecimento
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button
          type="button"
          onClick={handleNextStep}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Próximo: Revisão
        </Button>
      </div>
    </div>
  );
};
